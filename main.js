import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Update GSAP ScrollTrigger to use Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Index page specific animations
  if (document.querySelector('.hero')) {
    // 1. Cinematic Hero Parallax
    gsap.to('.hero-bg', {
      yPercent: 30,
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to('.hero-content', {
      yPercent: 50,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // 4. Parallax Image in About Section
    if (document.querySelector('.about-image-wrapper')) {
      gsap.fromTo('.about-image-wrapper',
        { y: 50 },
        {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: ".about",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }

    // 6. Weddings Gallery 3D scroll effect
    if (document.querySelector('.weddings')) {
      gsap.to('.gallery-item', {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".weddings",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }

  // 2. Section Title Reveals (3D Split Text)
  const sectionTitles = gsap.utils.toArray('.section-title');
  sectionTitles.forEach(title => {
    const text = new SplitType(title, { types: 'chars, words' });
    gsap.from(text.chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.02,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  const sectionSubtitles = gsap.utils.toArray('.section-subtitle');
  sectionSubtitles.forEach(subtitle => {
    gsap.fromTo(subtitle, 
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: subtitle,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // 3. Image 3D Reveal Effects
  const revealImages = gsap.utils.toArray('.reveal-img');
  revealImages.forEach(img => {
    // Wrapper gets overflow hidden in CSS
    gsap.fromTo(img,
      { scale: 1.3, transformOrigin: "center center" },
      {
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // 5. Staggered Card Reveal (Testimonials)
  const grids = gsap.utils.toArray('.testimonials-grid');
  grids.forEach(grid => {
    const cards = grid.children;
    gsap.fromTo(cards,
      { opacity: 0, y: 50, rotateY: 15 },
      {
        opacity: 1,
        y: 0,
        rotateY: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // 6. Gallery Stack Animation
  if (document.querySelector('.gallery-stack')) {
    const stackItems = gsap.utils.toArray('.gallery-stack-item');
    
    gsap.set(stackItems, { zIndex: (i) => i });

    let stackTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".gallery",
        start: "center center", 
        end: "+=" + (stackItems.length * 100) + "%", 
        pin: true,
        scrub: true
      }
    });

    stackItems.forEach((item, i) => {
      if (i > 0) {
        stackTl.fromTo(item, 
          { yPercent: 100 }, 
          { yPercent: 0, duration: 1, ease: "none" }, 
          i - 1
        );
      }
      
      if (i < stackItems.length - 1) {
        stackTl.to(item, {
          scale: 0.8,
          opacity: 0.3,
          yPercent: -20,
          duration: 1,
          ease: "none"
        }, i); 
      }
    });
  }

  // 7. Data Speed Parallax
  const parallaxItems = gsap.utils.toArray('[data-speed]');
  parallaxItems.forEach(item => {
    const speed = item.getAttribute('data-speed');
    gsap.to(item, {
      y: () => (1 - parseFloat(speed)) * 100,
      ease: "none",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // 8. Custom Cinematic Cursor
  const cursor = document.querySelector('.cursor');
  const links = document.querySelectorAll('a, .magnetic-btn, .gallery-stack-item');

  // Center cursor on load if needed, otherwise it starts at 0,0
  gsap.set(cursor, {xPercent: -50, yPercent: -50});

  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power2.out"
    });
  });

  links.forEach(link => {
    link.addEventListener('mouseenter', () => cursor.classList.add('active'));
    link.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });

});
