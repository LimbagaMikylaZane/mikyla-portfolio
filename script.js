const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
  const visual = card.querySelector('.project-visual');

  if (visual && !visual.parentElement.classList.contains('project-visual-wrap')) {
    const wrap = document.createElement('div');
    wrap.className = 'project-visual-wrap';
    visual.parentNode.insertBefore(wrap, visual);
    wrap.appendChild(visual);

    const images = visual.dataset.gallery
      ? visual.dataset.gallery.split(',').map((image) => image.trim())
      : [visual.getAttribute('src')];
    let currentIndex = 0;
    let slideTimer;

    const updateVisual = (direction) => {
      currentIndex = (currentIndex + direction + images.length) % images.length;
      visual.classList.remove('is-sliding');
      void visual.offsetWidth;
      visual.src = images[currentIndex];
      visual.alt = `Project image ${currentIndex + 1}`;
      visual.classList.add('is-sliding');
    };

    const startSlideshow = () => {
      if (images.length < 2 || slideTimer) return;
      slideTimer = window.setInterval(() => updateVisual(1), 3500);
    };

    const stopSlideshow = () => {
      window.clearInterval(slideTimer);
      slideTimer = undefined;
    };

    wrap.addEventListener('mouseenter', stopSlideshow);
    wrap.addEventListener('mouseleave', startSlideshow);
    wrap.addEventListener('focusin', stopSlideshow);
    wrap.addEventListener('focusout', (event) => {
      if (!wrap.contains(event.relatedTarget)) startSlideshow();
    });

    startSlideshow();
  }

});
