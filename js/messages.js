/*
========================================
EDIT EVERYTHING HERE LATER
========================================

You only need to modify:

1. title
2. artist
3. cover
4. audio
5. message

Everything else can stay untouched.
*/

const flowerData = {

    peony: {

        id: "peony",

        flowerName: "Pink Peony",

        title: "LOVER",

        artist: "Taylor Swift",

        cover: "assets/covers/cover1.jpg",

        audio: "assets/music/song1.mp3",

        message: ` If love had a color, I think it would be pink.
        Not because it's soft, or delicate, or because it happens to be one of your favorite colors…
        but because pink feels like us.

        Not the perfect kind of love.
        Not the loud kind either.
        But the kind that lingers quietly in ordinary moments,
        like hands brushing without meaning to,
        like laughter that stays a little longer than it should,
        like a feeling you can't fully explain but never want to lose.

        Pink just fits the way our love feels.
        gentle, but never empty.
        soft, but never fragile.

        I dont think love is supposed to be loud all the time.
        I think sometimes it's just this—
        a quiet kind of warmth
        that feels like home without ever asking to be called one.

        And if I had to choose a color to keep forever,
        I think I would still choose pink.
        Because somehow, it already feels like you.
        `
    },



    spiderLily: {

        id: "spiderLily",

        flowerName: "White Spider Lily",

        title: "LUST",

        artist: "Chase Atlantic",

        cover: "assets/covers/cover2.jpg",

        audio: "assets/music/song2.mp3",

        message: ` They say modern love often begins with attraction—
        a glance, a shape, a fleeting kind of wanting that burns too quickly to understand.

        But ours didnt start like that.

        It didnt rush.
        It didnt try to impress.
        It didnt even know what it was at first.

        It began with curiosity.
        the quiet kind that lingers when someone feels unfamiliar in a way that doesn't scare you away,
        but pulls you in closer.

        Like wondering why someone stays in your thoughts longer than they should,
        why their silence feels different from everyone else's noise,
        why getting to know them doesn't feel like effort but discovery.

        Maybe its not about wanting a body
        but about how strongly you can be drawn to a mind,
        to a presence,
        to something you cant explain but also cant ignore.

        Because what we had was never just a spark that burned and faded.

        It was something slower.
        Stranger.
        Deeper.

        The kind of connection that doesnt ask for attention
        but quietly becomes impossible to overlook.

        And maybe thats the difference.

        They fall in love with what they see.
        But I think we started with something closer to understanding what we couldn't yet see.
        `
    },



    morningGlory: {

        id: "morningGlory",

        flowerName: "Morning Glory",

        title: "YELLOW",

        artist: "Coldplay",

        cover: "assets/covers/cover3.jpg",

        audio: "assets/music/song3.mp3",

        message: ` Yellow is one of the brightest colors we know—
        not just in how it looks, but in how it feels.

        It doesn’t ask to be noticed.
        It just is light.

        And somehow, that’s what you became to me.

        There were days I didn’t even realize how gray everything had been
        like I had been living inside a color I never chose,
        moving through time without really feeling it.

        But then you came in quietly…
        not to fix anything, not to change everything at once
        but to slowly bring color into places I didnt know were empty.

        Like sunlight slipping through a window I forgot was open.
        Like warmth returning to something I thought had already gone cold.

        It felt soft.
        constant.
        real.

        You didn’t just make things brighter.
        You made them feel alive again.

        And now I cant remember what it felt like
        to live in gray
        without thinking about how everything turned a little more golden
        the moment you were there.
        `
    }

};

/*
========================================
SECRET FINAL LETTER
========================================

Appears after all 3 flowers have been opened
and the favorite-flower quiz is answered correctly.

title  → large heading on the ending screen
message → body text below the title
*/

const finalLetter = {

    title: `Distance taught our love how to endure.
No matter how far things are, love still finds a way to bloom.`,

    message: `Like flowers reaching for the sun—they dont question the distance, they just grow toward it anyway.

Quietly. Naturally. Patiently.

And maybe thats what we were all along—different moments, different colors, but the same kind of growth.

Because love, like a flower, doesnt rush.

It just keeps reaching for the light…
until it finally blooms.`
};

/*
========================================
TRACKING
========================================
*/

const openedFlowers = {

    peony: false,

    spiderLily: false,

    morningGlory: false
};

/*
========================================
HELPERS
========================================
*/

function markFlowerOpened(flowerId) {

    if (openedFlowers.hasOwnProperty(flowerId)) {

        openedFlowers[flowerId] = true;
    }
}

function allFlowersOpened() {

    return Object.values(openedFlowers)
        .every(value => value === true);
}