const fs = require('fs');

function removeCommentKeys(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(removeCommentKeys);
  } else if (obj !== null && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (key.startsWith('__comment')) {
        delete obj[key];
      } else {
        removeCommentKeys(obj[key]);
      }
    });
  }
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide a file path');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
removeCommentKeys(data);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Comments removed from ${filePath}`);
