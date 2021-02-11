const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const { html_beautify } = require('js-beautify');

const indexPath = path.resolve(__dirname, '../public/index.html');

const indexHTML = fs.readFileSync(indexPath);
// fs.readFile(indexPath, function(err, data) {
//     const c = new Buffer.from(data).toString()
//     console.log(c)})
const c = new Buffer.from(indexHTML).toString()
const script = '<script type="text/javascript" src="https://massgovfeature3.prod.acquia-sites.com/themes/custom/mass_theme/overrides/js/iframe_resizer_iframe.js"></script>'
const $ = cheerio.load(c);

if ($.html().includes(script)) {
    return true
} else {
    $('body').append(script);
}

const finalHTML = html_beautify($.html(), { indent_size:2 })
console.log(finalHTML)

fs.writeFile(indexPath, finalHTML, (err) => {
    if (err) throw err;
})