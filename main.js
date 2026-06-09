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

  // Smooth scroll for anchor links using Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: -80, // Adjust for navbar height
          duration: 1.2
        });
      }
    });
  });

  // Index page specific animations
  if (document.querySelector('.hero')) {
    // 1. Cinematic Hero Parallax
    gsap.to('.hero-slider', {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Fade out scroll down indicator on scroll
    gsap.to('.scroll-down', {
      opacity: 0,
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "30% top",
        scrub: true
      }
    });

    // 2. Cinematic Hero Content Reveal (3D Split Text)
    if (document.querySelector('.hero-content')) {
      const heroTitle = document.querySelector('.hero-title');
      const splitTitle = new SplitType(heroTitle, { types: 'words, chars' });
      
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Animate subtitle (letters fade in and spread out slightly)
      heroTl.fromTo('.hero-subtitle', 
        { opacity: 0, letterSpacing: "1px", y: -10 },
        { opacity: 1, letterSpacing: "6px", y: 0, duration: 1.5 },
        0.2
      );

      // Animate title characters (3D rotate, slide up, cascade)
      heroTl.from(splitTitle.chars, {
        opacity: 0,
        y: 80,
        rotateX: -90,
        transformOrigin: "0% 50% -50",
        stagger: 0.04,
        duration: 1.2,
        ease: "power4.out"
      }, 0.5);

      // Animate tagline (fade in and slide up)
      heroTl.fromTo('.hero-tagline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2 },
        1.2
      );

      // Animate CTA Button (fade in and scale up slightly)
      heroTl.fromTo('.hero-btn',
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 1.0 },
        1.5
      );

      // Scroll parallax for hero-content (it moves down slower than scroll speed)
      gsap.to('.hero-content', {
        yPercent: 40,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // Hero Slider logic (Contessa style)
    if (document.querySelector('.hero-slider')) {
      const slides = document.querySelectorAll('.hero-slider .slide');
      const prevBtn = document.querySelector('.prev-btn');
      const nextBtn = document.querySelector('.next-btn');
      let currentSlide = 0;
      let slideInterval;

      function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
      }

      function nextSlide() {
        showSlide(currentSlide + 1);
      }

      function prevSlide() {
        showSlide(currentSlide - 1);
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          resetInterval();
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          resetInterval();
        });
      }

      function startInterval() {
        slideInterval = setInterval(nextSlide, 6000);
      }

      function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
      }

      startInterval();
    }

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
