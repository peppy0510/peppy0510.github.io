// author: Taehong Kim
// email: peppy0510@hotmail.com

function createElement(tag, className, value) {
    let element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (value) {
        element.appendChild(document.createTextNode(value));
    }
    return element;
}

async function loadYoutubeAPI() {
    let containers = $('.youtube-video-container');
    if (!containers.length) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

async function initializeYoutubeEmbed() {
    let youtubes = $('youtube');
    for (let i = 0; i < youtubes.length; i++) {
        let hash = undefined;
        for (let ii = 0; ii < youtubes[i].attributes.length; ii++) {
            if (youtubes[i].attributes[ii].name === 'source') {
                hash = youtubes[i].attributes[ii].value;
            }
        }
        if (!hash) {
            continue;
        }
        let title = youtubes[i].innerText;
        if (title) {
            title = createElement('h4', '', youtubes[i].innerText);
        }
        let wrapper = createElement('div', 'fluid-width-video-wrapper');
        let container = createElement('div', 'video-container');
        container.classList.add('youtube-video-container');
        // container.setAttribute('youtube-source', hash);
        // container.setAttribute('id', `youtube-source-${hash}`);
        let iframe = createElement('div', 'youtube-video-iframe');
        iframe.setAttribute('youtube-source', hash);
        iframe.setAttribute('id', `youtube-source-${hash}`);
        // iframe.setAttribute('src', 'https://www.youtube.com/embed/' + hash + '?html5=1');
        // iframe.setAttribute(
        //     'allow',
        //     'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
        // );
        // iframe.setAttribute('allowfullscreen', '');
        // iframe.setAttribute('frameborder', '0');
        // iframe.setAttribute('width', '560');
        // iframe.setAttribute('height', '315');
        container.appendChild(iframe);
        wrapper.appendChild(container);
        youtubes[i].parentNode.after(createElement('p'));
        youtubes[i].parentNode.before(createElement('p'));
        if (title) {
            youtubes[i].parentNode.before(title);
        }
        youtubes[i].parentNode.replaceWith(wrapper);
    }
}

function onYouTubeIframeAPIReady() {
    const players = [];
    const origin = window.location.origin;
    let iframes = $('.youtube-video-iframe');
    for (let index = 0; index < iframes.length; index++) {
        const source = iframes[index].getAttribute('youtube-source');

        function onPlayerReady(event) {
            // event.target.playVideo();
        }
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING) {
                for (let i = 0; i < players.length; i++) {
                    if (i !== index && players[i].pauseVideo) {
                        players[i].pauseVideo();
                        // players[i].stopVideo();
                    }
                }
            }
        }

        function onPlayerError(event) {}
        const player = new window.YT.Player(iframes[index].id, {
            height: '560',
            width: '315',
            videoId: source,
            // host: 'https://www.youtube.com',
            playerVars: {
                playsinline: 1,
                enablejsapi: 1,
                // wmode: 'opaque',
                // host: origin,
                // host: 'https://www.youtube.com',
                origin: origin,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
                onError: onPlayerError,
            },
        });
        players.push(player);
    }
}

$(document).ready(async function () {
    initializeYoutubeEmbed();
    loadYoutubeAPI();
});
