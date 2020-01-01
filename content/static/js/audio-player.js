// author: Taehong Kim
// email: peppy0510@hotmail.com

var audio = {
    loaded: false,
    playing: false,
    volume: 1.0,
    duration: 0,
    offsetTime: 0,
    currentTime: 0,
    buffer: undefined,
    gainNode: undefined,
    audioCtx: undefined,
    audioBuffer: undefined,
};

var skipAnimationFrame = false;
var animationFrameHandler = undefined;
var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.onAudioContext;

function initAudioPlayer(url, title) {

    let processingIconSrc = '/static/images/processing-icon.gif';

    let audioPlayerElements = $('.audio-player');

    let information = document.createElement('div');
    information.className = 'information';
    audioPlayerElements[0].appendChild(information);

    let informationElements = audioPlayerElements.find('.information');
    let paragraph = document.createElement('p');
    paragraph.className = 'showme-later';
    informationElements[0].appendChild(paragraph);
    $('.audio-player .information p').text(title);

    let waveform = document.createElement('div');
    waveform.className = 'waveform';
    audioPlayerElements[0].appendChild(waveform);

    let toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    audioPlayerElements[0].appendChild(toolbar);

    let waveformElements = audioPlayerElements.find('.waveform');

    let processingIcon = document.createElement('img');
    processingIcon.className = 'processing-icon';
    processingIcon.src = processingIconSrc;
    waveformElements[0].appendChild(processingIcon);

    let waveformCanvas = document.createElement('div');
    waveformCanvas.className = 'waveform-canvas showme-later';
    waveformElements[0].appendChild(waveformCanvas);

    let toolbarElements = audioPlayerElements.find('.toolbar');

    let currentTime = document.createElement('div');
    currentTime.className = 'current-time showme-later';
    toolbarElements[0].appendChild(currentTime);

    let backwardAudioButton = document.createElement('button');
    backwardAudioButton.className = 'backward-audio-button showme-later';
    toolbarElements[0].appendChild(backwardAudioButton);

    let toggleAudioButton = document.createElement('button');
    toggleAudioButton.className = 'toggle-audio-button showme-later';
    toolbarElements[0].appendChild(toggleAudioButton);

    let durationTime = document.createElement('div');
    durationTime.className = 'duration-time showme-later';
    toolbarElements[0].appendChild(durationTime);

    let backwardAudioButtonElements = audioPlayerElements.find('.backward-audio-button');
    let toggleAudioButtonElements = audioPlayerElements.find('.toggle-audio-button');

    let glyphiconStepBackward = document.createElement('span');
    glyphiconStepBackward.className = 'glyphicon glyphicon-step-backward';
    backwardAudioButtonElements[0].appendChild(glyphiconStepBackward);

    let glyphiconPlay = document.createElement('span');
    glyphiconPlay.className = 'glyphicon glyphicon-play';
    toggleAudioButtonElements[0].appendChild(glyphiconPlay);

    let glyphiconPause = document.createElement('span');
    glyphiconPause.className = 'glyphicon glyphicon-pause';
    toggleAudioButtonElements[0].appendChild(glyphiconPause);

    audioPlayerElements.find('.showme-later').css({ 'visibility': 'hidden' });
    audioPlayerElements.find('.waveform-canvas').click(function(event) { onClickWaveform(event); });
    audioPlayerElements.find('.backward-audio-button').click(function() { backwardAudio(); });
    audioPlayerElements.find('.toggle-audio-button').click(function() { toggleAudio(); });

    getAudio(url);
};

function getAudio(url) {
    $('.audio-player .processing-icon').show();
    let request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';
    request.onprogress = function(event) {};
    request.onload = async function(event) {
        audio.audioCtx = new AudioContext();
        await audio.audioCtx.decodeAudioData(request.response, async function(buffer) {
            audio.buffer = buffer;
            if (audio.audioCtx && audio.audioCtx.state !== 'closed') {
                await drawWaveform(buffer);
            }
            if (audio.audioCtx && audio.audioCtx.state !== 'closed') {
                audio.duration = parseFloat(buffer.duration.toString());
            }
            let audioPlayerElements = $('.audio-player');
            audioPlayerElements.find('.processing-icon').hide();
            let showmeLaterElements = audioPlayerElements.find('.showme-later')
            showmeLaterElements.hide();
            showmeLaterElements.css({ 'visibility': 'visible' });
            showmeLaterElements.fadeIn(250);
            let durationTime = audioPlayerElements.find('.duration-time');
            durationTime.text(second2mmssff(audio.duration));
            if (audio.audioCtx && audio.audioCtx.state !== 'closed') {
                audio.audioCtx.close();
                audio.loaded = true;
            }
        });
    }
    request.open('GET', url, true);
    request.send();
};

async function drawWaveform(buffer) {

    let cursorWidth = 2;
    let oversampling = 4;
    let lineColor = '#A0A0A0';
    let fillColor = '#F8F8F8';
    let audioPlayerElements = $('.audio-player');

    let getWaveform = function(buffer, width) {

        let left = buffer.getChannelData(0);
        let right = buffer.getChannelData(1);
        let data = new Array(buffer.length);
        for (let i = 0; i < data.length; i++) {
            data[i] = (left[i] + right[i]) / 2;
        }

        let windowSize = Math.floor(data.length / width);
        let waveform = new Array(width);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.abs(data[i]);
        }
        for (let i = 0; i < waveform.length; i++) {
            let segment = data.slice(i * windowSize, i * windowSize + windowSize);
            waveform[i] = segment.reduce(function(a, b) { return a + b; }, 0);
            waveform[i] = Math.round(waveform[i]);
        }
        return waveform;
    }
    let waveformCanvasElements = audioPlayerElements.find('.waveform-canvas');
    let width = Math.round(waveformCanvasElements.width());
    let height = Math.round(waveformCanvasElements.height());
    let data = getWaveform(buffer, width * oversampling);

    let maxValue = Math.max(...data);
    let container = waveformCanvasElements[0];
    let canvas = document.createElement('canvas');
    canvas.className = 'waveform-canvas';
    container.appendChild(canvas);
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = lineColor;
    let middle = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(0, middle);
    ctx.lineTo(0, middle);
    // ctx.quadraticCurveTo(0, middle, 0, middle);
    for (let i = 0; i < data.length; i++) {
        let x = i / oversampling;
        let y = middle - (data[i] / maxValue) * canvas.height / 2;
        ctx.lineTo(x, y);
        // ctx.quadraticCurveTo(x, y, x, y);
    }
    for (let i = data.length - 1; i > -1; i--) {
        let x = i / oversampling;
        let y = middle + (data[i] / maxValue) * canvas.height / 2;
        ctx.lineTo(x, y);
        // ctx.quadraticCurveTo(x, y, x, y);
    }
    ctx.lineTo(0, middle);
    // ctx.quadraticCurveTo(0, middle, 0, middle);
    // ctx.moveTo(0, middle);
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    let cursor = document.createElement('div');
    cursor.className = 'waveform-cursor';
    container.appendChild(cursor);

    let waveformCursorElements = audioPlayerElements.find('.waveform-cursor');
    cursorParent = waveformCursorElements[0].parentElement;
    waveformCursorElements.css({
        'width': cursorWidth.toString() + 'px',
        'top': (cursorParent.offsetTop).toString() + 'px',
        'left': (cursorParent.offsetLeft - cursorWidth / 2).toString() + 'px',
        'height': (cursorParent.offsetHeight).toString() + 'px',
    });
    startAnimationFrame();
};

function onClickWaveform(event) {
    let left = 0;
    let cursor = $('.audio-player .waveform-cursor');
    let cursorParent = cursor[0].parentElement;
    let cursorWidth = Math.round(cursor.width());
    if (event.target.className === 'waveform-canvas') {
        left = event.offsetX + (cursorWidth / 2);
    } else if (event.target.className === 'waveform-cursor') {
        left = event.target.offsetLeft - cursorParent.offsetLeft + (cursorWidth / 2);
    } else {
        return;
    }
    skipAnimationFrame = true;
    if (Math.round(left) < 1) {
        left = 0;
    }
    if (Math.round(left) > cursorParent.offsetWidth - 1) {
        left = cursorParent.offsetWidth;
    }
    let percentage = left / cursorParent.offsetWidth;
    if (percentage < 0) { percentage = 0; }
    if (percentage > 100) { percentage = 100; }
    let newTime = audio.duration * percentage;
    if (!audio.playing) {
        audio.currentTime = newTime;
        audio.offsetTime = newTime;
    } else {
        stopAudio();
        audio.currentTime = newTime;
        audio.offsetTime = newTime;
        playAudio();
    }
    skipAnimationFrame = false;
};

function backwardAudio() {
    skipAnimationFrame = true;
    if (!audio.playing) {
        audio.currentTime = 0;
        audio.offsetTime = 0;
    } else {
        audio.playing = true;
        stopAudio();
        audio.currentTime = 0;
        audio.offsetTime = 0;
        playAudio();
    }
    skipAnimationFrame = false;
};

function toggleAudio() {
    if (!audio.loaded) { return; }
    skipAnimationFrame = true;
    if (!audio.playing) {
        audio.playing = true;
        playAudio();
    } else {
        audio.playing = false;
        stopAudio();
    }
    skipAnimationFrame = false;
};

async function playAudio() {
    let audioPlayerElements = $('.audio-player');
    audioPlayerElements.find('.glyphicon-play').hide();
    audioPlayerElements.find('.glyphicon-pause').show();
    if (!animationFrameHandler) {
        await startAnimationFrame();
    }
    audio.audioCtx = new AudioContext();
    audio.audioBuffer = audio.audioCtx.createBufferSource();
    audio.audioBuffer.buffer = audio.buffer;
    audio.gainNode = audio.audioCtx.createGain();
    audio.audioBuffer.connect(audio.gainNode);
    audio.gainNode.connect(audio.audioCtx.destination);
    audio.audioBuffer.onended = function() {
        audio.playing = false;
        skipAnimationFrame = true;
        stopAudio();
        if (audio && audio.currentTime > audio.duration) {
            audio.currentTime = audio.duration;
        }
        // if (!$scope.$$phase) { $scope.$digest(); }
        skipAnimationFrame = false;
        // console.log('onended');
    };
    audio.audioBuffer.start(0, audio.currentTime);
};

function stopAudio() {
    let audioPlayerElements = $('.audio-player');
    audioPlayerElements.find('.glyphicon-play').show();
    audioPlayerElements.find('.glyphicon-pause').hide();
    if (audio &&
        audio.audioCtx &&
        audio.audioBuffer &&
        audio.audioBuffer.context &&
        audio.audioBuffer.context.state === 'running') {
        audio.currentTime = audio.offsetTime + parseFloat(audio.audioBuffer.context.currentTime.toString());
        audio.offsetTime = audio.currentTime;
        audio.audioBuffer.stop();
        audio.audioBuffer.disconnect();
        audio.gainNode.disconnect();
        if (audio.audioCtx) {
            audio.audioCtx.close();
        }
    }
};

async function startAnimationFrame() {
    var animationFrameHandler = window.requestAnimationFrame(function(timestamp) {
        animationFrame(timestamp);
    });
};

function cancelAnimationFrame() {
    if (!animationFrameHandler) { return; }
    window.cancelAnimationFrame(animationFrameHandler);
    animationFrameHandler = undefined;
};

function second2mmss(second) {
    let zero_padding_head = function(n, width) {
        n = n.toString();
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }
    mm = Math.floor(second / 60);
    ss = Math.floor(second % 60);
    return [zero_padding_head(mm, 2), zero_padding_head(ss, 2)].join(':');
};

function second2mmssff(second) {
    let length = 2;
    let divider = 10 ** length;
    let zero_padding_tail = function(n, width) {
        n = n.toString();
        return n.length >= width ? n : n + new Array(width - n.length + 1).join('0');
    };
    let mmss = second2mmss(second);
    let ff = Math.floor(second * divider % divider);
    return [mmss, zero_padding_tail(ff, length)].join('.');
};

function animationFrame(timestamp) {
    let audioPlayerElements = $('.audio-player');
    let cursor = audioPlayerElements.find('.waveform-cursor');
    let currentTime = audioPlayerElements.find('.current-time');
    // let updatedTime = second2mmss(audio.currentTime);
    let updatedTime = second2mmssff(audio.currentTime);
    if (currentTime.text() !== updatedTime) {
        currentTime.text(updatedTime);
    }
    if (!skipAnimationFrame && audio && cursor.length > 0 && cursor[0].parentElement) {
        let cursorWidth = cursor.width();
        let cursorParent = cursor[0].parentElement;
        if (audio.audioBuffer && audio.playing) {
            let currentTime = audio.offsetTime + parseFloat(audio.audioBuffer.context.currentTime.toString());
            if (currentTime > audio.duration) {
                currentTime = audio.duration;
            }
            audio.currentTime = currentTime;
        }
        let percentage = audio.currentTime / audio.duration;
        let left = cursor[0].parentElement.offsetLeft + (cursorParent.offsetWidth) * percentage;
        cursor.css({ left: (left - cursorWidth / 2).toString() + 'px' });
    }
    var animationFrameHandler = window.requestAnimationFrame(function(timestamp) {
        animationFrame(timestamp);
    });
};