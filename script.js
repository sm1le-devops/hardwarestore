// Плавная прокрутка и активные ссылки
const header = document.querySelector('.header');
const headerHeight = header.offsetHeight;

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Снимаем класс active со всех ссылок и ставим на текущую
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    this.classList.add('active');

    // Определяем целевой блок
    let targetSection;

    // Если это ссылка "Контакты", скроллим к .contact-info
    if (this.id === 'contactLink') {
      targetSection = document.querySelector('.contact-info');
    } else {
      const targetId = this.getAttribute('href').substring(1);
      targetSection = document.getElementById(targetId);
    }

    // Скроллим с учётом шапки и плавно
    if (targetSection) {
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10; // 10px отступ сверху
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// Появление карточек при прокрутке
window.addEventListener('scroll', () => {
  document.querySelectorAll('.service').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add('visible');
    }
  });
});

// Мобильное меню - скролл карточек
const container = document.getElementById("servicesContainer");
const leftBtn = document.getElementById("scrollLeft");
const rightBtn = document.getElementById("scrollRight");

const service = container.querySelector(".service");
const serviceWidth = service.offsetWidth + 20; // ширина карточки + gap

rightBtn.addEventListener("click", () => {
  container.scrollLeft += serviceWidth;
  if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
    setTimeout(() => container.scrollLeft = 0, 300);
  }
});

leftBtn.addEventListener("click", () => {
  container.scrollLeft -= serviceWidth;
  if (container.scrollLeft <= 0) {
    setTimeout(() => container.scrollLeft = container.scrollWidth - container.offsetWidth, 300);
  }
});
