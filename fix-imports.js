import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  const regex = /((?:import|export)\s+(?:.*?from\s+)?['"])(\.\.?\/[^'"]+)(['"])/g;

  let changed = false;
  const newContent = content.replace(regex, (match, prefix, pathStr, suffix) => {
    if (!pathStr.endsWith('.js')) return match;
    changed = true;
    return `${prefix}${pathStr.slice(0, -3)}${suffix}`;
  });

  if (changed) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Fixed ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('.d.ts')) {
      fixFile(fullPath);
    }
  }
}

walk('server');
walk('api');
walk('shared');
