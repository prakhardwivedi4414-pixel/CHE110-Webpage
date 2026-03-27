const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.scroll-anim').forEach((el) => {
  observer.observe(el);
});

const tiltElements = document.querySelectorAll('.tilt-card');

tiltElements.forEach(el => {
  el.addEventListener('mousemove', handleTilt);
  el.addEventListener('mouseleave', resetTilt);
  el.addEventListener('mouseenter', function() {
    this.style.transition = 'none';
  });
});

function handleTilt(e) {
  const card = this;
  const cardRect = card.getBoundingClientRect();
  const cardCenterX = cardRect.left + cardRect.width / 2;
  const cardCenterY = cardRect.top + cardRect.height / 2;
  const mouseX = e.clientX - cardCenterX;
  const mouseY = e.clientY - cardCenterY;
  const rotateX = (mouseY / (cardRect.height / 2)) * -10;
  const rotateY = (mouseX / (cardRect.width / 2)) * 10;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetTilt() {
  this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  this.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
}

const navItems = document.querySelectorAll('.nav-item');
const dropItems = document.querySelectorAll('.drop-item');
const pill = document.querySelector('.nav-pill');
const sections = document.querySelectorAll('section');
let pillTimeout;

function updatePill(element) {
  if (!element || !pill) return;
  
  let targetElement = element;
  if (element.classList.contains('drop-item')) {
    targetElement = document.getElementById('explore-btn');
  }

  const navContainer = targetElement.closest('.nav-links');
  if (!navContainer) return;

  const itemRect = targetElement.getBoundingClientRect();
  const containerRect = navContainer.getBoundingClientRect();
  
  const currentTransform = pill.style.transform;
  const currentX = currentTransform ? parseFloat(currentTransform.split('(')[1]) : 0;
  const targetX = itemRect.left - containerRect.left;
  const targetWidth = itemRect.width;

  if (Math.abs(targetX - currentX) > 1) {
    clearTimeout(pillTimeout);
    const distance = Math.abs(targetX - currentX);
    const isMovingRight = targetX > currentX;
    
    pill.style.transition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), width 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.25s ease';
    
    if (isMovingRight) {
      pill.style.width = `${distance + targetWidth}px`;
      pill.style.transform = `translateX(${currentX}px)`;
      pill.style.borderRadius = '30px 45px 45px 30px';
    } else {
      pill.style.width = `${distance + targetWidth}px`;
      pill.style.transform = `translateX(${targetX}px)`;
      pill.style.borderRadius = '45px 30px 30px 45px';
    }

    pillTimeout = setTimeout(() => {
      pill.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), width 0.4s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.4s ease';
      pill.style.width = `${targetWidth}px`;
      pill.style.transform = `translateX(${targetX}px)`;
      pill.style.borderRadius = '30px';
    }, 120);
  } else {
    pill.style.width = `${targetWidth}px`;
    pill.style.transform = `translateX(${targetX}px)`;
    pill.style.borderRadius = '30px';
  }
}

const scrollSpyOptions = {
  root: null,
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
};

const scrollSpyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const currentId = entry.target.getAttribute('id');
      let activeItem = document.querySelector(`.nav-item[href="#${currentId}"]`);
      
      if (!activeItem) {
        activeItem = document.querySelector(`.drop-item[href="#${currentId}"]`);
      }
      
      navItems.forEach(item => item.classList.remove('active'));
      dropItems.forEach(item => item.classList.remove('active'));
      
      if (activeItem) {
        if (activeItem.classList.contains('drop-item')) {
          const parentBtn = document.getElementById('explore-btn');
          if (parentBtn) parentBtn.classList.add('active');
        } else {
          activeItem.classList.add('active');
        }
        updatePill(activeItem);
      }
    }
  });
}, scrollSpyOptions);

sections.forEach(section => scrollSpyObserver.observe(section));

const allNavLinks = document.querySelectorAll('a[href^="#"]');
allNavLinks.forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(targetId);
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
      
      navItems.forEach(item => item.classList.remove('active'));
      dropItems.forEach(item => item.classList.remove('active'));
      
      if (this.classList.contains('drop-item')) {
        const parentBtn = document.getElementById('explore-btn');
        if (parentBtn) parentBtn.classList.add('active');
      } else {
        this.classList.add('active');
      }
      updatePill(this);
    }
  });
});

function createLeaves() {
  const container = document.getElementById('leaf-container');
  if (!container) return;

  const leafIcons = ['ph-leaf', 'ph-plant'];

  for (let i = 0; i < 18; i++) {
    const leaf = document.createElement('i');
    const randomIcon = leafIcons[Math.floor(Math.random() * leafIcons.length)];
    leaf.classList.add('ph-fill', randomIcon, 'leaf');

    const startPosX = Math.random() * 100;
    const animationDuration = Math.random() * 6 + 4;
    const animationDelay = Math.random() * 5;
    const size = Math.random() * 1.2 + 0.8;

    leaf.style.left = `${startPosX}%`;
    leaf.style.animationDuration = `${animationDuration}s`;
    leaf.style.animationDelay = `${animationDelay}s`;
    leaf.style.fontSize = `${size}rem`;

    container.appendChild(leaf);
  }
}

function createFallingApps() {
  const container = document.getElementById('floating-social-container');
  if (!container) return;

  const appIcons = ['ph-github-logo', 'ph-instagram-logo', 'ph-linkedin-logo'];

  for (let i = 0; i < 15; i++) {
    const icon = document.createElement('i');
    const randomIcon = appIcons[Math.floor(Math.random() * appIcons.length)];
    icon.classList.add('ph-bold', randomIcon, 'drifting-app-icon'); 

    const startPosX = Math.random() * 100;
    const animationDuration = Math.random() * 8 + 6;
    const animationDelay = Math.random() * 6;
    const size = Math.random() * 2 + 1.2;

    icon.style.left = `${startPosX}%`;
    icon.style.animationDuration = `${animationDuration}s`;
    icon.style.animationDelay = `${animationDelay}s`;
    icon.style.fontSize = `${size}rem`;

    container.appendChild(icon);
  }
}

function createStars() {
  const container = document.getElementById('night-sky');
  if (!container) return;

  for (let i = 0; i < 75; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    const isBig = Math.random() > 0.80;
    const size = isBig ? Math.random() * 3 + 3 : Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    const duration = isBig ? Math.random() * 1 + 0.5 : Math.random() * 4 + 2;
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--opacity', `${Math.random() * 0.7 + 0.3}`);
    
    container.appendChild(star);
  }
}

const solutionsSectionId = document.getElementById('solutions');
const bgAliveImg = document.querySelector('.bg-alive');
let bgTimeoutId;

if (solutionsSectionId && bgAliveImg) {
  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bgTimeoutId = setTimeout(() => {
          bgAliveImg.style.opacity = '1';
        }, 2000);
      } else {
        clearTimeout(bgTimeoutId);
        bgAliveImg.style.opacity = '0';
      }
    });
  }, observerOptions);
  bgObserver.observe(solutionsSectionId);
}

const typingTexts = [
  "Over 29% of India's geographical area is degraded.",
  "Water erosion accounts for 10.98% of the degradation.",
  "Vegetation loss severely impacts the Thar Desert borders.",
  "Restoration is not an option. It is a necessity."
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let typeObserver;

function typeEffect() {
  const textElement = document.getElementById('typewriter-text');
  if (!textElement) return;

  const currentText = typingTexts[textIndex];

  if (isDeleting) {
    textElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 50;
  } else {
    textElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 100;
  }

  if (!isDeleting && charIndex === currentText.length) {
    typingDelay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % typingTexts.length;
    typingDelay = 500;
  }

  setTimeout(typeEffect, typingDelay);
}

let chartsRendered = false;

function initCharts() {
  if (chartsRendered || typeof Chart === 'undefined') return;
  
  const causeCtx = document.getElementById('causeChart');
  const stateCtx = document.getElementById('stateChart');
  
  if (!causeCtx || !stateCtx) return;

  new Chart(causeCtx, {
    type: 'doughnut',
    data: {
      labels: ['Water Erosion', 'Vegetation Degradation', 'Wind Erosion', 'Salinity', 'Others'],
      datasets: [{
        data: [10.98, 8.91, 5.55, 1.12, 3.2],
        backgroundColor: [
          '#4682B4',
          '#2E8B57',
          '#D4A373',
          '#A0522D',
          '#8B5A2B'
        ],
        borderWidth: 0,
        borderRadius: 15,
        spacing: 5,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: '75%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#2C2C2C', font: { family: 'Open Sans', size: 12 }, padding: 20 }
        }
      },
      animation: { 
        animateScale: true, 
        animateRotate: true, 
        duration: 2500,
        easing: 'easeOutBounce'
      }
    }
  });

  new Chart(stateCtx, {
    type: 'bar',
    data: {
      labels: ['Rajasthan', 'Maharashtra', 'Gujarat', 'Karnataka', 'Jharkhand'],
      datasets: [{
        label: 'Degraded Area (M ha)',
        data: [21.53, 13.74, 13.04, 6.87, 5.44],
        backgroundColor: [
          'rgba(160, 82, 45, 0.9)',
          'rgba(139, 90, 43, 0.9)',
          'rgba(212, 163, 115, 0.9)',
          'rgba(46, 139, 87, 0.9)',
          'rgba(70, 130, 180, 0.9)'
        ],
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 12, bottomRight: 12 },
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false }
      },
      animation: { 
        duration: 2000, 
        easing: 'easeOutQuart',
        delay: (context) => {
          return context.dataIndex * 200;
        }
      }
    }
  });
  
  chartsRendered = true;
}

const dashboardSection = document.getElementById('dashboard');
if (dashboardSection) {
  const dashboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!typeObserver) {
          typeEffect();
          typeObserver = true;
        }
        initCharts();
      }
    });
  }, { threshold: 0.3 });
  
  dashboardObserver.observe(dashboardSection);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const activeItem = document.querySelector('.nav-item.active') || document.querySelector('.drop-item.active') || navItems[0];
    updatePill(activeItem);
  }, 100);
  createLeaves();
  createFallingApps();
  createStars();
});

window.addEventListener('resize', () => {
  let activeItem = document.querySelector('.nav-item.active');
  if (!activeItem || activeItem.id === 'explore-btn') {
     const activeDrop = document.querySelector('.drop-item.active');
     if (activeDrop) activeItem = document.getElementById('explore-btn');
  }
  updatePill(activeItem);
});

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1), inset 0 -5px 15px rgba(255,255,255,0.4)';
  } else {
    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.05)';
  }
});

