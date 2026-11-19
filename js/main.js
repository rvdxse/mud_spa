// ===== Navbar toggle =====
(function () {
  var toggle = document.querySelector('.navbar__toggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }
})();

// ===== Chip filters =====
(function () {
  var chips = document.querySelectorAll('.chip');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (x) {
        x.setAttribute('aria-pressed', x === chip);
      });

      var filter = chip.dataset.filter;
      document.querySelectorAll('.card--proc').forEach(function (card) {
        card.hidden = !(
          filter === 'all' ||
          card.dataset.tags.split(' ').indexOf(filter) > -1
        );
      });
    });
  });
})();

// ===== Visit form validation =====
(function () {
  var form = document.getElementById('visit-form');

  if (!form) return;

  function markField(inp, isValid) {
    var field = inp.closest('.field');
    field.classList.toggle('is-ok', isValid);
    field.classList.toggle('is-err', !isValid);
  }

  var checks = {
    name: function (v) {
      return v.trim().length >= 2;
    },
    phone: function (v) {
      return /^\+380\d{9}$/.test(v.replace(/[\s()-]/g, ''));
    },
    proc: function (v) {
      return !!v;
    },
    date: function (v) {
      return !!v;
    }
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var isValid = true;

    Object.keys(checks).forEach(function (key) {
      var input = form.elements[key];
      var valid = checks[key](input.value);
      markField(input, valid);
      isValid = isValid && valid;
    });

    var consent = document.getElementById('f-consent');
    var consentErr = document.getElementById('consent-err');
    consentErr.hidden = consent.checked;
    isValid = isValid && consent.checked;

    if (isValid) {
      document.getElementById('form-ok').hidden = false;
      form.reset();
      form.querySelectorAll('.field').forEach(function (f) {
        f.classList.remove('is-ok', 'is-err');
      });
    } else {
      var bad = form.querySelector('.is-err input');
      if (bad) bad.focus();
    }
  });

  // Set min date to today
  var dateInput = form.elements.date;
  if (dateInput) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }
})();

// ===== Animations =====
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navbar = document.querySelector('.navbar');

  // Scroll shadow on navbar
  if (navbar) {
    var onScroll = function () {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Skip reveal animations if motion is reduced or no IntersectionObserver
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.divider').forEach(function (d) {
      d.classList.add('is-in');
    });
    return;
  }

  var targets = [];

  function addReveal(el, type, delay) {
    if (!el || el.hasAttribute('data-reveal')) return;
    el.setAttribute('data-reveal', type || '');
    el.style.setProperty('--d', (delay || 0) + 'ms');
    targets.push(el);
  }

  // Section content blocks (skip hero/intro: they have entrance animation)
  document.querySelectorAll('main > section:not(.hero):not(.intro)').forEach(
    function (sec) {
      var wrap = sec.querySelector('.wrap');
      if (!wrap) return;

      Array.prototype.forEach.call(wrap.children, function (child, i) {
        if (
          child.classList.contains('grid') ||
          child.classList.contains('route') ||
          child.classList.contains('contact__grid') ||
          child.classList.contains('about') ||
          child.classList.contains('legend') ||
          child.classList.contains('cta__in') ||
          child.classList.contains('split')
        ) {
          if (child.classList.contains('grid')) {
            Array.prototype.forEach.call(child.children, function (c, j) {
              addReveal(c, '', j * 110);
            });
          } else if (
            child.classList.contains('about') ||
            child.classList.contains('legend')
          ) {
            addReveal(child.children[0], 'left', 0);
            addReveal(child.children[1], 'right', 150);
          } else if (child.classList.contains('contact__grid')) {
            addReveal(child.children[0], 'left', 0);
            addReveal(child.children[1], 'right', 150);
          } else if (child.classList.contains('route')) {
            addReveal(child.children[0], 'zoom', 0);
            addReveal(child.children[1], '', 150);
          } else {
            addReveal(child, '', 0);
          }
        } else {
          addReveal(child, '', i ? 60 : 0);
        }
      });

      // Nested wraps (about, legend, contact__grid, cta__in)
      if (
        wrap.classList.contains('about') ||
        wrap.classList.contains('legend') ||
        wrap.classList.contains('contact__grid') ||
        wrap.classList.contains('cta__in')
      ) {
        addReveal(wrap.children[0], 'left', 0);
        addReveal(wrap.children[1], 'right', 150);
      }

      // CTA section
      var ctaInner = sec.querySelector('.cta__in');
      if (ctaInner && sec.classList.contains('cta')) {
        addReveal(ctaInner.children[0], 'left', 0);
        addReveal(ctaInner.children[1], 'right', 150);
      }
    }
  );

  // Footer items
  document.querySelectorAll('.footer > :not(hr)').forEach(function (el, i) {
    addReveal(el, '', i * 80);
  });

  // Observe reveal targets
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -3% 0px' }
  );
  targets.forEach(function (t) {
    observer.observe(t);
  });

  // Divider draw animation
  var dividerObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          dividerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll('.divider').forEach(function (d) {
    dividerObserver.observe(d);
  });

  // Subtle parallax on hero & legend images
  var parallaxEls = [].slice.call(
    document.querySelectorAll('.hero__fig .arch, .arch--legend')
  );
  if (parallaxEls.length && window.matchMedia('(min-width:1101px)').matches) {
    var ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          parallaxEls.forEach(function (p) {
            var rect = p.getBoundingClientRect();
            var k =
              (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
            p.style.translate = '0 ' + (k * -18).toFixed(1) + 'px';
          });
          ticking = false;
        });
      },
      { passive: true }
    );
  }
})();
