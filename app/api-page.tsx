import { createAPIPage } from 'fumadocs-openapi/ui';
import { createOpenAPI } from 'fumadocs-openapi/server';

export const APIPage = createAPIPage(
  createOpenAPI({ input: ['./openapi.json'] })
);
