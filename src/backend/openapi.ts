import { type OpenAPIObject } from 'openapi3-ts/oas31';

export const openApiDoc: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'ServiceBuilder API',
    version: '1.0.0'
  },
  paths: {
    '/api/connect': {
      post: {
        summary: 'Connect to database',
        requestBody: {
          description: 'Connection settings',
          content: { 'application/json': { schema: { type: 'object' } } }
        },
        responses: { '200': { description: 'ok' } }
      }
    },
    '/api/tables': {
      get: { summary: 'List tables', responses: { '200': { description: 'table list' } } }
    }
  }
};

// In-memory record of generated endpoint definitions
export const generatedApis: Record<string, { sql: string }> = {};
