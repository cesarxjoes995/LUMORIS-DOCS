const fs = require('fs');
const path = require('path');

const mintJsonPath = path.join(__dirname, '../firefly-api/mint.json');
const docsDir = path.join(__dirname, 'content/docs');

const mintJson = JSON.parse(fs.readFileSync(mintJsonPath, 'utf8'));

// Recursive function to generate meta.json for navigation groups
function processGroup(group, currentPath) {
  if (!group.pages) return;
  
  const metaPages = [];
  
  for (const item of group.pages) {
    if (typeof item === 'string') {
      // It's a file
      const baseName = path.basename(item);
      // If the file is 'welcome' or 'quickstart' in 'get-started'
      if (item.includes('/')) {
         metaPages.push(baseName);
      } else {
         metaPages.push(item);
      }
    } else if (typeof item === 'object' && item.group) {
      // It's a sub-group
      // Mintlify groups don't explicitly map to folders, but we mapped them to folders in the migration based on paths.
      // Actually, my migration just copied the files over. So the folders exist based on the file paths, e.g. api-reference/image-generation/flux2-pro/create.mdx
      
      // We need to infer the folder name from the first page in the group
      let folderName = '';
      const firstPage = findFirstPage(item);
      if (firstPage) {
        // e.g. api-reference/image-generation/flux2-pro/create -> folder is 'flux2-pro'
        const parts = firstPage.split('/');
        // The group is represented by the folder containing these pages
        // So if currentPath is 'api-reference/image-generation', the next folder is 'flux2-pro' or 'flux'
        
        // Wait, the folders on disk:
        // api-reference/
        //   image-generation/
        //     flux1-1-pro-ultra/
        //     flux2-pro/
        //     ...
        
        // If it's a folder, we just add the folder name to metaPages
        // Let's just create a meta.json in every directory based on the directory contents for now, 
        // since Mintlify's mint.json is complex.
      }
    }
  }
}

function generateMetaJsonForDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const items = fs.readdirSync(dirPath);
  const dirs = [];
  const files = [];
  
  for (const item of items) {
    if (item === 'meta.json') continue;
    const fullPath = path.join(dirPath, item);
    if (fs.statSync(fullPath).isDirectory()) {
      dirs.push(item);
      generateMetaJsonForDir(fullPath);
    } else if (item.endsWith('.mdx')) {
      files.push(item.replace('.mdx', ''));
    }
  }
  
  // Custom sorting logic for nice titles
  const formatTitle = (name) => {
    return name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .replace(/Flux/gi, 'FLUX')
      .replace(/Gpt/gi, 'GPT')
      .replace(/Api/gi, 'API');
  };

  // If this is a leaf directory (contains create and get-job)
  if (files.includes('create') && files.includes('get-job')) {
    fs.writeFileSync(path.join(dirPath, 'meta.json'), JSON.stringify({
      title: formatTitle(path.basename(dirPath)),
      pages: ['create', 'get-job', ...files.filter(f => f !== 'create' && f !== 'get-job')]
    }, null, 2));
    return;
  }
  
  // Otherwise just list them
  if (dirs.length > 0 || files.length > 0) {
     const meta = {
       title: formatTitle(path.basename(dirPath)),
       pages: [...dirs, ...files]
     };
     
     if (dirPath.endsWith('docs')) {
        meta.title = 'Lumoris Labs API';
        meta.pages = ['get-started', 'api-reference'];
     } else if (dirPath.endsWith('get-started')) {
        meta.pages = ['welcome', 'quickstart'];
     }
     
     fs.writeFileSync(path.join(dirPath, 'meta.json'), JSON.stringify(meta, null, 2));
  }
}

generateMetaJsonForDir(docsDir);
console.log('Generated meta.json files for clean navigation!');
