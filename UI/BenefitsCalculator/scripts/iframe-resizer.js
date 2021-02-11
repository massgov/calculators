const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const { html_beautify } = require('js-beautify');

const indexPath = path.resolve(__dirname, '../public/index.html');

const indexHTML = fs.readFileSync(indexPath);

const script = '<script type="text/javascript" src="https://massgovfeature3.prod.acquia-sites.com/themes/custom/mass_theme/overrides/js/iframe_resizer_iframe.js"></script>'
const $ = cheerio.load(indexHTML);

if ($.html().includes(script)) {
    return true
} else {
    $('body').append(script);
}

const finalHTML = html_beautify($.html(), { indent_size:2 })

fs.writeFile(indexPath, finalHTML, (err) => {
    if (err) throw err;
})