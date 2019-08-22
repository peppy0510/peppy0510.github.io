// author: Taehong Kim
// email: peppy0510@hotmail.com

function initAudioPlayer(url) {

    let audioPlayerElement = $('.audio-player')[0];


    // <audio controls="controls">
    //     <source src="/static/audio/production/super-star.mp3" type="audio/mpeg">
    // </audio>

    let audio = document.createElement('audio');
    audio.controls = 'controls';
    audioPlayerElement.appendChild(audio);

    let audioElement = $('.audio-player audio')[0];

    let source = document.createElement('source');
    source.src = url;
    source.type = 'audio/mpeg';
    source.preload = 'auto';
    audioElement.appendChild(source);
};