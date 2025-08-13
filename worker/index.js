import { createRequestHandler } from '@remix-run/cloudflare';
import * as build from '../build/index.js';

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  const request = event.request;
  return createRequestHandler({
    build,
    getLoadContext() {
      // make env accessible inside loaders/actions as `context.env`
      return { env: event.data ? event.data.env : undefined };
    }
  })(request, event);
}

// Note: when using wrangler publish / cloudflare, the environment `env` will
// be passed automatically to loader/action context. The Remix handler above
// is the standard entry for Cloudflare Workers.
// In some setups you might export default for wrangler; adjust as needed.
