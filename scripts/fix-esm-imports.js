#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function fixImports(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = join(dir, file.name);
    
    if (file.isDirectory()) {
      await fixImports(fullPath);
    } else if (file.name.endsWith('.js')) {
      let content = await readFile(fullPath, 'utf-8');
      
      // Fix relative imports - add .js extension
      content = content.replace(
        /from\s+['"](\.[^'"]+)(?<!\.js)(?<!\.json)['"]/g,
        "from '$1.js'"
      );
      
      // Fix import statements
      content = content.replace(
        /import\s+(.+)\s+from\s+['"](\.[^'"]+)(?<!\.js)(?<!\.json)['"]/g,
        "import $1 from '$2.js'"
      );
      
      // Fix dynamic imports
      content = content.replace(
        /import\(['"](\.[^'"]+)(?<!\.js)(?<!\.json)['"]\)/g,
        "import('$1.js')"
      );
      
      // Fix dayjs plugin imports
      content = content.replace(
        /from\s+['"]dayjs\/plugin\/(\w+)['"]/g,
        "from 'dayjs/plugin/$1.js'"
      );
      
      await writeFile(fullPath, content);
    }
  }
}

fixImports('./dist').then(() => {
  console.log('✅ Fixed ESM imports');
}).catch(console.error);