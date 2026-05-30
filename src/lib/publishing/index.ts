import { BufferAdapter } from './buffer';
import { PublishingAdapter, PublishingProvider, PublishInput, PublishResult } from './types';

class PlaceholderAdapter implements PublishingAdapter {
    provider: PublishingProvider;
    constructor(provider: PublishingProvider) {
        this.provider = provider;
    }
    async function sendPost(_input: PublishInput, _apiKey: string): Promise<PublishResult> {
        return { success: false, error: `Provider ${this.provider} not implemented yet.` };
    }

}

const adapters: Record<PublishingProvider, PublishingAdapter> = {
  buffer: new BufferAdapter(),
  facebook: new PlaceholderAdapter('facebook'),
  instagram: new PlaceholderAdapter('instagram'),
  linkedin: new PlaceholderAdapter('linkedin'),
};

export function getPublishingAdapter(provider: PublishingProvider): PublishingAdapter {
  const adapter = adapters[provider];
  if (!adapter) {
    throw new Error(`No publishing adapter found for provider: ${provider}`);
  }
  return adapter;
}

export * from './types';
