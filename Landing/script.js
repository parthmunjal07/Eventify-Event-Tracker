
// Smooth Scrolling for Navigation Links

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
  } else {
    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  }
  lastScroll = currentScroll;
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in animation to feature cards
document.querySelectorAll('.feature-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `all 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});

// Apply fade-in animation to steps
document.querySelectorAll('.step').forEach((step, index) => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(30px)';
  step.style.transition = `all 0.6s ease ${index * 0.15}s`;
  observer.observe(step);
});

// Apply fade-in animation to benefit items
document.querySelectorAll('.benefit-item').forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-30px)';
  item.style.transition = `all 0.6s ease ${index * 0.1}s`;
  observer.observe(item);
});

// Apply fade-in animation to stats cards
document.querySelectorAll('.stats-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';
  card.style.transition = `all 0.6s ease ${index * 0.15}s`;
  observer.observe(card);
});

// Counter Animation for Stats
const animateCounter = (element, target) => {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString() + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString() + '+';
    }
  }, 20);
};

// Observe stats cards and trigger counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      const h3 = entry.target.querySelector('h3');
      const text = h3.textContent.replace(/[^0-9]/g, '');
      const target = parseInt(text);
      entry.target.classList.add('counted');
      animateCounter(h3, target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-card').forEach(card => {
  statsObserver.observe(card);
});

// CTA Button Click Handlers
document.querySelectorAll('.btn-primary, .btn-secondary, .cta-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    // Add ripple effect
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    // Handle button action
    if (button.textContent.includes('Get Started') || button.textContent.includes('Start Managing')) {
      alert('Welcome to BuzzBoard! Registration coming soon.');
    } else if (button.textContent.includes('Demo')) {
      alert('Demo video coming soon!');
    }
  });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Floating cards animation enhancement
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'scale(1.1) translateY(-10px)';
    card.style.transition = 'all 0.3s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'scale(1)';
  });
});

// Feature card tilt effect
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// Mobile Menu Toggle (for future mobile menu implementation)
const createMobileMenu = () => {
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.innerHTML = `<span></span><span></span><span></span>`;

  if (window.innerWidth <= 768) {
    document.querySelector('.navbar .container').appendChild(hamburger);
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
};

// Initialize on load
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.5s ease';
});

// Log page view (can be replaced with actual analytics)
console.log('BuzzBoard Landing Page Loaded');
console.log('Features: Event Management, QR Check-in, Gamification, Real-time Updates');
