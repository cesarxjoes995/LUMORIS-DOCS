import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';

void generateFiles({
  input: createOpenAPI({ input: ['./openapi.json'] }),
  output: './content/docs/api-playground',
});
