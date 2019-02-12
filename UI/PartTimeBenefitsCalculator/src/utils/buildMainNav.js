/* eslint-disable no-console, prefer-template */
const fs = require('fs');
const https = require('https');
const os = require('os');

const generatedMessage = '// *NOTICE* This file is generated by the build, do not edit directly.';
const eslintDisable = '/* eslint-disable quotes, quote-props */';

try {
  https.get('https://www.mass.gov/api/v1/nav/main', (resp) => {
    const dataFileName = 'src/data/MainNav.data.js';
    const varName = 'mainNav';

    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
      // Write out the JSON, formatted with 2 space indent, as a JS module.
      data = JSON.stringify(JSON.parse(data), null, 2);
      const content = generatedMessage + os.EOL
        + eslintDisable + os.EOL
        + `const ${varName} = ${data};` + os.EOL
        + `export default { ${varName} };` + os.EOL;

      fs.writeFileSync(dataFileName, content, 'utf8', (err) => {
        if (err) throw err;
      });
    });
  }).on('error', (err) => {
    throw err;
  });
} catch (e) {
  console.log(`Error: ${e.message}`);
  process.exit(1);
}
