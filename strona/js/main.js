
/* ============================================
   T.E.K.M. — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = document.querySelectorAll('.section');
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const modalImage = document.querySelector('.modal-image');
  const modalCaption = document.querySelector('.modal-caption h3');
  const modalDesc = document.querySelector('.modal-caption p');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const dustversumLinks = document.querySelectorAll('.dustversum-link');
  const contactForm = document.getElementById('contactForm');

  // ==========================================
  // SECTION SWITCHING
  // ==========================================
  function showSection(sectionId) {
    // Hide all sections
    sections.forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav active state
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Close mobile menu
    sidebar.classList.remove('open');

    // Update URL hash for shareability
    history.replaceState(null, null, '#' + sectionId);
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      if (section === 'shop-external') {
        window.open('https://www.teepublic.com/user/samsomart', '_blank');
        return;
      }
      showSection(section);
    });
  });

  // Handle initial hash
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const validSection = document.getElementById(hash);
    if (validSection && validSection.classList.contains('section')) {
      showSection(hash);
    }
  }

  // ==========================================
  // MOBILE MENU
  // ==========================================
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });

  // ==========================================
  // MODAL / LIGHTBOX
  // ==========================================
  function openModal(options) {
    const { image, title, desc, isDustversum } = options;

    modalImage.src = image;
    modalCaption.textContent = title || '';
    modalDesc.textContent = desc || '';

    if (isDustversum) {
      modalOverlay.classList.add('dustversum-modal');
    } else {
      modalOverlay.classList.remove('dustversum-modal');
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImage.src = '';
    }, 300);
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Gallery lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay-text')?.textContent || '';
      openModal({
        image: img.src,
        title: title,
        desc: ''
      });
    });
  });

  // DustVersum modal
  dustversumLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal({
        image: 'images/dustversum-teaser.jpg',
        title: 'DUSTVERSUM',
        desc: 'Co to właściwie jest?',
        isDustversum: true
      });
    });
  });

  // ==========================================
  // CONTACT FORM
  // ==========================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      // Formspree integration (replace with your Formspree endpoint)
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

      // Check if Formspree is configured
      if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
        // Fallback: mailto
        const subject = encodeURIComponent('T.E.K.M. - Kontakt od ' + name);
        const body = encodeURIComponent(
          'Od: ' + name + ' (' + email + ')\\n\\n' + message
        );
        window.location.href = 'mailto:somrocksam@gmail.com?subject=' + subject + '&body=' + body;

        // Show feedback
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '✓ Otwarto klienta poczty';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      } else {
        // Real Formspree submit
        fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        }).then(response => {
          if (response.ok) {
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.textContent = '✓ Wysłano';
            btn.disabled = true;
            contactForm.reset();
            setTimeout(() => {
              btn.textContent = 'Wyślij';
              btn.disabled = false;
            }, 3000);
          }
        }).catch(() => {
          alert('Błąd wysyłki. Spróbuj ponownie.');
        });
      }
    });
  }

  // ==========================================
  // SCROLL EFFECTS
  // ==========================================
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Subtle parallax or scroll effects can go here
        ticking = false;
      });
      ticking = true;
    }
  });

  // ==========================================
  // EXTERNAL SHOP BUTTONS
  // ==========================================
  document.querySelectorAll('[data-external="teepublic"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open('https://www.teepublic.com/user/samsomart', '_blank');
    });
  });
});
