/* ── js/matrix.js ── */
(function() {
  
  // Checks if the cinematic transition should play
  function shouldPlayMatrixTransition() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introPlayed = sessionStorage.getItem('matrix_intro_played');
    return !prefersReducedMotion && !introPlayed;
  }

  // Phase 1: Glitch elements
  const glitchChars = "0123456789!@#$%^&*()_+{}|:<>?-=[]\\;',./";
  const originalTexts = new Map();

  function glitchElement(el, rate) {
    if (!el || el.childNodes.length === 0) return;
    if (!originalTexts.has(el)) {
      originalTexts.set(el, el.innerText);
    }
    const text = originalTexts.get(el);
    let glitchedText = "";
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ' || text[i] === '\n') {
        glitchedText += text[i];
      } else {
        glitchedText += Math.random() < rate ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : text[i];
      }
    }
    el.innerText = glitchedText;
  }

  function restoreElements() {
    originalTexts.forEach((text, el) => {
      el.innerText = text;
    });
    originalTexts.clear();
  }

  // Phase 3: Terminal sequence
  function startTerminalSequence(parent, onComplete) {
    const term = document.createElement('div');
    term.className = 'matrix-terminal';
    term.style.cssText = 'font-family: monospace; color: #00ff41; background: #000; padding: 2rem; width: 100dvw; height: 100dvh; box-sizing: border-box; text-align: left; display: flex; flex-direction: column; justify-content: flex-start; overflow: hidden; font-size: 14px; line-height: 1.5; z-index: 100001;';
    
    const lines = [
      "INITIALIZING MATRIX MODE...",
      "Loading Runtime...",
      "Injecting Interface...",
      "Decrypting Portfolio...",
      "Rendering UI...",
      "ACCESS GRANTED"
    ];

    const contentDiv = document.createElement('div');
    contentDiv.id = 'terminal-content';
    term.appendChild(contentDiv);

    const cursor = document.createElement('span');
    cursor.innerText = '_';
    cursor.style.cssText = 'animation: terminal-blink 0.8s infinite; margin-left: 2px;';
    term.appendChild(cursor);

    parent.appendChild(term);

    if (!document.getElementById('terminal-blink-style')) {
      const style = document.createElement('style');
      style.id = 'terminal-blink-style';
      style.innerHTML = '@keyframes terminal-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }';
      document.head.appendChild(style);
    }

    let lineIndex = 0;
    function printNextLine() {
      if (lineIndex < lines.length) {
        const line = document.createElement('div');
        line.innerText = lines[lineIndex];
        if (lines[lineIndex] === "ACCESS GRANTED") {
          line.style.fontWeight = 'bold';
          line.style.textShadow = '0 0 8px #00ff41';
        }
        contentDiv.appendChild(line);
        lineIndex++;
        setTimeout(printNextLine, 120);
      } else {
        setTimeout(onComplete, 300);
      }
    }

    printNextLine();
  }

  // Full transition flow
  function playMatrixTransition(onComplete) {
    const els = document.querySelectorAll('h1, h2, h3, .nav-link, .btn, .section-title, .hero-title, .hero-subtitle');
    const profileImg = document.querySelector('.about-image img, .hero-image img, img');
    
    // Hide scrollbar and prevent layout shifts
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    // Phase 1: Progressive Reality Breakdown (1.8 seconds)
    document.body.classList.add('matrix-destabilize');
    let glitchRate = 0.15;

    const glitchInterval = setInterval(() => {
      els.forEach(el => glitchElement(el, glitchRate));
      
      // profile image offsets by 1-2px
      if (profileImg && Math.random() > 0.6) {
        const dx = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.5 ? 1 : 2);
        const dy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.5 ? 1 : 2);
        profileImg.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    }, 90);

    // timeline stages
    setTimeout(() => {
      glitchRate = 0.30;
      document.body.classList.add('matrix-stage-flicker');
    }, 450);

    setTimeout(() => {
      glitchRate = 0.50;
      document.body.classList.add('matrix-stage-rgb');
    }, 900);

    setTimeout(() => {
      glitchRate = 0.70;
      document.body.classList.add('matrix-stage-extreme');
    }, 1350);

    setTimeout(() => {
      document.body.classList.add('matrix-fade-black');
    }, 1600);

    setTimeout(() => {
      clearInterval(glitchInterval);
      restoreElements();
      if (profileImg) profileImg.style.transform = '';
      document.body.classList.remove('matrix-destabilize', 'matrix-stage-flicker', 'matrix-stage-rgb', 'matrix-stage-extreme', 'matrix-fade-black');

      // Phase 2: Fullscreen video overlay
      const overlay = document.createElement('div');
      overlay.id = 'matrix-overlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100dvw; height: 100dvh; z-index: 100000; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden;';
      document.body.appendChild(overlay);

      const video = document.createElement('video');
      video.id = 'matrix-video';
      video.src = 'videos/matrix/matrix-intro.mp4';
      video.autoplay = true;
      video.playsInline = true;
      video.style.cssText = 'max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain;';
      overlay.appendChild(video);

      let overlayRemoved = false;
      function transitionToTerminal() {
        if (overlayRemoved) return;
        overlayRemoved = true;
        
        video.remove();

        // Phase 3: Terminal boot sequence
        startTerminalSequence(overlay, () => {
          // Phase 4: Finalize transition
          overlay.remove();
          
          // Reset scroll to Hero before revealing
          window.scrollTo({ top: 0, behavior: 'instant' });
          document.documentElement.style.overflow = originalOverflow; // Restore scrollbar
          
          sessionStorage.setItem('matrix_intro_played', 'true');
          
          // Trigger brief final digital glitch
          document.body.classList.add('matrix-destabilize');
          setTimeout(() => {
            document.body.classList.remove('matrix-destabilize');
            onComplete();
          }, 200);
        });
      }

      // Safety timeout fallback
      const fallbackTimeout = setTimeout(transitionToTerminal, 8500);

      video.addEventListener('ended', () => {
        clearTimeout(fallbackTimeout);
        transitionToTerminal();
      });

      video.addEventListener('error', () => {
        clearTimeout(fallbackTimeout);
        transitionToTerminal();
      });

    }, 1800);
  }

  // Refinement 5: Background text activity
  let backgroundGlitchTimeout = null;

  function startBackgroundActivity() {
    if (backgroundGlitchTimeout) return;

    function triggerSingleGlitch() {
      if (document.documentElement.getAttribute('data-mood') !== 'matrix') return;

      const els = Array.from(document.querySelectorAll('h1, h2, h3, .nav-link, .btn, .section-title, .hero-title, .hero-subtitle'))
                       .filter(el => el.innerText && el.innerText.trim().length > 3);
      if (els.length === 0) return;

      const target = els[Math.floor(Math.random() * els.length)];
      const originalText = target.innerText;
      
      let glitchedText = "";
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === ' ' || originalText[i] === '\n') {
          glitchedText += originalText[i];
        } else {
          glitchedText += Math.random() < 0.4 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : originalText[i];
        }
      }
      target.innerText = glitchedText;

      setTimeout(() => {
        target.innerText = originalText;
      }, 150);
    }

    function loop() {
      if (document.documentElement.getAttribute('data-mood') !== 'matrix') return;
      triggerSingleGlitch();
      const nextDelay = 6000 + Math.random() * 6000; // 6 - 12 seconds
      backgroundGlitchTimeout = setTimeout(loop, nextDelay);
    }

    backgroundGlitchTimeout = setTimeout(loop, 5000);
  }

  function stopBackgroundActivity() {
    if (backgroundGlitchTimeout) {
      clearTimeout(backgroundGlitchTimeout);
      backgroundGlitchTimeout = null;
    }
  }

  // Refinement 6: Floating Developer Words
  let wordsTimeout = null;
  const devWords = [
    "ACCESS", "ROOT", "THREAD", "STACK", "KERNEL", "JWT", "LOCALHOST", 
    "NODE", "PROCESS", "NULL", "010101", "PORT", "GET", "POST", 
    "AUTH", "DEPLOY", "ENCRYPT", "BOOT", "SYSTEM"
  ];

  function startFloatingWords() {
    if (wordsTimeout) return;

    let container = document.getElementById('matrix-words-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'matrix-words-container';
      container.style.cssText = 'position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden;';
      document.body.appendChild(container);
    }

    function spawnWord() {
      if (document.documentElement.getAttribute('data-mood') !== 'matrix') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const wordText = devWords[Math.floor(Math.random() * devWords.length)];
      const wordEl = document.createElement('div');
      wordEl.innerText = wordText;
      
      const top = 15 + Math.random() * 70;
      const left = 5 + Math.random() * 90;
      
      wordEl.style.cssText = `
        position: absolute;
        top: ${top}%;
        left: ${left}%;
        font-family: monospace;
        font-size: 11px;
        color: #00ff41;
        opacity: 0;
        text-shadow: 0 0 3px rgba(0, 255, 65, 0.4);
        letter-spacing: 0.1em;
        transition: opacity 1.5s ease-in-out, transform 4s ease-in-out;
        transform: translateY(0);
      `;

      container.appendChild(wordEl);

      requestAnimationFrame(() => {
        wordEl.style.opacity = '0.045';
        wordEl.style.transform = 'translateY(-15px)';
      });

      setTimeout(() => {
        wordEl.style.opacity = '0';
      }, 2500);

      setTimeout(() => {
        wordEl.remove();
      }, 4500);
    }

    function loop() {
      if (document.documentElement.getAttribute('data-mood') !== 'matrix') return;
      spawnWord();
      const nextDelay = 3000 + Math.random() * 3000; // 3 - 6 seconds
      wordsTimeout = setTimeout(loop, nextDelay);
    }

    wordsTimeout = setTimeout(loop, 3000);
  }

  function stopFloatingWords() {
    if (wordsTimeout) {
      clearTimeout(wordsTimeout);
      wordsTimeout = null;
    }
    const container = document.getElementById('matrix-words-container');
    if (container) {
      container.remove();
    }
  }

  // Hook setMood globally once script.js is loaded
  function hookSetMood() {
    const originalSetMood = window.setMood;
    if (originalSetMood) {
      window.setMood = function(mood) {
        if (mood === 'matrix' && shouldPlayMatrixTransition()) {
          playMatrixTransition(() => {
            originalSetMood('matrix');
            if (window.MatrixRain) window.MatrixRain.start();
            startBackgroundActivity();
            startFloatingWords();
          });
        } else {
          originalSetMood(mood);
          if (mood === 'matrix') {
            if (window.MatrixRain) window.MatrixRain.start();
            startBackgroundActivity();
            startFloatingWords();
          } else {
            if (window.MatrixRain) window.MatrixRain.stop();
            stopBackgroundActivity();
            stopFloatingWords();
          }
        }
      };

      // Handle load-time check: if already matrix, trigger intro
      if (document.documentElement.getAttribute('data-mood') === 'matrix') {
        if (shouldPlayMatrixTransition()) {
          document.documentElement.removeAttribute('data-mood');
          document.documentElement.removeAttribute('data-theme');
          playMatrixTransition(() => {
            window.setMood('matrix');
          });
        } else {
          if (window.MatrixRain) window.MatrixRain.start();
          startBackgroundActivity();
          startFloatingWords();
        }
      }
    } else {
      setTimeout(hookSetMood, 50);
    }
  }

  // Start checking
  hookSetMood();

})();
