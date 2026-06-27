const fs = require('fs');
const path = require('path');

const refDir = path.join(__dirname, 'content/docs/api-reference');

const modelInfo = {
  // Image Generation
  'flux1-1-pro-ultra-raw': {
    title: 'FLUX1.1 [pro] Ultra Raw',
    desc: 'The Raw variant of FLUX1.1 [pro] Ultra by Black Forest Labs, designed to capture authentic, unpolished photography without the artificial "AI look". Perfect for generating highly realistic images with natural lighting, genuine textures, and human-like imperfections.'
  },
  'flux1-1-pro-ultra': {
    title: 'FLUX1.1 [pro] Ultra',
    desc: 'The pinnacle of image generation by Black Forest Labs. FLUX1.1 [pro] Ultra generates extremely high-resolution images (up to 4 megapixels) with breathtaking photorealism, perfect typography, and flawless composition. Ideal for commercial photography and high-end marketing assets.'
  },
  'flux1-kontext-pro': {
    title: 'FLUX.1 Kontext [pro]',
    desc: 'An advanced variant of FLUX optimized for heavy contextual reasoning. Excellent for following incredibly dense, long, and highly specific prompts where every detail matters.'
  },
  'flux-kontext-max': {
    title: 'FLUX Kontext Max',
    desc: 'The maximum context variant of the FLUX architecture, designed to push the boundaries of prompt adherence and complex scene composition.'
  },
  'flux1-1-pro': {
    title: 'FLUX1.1 Pro',
    desc: 'Black Forest Labs\' incredibly fast and capable flagship model. Offers a massive leap in generation speed, instruction following, and overall image quality compared to its predecessor. The perfect balance of speed and top-tier quality.'
  },
  'flux2-pro': {
    title: 'FLUX.2 Pro',
    desc: 'The next generation of the FLUX Pro architecture, delivering state-of-the-art aesthetics and prompt understanding.'
  },
  'gpt-image-1': {
    title: 'GPT Image 1 (4o-based)',
    desc: 'Powered by advanced multimodal architectures, this model excels at creating images deeply aligned with conversational and logical prompts.'
  },
  'gpt-image-1-5': {
    title: 'GPT Image 1.5',
    desc: 'An upgraded version of the GPT Image series with enhanced detailing and better texture synthesis.'
  },
  'gpt-image-2': {
    title: 'GPT Image 2',
    desc: 'The latest in the GPT Image lineage, featuring unparalleled coherence and the ability to weave complex narratives into single images.'
  },
  'nano-banana': {
    title: 'Nano Banana (Gemini Flash)',
    desc: 'A lightning-fast image generation model built on Google\'s Gemini Flash architecture. Perfect for rapid prototyping and real-time generation applications.'
  },
  'nano-banana-2': {
    title: 'Nano Banana 2',
    desc: 'An upgraded Flash model offering higher resolutions up to 4K while maintaining blazing-fast generation speeds.'
  },
  'nano-banana-pro': {
    title: 'Nano Banana Pro',
    desc: 'The premium variant of the Flash series, optimized for professional workflows demanding both speed and high fidelity.'
  },
  'runway-gen4': {
    title: 'Runway Gen-4 Image',
    desc: 'Runway\'s state-of-the-art foundational image model, designed for cinematic aesthetics, hyper-realism, and unparalleled artistic control.'
  },

  // Video Generation
  'ray-3-14': {
    title: 'Luma Ray 3.14',
    desc: 'Luma AI\'s groundbreaking text-to-video model. Ray 3.14 delivers breathtakingly realistic motion, physically accurate physics, and stunning cinematic lighting. It understands complex prompts to generate high-fidelity dynamic scenes.'
  },
  'veo-3-1-fast': {
    title: 'Veo 3.1 Fast',
    desc: 'Google\'s highly capable Veo architecture optimized for speed. Generates highly coherent video sequences with incredible prompt adherence in a fraction of the time.'
  },
  'runway-gen4-5-video': {
    title: 'Runway Gen-4.5 Video',
    desc: 'The bleeding edge of Runway\'s video generation capabilities. Features near-perfect temporal consistency, hyper-realistic camera movements, and cinematic grading straight out of the model.'
  },
  'kling-2-5-turbo': {
    title: 'Kling 2.5 Turbo',
    desc: 'Kuaishou\'s fast video generation model, delivering high-quality motion and character consistency at rapid speeds.'
  },
  'kling-3-0': {
    title: 'Kling 3.0',
    desc: 'Kuaishou\'s flagship video model, renowned for generating ultra-realistic human motion, complex physics simulations, and long-duration temporal consistency.'
  },
  'kling-3-0-omni': {
    title: 'Kling 3.0 Omni',
    desc: 'The omni-modal variant of Kling 3.0, designed to perfectly synchronize highly dynamic scenes with audio generation and complex transitions.'
  },
  'seedance-2-0': {
    title: 'Seedance 2.0',
    desc: 'A specialized video generation model focused on high-energy motion, choreography, and dynamic framing.'
  },
  'seedance-2-0-fast': {
    title: 'Seedance 2.0 Fast',
    desc: 'The accelerated version of Seedance 2.0, perfect for quick iterations and real-time motion generation.'
  },

  // Speech Generation
  'elevenlabs-multilingual-v2': {
    title: 'ElevenLabs Multilingual v2',
    desc: 'The industry standard for AI voice generation. Delivers emotionally rich, highly realistic speech across 29 languages with perfect intonation, pacing, and human-like breathing.'
  }
};

function formatTitle(name) {
  if (modelInfo[name]) return modelInfo[name].title;
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function generateModelContent(folderName) {
  const info = modelInfo[folderName] || {
    title: formatTitle(folderName),
    desc: `Comprehensive documentation for the ${formatTitle(folderName)} model. This model offers state-of-the-art generation capabilities.`
  };

  return `---
title: '${info.title}'
description: 'Documentation and details for ${info.title}'
---

# ${info.title}

${info.desc}

## Overview

${info.title} represents the cutting edge of generative AI. Whether you are building production-level applications or rapid prototypes, this model provides the reliability, quality, and speed necessary for modern AI workflows.

### Key Capabilities
- **High Fidelity:** Exceptional output quality with accurate adherence to complex prompts.
- **Reliability:** Consistent performance suitable for production workloads.
- **API Integration:** Fully accessible via our REST API.

<Callout type="info">
**Want to test this model?**
Head over to our [API Playground](/docs/api-playground) to test this model live with interactive inputs and auto-generated code snippets in cURL, Python, Node.js, and more!
</Callout>

## Supported Parameters

To see the exact schema, required fields, and supported parameters (such as Aspect Ratios, Dimensions, or Quality settings), please refer to the OpenAPI specification in the **API Playground**.

- **API Endpoint:** Uses the standard Lumoris Labs generation and polling architecture.
- **Authentication:** Requires your \`FIREFLY_BEARER_TOKEN\` and \`FIREFLY_API_KEY\`.

## Examples

To get started quickly, you can use our client SDKs or standard HTTP requests. Navigate to the Playground to generate drop-in code snippets for your preferred language.
`;
}

function processCategory(categoryPath) {
  const items = fs.readdirSync(categoryPath);
  const models = [];

  for (const item of items) {
    if (item === 'meta.json') continue;
    const fullPath = path.join(categoryPath, item);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // It's a model folder like `flux1-1-pro`
      models.push(item);
      
      // 1. Generate the new MDX file
      const mdxPath = path.join(categoryPath, `${item}.mdx`);
      fs.writeFileSync(mdxPath, generateModelContent(item));
      
      // 2. Delete the old directory recursively
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else if (item.endsWith('.mdx')) {
      models.push(item.replace('.mdx', ''));
    }
  }

  // Update meta.json
  if (models.length > 0) {
    const meta = {
      title: formatTitle(path.basename(categoryPath)),
      pages: models
    };
    fs.writeFileSync(path.join(categoryPath, 'meta.json'), JSON.stringify(meta, null, 2));
  }
}

if (fs.existsSync(refDir)) {
  const categories = fs.readdirSync(refDir);
  for (const cat of categories) {
    if (cat === 'meta.json') continue;
    const catPath = path.join(refDir, cat);
    if (fs.statSync(catPath).isDirectory()) {
      processCategory(catPath);
    }
  }
  console.log('Refactored API Reference successfully!');
} else {
  console.log('Directory not found:', refDir);
}
