const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const indexPath = path.resolve(__dirname, '../public/index.html');

const indexHTML = fs.readFileSync(indexPath);
// fs.readFile(indexPath, function(err, data) {
//     const c = new Buffer.from(data).toString()
//     console.log(c)})
const c = new Buffer.from(indexHTML).toString()
const script = '<script type="text/javascript" src="https://massgovfeature3.prod.acquia-sites.com/themes/custom/mass_theme/overrides/js/iframe_resizer_iframe.js"></script>'
const $ = cheerio.load(c);

$('body').append(script);
console.log($.html())

fs.writeFile(indexPath, $.html(), (err) => {
    if (err) throw err;
})