export type PublishingProvider = 'buffer' | 'facebook' | 'instagram' | 'linkedin';

export interface PublishInput {
  title: string;
  caption: string;
  hashtags: string; // Sticking to string as per current metadata
  platform: 'facebook';
  scheduledAt?: string;
}

export interface PublishResult {
  success: boolean;
  externalId?: string;
  externalUrl?: string;
  error?: string;
}

export interface PublishingAdapter {
  provider: PublishingProvider;
  sendPost(input: PublishInput, apiKey: string): Promise<PublishResult>;
}
