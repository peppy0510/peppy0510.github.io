// author: Taehong Kim
// email: peppy0510@hotmail.com


function createElement(tag, className, value) {
    let element = document.createElement(tag);
    if (className) { element.className = className; }
    if (value) { element.appendChild(document.createTextNode(value)); }
    return element;
}

function initializeYoutubeEmbed() {
    let youtube = $('youtube');
    youtube.show();
    let warning = createElement('p', 'browser-media-warning',
        'Your browser(IE) does not support this media.')
    youtube.after(warning);
}

$(document).ready(function() {
    initializeYoutubeEmbed();
});