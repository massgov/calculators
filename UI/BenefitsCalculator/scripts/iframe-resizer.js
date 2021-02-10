const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const indexPath = path.resolve(__dirname, '../public/index.html');

const indexHTML = fs.readFileSync(indexPath);
const script = '<script type="text/javascript" src="https://massgovfeature3.prod.acquia-sites.com/themes/custom/mass_theme/overrides/js/iframe_resizer_iframe.js"></script> />'
const $ = cheerio.load(indexHTML);

const content = $('body').append(script)

fs.writeFile(indexHTML, content.html(), (err) => {
    if (err) throw err;
})