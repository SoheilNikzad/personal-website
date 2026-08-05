(() => {
  const root = document.documentElement;
  const languageToggle = document.querySelector('#languageToggle');
  const themeToggle = document.querySelector('#themeToggle');
  const menuToggle = document.querySelector('#menuToggle');
  const nav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  const printResume = document.querySelector('#printResume');
  const copyContact = document.querySelector('#copyContact');
  const toast = document.querySelector('#toast');
  const year = document.querySelector('#year');

  const translations = {
    fa: {
      switchLabel: 'Switch to English',
      menuOpen: 'باز کردن منو',
      menuClose: 'بستن منو',
      copied: 'ایمیل نمونه کپی شد',
      copyFailed: 'کپی خودکار ممکن نشد',
      theme: 'تغییر پوسته'
    },
    en: {
      switchLabel: 'تغییر زبان به فارسی',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      copied: 'Sample email copied',
      copyFailed: 'Could not copy automatically',
      theme: 'Toggle theme'
    }
  };

  const getSavedLanguage = () => localStorage.getItem('site-language') || 'fa';
  const getSavedTheme = () => localStorage.getItem('site-theme') || 'light';

  function applyLanguage(language) {
    const isPersian = language === 'fa';
    root.lang = language;
    root.dir = isPersian ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-fa][data-en]').forEach((element) => {
      element.textContent = element.dataset[language];
    });

    document.querySelectorAll('[data-alt-fa][data-alt-en]').forEach((element) => {
      element.alt = element.dataset[`alt${isPersian ? 'Fa' : 'En'}`];
    });

    document.querySelector('.language-current').textContent = isPersian ? 'EN' : 'فا';
    languageToggle.setAttribute('aria-label', translations[language].switchLabel);
    themeToggle.setAttribute('aria-label', translations[language].theme);
    themeToggle.title = translations[language].theme;
    menuToggle.setAttribute('aria-label', translations[language].menuOpen);
    document.title = isPersian ? 'سهیل نیک‌زاد | Soheil Nikzad' : 'Soheil Nikzad | Systems Architect & Product Builder';
    localStorage.setItem('site-language', language);
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('site-theme', theme);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 2200);
  }

  languageToggle.addEventListener('click', () => {
    applyLanguage(root.lang === 'fa' ? 'en' : 'fa');
  });

  themeToggle.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', translations[root.lang][open ? 'menuOpen' : 'menuClose']);
    nav.classList.toggle('open', !open);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', translations[root.lang].menuOpen);
    });
  });

  printResume.addEventListener('click', () => window.print());

  copyContact.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyContact.dataset.copy);
      showToast(translations[root.lang].copied);
    } catch (error) {
      showToast(translations[root.lang].copyFailed);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  year.textContent = new Date().getFullYear();
  applyTheme(getSavedTheme());
  applyLanguage(getSavedLanguage());
})();
