/* =====================================================================
   PORTFOLIO — script.js
   Handles:
     1. Navbar scroll effect (transparent → frosted glass)
     2. Hamburger menu toggle (mobile)
     3. Active nav link on scroll (IntersectionObserver)
     4. Fade-up reveal animation on scroll (IntersectionObserver)
     5. Dynamic footer year
   ===================================================================== */

/* ── 1. FOOTER YEAR ────────────────────────────────────────────────── */
/* Sets the copyright year automatically — no manual updates needed */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ── 2. NAVBAR SCROLL EFFECT ───────────────────────────────────────── */
/* Adds .scrolled class after the user scrolls past 20px.
   CSS handles the visual change (backdrop-filter + border). */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Run once on page load in case user refreshed mid-page

/* ── 3. HAMBURGER MENU ─────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const navLinkEls = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

function closeMenu() {
  if (!hamburger || !navLinks) return;
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = ''; // restore scroll
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll while mobile nav is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when any nav link is clicked
  navLinkEls.forEach(link => link.addEventListener('click', closeMenu));
}

/* ── 4. ACTIVE NAV LINK ON SCROLL ──────────────────────────────────── */
/* Watches each section and highlights the matching nav link */
const sections      = document.querySelectorAll('section[id]');
const navLinkMap    = {};               // { sectionId: navLinkElement }

navLinkEls.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    navLinkMap[href.slice(1)] = link;
  }
});

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active from all links
        Object.values(navLinkMap).forEach(l => l.classList.remove('active'));
        // Add active to the matching link
        const activeLink = navLinkMap[entry.target.id];
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  {
    threshold: 0.3,           // section must be 30% visible to activate link
    rootMargin: '-60px 0px -40% 0px'
  }
);

sections.forEach(section => sectionObserver.observe(section));

/* ── 5. FADE-UP REVEAL ANIMATION ───────────────────────────────────── */
/* Elements with class .fade-up are invisible by default (CSS handles that).
   Once they enter the viewport, we add .visible so CSS transitions them in. */
const fadeEls = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop watching once revealed — no need to toggle back
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,          // trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'
  }
);

fadeEls.forEach(el => fadeObserver.observe(el));

/* ── 6. SMOOTH SCROLL POLYFILL FOR OLDER SAFARI ────────────────────── */
/* Modern browsers handle scroll-behavior: smooth via CSS.
   This catches edge cases where hash clicks need a nudge. */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Close mobile menu if open
    closeMenu();
  });
});

/* ── 7. THEME TOGGLE ───────────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
  document.body.classList.add('theme-transition');
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  }
  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 300);
}

// Initial sync
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
} else {
  document.documentElement.removeAttribute('data-theme');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    setTheme(isLight ? 'dark' : 'light');
  });
}

/* ── 8. FLOATING EASTER EGG ────────────────────────────────────────── */
const egg = document.getElementById('easter-egg');
const eggTooltip = document.getElementById('easter-egg-tooltip');

if (egg) {
  let failedAttempts = 0;
  let tooltipTimeout;

  let posX = Math.random() * (window.innerWidth - 100) + 20;
  let posY = Math.random() * (window.innerHeight - 100) + 20;
  let velX = (Math.random() - 0.5) * 2;
  let velY = (Math.random() - 0.5) * 2;

  // Set initial slow velocity magnitude
  const speed = 1.0;
  const initialLen = Math.hypot(velX, velY) || 1;
  velX = (velX / initialLen) * speed;
  velY = (velY / initialLen) * speed;

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function teleportBox() {
    const padding = 60;
    posX = Math.random() * (window.innerWidth - 80 - padding * 2) + padding;
    posY = Math.random() * (window.innerHeight - 80 - padding * 2) + padding;
  }

  function registerFailedAttempt() {
    failedAttempts++;
    if (eggTooltip) {
      eggTooltip.classList.add('show');
      clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => {
        eggTooltip.classList.remove('show');
      }, 2000);
    }
    teleportBox();
  }

  // Handle direct click/touch on the egg
  egg.addEventListener('click', (e) => {
    if (failedAttempts < 10) {
      e.preventDefault();
      e.stopPropagation();
      registerFailedAttempt();
    } else {
      window.location.href = 'secret.html';
    }
  });

  // Handle missed clicks near the egg
  document.addEventListener('click', (e) => {
    if (failedAttempts >= 10) return;
    // Ignore click if it was on the egg itself or on links/buttons
    if (e.target.closest('#easter-egg') || e.target.closest('a') || e.target.closest('button')) {
      return;
    }

    const rect = egg.getBoundingClientRect();
    const eggCenterX = rect.left + rect.width / 2;
    const eggCenterY = rect.top + rect.height / 2;
    const distance = Math.hypot(e.clientX - eggCenterX, e.clientY - eggCenterY);

    // If clicked within 150px of the egg, count as a failed attempt to catch it
    if (distance < 150) {
      registerFailedAttempt();
    }
  });

  // Handle resize to keep inside viewport bounds
  window.addEventListener('resize', () => {
    const size = 60;
    if (posX > window.innerWidth - size - 10) {
      posX = window.innerWidth - size - 10;
    }
    if (posY > window.innerHeight - size - 10) {
      posY = window.innerHeight - size - 10;
    }
  });

  // requestAnimationFrame Physics Loop
  function animate() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = 60;

    let targetVelX = velX;
    let targetVelY = velY;

    if (failedAttempts < 10) {
      const eggCenterX = posX + size / 2;
      const eggCenterY = posY + size / 2;
      const dx = eggCenterX - mouseX;
      const dy = eggCenterY - mouseY;
      const dist = Math.hypot(dx, dy) || 1;
      const runDistance = 140;

      if (dist < runDistance) {
        // Flee speed multiplier based on proximity
        const force = (runDistance - dist) / runDistance;
        const fleeSpeed = 8;
        targetVelX = (dx / dist) * fleeSpeed;
        targetVelY = (dy / dist) * fleeSpeed;
      } else {
        // Gently return to original slow drift speed if moving fast
        const currentSpeed = Math.hypot(velX, velY);
        if (currentSpeed > speed) {
          targetVelX = (velX / currentSpeed) * speed;
          targetVelY = (velY / currentSpeed) * speed;
        }
      }
    } else {
      // Once caught (10 failed attempts), float extremely slowly or stop
      targetVelX = 0;
      targetVelY = 0;
    }

    // Blend velocities for smooth inertial transition
    velX = velX * 0.92 + targetVelX * 0.08;
    velY = velY * 0.92 + targetVelY * 0.08;

    posX += velX;
    posY += velY;

    // Bounce off screen boundaries
    if (posX < 10) {
      posX = 10;
      velX = Math.abs(velX) * 0.8;
    } else if (posX > width - size - 10) {
      posX = width - size - 10;
      velX = -Math.abs(velX) * 0.8;
    }

    if (posY < 10) {
      posY = 10;
      velY = Math.abs(velY) * 0.8;
    } else if (posY > height - size - 10) {
      posY = height - size - 10;
      velY = -Math.abs(velY) * 0.8;
    }

    egg.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

    requestAnimationFrame(animate);
  }

  // Start the animation loop
  requestAnimationFrame(animate);
}
