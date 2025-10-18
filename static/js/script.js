// ===== Плавная прокрутка и активные ссылки =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (href.startsWith('#')) {
      e.preventDefault();

      // Активная ссылка
      document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
      this.classList.add('active');

      let targetSection;
      if (this.id === 'contactLink') {
        targetSection = document.getElementById('contact-inf');
      } else {
        const targetId = href.substring(1);
        targetSection = document.getElementById(targetId);
      }

      if (targetSection) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
  });
});

// ===== Скролл карточек (мобильное меню) =====
const container = document.getElementById("servicesContainer");
if (container) {
  const leftBtn = document.getElementById("scrollLeft");
  const rightBtn = document.getElementById("scrollRight");
  const service = container.querySelector(".service");
  const serviceWidth = service ? service.offsetWidth + 20 : 0;

  rightBtn?.addEventListener("click", () => {
    container.scrollLeft += serviceWidth;
    if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
      setTimeout(() => container.scrollLeft = 0, 300);
    }
  });

  leftBtn?.addEventListener("click", () => {
    container.scrollLeft -= serviceWidth;
    if (container.scrollLeft <= 0) {
      setTimeout(() => container.scrollLeft = container.scrollWidth - container.offsetWidth, 300);
    }
  });
}

// ===== Чат =====
const chatIcon = document.querySelector('.chat-icon');
const chatMenu = document.querySelector('.chat-menu');

chatIcon?.addEventListener('click', (e) => {
  e.preventDefault();
  chatMenu?.classList.toggle('show');
});

chatMenu?.addEventListener('click', (e) => {
  if (e.target === chatMenu) chatMenu.classList.remove('show');
});

// Кнопки чата
document.querySelector('.chat-btn.whatsapp')?.addEventListener('click', () => {
  window.open('https://wa.me/42091234567', '_blank');
});
document.querySelector('.chat-btn.email')?.addEventListener('click', () => {
  const myEmail = 'example154@gmail.com';
  const subject = 'Посетитель сайта';
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(myEmail)}&su=${encodeURIComponent(subject)}`;
  window.open(gmailUrl, '_blank');
});
document.querySelector('.chat-btn.phone')?.addEventListener('click', () => {
  window.location.href = 'tel:+420 xxx xxx xxx';
});
document.querySelector('.chat-btn.order')?.addEventListener('click', () => {
  window.location.href = '/anket';
});
document.querySelector('.chat-close')?.addEventListener('click', () => {
  chatMenu?.classList.remove('show');
});

// ===== Fade-in элементов =====
window.addEventListener('DOMContentLoaded', () => {
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 300);
  });
});

// ===== Счётчики =====
const counters = document.querySelectorAll('.number');
const options = { threshold: 0.5 };

const startCounting = (entry) => {
  if (!entry.isIntersecting) return;
  const counter = entry.target;
  const target = +counter.dataset.target;
  let current = 0;

  const update = () => {
    current += Math.ceil(target / 100);
    if (current < target) {
      counter.textContent = current;
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  };
  update();
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(startCounting);
}, options);

counters.forEach(counter => observer.observe(counter));

// ===== Появление контейнера и карточек при скролле =====
const servicesInner = document.querySelector('.services-inner');
const serviceCards = document.querySelectorAll('.service');
const containerObserverOptions = { threshold: 0.2 };

if (servicesInner) {
  const containerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Появление контейнера
        servicesInner.classList.add('visible');

        // Появление карточек поочередно
        serviceCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, index * 200); // задержка между карточками
        });

        observer.unobserve(entry.target);
      }
    });
  }, containerObserverOptions);

  containerObserver.observe(servicesInner);
}
