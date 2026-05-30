import { PublishingAdapter, PublishInput, PublishResult } from './types';

export class BufferAdapter implements PublishingAdapter {
  provider = 'buffer' as const;

  async sendPost(input: PublishInput, accessToken: string): Promise<PublishResult> {
    const isMock = process.env.BUFFER_MOCK_MODE === 'true';

    if (isMock) {
      console.log('[Buffer Mock] Sending post:', input);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        externalId: `mock_buffer_${Date.now()}`,
        externalUrl: 'https://publish.buffer.com/mock',
      };
    }

    try {
      // Buffer API endpoint for creating an update
      // Requires profile_ids which we might need to fetch first in a more advanced version
      // For now, we assume the token has a default or we fetch profiles
      
      // Step 1: Get profiles to find where to post
      const profileRes = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${accessToken}`);
      if (!profileRes.ok) {
        throw new Error('Failed to fetch Buffer profiles');
      }
      const profiles = await profileRes.json() as Array<{ id: string; service: string }>;
      
      // For simplicity in MVP, we take the first Facebook profile found
      const fbProfile = profiles.find((p) => p.service === 'facebook');
      if (!fbProfile) {
        return {
          success: false,
          error: 'No Facebook profile connected to this Buffer account.',
        };
      }

      const fullContent = `${input.caption}\n\n${input.hashtags}`;
      
      const body = new URLSearchParams();
      body.append('text', fullContent);
      body.append('profile_ids[]', fbProfile.id);
      if (input.scheduledAt) {
          body.append('scheduled_at', input.scheduledAt);
      } else {
          body.append('shorten', 'false');
          // 'now' isn't a direct param for create, it just goes to queue
      }

      const response = await fetch(`https://api.bufferapp.com/1/updates/create.json?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          externalId: result.updates?.[0]?.id,
          externalUrl: `https://publish.buffer.com/update/${result.updates?.[0]?.id}`,
        };
      } else {
        return {
          success: false,
          error: result.message || 'Unknown Buffer API error',
        };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect to Buffer'
      return {
        success: false,
        error: message,
      };
    }
  }
}
