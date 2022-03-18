import {readFileSync} from 'fs';
import {marked} from 'marked';
import {sanitizeHtml} from './sanitizer';
import {ParsedRequest} from './types';

const twemoji = require('twemoji');
const twOptions = {folder: 'svg', ext: '.svg'};
const emojify = (text: string) => twemoji.parse(text, twOptions);

// const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
// const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = '#0f172a';
    let softForeground = '#475569'

    if (theme === 'dark') {
        background = '#0f172a';
        foreground = 'white';
        softForeground = '#94a3b8'
    }
    return `
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&display=swap');
    
    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        background-size: 100px 100px;
        height: 100vh;
        margin: 112px;
        display: flex;
        flex-direction: column;
        text-align: left;
        align-items: flex-start;
        justify-content: flex-start;
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme === 'dark' ? '1e293b' : 'f1f5f9'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        position: absolute;
        bottom: 0px;
        right: -48px;
    }
    
    .website-name {
        font-size: 80px;
        font-weight: 500;
        color: ${softForeground};
        visibility: hidden;
    }

    .logo {
        margin: 0 48px;
    }

    .plus {
        color: #BBB;
        font-family: "Times New Roman", Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 48px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: "Libre Baskerville", serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        font-weight: 800;
        line-height: 1.1111111;
        text-align: left;
        width: 66.6666666%
    }
    
    .heading > p {
        margin-top: 0;
    }
    `;


}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="heading">${emojify(
            md ? marked(text) : sanitizeHtml(text)
        )}
        </div>
         <div class="logo-wrapper">
            ${images.map((img, i) =>
    getPlusSign(i) + getImage(img, widths[i], heights[i])
).join('')}

        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '1100') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
