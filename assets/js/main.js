/**
 * LAWN HOGS — Master Interactive Client Script
 * Abiding by modern JS best practices, accessibility (a11y), and responsive interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initBeforeAfterSlider();
  initRivalryMeter();
  initWorkFilters();
  initBackToTop();
  initQuoteWizard();
  initMerchActions();
});

/* 1. Header Scroll Compression */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* 2. Mobile Drawer Navigation */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (!toggleBtn || !mobileNav) return;

  const openMenu = () => {
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close when clicking outside drawer
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMenu();
  });
}

/* 3. Before / After Interactive Slider */
function initBeforeAfterSlider() {
  const container = document.getElementById('baSliderContainer');
  const beforeWrapper = document.getElementById('baBeforeWrapper');
  const handle = document.getElementById('baHandle');
  const beforeImg = document.getElementById('baBeforeImg');

  if (!container || !beforeWrapper || !handle) return;

  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    beforeWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
    if (beforeImg) {
      beforeImg.style.width = `${rect.width}px`;
    }
  };

  const startDrag = (e) => {
    isDragging = true;
    updateSlider(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const stopDrag = () => {
    isDragging = false;
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    updateSlider(clientX);
  };

  handle.addEventListener('mousedown', startDrag);
  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', onDrag);

  handle.addEventListener('touchstart', startDrag, { passive: true });
  container.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: true });

  // Keyboard accessibility for handle
  handle.setAttribute('tabindex', '0');
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Before and after lawn comparison slider');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '50');

  handle.addEventListener('keydown', (e) => {
    const currentVal = parseFloat(beforeWrapper.style.width || '50');
    let newVal = currentVal;

    if (e.key === 'ArrowLeft') newVal = Math.max(0, currentVal - 5);
    if (e.key === 'ArrowRight') newVal = Math.min(100, currentVal + 5);

    if (newVal !== currentVal) {
      beforeWrapper.style.width = `${newVal}%`;
      handle.style.left = `${newVal}%`;
      handle.setAttribute('aria-valuenow', `${Math.round(newVal)}`);
    }
  });

  // Resize handler to adjust the before image width
  window.addEventListener('resize', () => {
    if (beforeImg) {
      beforeImg.style.width = `${container.getBoundingClientRect().width}px`;
    }
  });
  if (beforeImg) {
    beforeImg.style.width = `${container.getBoundingClientRect().width}px`;
  }
}

/* 4. Neighborhood Rivalry Module Interactive Meter */
function initRivalryMeter() {
  const slider = document.getElementById('rivalryRangeInput');
  const meterFill = document.getElementById('rivalryMeterFill');
  const rivalryStatus = document.getElementById('rivalryStatusText');
  const rivalryAction = document.getElementById('rivalryActionRecommendation');

  if (!slider || !meterFill) return;

  const levels = [
    { threshold: 25, status: "Mild Annoyance", action: "Steve's lawn has 3 dandelions. A single pass of our commercial 60-inch deck will restore family honor." },
    { threshold: 50, status: "Suburban Cold War", action: "Steve just bought a cordless string trimmer and smirked at your mailbox. Request Whole Hog™ intervention immediately." },
    { threshold: 75, status: "Critical Threat Level", action: "Steve has crisp 45-degree diagonal stripes. Your property value is trembling. We deploy the heavy artillery at 06:00." },
    { threshold: 100, status: "DEFCON 1: TOTAL LAWN WARFARE", action: "Steve hired a 5-man crew with matching polos. Deploy Johnny Hogger and the entire fleet. We take no grass prisoners." }
  ];

  const updateRivalry = () => {
    const val = parseInt(slider.value, 10);
    meterFill.style.width = `${val}%`;

    let current = levels[levels.length - 1];
    for (const lvl of levels) {
      if (val <= lvl.threshold) {
        current = lvl;
        break;
      }
    }

    if (rivalryStatus) rivalryStatus.textContent = current.status;
    if (rivalryAction) rivalryAction.textContent = current.action;
  };

  slider.addEventListener('input', updateRivalry);
}

/* 5. The Hog Files Portfolio Filter */
function initWorkFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  if (!filterBtns.length || !workCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* 6. Back to Top Button */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* 7. Multi-step Quote Wizard */
function initQuoteWizard() {
  const wizard = document.getElementById('quoteWizardForm');
  if (!wizard) return;

  const step1 = document.getElementById('wizardStep1');
  const step2 = document.getElementById('wizardStep2');
  const step3 = document.getElementById('wizardStep3');
  const stepSuccess = document.getElementById('wizardSuccess');

  const btnNext1 = document.getElementById('btnNext1');
  const btnNext2 = document.getElementById('btnNext2');
  const btnPrev2 = document.getElementById('btnPrev2');
  const btnPrev3 = document.getElementById('btnPrev3');

  const node1 = document.getElementById('stepNode1');
  const node2 = document.getElementById('stepNode2');
  const node3 = document.getElementById('stepNode3');

  const estimatedTotal = document.getElementById('quoteEstimatedTotal');

  const calculateEstimate = () => {
    if (!estimatedTotal) return;
    const baseLot = document.querySelector('input[name="lotSize"]:checked')?.value || 'quarter';
    let base = 65;
    if (baseLot === 'half') base = 95;
    if (baseLot === 'acre') base = 160;
    if (baseLot === 'estate') base = 280;

    const checkedAddons = document.querySelectorAll('input[name="quoteAddon"]:checked');
    let addonsTotal = 0;
    checkedAddons.forEach(cb => {
      addonsTotal += parseInt(cb.getAttribute('data-price') || '0', 10);
    });

    estimatedTotal.textContent = `$${base + addonsTotal}`;
  };

  document.querySelectorAll('input[name="lotSize"], input[name="quoteAddon"]').forEach(el => {
    el.addEventListener('change', calculateEstimate);
  });

  if (btnNext1) {
    btnNext1.addEventListener('click', () => {
      const addressInput = document.getElementById('quoteAddress');
      if (addressInput && !addressInput.value.trim()) {
        showToast("⚠️ Enter your address so we know where to drop the tailgate.");
        addressInput.focus();
        return;
      }
      step1.style.display = 'none';
      step2.style.display = 'block';
      if (node2) node2.classList.add('active');
    });
  }

  if (btnPrev2) {
    btnPrev2.addEventListener('click', () => {
      step2.style.display = 'none';
      step1.style.display = 'block';
      if (node2) node2.classList.remove('active');
    });
  }

  if (btnNext2) {
    btnNext2.addEventListener('click', () => {
      step2.style.display = 'none';
      step3.style.display = 'block';
      if (node3) node3.classList.add('active');
    });
  }

  if (btnPrev3) {
    btnPrev3.addEventListener('click', () => {
      step3.style.display = 'none';
      step2.style.display = 'block';
      if (node3) node3.classList.remove('active');
    });
  }

  wizard.addEventListener('submit', (e) => {
    e.preventDefault();
    step3.style.display = 'none';
    if (stepSuccess) stepSuccess.style.display = 'block';
    showToast("🐗 DISPATCH CONFIRMED: Lawn Hogs strike team queued.");
  });
}

/* 8. Merch Actions */
function initMerchActions() {
  const buyButtons = document.querySelectorAll('.btn-add-merch');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.getAttribute('data-item') || 'Lawn Hogs Gear';
      showToast(`🛒 "${item}" added to outfitter bag. Rugged choice.`);
    });
  });
}

/* 9. Toast Notification System */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
