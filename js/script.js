/*
========================================
DOM
========================================
*/

const flowerWrappers =
    document.querySelectorAll(".flower-wrapper");

const overlay =
    document.getElementById("messageOverlay");

const card =
    document.getElementById("messageCard");

const messageContent =
    document.getElementById("messageContent");

const lyricsViewport =
    document.getElementById("lyricsViewport");

const closeBtn =
    document.getElementById("closeBtn");

const endingScreen =
    document.getElementById("endingScreen");

const endingOverlay =
    document.getElementById("endingOverlay");

const giantFlower =
    document.getElementById("giantFlower");

const gatheringField =
    document.getElementById("gatheringField");

const favoriteQuiz =
    document.getElementById("favoriteQuiz");

const quizQuestion =
    document.getElementById("quizQuestion");

const quizError =
    document.getElementById("quizError");

const quizOptions =
    document.getElementById("quizOptions");

const quizFlowers =
    document.querySelectorAll(".quiz-flower");

const FAVORITE_FLOWER = "spiderLily";

let interactionActive = false;

let quizPassed = false;

let manualLyricsControl = false;

let programmaticLyricsScroll = false;

let lyricsScrollRaf = null;

let cardFloatTween = null;

/*
========================================
UTILITIES
========================================
*/

function isMobile() {
    return window.innerWidth <= 480 ||
        ("ontouchstart" in window && window.innerWidth < 768);
}

function getPetalCount() {
    return isMobile()
        ? 20 + Math.floor(Math.random() * 11)
        : 35 + Math.floor(Math.random() * 16);
}

function getGatherCount() {
    return isMobile() ? 30 : 60;
}

function hapticTap() {
    if (isMobile() && navigator.vibrate) {
        navigator.vibrate(20);
    }
}

function getFlowerColors(flowerId) {
    return PETAL_COLORS[flowerId] || PETAL_COLORS.peony;
}

/*
========================================
BACKGROUND PARTICLES
========================================
*/

function createAmbientParticle() {

    const particle = document.createElement("div");
    particle.classList.add("particle");

    particle.style.left =
        Math.random() * window.innerWidth + "px";

    particle.style.animationDuration =
        (6 + Math.random() * 8) + "s";

    particle.style.opacity =
        0.2 + Math.random() * 0.6;

    particle.style.transform =
        `scale(${0.5 + Math.random()})`;

    document
        .getElementById("particles")
        .appendChild(particle);

    setTimeout(() => particle.remove(), 15000);
}

setInterval(createAmbientParticle, 500);

const particleStyle = document.createElement("style");
particleStyle.innerHTML = `
.particle{
    position:absolute;
    width:8px;
    height:8px;
    border-radius:50%;
    background:white;
    box-shadow:0 0 12px white;
    animation:floatParticle linear forwards;
}
@keyframes floatParticle{
    from{ transform:translateY(100vh); }
    to{ transform:translateY(-120vh); }
}`;
document.head.appendChild(particleStyle);

/*
========================================
FAST PETAL BURST (on interaction)
========================================
*/

function burstFastPetals(wrapper) {

    const fastLayer = document.getElementById("layer-fast");
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const burstCount = isMobile() ? 8 : 18;

    for (let i = 0; i < burstCount; i++) {

        const petal = document.createElement("div");
        petal.className = "drift-petal";
        petal.style.left = cx + "px";
        petal.style.top = cy + "px";
        petal.style.opacity = "0.7";
        fastLayer.appendChild(petal);

        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 200;

        gsap.to(petal, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            rotation: Math.random() * 360,
            opacity: 0,
            duration: 1.5 + Math.random(),
            ease: "power2.out",
            onComplete: () => petal.remove()
        });
    }
}

/*
========================================
PARALLAX BACKGROUND LAYERS
========================================
*/

function initParallaxLayers() {

    const starsLayer = document.getElementById("layer-stars");
    const floatLayer = document.getElementById("layer-float");
    const fastLayer = document.getElementById("layer-fast");

    const starCount = isMobile() ? 25 : 50;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        const size = 1 + Math.random() * 2.5;
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.opacity = 0.2 + Math.random() * 0.6;
        starsLayer.appendChild(star);

        gsap.to(star, {
            y: -20 - Math.random() * 30,
            opacity: 0.1 + Math.random() * 0.5,
            duration: 8 + Math.random() * 12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 5
        });
    }

    const floatCount = isMobile() ? 12 : 25;

    for (let i = 0; i < floatCount; i++) {
        const dot = document.createElement("div");
        dot.className = "float-dot";
        const size = 3 + Math.random() * 6;
        dot.style.width = size + "px";
        dot.style.height = size + "px";
        dot.style.left = Math.random() * 100 + "%";
        dot.style.top = Math.random() * 100 + "%";
        floatLayer.appendChild(dot);

        gsap.to(dot, {
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 80,
            duration: 10 + Math.random() * 15,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    function spawnDriftPetal() {
        const petal = document.createElement("div");
        petal.className = "drift-petal";
        petal.style.left = Math.random() * 100 + "%";
        petal.style.top = "110%";
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        fastLayer.appendChild(petal);

        gsap.to(petal, {
            y: -(window.innerHeight + 200),
            x: (Math.random() - 0.5) * 120,
            rotation: Math.random() * 360,
            duration: 4 + Math.random() * 4,
            ease: "none",
            onComplete: () => petal.remove()
        });
    }

    setInterval(spawnDriftPetal, isMobile() ? 1200 : 600);
}

/*
========================================
IDLE FLOWER ANIMATION
========================================
*/

function initIdleAnimations() {

    flowerWrappers.forEach((wrapper, index) => {

        const flower = wrapper.querySelector(".flower");
        const glow = wrapper.querySelector(".flower-glow");

        gsap.set(flower, { opacity: 0, y: 60 });

        gsap.to(flower, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            delay: index * 0.4,
            ease: "power3.out"
        });

        gsap.to(flower, {
            y: "-=8",
            rotation: 2,
            duration: 3 + index * 0.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.3
        });

        gsap.to(flower, {
            rotation: -2,
            duration: 4 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1 + index * 0.2
        });

        gsap.to(glow, {
            scale: 1.05,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.5
        });
    });
}

/*
========================================
BLOOM TIMELINE
========================================
*/

function bloomFlower(flowerEl) {

    const tl = gsap.timeline();

    tl.to(flowerEl, {
        scale: 0.88,
        duration: 0.18,
        ease: "power2.in"
    })
    .to(flowerEl, {
        scale: 1.3,
        duration: 0.55,
        ease: "power2.out"
    })
    .to(flowerEl, {
        rotation: 8,
        duration: 0.35,
        ease: "sine.inOut"
    })
    .to(flowerEl, {
        rotation: -8,
        duration: 0.35,
        ease: "sine.inOut"
    })
    .to(flowerEl, {
        rotation: 0,
        scale: 1.2,
        duration: 0.3,
        ease: "sine.out"
    });

    return tl;
}

/*
========================================
PETAL EXPLOSION
========================================
*/

function createPetalExplosion(wrapper, flowerId) {

    const layer = wrapper.querySelector(".flower-particles");
    const colors = getFlowerColors(flowerId);
    const count = getPetalCount();
    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const remnants = [];

    for (let i = 0; i < count; i++) {

        const petal = document.createElement("div");
        petal.className = "petal";
        petal.style.background = colors[i % colors.length];
        petal.style.left = centerX + "px";
        petal.style.top = centerY + "px";
        layer.appendChild(petal);

        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * (isMobile() ? 100 : 160);
        const duration = 1 + Math.random() * 1.8;
        const delay = Math.random() * 0.15;

        if (Math.random() > 0.4 && remnants.length < getGatherCount()) {
            remnants.push({
                x: rect.left + centerX + Math.cos(angle) * distance * 0.55,
                y: rect.top + centerY + Math.sin(angle) * distance * 0.55,
                color: colors[i % colors.length]
            });
        }

        gsap.fromTo(petal,
            {
                x: 0,
                y: 0,
                rotation: Math.random() * 60,
                scale: 0.2,
                opacity: 1
            },
            {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                rotation: Math.random() * 540 - 270,
                scale: 0.5 + Math.random() * 0.9,
                opacity: 0,
                duration,
                delay,
                ease: "power2.out",
                onComplete: () => petal.remove()
            }
        );
    }

    return new Promise(resolve => {
        setTimeout(() => resolve(remnants), 1400);
    });
}

/*
========================================
PARTICLE GATHERING → MESSAGE
========================================
*/

function gatherParticles(remnants, flowerId) {

    return new Promise(resolve => {

        const targetX = window.innerWidth / 2;
        const targetY = window.innerHeight / 2;
        const count = remnants.length || getGatherCount();
        const colors = getFlowerColors(flowerId);

        for (let i = 0; i < count; i++) {

            const p = document.createElement("div");
            p.className = "gather-particle";
            const color = remnants[i]
                ? remnants[i].color
                : colors[i % colors.length];

            p.style.background = color;
            p.style.color = color;

            const startX = remnants[i]
                ? remnants[i].x
                : Math.random() * window.innerWidth;

            const startY = remnants[i]
                ? remnants[i].y
                : Math.random() * window.innerHeight;

            p.style.left = startX + "px";
            p.style.top = startY + "px";

            gatheringField.appendChild(p);

            const delay = Math.random() * 0.6;
            const duration = 1.4 + Math.random() * 0.8;

            gsap.fromTo(p,
                { opacity: 0, scale: 0 },
                {
                    opacity: 0.9,
                    scale: 1,
                    duration: 0.3,
                    delay,
                    ease: "power2.out"
                }
            );

            gsap.to(p, {
                left: targetX + (Math.random() - 0.5) * 40,
                top: targetY + (Math.random() - 0.5) * 30,
                scale: 0.3,
                opacity: 0.6,
                duration,
                delay: delay + 0.2,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.to(p, {
                        opacity: 0,
                        scale: 0,
                        duration: 0.4,
                        onComplete: () => p.remove()
                    });
                }
            });
        }

        setTimeout(resolve, 1800);
    });
}

function updateLyricsScrollPadding() {

    if (!lyricsViewport || !messageContent) return;

    const pad = Math.max(lyricsViewport.clientHeight * 0.38, 72);

    messageContent.style.paddingTop = pad + "px";
    messageContent.style.paddingBottom = pad + "px";
}

function scrollLyricsToActive() {

    if (manualLyricsControl) return;

    const active =
        messageContent.querySelector(".lyric-line.active");

    if (!active || !lyricsViewport) return;

    const viewRect = lyricsViewport.getBoundingClientRect();
    const lineRect = active.getBoundingClientRect();
    const targetScroll =
        lyricsViewport.scrollTop +
        (lineRect.top - viewRect.top) -
        viewRect.height * 0.35;

    programmaticLyricsScroll = true;

    gsap.to(lyricsViewport, {
        scrollTop: Math.max(0, targetScroll),
        duration: 0.75,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
            programmaticLyricsScroll = false;
        },
        onInterrupt: () => {
            programmaticLyricsScroll = false;
        }
    });
}

function setActiveLyricLine(lineIndex, options = {}) {

    const autoScroll =
        options.autoScroll !== undefined
            ? options.autoScroll
            : !manualLyricsControl;

    const allLines =
        messageContent.querySelectorAll(".lyric-line");

    if (!allLines.length) return;

    const index = Math.min(
        Math.max(0, lineIndex),
        allLines.length - 1
    );

    allLines.forEach((el, i) => {
        el.classList.remove("active", "past", "upcoming");

        if (i < index) {
            el.classList.add("past");
        } else if (i === index) {
            el.classList.add("active");
        } else {
            el.classList.add("upcoming");
        }
    });

    if (autoScroll) {
        scrollLyricsToActive();
    }
}

function updateActiveLineFromScroll() {

    const lines =
        messageContent.querySelectorAll(".lyric-line");

    if (!lines.length || !lyricsViewport) return;

    const viewRect = lyricsViewport.getBoundingClientRect();
    const focusY = viewRect.top + viewRect.height * 0.38;

    let closestIndex = 0;
    let closestDist = Infinity;

    lines.forEach((line, i) => {
        const rect = line.getBoundingClientRect();
        const lineCenter = rect.top + rect.height / 2;
        const dist = Math.abs(lineCenter - focusY);

        if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
        }
    });

    setActiveLyricLine(closestIndex, { autoScroll: false });
}

function enableManualLyricsControl() {

    if (manualLyricsControl) return;

    manualLyricsControl = true;

    if (lyricsViewport) {
        gsap.killTweensOf(lyricsViewport);
    }
}

function onLyricsViewportScroll() {

    if (programmaticLyricsScroll) return;

    if (!manualLyricsControl) {
        enableManualLyricsControl();
    }

    if (lyricsScrollRaf) {
        cancelAnimationFrame(lyricsScrollRaf);
    }

    lyricsScrollRaf = requestAnimationFrame(() => {
        updateActiveLineFromScroll();
        lyricsScrollRaf = null;
    });
}

function resetLyricsInteraction() {

    manualLyricsControl = false;
    programmaticLyricsScroll = false;

    if (lyricsScrollRaf) {
        cancelAnimationFrame(lyricsScrollRaf);
        lyricsScrollRaf = null;
    }

    if (lyricsViewport) {
        gsap.killTweensOf(lyricsViewport);
    }
}

function initLyricsScrollInteraction() {

    if (!lyricsViewport) return;

    lyricsViewport.addEventListener(
        "scroll",
        onLyricsViewportScroll,
        { passive: true }
    );

    lyricsViewport.addEventListener(
        "wheel",
        enableManualLyricsControl,
        { passive: true }
    );

    lyricsViewport.addEventListener(
        "touchstart",
        enableManualLyricsControl,
        { passive: true }
    );
}

function renderLyrics(text) {

    resetLyricsInteraction();
    messageContent.innerHTML = "";

    updateLyricsScrollPadding();

    if (lyricsViewport) {
        lyricsViewport.scrollTop = 0;
    }

    const lines = text
        .trim()
        .split("\n")
        .filter(line => line.trim() !== "");

    const CHAR_DELAY = 0.05;

    let charIndex = 0;

    lines.forEach((lineText, lineIndex) => {

        const lineEl = document.createElement("div");
        lineEl.className = "lyric-line upcoming";
        messageContent.appendChild(lineEl);

        const chars = lineText.trim().split("");

        chars.forEach((char, i) => {

            const span = document.createElement("span");
            span.className = "lyric-char";
            span.textContent = char;
            lineEl.appendChild(span);

            const isFirstChar = i === 0;
            const delay = charIndex * CHAR_DELAY;

            gsap.fromTo(span,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.01,
                    delay,
                    ease: "none",
                    onStart: () => {
                        if (isFirstChar && !manualLyricsControl) {
                            setActiveLyricLine(lineIndex);
                        }
                    }
                }
            );

            charIndex++;
        });
    });
}

/*
========================================
FLOATING MESSAGE CARD
========================================
*/

function showFloatingCard() {

    overlay.style.display = "flex";

    gsap.set(card, { opacity: 0, y: 50, scale: 0.9, rotation: -2 });

    gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "power3.out",
        onComplete: () => {
            updateLyricsScrollPadding();
        }
    });

    if (cardFloatTween) cardFloatTween.kill();

    cardFloatTween = gsap.to(card, {
        y: "-=6",
        rotation: 0.6,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

function hideFloatingCard() {

    if (cardFloatTween) {
        cardFloatTween.kill();
        cardFloatTween = null;
    }

    return gsap.to(card, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        rotation: 1,
        duration: 0.5,
        ease: "power2.in"
    });
}

/*
========================================
FLOWER OPEN (staged sequence)
========================================
*/

async function openFlower(flowerId) {

    if (interactionActive) return;

    const flower = flowerData[flowerId];
    if (!flower) return;

    const wrapper = document.querySelector(
        `[data-flower="${flowerId}"]`
    );

    if (!wrapper || wrapper.classList.contains("opened")) return;

    interactionActive = true;
    wrapper.classList.add("opened");

    hapticTap();
    unlockAudio();
    loadFlowerMusic(flowerId);
    onFlowerClickAudio();
    burstFastPetals(wrapper);

    const flowerImg = wrapper.querySelector(".flower");
    const glow = wrapper.querySelector(".flower-glow");

    flowerWrappers.forEach(item => {
        if (item !== wrapper) {
            gsap.to(item, { opacity: 0.15, duration: 0.6 });
        }
    });

    gsap.to(glow, {
        scale: 1.4,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    });

    const bloomTl = bloomFlower(flowerImg);

    bloomTl.eventCallback("onStart", () => {
        setTimeout(onBloomAudio, 200);
    });

    const remnants = await createPetalExplosion(wrapper, flowerId);

    markFlowerOpened(flowerId);

    showFloatingCard();
    messageContent.innerHTML = "";

    await gatherParticles(remnants, flowerId);

    renderLyrics(flower.message);
    onMessageRevealAudio();

    interactionActive = false;
}

/*
========================================
FLOWER EVENTS
========================================
*/

flowerWrappers.forEach(wrapper => {

    wrapper.addEventListener("click", () => {
        openFlower(wrapper.dataset.flower);
    });
});

/*
========================================
RETURN
========================================
*/

closeBtn.addEventListener("click", () => {

    stopMusic();
    resetLyricsInteraction();
    restoreAmbientAfterClose();

    hideFloatingCard().eventCallback("onComplete", () => {

        overlay.style.display = "none";
        gsap.set(card, { clearProps: "all" });
        messageContent.innerHTML = "";

        if (lyricsViewport) {
            lyricsViewport.scrollTop = 0;
        }

        flowerWrappers.forEach(item => {
            item.classList.remove("opened");
            const flowerImg = item.querySelector(".flower");
            const glow = item.querySelector(".flower-glow");

            gsap.to(item, { opacity: 1, duration: 0.6 });
            gsap.to(flowerImg, {
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: "power2.out"
            });
            gsap.to(glow, {
                scale: 1,
                opacity: 0.6,
                duration: 0.6
            });
        });

        checkEnding();
    });
});

/*
========================================
SECRET ENDING SEQUENCE
========================================
*/

function checkEnding() {

    if (!allFlowersOpened() || quizPassed) return;

    setTimeout(() => {
        showFavoriteQuiz();
    }, 1500);
}

/*
========================================
FAVORITE FLOWER QUIZ
========================================
*/

function showFavoriteQuiz() {

    quizError.textContent = "";
    quizError.classList.remove("visible");

    favoriteQuiz.style.display = "flex";

    gsap.fromTo(quizQuestion,
        { opacity: 0, y: -24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
    );

    gsap.fromTo(quizOptions,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
    );

    gsap.fromTo(".quiz-flower",
        { opacity: 0, y: 40, scale: 0.88 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            delay: 0.35,
            ease: "power3.out"
        }
    );
}

function hideFavoriteQuiz() {

    return gsap.to([quizQuestion, quizOptions, quizError], {
        opacity: 0,
        y: -16,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            favoriteQuiz.style.display = "none";
            gsap.set([quizQuestion, quizOptions, quizError, ".quiz-flower"], {
                clearProps: "all"
            });
        }
    });
}

function handleQuizAnswer(answer) {

    if (answer === FAVORITE_FLOWER) {

        quizPassed = true;
        quizError.textContent = "";
        quizError.classList.remove("visible");

        hideFavoriteQuiz().eventCallback("onComplete", () => {
            launchCinematicEnding();
        });

        return;
    }

    quizError.textContent =
        "Not quite. Take another look and choose again.";

    quizError.classList.add("visible");

    gsap.fromTo(quizOptions,
        { x: 0 },
        {
            x: 8,
            duration: 0.08,
            repeat: 5,
            yoyo: true,
            ease: "power1.inOut",
            onComplete: () => gsap.set(quizOptions, { x: 0 })
        }
    );
}

quizFlowers.forEach(btn => {

    btn.addEventListener("click", () => {
        handleQuizAnswer(btn.dataset.answer);
    });
});

function launchCinematicEnding() {

  const endingPetals = [];
  const colors = [
      ...PETAL_COLORS.peony,
      ...PETAL_COLORS.spiderLily,
      ...PETAL_COLORS.morningGlory
  ];

  gsap.to(endingOverlay, {
      backgroundColor: "rgba(30, 15, 25, 0.55)",
      duration: 2,
      ease: "power2.inOut"
  });

  flowerWrappers.forEach(wrapper => {
      const glow = wrapper.querySelector(".flower-glow");
      gsap.to(glow, {
          scale: 1.8,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out"
      });
  });

  gsap.to("#intro", { opacity: 0, duration: 1.2 });
  gsap.to("#garden", { opacity: 0.3, duration: 1.2 });

  const petalTotal = isMobile() ? 40 : 80;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < petalTotal; i++) {

      const petal = document.createElement("div");
      petal.className = "ending-petal";
      petal.style.background = colors[i % colors.length];

      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + 20 + Math.random() * 100;

      petal.style.left = startX + "px";
      petal.style.top = startY + "px";

      document.body.appendChild(petal);
      endingPetals.push(petal);

      gsap.to(petal, {
          y: -(window.innerHeight + 200),
          x: (Math.random() - 0.5) * 60,
          rotation: Math.random() * 720,
          duration: 3 + Math.random() * 2,
          delay: Math.random() * 1.5,
          ease: "power1.out"
      });
  }

  setTimeout(() => {

      endingPetals.forEach((petal, i) => {
          const rect = petal.getBoundingClientRect();
          const dx = centerX - (rect.left + rect.width / 2);
          const dy = centerY - (rect.top + rect.height / 2);

          gsap.to(petal, {
              x: dx + (Math.random() - 0.5) * 30,
              y: dy + (Math.random() - 0.5) * 30,
              rotation: 0,
              scale: 0.2,
              opacity: 0.8,
              duration: 2 + Math.random(),
              delay: i * 0.02,
              ease: "power2.inOut"
          });
      });

  }, 2500);

  setTimeout(() => {

      endingPetals.forEach(p => p.remove());

      gsap.set(giantFlower, {
          opacity: 1,
          xPercent: -50,
          yPercent: -50
      });

      gsap.fromTo(giantFlower,
          { scale: 0, rotation: -15 },
          {
              scale: 0.5,
              rotation: 0,
              duration: 1.2,
              ease: "back.out(1.4)"
          }
      );

      const giantImg = giantFlower.querySelector("img");

      gsap.to(giantImg, {
          scale: 0.85,
          duration: 0.2,
          ease: "power2.in",
          yoyo: true,
          repeat: 1
      });

      gsap.to(giantFlower, {
          scale: 1,
          duration: 0.6,
          delay: 0.5,
          ease: "power2.out"
      });

      gsap.to(giantFlower, {
          rotation: 10,
          duration: 0.4,
          delay: 0.8,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut"
      });

  }, 4800);

  setTimeout(() => {

      gsap.to(giantFlower, {
          opacity: 0,
          scale: 1.3,
          duration: 1.2,
          ease: "power2.in"
      });

      gsap.to("#garden", { opacity: 0, duration: 1 });
      gsap.to(endingOverlay, {
          backgroundColor: "rgba(255, 245, 246, 0.98)",
          duration: 1.5
      });

  }, 6500);

  setTimeout(() => {

      endingScreen.style.display = "flex";

      const endingH2 = document.getElementById("endingTitle");
      const endingP = document.getElementById("endingBody");

      endingH2.textContent = finalLetter.title.trim();
      endingP.textContent = finalLetter.message.trim();

      gsap.fromTo(endingH2,
          { opacity: 0, y: 30, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }
      );

      gsap.fromTo(endingP,
          { opacity: 0, y: 20, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, delay: 0.8, ease: "power3.out" }
      );

  }, 7800);
}

/*
========================================
PARALLAX (mouse / touch)
========================================
*/

function initParallax() {

    function handleMove(clientX, clientY) {

        const x = clientX / window.innerWidth - 0.5;
        const y = clientY / window.innerHeight - 0.5;

        gsap.to("#layer-stars", {
            x: x * 8,
            y: y * 8,
            duration: 2,
            ease: "power2.out"
        });

        gsap.to("#layer-float", {
            x: x * 18,
            y: y * 18,
            duration: 1.5,
            ease: "power2.out"
        });

        gsap.to("#layer-fast", {
            x: x * 30,
            y: y * 30,
            duration: 1,
            ease: "power2.out"
        });

        gsap.to(".flower-wrapper", {
            x: x * 12,
            y: y * 12,
            duration: 1.5,
            ease: "power2.out"
        });
    }

    document.addEventListener("mousemove", e => {
        handleMove(e.clientX, e.clientY);
    });

    document.addEventListener("touchmove", e => {
        if (e.touches.length) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
}

/*
========================================
WELCOME ANIMATION
========================================
*/

window.addEventListener("load", () => {

    initParallaxLayers();
    initIdleAnimations();
    initParallax();
    initLyricsScrollInteraction();

    gsap.from("#intro h1", {
        y: 20,
        opacity: 0,
        duration: 1.2
    });

    gsap.from("#intro p", {
        y: 20,
        opacity: 0,
        delay: 0.3,
        duration: 1.2
    });
});
