const fs = require('fs');
const path = require('path');

try {
  fs.copyFileSync(
    path.join(__dirname, '..', '.env.prod'),
    path.join(__dirname, '..', 'dist', '.env')
  );
} catch (error) {
  console.log('.env copy failed', error);
  exit(1);
}
