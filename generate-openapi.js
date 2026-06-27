const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'content/docs');
const openapiPath = path.join(__dirname, 'openapi.json');

const openapi = {
  openapi: "3.1.0",
  info: {
    title: "Lumoris Labs API",
    version: "1.0.0",
    description: "API for accessing Lumoris Labs AI models."
  },
  servers: [
    {
      url: "https://lumorislabs.online"
    }
  ],
  paths: {}
};

function parseMdxForOpenApi(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract frontmatter
  const titleMatch = content.match(/title:\s*'([^']+)'/);
  const apiMatch = content.match(/api:\s*'([A-Z]+)\s+([^']+)'/);
  const descMatch = content.match(/description:\s*'([^']+)'/);
  
  if (!apiMatch) return;
  
  const method = apiMatch[1].toLowerCase();
  const route = apiMatch[2];
  const title = titleMatch ? titleMatch[1] : route;
  const description = descMatch ? descMatch[1] : '';
  
  if (!openapi.paths[route]) {
    openapi.paths[route] = {};
  }
  
  // Determine parameter from route
  const parameters = [];
  let parsedRoute = route;
  // Some routes might have path parameters like {jobId}
  // Wait, the MDX routes look like: GET /api/image-generation/flux2-pro
  // But wait, the GET route should have a jobId path parameter! 
  // Wait, how did the MDX define it? It just said `api: 'GET /api/image-generation/flux2-pro'` ? Wait, usually it says `GET /api/image-generation/flux2-pro/{jobId}` ? Let me check.
  
  // Actually, I'll extract parameters from the MDX content if possible.
  // For GET requests, we probably need a query or path parameter for jobId.
  let requestBody = undefined;
  
  if (method === 'post') {
    requestBody = {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              prompt: { type: "string" },
              aspectRatio: { type: "string" },
              image_url: { type: "string" },
              mask_url: { type: "string" }
            }
          }
        }
      }
    };
  } else if (method === 'get') {
    parameters.push({
      name: "jobId",
      in: "path", // Changed from "query" to "path" so it correctly maps to the URL
      required: true,
      schema: { type: "string" }
    });
  }

  openapi.paths[route][method] = {
    summary: title,
    description: description,
    parameters: parameters,
    requestBody: requestBody,
    responses: {
      "200": {
        description: "Success"
      }
    }
  };
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (item.endsWith('.mdx')) {
      parseMdxForOpenApi(fullPath);
    }
  }
}

processDirectory(docsDir);

fs.writeFileSync(openapiPath, JSON.stringify(openapi, null, 2));
console.log('Generated openapi.json');
