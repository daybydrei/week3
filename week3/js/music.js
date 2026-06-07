/*

========================================

MUSIC CONTROLLER

========================================

*/



let currentSound = null;



let currentFlower = null;



let isPlaying = true;



let ambientWind = null;



let ambientBirds = null;



let audioCtx = null;



let proceduralWind = null;



/*

========================================

DOM ELEMENTS

========================================

*/



const albumCover =

    document.getElementById("albumCover");



const songTitle =

    document.getElementById("songTitle");



const artistName =

    document.getElementById("artistName");



const playPauseBtn =

    document.getElementById("playPause");



/*

========================================

AMBIENT CONFIG

========================================

*/



const ambientPaths = {

    wind: "assets/sounds/wind.mp3",

    birds: "assets/sounds/birds.mp3",

    chime: "assets/sounds/chime.mp3"

};



const PETAL_COLORS = {

    peony: ["#ffb7c5", "#ff8fa8", "#ffc8d4", "#ffe0e8"],

    spiderLily: ["#ffffff", "#f5f0ff", "#e8e0f0", "#fff8ff"],

    morningGlory: ["#b8c8ff", "#9ab0ff", "#d4dcff", "#c0d0ff"]

};



/*

========================================

WEB AUDIO HELPERS

========================================

*/



function getAudioContext() {



    if (!audioCtx) {

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    }



    if (audioCtx.state === "suspended") {

        audioCtx.resume();

    }



    return audioCtx;

}



function playProceduralChime() {



    const ctx = getAudioContext();

    const now = ctx.currentTime;



    const frequencies = [523.25, 659.25, 783.99];



    frequencies.forEach((freq, i) => {



        const osc = ctx.createOscillator();

        const gain = ctx.createGain();



        osc.type = "sine";

        osc.frequency.setValueAtTime(freq, now);



        gain.gain.setValueAtTime(0, now);

        gain.gain.linearRampToValueAtTime(0.12 - i * 0.025, now + 0.05);

        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8 + i * 0.15);



        osc.connect(gain);

        gain.connect(ctx.destination);



        osc.start(now + i * 0.08);

        osc.stop(now + 2.2);

    });

}



function startProceduralWind() {



    if (proceduralWind) return;



    const ctx = getAudioContext();

    const bufferSize = 2 * ctx.sampleRate;

    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);

    const data = buffer.getChannelData(0);



    for (let i = 0; i < bufferSize; i++) {

        data[i] = (Math.random() * 2 - 1) * 0.3;

    }



    const source = ctx.createBufferSource();

    source.buffer = buffer;

    source.loop = true;



    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";

    filter.frequency.value = 400;



    const gain = ctx.createGain();

    gain.gain.value = 0.04;



    source.connect(filter);

    filter.connect(gain);

    gain.connect(ctx.destination);



    source.start();



    proceduralWind = { source, gain };

}



/*

========================================

AMBIENT AUDIO

========================================

*/



function initAmbientAudio() {



    ambientWind = new Howl({

        src: [ambientPaths.wind],

        loop: true,

        volume: 0,

        preload: true,

        onloaderror: () => {

            startProceduralWind();

        }

    });



    ambientBirds = new Howl({

        src: [ambientPaths.birds],

        loop: true,

        volume: 0,

        preload: true

    });



    ambientWind.play();

    ambientBirds.play();



    ambientWind.fade(0, 0.25, 3000);

    ambientBirds.fade(0, 0.12, 4000);

}



function onFlowerClickAudio() {



    getAudioContext();



    const chime = new Howl({

        src: [ambientPaths.chime],

        volume: 0.5,

        onloaderror: () => {

            playProceduralChime();

        },

        onplayerror: () => {

            playProceduralChime();

        }

    });



    chime.play();



    if (ambientWind && ambientWind.playing()) {

        ambientWind.fade(ambientWind.volume(), 0.35, 600);

    }



    if (proceduralWind) {

        gsap.to(proceduralWind.gain.gain, {

            value: 0.06,

            duration: 0.6,

            ease: "sine.out"

        });

    }

}



function onBloomAudio() {



    if (ambientWind && ambientWind.playing()) {

        ambientWind.fade(ambientWind.volume(), 0.2, 1200);

    }



    if (ambientBirds && ambientBirds.playing()) {

        ambientBirds.fade(ambientBirds.volume(), 0.06, 1200);

    }



    if (proceduralWind) {

        gsap.to(proceduralWind.gain.gain, {

            value: 0.03,

            duration: 1.2,

            ease: "sine.inOut"

        });

    }

}



function onMessageRevealAudio() {



    if (ambientWind && ambientWind.playing()) {

        ambientWind.fade(ambientWind.volume(), 0.15, 2000);

    }



    if (ambientBirds && ambientBirds.playing()) {

        ambientBirds.fade(ambientBirds.volume(), 0.04, 2000);

    }

}



function restoreAmbientAfterClose() {



    if (ambientWind && ambientWind.playing()) {

        ambientWind.fade(ambientWind.volume(), 0.25, 1500);

    }



    if (ambientBirds && ambientBirds.playing()) {

        ambientBirds.fade(ambientBirds.volume(), 0.12, 1500);

    }



    if (proceduralWind) {

        gsap.to(proceduralWind.gain.gain, {

            value: 0.04,

            duration: 1.5,

            ease: "sine.out"

        });

    }

}



/*

========================================

PLAYBACK HELPERS

========================================

*/



function playCurrentTrack() {

    if (!currentSound) return;

    const attemptPlay = () => {

        if (!currentSound) return;

        currentSound.volume(0);

        const soundId = currentSound.play();

        if (soundId !== undefined) {
            currentSound.fade(0, 0.7, 1800);
            isPlaying = true;
            updatePlayButton();
        }
    };

    if (currentSound.state() === "loaded") {
        attemptPlay();
    } else {
        currentSound.once("load", attemptPlay);
    }

    currentSound.once("playerror", () => {
        Howler.once("unlock", attemptPlay);
    });
}

function startFlowerPlayback(flowerId) {

    if (!currentSound || currentFlower !== flowerId) return;

    playCurrentTrack();
}



/*

========================================

LOAD FLOWER MUSIC

========================================

*/



function loadFlowerMusic(flowerId) {



    const flower = flowerData[flowerId];



    if (!flower) return;



    currentFlower = flowerId;



    albumCover.src = flower.cover;

    songTitle.textContent = flower.title;

    artistName.textContent = flower.artist;



    if (currentSound) {

        currentSound.stop();

        currentSound.unload();

        currentSound = null;

    }



    unlockAudio();



    currentSound = new Howl({

        src: [flower.audio],

        volume: 0,

        preload: true,

        html5: true,

        onload: () => {

            if (currentFlower !== flowerId) return;

            currentSound.fade(0, 0.7, 1800);
            isPlaying = true;
            updatePlayButton();

        },

        onloaderror: (id, err) => {

            console.warn("Music file missing:", flower.audio, err);

        },

        onplayerror: () => {

            Howler.once("unlock", () => startFlowerPlayback(flowerId));

        }

    });

    currentSound.play();

    isPlaying = true;

    updatePlayButton();

}

function getTrackProgress() {

    if (!currentSound) return null;

    const duration = currentSound.duration();

    if (!duration || !isFinite(duration)) return null;

    return {
        seek: currentSound.seek(),
        duration,
        playing: currentSound.playing()
    };
}



/*

========================================

PAUSE / PLAY / STOP

========================================

*/



function pauseMusic() {



    if (!currentSound) return;



    currentSound.pause();



    isPlaying = false;



    updatePlayButton();

}



function resumeMusic() {



    if (!currentSound) return;



    currentSound.play();



    isPlaying = true;



    updatePlayButton();

}



function toggleMusic() {



    if (!currentSound) return;



    if (isPlaying) {

        pauseMusic();

    } else {

        resumeMusic();

    }

}



function updatePlayButton() {



    if (isPlaying) {

        playPauseBtn.textContent = "⏸";

    } else {

        playPauseBtn.textContent = "▶";

    }

}



function stopMusic() {



    if (!currentSound) return;



    currentSound.fade(

        currentSound.volume(),

        0,

        600

    );



    setTimeout(() => {

        currentSound.stop();

    }, 600);

}



/*

========================================

EVENT LISTENERS

========================================

*/



playPauseBtn.addEventListener(

    "click",

    toggleMusic

);



/*

========================================

AUDIO UNLOCK

========================================

*/



let audioUnlocked = false;



function unlockAudio() {



    getAudioContext();



    if (!audioUnlocked) {

        audioUnlocked = true;

        initAmbientAudio();

    }

}



document.addEventListener(

    "click",

    unlockAudio,

    { once: true }

);



document.addEventListener(

    "touchstart",

    unlockAudio,

    { once: true }

);



/*

========================================

OPTIONAL FADES

========================================

*/



function fadeOutCurrentTrack() {



    if (!currentSound) return;



    currentSound.fade(

        currentSound.volume(),

        0,

        1500

    );

}



function fadeInCurrentTrack() {



    if (!currentSound) return;



    currentSound.fade(

        0,

        0.7,

        1500

    );

}


