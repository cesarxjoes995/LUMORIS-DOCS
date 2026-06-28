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
            if (!fullPath.endsWith('.tsx') && !fullPath.endsWith('.ts') && !fullPath.endsWith('.mdx')) continue;
            
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content;

            // Specific route replacements
            newContent = newContent.replaceAll("'/dashboard/keys'", "'/keys'");
            newContent = newContent.replaceAll('"/dashboard/keys"', '"/keys"');
            newContent = newContent.replaceAll("'/dashboard/usage'", "'/usage'");
            newContent = newContent.replaceAll('"/dashboard/usage"', '"/usage"');
            newContent = newContent.replaceAll("'/dashboard/billing'", "'/billing'");
            newContent = newContent.replaceAll('"/dashboard/billing"', '"/billing"');
            newContent = newContent.replaceAll("'/dashboard/pricing'", "'/pricing'");
            newContent = newContent.replaceAll('"/dashboard/pricing"', '"/pricing"');
            newContent = newContent.replaceAll("'/dashboard/settings'", "'/settings'");
            newContent = newContent.replaceAll('"/dashboard/settings"', '"/settings"');
            newContent = newContent.replaceAll("'/dashboard/admin'", "'/admin'");
            newContent = newContent.replaceAll('"/dashboard/admin"', '"/admin"');
            
            // Nested admin routes
            newContent = newContent.replaceAll("'/dashboard/admin/users/[userId]'", "'/admin/users/[userId]'");
            newContent = newContent.replaceAll('`/dashboard/admin/users/${u.id}`', '`/admin/users/${u.id}`');
            
            // Base dashboard replacements
            newContent = newContent.replaceAll("'/dashboard'", "'/'");
            newContent = newContent.replaceAll('"/dashboard"', '"/"');
            newContent = newContent.replaceAll("href='/dashboard'", "href='/'");
            newContent = newContent.replaceAll('href="/dashboard"', 'href="/"');
            newContent = newContent.replaceAll("redirect('/dashboard')", "redirect('/')");
            newContent = newContent.replaceAll('redirect("/dashboard")', 'redirect("/")');
            newContent = newContent.replaceAll("isActive('/dashboard')", "isActive('/')");
            newContent = newContent.replaceAll('isActive("/dashboard")', 'isActive("/")');
            
            // Markdown links
            newContent = newContent.replaceAll("(/dashboard)", "(/)");
            newContent = newContent.replaceAll("(/dashboard/keys)", "(/keys)");

            if (newContent !== content) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

processDir(__dirname);
