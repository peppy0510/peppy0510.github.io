// author: Taehong Kim
// email: peppy0510@hotmail.com


function createElement(tag, className, value) {
    let element = document.createElement(tag);
    if (className) { element.className = className; }
    if (value) { element.appendChild(document.createTextNode(value)); }
    return element;
}

async function initializeYoutubeEmbed() {
    let youtube = $('youtube');
    for (let i = 0; i < youtube.length; i++) {
        let hash = undefined;
        for (let ii = 0; ii < youtube[i].attributes.length; ii++) {
            if (youtube[i].attributes[ii].name === 'source') {
                hash = youtube[i].attributes[ii].value;
            }
        }
        if (!hash) { continue; }
        let title = youtube[i].innerText;
        if (title) { title = createElement('h4', '', youtube[i].innerText); }
        let wrapper = createElement('div', 'fluid-width-video-wrapper');
        let container = createElement('div', 'video-container');
        let iframe = createElement('iframe');
        iframe.setAttribute('src', 'https://www.youtube.com/embed/' + hash + '?html5=1');
        iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        container.appendChild(iframe);
        wrapper.appendChild(container);
        youtube[i].parentNode.after(createElement('p'));
        youtube[i].parentNode.before(createElement('p'));
        if (title) { youtube[i].parentNode.before(title); }
        youtube[i].parentNode.replaceWith(wrapper);
    }
}

$(document).ready(async function() {
    initializeYoutubeEmbed();
});