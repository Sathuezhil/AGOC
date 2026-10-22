const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        walk(p);
      }
    } else if (/\.(ts|tsx|css|json|mjs)$/.test(entry.name)) {
      const text = fs.readFileSync(p, 'utf8');
      if (text.includes('\r\n')) {
        fs.writeFileSync(p, text.replace(/\r\n/g, '\n'), 'utf8');
      }
    }
  }
}

walk(path.resolve(__dirname, '..'));
console.log('LF normalized successfully.');
