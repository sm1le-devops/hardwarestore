// ===== Мобильное меню =====
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");
if (menuToggle && navbar) {
  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("show");
  });
}

// ===== ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ =====
document.addEventListener("DOMContentLoaded", () => {
  const filterPanel = document.querySelector(".filter-panel");
  const searchWrapper = document.querySelector(".search-wrapper"); // строка поиска
  const title = document.querySelector(".cards-title");
  const cards = document.querySelectorAll(".service-card");

  // 1️⃣ Появление фильтра
  setTimeout(() => filterPanel.classList.add("visible"), 200);

  // 2️⃣ Появление строки поиска и заголовка почти сразу после фильтра
  setTimeout(() => {
    searchWrapper?.classList.add("visible");
    title.classList.add("visible");
  }, 500);

  // 3️⃣ Карточки поочередно, каждая через 0.12 с
  cards.forEach((card, index) => {
    const delay = 600 + index * 120; // начало через 0.6 с, шаг 0.12 с
    setTimeout(() => {
      card.classList.add("visible");
      card.style.setProperty("--delay", `${index * 0.12}s`);
    }, delay);
  });

  // ===== Фильтр карточек =====
  const checkboxes = document.querySelectorAll(".filter-checkbox");

  function applyFilters() {
    const activeCategories = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.dataset.category);

    cards.forEach(card => {
      const category = card.dataset.category;
      if (activeCategories.includes(category)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }

  checkboxes.forEach(cb => cb.addEventListener("change", applyFilters));
  applyFilters();

  // ===== Поиск =====
  const searchInput = document.getElementById('serviceSearch');
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    cards.forEach(card => {
      const titleText = card.querySelector('h3').textContent.toLowerCase();
      if (titleText.includes(query)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== Ховер карточек =====
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.03)";
    card.style.filter = "brightness(1.2)";
    card.style.boxShadow =
      "0 12px 30px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.filter = "";
    card.style.boxShadow = "";
  });
});

const chatIcon = document.querySelector('.chat-icon');
const chatMenu = document.querySelector('.chat-menu');

// открыть/закрыть меню
chatIcon?.addEventListener('click', e => {
  e.preventDefault();
  chatMenu?.classList.toggle('show');
});

// закрытие по клику вне контента
chatMenu?.addEventListener('click', e => {
  if (e.target === chatMenu) chatMenu.classList.remove('show');
});

// закрытие по кнопке
document.querySelector('.chat-close')?.addEventListener('click', () => {
  chatMenu?.classList.remove('show');
});

// кнопки связи
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
