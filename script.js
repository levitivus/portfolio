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

/* ── 7. MOOD TOGGLE & THEME ORB SYSTEM ─────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const themeOrb = document.getElementById('theme-orb');
const themePanel = document.getElementById('theme-panel');
const themeOptions = document.querySelectorAll('.theme-option');

function setMood(mood) {
  // Add transition class to animate theme variables smoothly
  document.body.classList.add('theme-transition');
  
  // Set data-mood attribute
  document.documentElement.setAttribute('data-mood', mood);
  localStorage.setItem('mood', mood);
  
  // Update data-theme attribute for backwards compatibility with navbar toggle
  if (mood === 'professional') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  }
  
  // Update active states in options list
  themeOptions.forEach(opt => {
    if (opt.getAttribute('data-select-mood') === mood) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 350);
}

// Initial sync on load
const storedMood = localStorage.getItem('mood');
const defaultMood = storedMood || 'midnight';
setMood(defaultMood);

// Toggle Panel
function togglePanel() {
  const isOpen = themePanel.classList.contains('open');
  if (isOpen) {
    closePanel();
  } else {
    openPanel();
  }
}

function openPanel() {
  themePanel.classList.add('open');
  themeOrb.setAttribute('aria-expanded', 'true');
  themePanel.setAttribute('aria-hidden', 'false');
  // Focus the first button in panel for keyboard accessibility
  if (themeOptions.length > 0) {
    themeOptions[0].focus();
  }
}

function closePanel() {
  themePanel.classList.remove('open');
  themeOrb.setAttribute('aria-expanded', 'false');
  themePanel.setAttribute('aria-hidden', 'true');
}

// Navbar Toggle Button event listener
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentMood = document.documentElement.getAttribute('data-mood') || 'midnight';
    // Toggle between midnight and professional
    const nextMood = currentMood === 'professional' ? 'midnight' : 'professional';
    setMood(nextMood);
  });
}

// Theme Orb and panel event listeners
if (themeOrb && themePanel) {
  themeOrb.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
  });
  
  // Click option
  themeOptions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mood = btn.getAttribute('data-select-mood');
      setMood(mood);
      closePanel();
      themeOrb.focus(); // Return focus to orb
    });
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!themePanel.contains(e.target) && !themeOrb.contains(e.target)) {
      closePanel();
    }
  });

  // Close panel with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && themePanel.classList.contains('open')) {
      closePanel();
      themeOrb.focus();
    }
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

/* ── 9. LEAVE A MESSAGE SECTION CONTROLLER ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('message-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const msgInput = document.getElementById('form-msg');
  
  const charCounter = document.getElementById('char-counter');
  const submitBtn = document.getElementById('submit-btn');
  const successCard = document.getElementById('message-success-card');
  const globalError = document.getElementById('form-global-error');

  // Register section with IntersectionObserver for reveal animation if present
  const leaveMessageSection = document.getElementById('leave-message');
  if (leaveMessageSection && typeof fadeObserver !== 'undefined') {
    fadeObserver.observe(leaveMessageSection);
  } else if (leaveMessageSection) {
    // Fallback if observer isn't defined globally
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(leaveMessageSection);
  }

  // Input elements change listeners to clear inline errors dynamically
  const inputs = [nameInput, emailInput, msgInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
        const fieldName = input.name || input.id.split('-')[1];
        const errorSpan = document.getElementById(`error-${fieldName}`);
        if (errorSpan) errorSpan.textContent = '';
        if (globalError) globalError.textContent = '';
      });
    }
  });

  // Character counter listener
  if (msgInput && charCounter) {
    msgInput.addEventListener('input', () => {
      const len = msgInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len > 500) {
        charCounter.style.color = '#ff3333';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Inline Validation Helpers
  function validateField(input, condition, errorMessage) {
    const fieldName = input.name || input.id.split('-')[1];
    const errorSpan = document.getElementById(`error-${fieldName}`);
    if (!condition) {
      input.classList.add('invalid');
      if (errorSpan) errorSpan.textContent = errorMessage;
      return false;
    } else {
      input.classList.remove('invalid');
      if (errorSpan) errorSpan.textContent = '';
      return true;
    }
  }

  function validateForm() {
    let isValid = true;

    // Validate name: required, min 2, max 50
    const nameVal = nameInput.value.trim();
    isValid = validateField(
      nameInput,
      nameVal.length >= 2 && nameVal.length <= 50,
      'Name must be between 2 and 50 characters.'
    ) && isValid;

    // Validate email: optional, check formatting if filled
    const emailVal = emailInput.value.trim();
    if (emailVal.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = validateField(
        emailInput,
        emailRegex.test(emailVal),
        'Please enter a valid email address.'
      ) && isValid;
    } else {
      // Clear errors if empty
      validateField(emailInput, true, '');
    }

    // Validate message: required, min 10, max 500
    const msgVal = msgInput.value.trim();
    isValid = validateField(
      msgInput,
      msgVal.length >= 10 && msgVal.length <= 500,
      'Message must be between 10 and 500 characters.'
    ) && isValid;

    return isValid;
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (globalError) globalError.textContent = '';

      // Run validation
      if (!validateForm()) return;

      // Set sending state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      try {
        // Initialize and send via window.EmailService
        if (window.EmailService) {
          await window.EmailService.init();
          await window.EmailService.sendFeedback(
            nameInput.value.trim(),
            emailInput.value.trim(),
            msgInput.value.trim()
          );
        } else {
          throw new Error('Email service is currently unavailable.');
        }

        // Success state
        if (btnText) btnText.textContent = '✓ Sent';
        if (btnSpinner) btnSpinner.style.display = 'none';

        // Reveal success card overlay
        if (successCard) {
          successCard.classList.add('show');
        }

        // Reset form inputs
        form.reset();
        if (charCounter) charCounter.textContent = '0 / 500';

        // Auto-fade success card after 4.5 seconds
        setTimeout(() => {
          if (successCard) {
            successCard.classList.remove('show');
          }
          // Re-enable and restore button
          submitBtn.disabled = false;
          if (btnText) btnText.textContent = '✉ Send Message';
        }, 4500);

      } catch (err) {
        // Error state: do not lose typed content
        console.error('Feedback send failed:', err);
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = '✉ Send Message';
        if (btnSpinner) btnSpinner.style.display = 'none';

        if (globalError) {
          globalError.textContent = 'Transmission failed. Please check your connection and try again.';
        }
      }
    });
  }
});
