const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'content/docs');

function processMdxFile(destFile) {
  let content = fs.readFileSync(destFile, 'utf8');

  // Wipe <ResponseExample> and </ResponseExample>
  content = content.replace(/<ResponseExample>/g, '### Example Response\n');
  content = content.replace(/<\/ResponseExample>/g, '');

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
console.log('Fixed ResponseExample tags!');
