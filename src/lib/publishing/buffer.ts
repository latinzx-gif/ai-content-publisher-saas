import { PublishingAdapter, PublishInput, PublishResult } from './types';

type BufferGraphQLError = {
  message?: string;
}

type BufferGraphQLResponse<T> = {
  data?: T;
  errors?: BufferGraphQLError[];
}

type BufferAccountResponse = {
  account?: {
    organizations?: Array<{
      id: string;
      name?: string;
    }>;
  };
}

type BufferChannelsResponse = {
  channels?: Array<{
    id: string;
    name?: string;
    service: string;
  }>;
}

type BufferCreatePostResponse = {
  createPost?:
    | {
        post?: {
          id: string;
          text?: string;
          dueAt?: string;
          status?: string;
        };
      }
    | {
        message?: string;
      };
}

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
      const account = await this.requestGraphQL<BufferAccountResponse>(
        accessToken,
        `query BufferAccount {
          account {
            organizations {
              id
              name
            }
          }
        }`
      );

      const organization = account.account?.organizations?.[0];
      if (!organization) {
        return {
          success: false,
          error: 'No Buffer organization found for this API key.',
        };
      }

      const channels = await this.requestGraphQL<BufferChannelsResponse>(
        accessToken,
        `query BufferChannels($organizationId: OrganizationId!) {
          channels(input: { organizationId: $organizationId }) {
            id
            name
            service
          }
        }`,
        { organizationId: organization.id }
      );

      const facebookChannel = channels.channels?.find((channel) => channel.service === 'facebook');
      if (!facebookChannel) {
        return {
          success: false,
          error: 'No Facebook channel connected to this Buffer organization.',
        };
      }

      const fullContent = [input.caption, input.hashtags].filter(Boolean).join('\n\n');
      const createPost = await this.requestGraphQL<BufferCreatePostResponse>(
        accessToken,
        `mutation CreateBufferPost($text: String!, $channelId: ChannelId!) {
          createPost(input: {
            text: $text
            channelId: $channelId
            metadata: {
              facebook: {
                type: post
              }
            }
            schedulingType: automatic
            mode: addToQueue
          }) {
            ... on PostActionSuccess {
              post {
                id
                text
                dueAt
                status
              }
            }
            ... on MutationError {
              message
            }
          }
        }`,
        {
          text: fullContent,
          channelId: facebookChannel.id,
        }
      );

      const result = createPost.createPost;
      if (result && 'post' in result && result.post?.id) {
        const postId = result.post.id;

        return {
          success: true,
          externalId: postId,
          externalUrl: `https://publish.buffer.com/post/${postId}`,
        };
      }

      return {
        success: false,
        error: result && 'message' in result ? result.message || 'Unknown Buffer GraphQL error' : 'Unknown Buffer GraphQL error',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect to Buffer'
      return {
        success: false,
        error: message,
      };
    }
  }

  private async requestGraphQL<T>(
    accessToken: string,
    query: string,
    variables?: Record<string, string>
  ): Promise<T> {
    const response = await fetch('https://api.buffer.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json() as BufferGraphQLResponse<T>;
    if (!response.ok || result.errors?.length) {
      const errorMessage = result.errors?.map((error) => error.message).filter(Boolean).join('; ');
      throw new Error(errorMessage || `Buffer GraphQL request failed with HTTP ${response.status}`);
    }

    if (!result.data) {
      throw new Error('Buffer GraphQL response did not include data.');
    }

    return result.data;
  }
}
