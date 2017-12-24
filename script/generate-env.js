const fs = require('fs');

let production;

if (process.argv.length > 2 && process.argv[2] === 'production') {
  production = 'true';
} else {
  production = 'false';
}

fs.writeFileSync('env.ts', `export const environment = { production: ${production} };`);
