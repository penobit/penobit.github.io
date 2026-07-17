const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const orb1 = document.querySelector('.bg-orb-1');
const orb2 = document.querySelector('.bg-orb-2');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  const scrollY = window.scrollY;
  if (orb1) orb1.style.transform = `translate(${scrollY * 0.15}px, ${scrollY * 0.1}px)`;
  if (orb2) orb2.style.transform = `translate(${-scrollY * 0.12}px, ${-scrollY * 0.08}px)`;
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
  }
});

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;
const statOriginals = Array.from(statNumbers).map(el => el.textContent.trim());

function animateCountUp() {
  if (statsAnimated) return;
  statsAnimated = true;

  statNumbers.forEach((el, i) => {
    const text = statOriginals[i];
    const match = text.match(/^(\d+)(\+?)$/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statsAnimated = false;
      animateCountUp();
    } else {
      statsAnimated = false;
      statNumbers.forEach((el, i) => {
        el.textContent = statOriginals[i];
      });
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === '#' + current);
  });
});
