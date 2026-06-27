const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'content/docs');

function processMdxFile(destFile) {
  let content = fs.readFileSync(destFile, 'utf8');

  // Remove the div and a tags we mistakenly injected earlier
  content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">/g, '');
  content = content.replace(/<a href="[^"]+" className="block p-4 border rounded-lg hover:bg-muted">\n<h4 className="font-bold">[^<]+<\/h4>\n/g, '');
  content = content.replace(/<\/a>/g, '');
  content = content.replace(/<\/div>/g, '');

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
console.log('Fixed div and a tags in MDX!');
