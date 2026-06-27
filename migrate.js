const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../firefly-api');
const destDir = path.join(__dirname, 'content/docs');

// Helper to copy and convert MDX files
function processMdxFile(srcFile, destFile) {
  let content = fs.readFileSync(srcFile, 'utf8');

  // Convert <Note> to <Callout>
  content = content.replace(/<Note>/g, '<Callout>');
  content = content.replace(/<\/Note>/g, '</Callout>');
  content = content.replace(/<Warning>/g, '<Callout type="warn">');
  content = content.replace(/<\/Warning>/g, '</Callout>');
  content = content.replace(/<Info>/g, '<Callout type="info">');
  content = content.replace(/<\/Info>/g, '</Callout>');

  // Replace <ParamField> with Markdown headers/lists
  // Since Fumadocs <TypeTable> is complex, let's just make them standard markdown
  content = content.replace(/<ParamField\s+body="([^"]+)"\s+type="([^"]+)"(?:\s+required)?>/g, '#### `$1` ($2) **Required**\n\n');
  content = content.replace(/<ParamField\s+body="([^"]+)"\s+type="([^"]+)"(?:\s+default="([^"]+)")?>/g, '#### `$1` ($2)\n*Default: $3*\n\n');
  content = content.replace(/<ParamField\s+body="([^"]+)"\s+type="([^"]+)">/g, '#### `$1` ($2)\n\n');
  content = content.replace(/<\/ParamField>/g, '');

  content = content.replace(/<ResponseField\s+name="([^"]+)"\s+type="([^"]+)">/g, '#### `$1` ($2)\n\n');
  content = content.replace(/<\/ResponseField>/g, '');

  content = content.replace(/<RequestExample>/g, '### Example Request');
  content = content.replace(/<\/RequestExample>/g, '');

  // Convert CardGroup and Card
  content = content.replace(/<CardGroup[^>]*>/g, '<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">');
  content = content.replace(/<\/CardGroup>/g, '</div>');
  content = content.replace(/<Card\s+title="([^"]+)"[^>]*href="([^"]+)"[^>]*>/g, '<a href="$2" className="block p-4 border rounded-lg hover:bg-muted">\n<h4 className="font-bold">$1</h4>\n');
  content = content.replace(/<\/Card>/g, '</a>');

  // URL replacement for ngrok to railway
  content = content.replace(/https:\/\/disbelief-recent-thaw\.ngrok-free\.dev/g, 'https://lumorislabs.online');

  // Ensure dest directory exists
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.writeFileSync(destFile, content, 'utf8');
}

function processDirectory(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      processDirectory(srcPath, destPath);
    } else if (srcPath.endsWith('.mdx')) {
      processMdxFile(srcPath, destPath);
    }
  }
}

// 1. Copy get-started -> content/docs/get-started
processDirectory(path.join(srcDir, 'get-started'), path.join(destDir, 'get-started'));

// 2. Copy api-reference -> content/docs/api-reference
processDirectory(path.join(srcDir, 'api-reference'), path.join(destDir, 'api-reference'));

console.log('Content migration complete!');
