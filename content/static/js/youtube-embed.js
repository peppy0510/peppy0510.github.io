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

let youtubeIds = [];
let youtubePlayers = [];
let youtubeContainers = [];
const youtubeIntersectionObserver = new IntersectionObserver(onIntersectionYoutube, {
    threshold: 0,
});

function onPlayerReady(event) {
    // event.target.playVideo();
}

function getNextVideoId(videoId) {
    let nextId = undefined;
    for (let index = 0; index < youtubeIds.length; index++) {
        if (youtubeIds[index] !== videoId) continue;
        nextId = youtubeIds[index + 1];
        break;
    }
    // console.log(youtubeIds, nextId);
    return nextId;
}

let youtubePlayerTimeout = undefined;

function onPlayerStateChange(event) {
    // console.log(event.target.getVideoData())
    // console.log(event.target.playerInfo.videoData.video_id);
    const target = event.target;
    if (!target || !target.playerInfo || !target.playerInfo.videoData) return;
    const videoId = target.playerInfo.videoData.video_id;
    const nextVideoId = getNextVideoId(videoId);
    // console.log(target);
    // console.log(event.data, YT.PlayerState, YT.PlayerState.ENDED)
    if (event.data === YT.PlayerState.PLAYING) {
        for (let index = 0; index < youtubePlayers.length; index++) {
            const player = youtubePlayers[index];
            if (!player || !player.playerInfo || !player.playerInfo.videoData) continue;
            // if (!youtubePlayers[index] || !youtubePlayers[index].getVideoData) continue;
            // if (typeof youtubePlayers[index].getVideoData !== 'function') continue;
            // const _state = youtubePlayers[index].getPlayerState();
            const _videoId = player.playerInfo.videoData.video_id;
            // if (_state !== YT.PlayerState.PLAYING) continue;
            if (_videoId === videoId) continue;
            if (!player.pauseVideo) continue;
            // player.pauseVideo();
            player.seekTo(0);
            player.stopVideo();
        }
        loadYoutubeVideoId(nextVideoId);
    } else if (event.data === YT.PlayerState.ENDED) {
        // target.seekTo(0);
        for (let index = 0; index < youtubePlayers.length; index++) {
            const player = youtubePlayers[index];
            if (!player || !player.playerInfo || !player.playerInfo.videoData) continue;
            // if (!youtubePlayers[index] || !youtubePlayers[index].getVideoData) continue;
            if (player.playerInfo.videoData.video_id !== videoId) continue;
            if (!player.seekTo) continue;
            player.seekTo(0);
            player.stopVideo();
            break;
        }
        // clearTimeout(youtubePlayerTimeout);
        // youtubePlayerTimeout = setTimeout(() => {
        //     for (let index = 0; index < youtubePlayers.length; index++) {
        //         const player = youtubePlayers[index];
        //         if (!player || !player.playerInfo || !player.playerInfo.videoData) continue;
        //         // if (!youtubePlayers[index] || !youtubePlayers[index].getVideoData) continue;
        //         if (player.playerInfo.videoData.video_id !== nextVideoId) continue;
        //         if (!player.playVideo) continue;
        //         player.seekTo(0);
        //         player.playVideo();
        //         break;
        //     }
        // }, 100);
    }
}

function onPlayerError(event) {}

function loadYoutubeVideoId(videoId) {
    const origin = window.location.origin;
    const player = new window.YT.Player(`youtube-source-${videoId}`, {
        height: '560',
        width: '315',
        videoId: videoId,
        // host: 'https://www.youtube.com',
        playerVars: {
            // loop: 1,
            autoplay: 0,
            controls: 1,
            playsinline: 1,
            enablejsapi: 1,
            modestbranding: 1,
            // wmode: 'opaque',
            // host: 'https://www.youtube.com',
            origin: origin,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
        },
    });
    youtubePlayers.push(player);
}

async function onIntersectionYoutube(entries, observer) {
    for (let index = 0; index < entries.length; index++) {
        if (!entries[index].isIntersecting || entries[index].isVisible) continue;
        const source = entries[index].target.getAttribute('youtube-source');
        const iframe = entries[index].target.querySelector('div.youtube-video-iframe');
        if (!iframe) continue;
        loadYoutubeVideoId(source);
        // console.log(youtubeIframeState.isReady)
        // console.log(source, iframe.id);
        // const player = new window.YT.Player(iframe.id, {
        //     height: '560',
        //     width: '315',
        //     videoId: source,
        //     // host: 'https://www.youtube.com',
        //     playerVars: {
        //         loop: 1,
        //         autoplay: 0,
        //         controls: 1,
        //         playsinline: 1,
        //         enablejsapi: 1,
        //         modestbranding: 1,
        //         // wmode: 'opaque',
        //         // host: 'https://www.youtube.com',
        //         origin: origin,
        //     },
        //     events: {
        //         onReady: onPlayerReady,
        //         onStateChange: onPlayerStateChange,
        //         onError: onPlayerError,
        //     },
        // });
        // youtubePlayers.push(player);
        // players.push(player);
    }
}

function initializeYoutubeEmbed() {
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
        container.setAttribute('youtube-source', hash);
        youtubeIds.push(hash);
        // container.setAttribute('id', `youtube-source-${hash}`);
        let iframe = createElement('div', 'youtube-video-iframe');
        // let iframe = createElement('iframe', 'youtube-video-iframe');
        iframe.setAttribute('youtube-source', hash);
        iframe.setAttribute('id', `youtube-source-${hash}`);

        // if (console.log(youtubeIframeState.isReady))
        youtubeContainers.push(container);
        // iframe.setAttribute('src', 'https://www.youtube.com/embed/' + hash + '?html5=1');
        // iframe.setAttribute(
        //     'allow',
        //     'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
        // );
        // iframe.setAttribute('allowfullscreen', '');
        // iframe.setAttribute('frameborder', '0');
        // iframe.setAttribute('width', '560');
        // iframe.setAttribute('height', '315');
        // console.log(iframe)
        container.appendChild(iframe);
        wrapper.appendChild(container);
        youtubes[i].parentNode.after(createElement('p'));
        youtubes[i].parentNode.before(createElement('p'));
        if (title) {
            youtubes[i].parentNode.before(title);
        }
        youtubes[i].parentNode.replaceWith(wrapper);
    }

    // io.observe(container);
}

async function onYouTubeIframeAPIReady() {
    // youtubeIntersectionObserver
    // youtubeIframeState.isReady = true;
    for (let index = 0; index < youtubeContainers.length; index++) {
        youtubeIntersectionObserver.observe(youtubeContainers[index]);
    }
    // return;
    // const players = [];
    // const origin = window.location.origin;
    // let iframes = $('.youtube-video-iframe');
    // for (let index = 0; index < iframes.length; index++) {
    //     const source = iframes[index].getAttribute('youtube-source');

    //     function onPlayerReady(event) {
    //         // event.target.playVideo();
    //     }
    //     function onPlayerStateChange(event) {
    //         if (event.data == YT.PlayerState.PLAYING) {
    //             for (let i = 0; i < players.length; i++) {
    //                 if (i !== index && players[i].pauseVideo) {
    //                     players[i].pauseVideo();
    //                     // players[i].stopVideo();
    //                 }
    //             }
    //         }
    //     }

    //     function onPlayerError(event) {}

    //     const player = new window.YT.Player(iframes[index].id, {
    //         height: '560',
    //         width: '315',
    //         videoId: source,
    //         // host: 'https://www.youtube.com',
    //         playerVars: {
    //             playsinline: 1,
    //             enablejsapi: 1,
    //             // wmode: 'opaque',
    //             // host: origin,
    //             // host: 'https://www.youtube.com',
    //             origin: origin,
    //         },
    //         events: {
    //             onReady: onPlayerReady,
    //             onStateChange: onPlayerStateChange,
    //             onError: onPlayerError,
    //         },
    //     });
    //     players.push(player);
    // }
}

$(document).ready(async function () {
    initializeYoutubeEmbed();
    loadYoutubeAPI();
});
