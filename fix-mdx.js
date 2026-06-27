const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'content/docs');

// Helper to fix remaining MDX issues
function processMdxFile(destFile) {
  let content = fs.readFileSync(destFile, 'utf8');

  // Fix multiline <ParamField> opening tags which were missed
  // We'll replace <ParamField body="xyz" type="xyz" ...> and <ParamField query="xyz" type="xyz" ...>
  content = content.replace(/<ParamField\s+([^>]+)>/g, (match, attrs) => {
    let nameMatch = attrs.match(/(?:body|query)="([^"]+)"/);
    let typeMatch = attrs.match(/type="([^"]+)"/);
    
    let name = nameMatch ? nameMatch[1] : 'Param';
    let type = typeMatch ? typeMatch[1] : 'unknown';
    
    let suffix = attrs.includes('required') ? '**Required**' : '';
    let defaultMatch = attrs.match(/default="([^"]+)"/);
    if (defaultMatch) {
      suffix += ` *Default: ${defaultMatch[1]}*`;
    }
    
    return `#### \`${name}\` (${type}) ${suffix}\n\n`;
  });
  
  // Wipe all </ParamField> tags
  content = content.replace(/<\/ParamField>/g, '');
  
  // Wipe all <Card> and </Card> tags if any are broken or missed
  content = content.replace(/<Card[^>]*>/g, '');
  content = content.replace(/<\/Card>/g, '');
  content = content.replace(/<CardGroup[^>]*>/g, '');
  content = content.replace(/<\/CardGroup>/g, '');
  content = content.replace(/<ResponseField[^>]*>/g, '');
  content = content.replace(/<\/ResponseField>/g, '');

  fs.writeFileSync(destFile, content, 'utf8');
}

function processDirectory(destDir) {
  if (!fs.existsSync(destDir)) return;
  const files = fs.readdirSync(destDir);
  for (const file of files) {
    const destPath = path.join(destDir, file);
    const stat = fs.statSync(destPath);
    if (stat.isDirectory()) {
      processDirectory(destPath);
    } else if (destPath.endsWith('.mdx')) {
      processMdxFile(destPath);
    }
  }
}

processDirectory(destDir);
console.log('Fixed MDX files!');
