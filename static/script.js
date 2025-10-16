// Плавная прокрутка и активные ссылки
const header = document.querySelector('.header');
const headerHeight = header ? header.offsetHeight : 0;

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Активная ссылка
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    this.classList.add('active');

    let targetSection;

    if (this.id === 'contactLink') {
      targetSection = document.querySelector('.contact-info');
    } else {
      const targetId = this.getAttribute('href').substring(1);
      targetSection = document.getElementById(targetId);
    }

    if (targetSection) {
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// Появление карточек при прокрутке
window.addEventListener('scroll', () => {
  document.querySelectorAll('.service').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) el.classList.add('visible');
  });
});

// Скролл карточек (мобильное меню)
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

// Чат
const chatIcon = document.querySelector('.chat-icon');
const chatMenu = document.querySelector('.chat-menu');

chatIcon?.addEventListener('click', (e) => {
  e.preventDefault();
  chatMenu?.classList.toggle('show');
});

// Закрытие меню при клике вне блока
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

// Переход на страницу формы заказа через FastAPI роут
document.querySelector('.chat-btn.order')?.addEventListener('click', () => {
  window.location.href = '/anket';
});

// Закрытие чата крестиком
document.querySelector('.chat-close')?.addEventListener('click', () => {
  chatMenu?.classList.remove('show');
});

window.addEventListener('DOMContentLoaded', () => {
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 300); // каждый элемент появляется с задержкой 300мс
  });
});