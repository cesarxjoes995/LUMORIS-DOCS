const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (['node_modules', '.next', '.git'].includes(file)) continue;
            processDir(fullPath);
        } else {
            if (!fullPath.endsWith('.tsx') && !fullPath.endsWith('.mdx') && !fullPath.endsWith('.ts')) continue;
            
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content;

            // Replace domains
            newContent = newContent.replaceAll('lumorislabs.online/api/', 'api.lumorislabs.online/');
            newContent = newContent.replaceAll('disbelief-recent-thaw.ngrok-free.dev/api/', 'api.lumorislabs.online/');
            
            // Playground base url
            newContent = newContent.replaceAll('${API_BASE_URL}/api/', '${API_BASE_URL}/');
            
            // Log endpoint checks
            newContent = newContent.replaceAll("'/api/jobs/'", "'/jobs/'");
            newContent = newContent.replaceAll('"/api/jobs/"', '"/jobs/"');
            newContent = newContent.replaceAll("'/api/image-generation", "'/image-generation");
            
            // MDX api keys
            newContent = newContent.replaceAll("api: 'POST /api/", "api: 'POST /");
            newContent = newContent.replaceAll("api: 'GET /api/", "api: 'GET /");
            
            if (newContent !== content) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

processDir(__dirname);
