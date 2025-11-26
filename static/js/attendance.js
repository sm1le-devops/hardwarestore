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

  document.querySelector(".filter-panel h3")?.addEventListener("click", () => {
    filterPanel?.classList.toggle("open");
  });
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

    // Если ничего не выбрано — показываем все карточки
    if (activeCategories.length === 0) {
      cards.forEach(card => card.classList.remove("hidden"));
      return;
    }

    // Если выбрано что-то — показываем только выбранные
    cards.forEach(card => {
      const category = card.dataset.category;
      if (activeCategories.includes(category)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }
  applyFilters();
  checkboxes.forEach(cb => cb.addEventListener("change", applyFilters));

  document.querySelectorAll(".filter-toggle").forEach(toggle => {
    const group = toggle.parentElement;

    // По клику переключаем open
    toggle.addEventListener("click", () => {
      group.classList.toggle("open");
    });

    // По умолчанию раскрыть все группы
    group.classList.add("open");
  });
  // ===== Поиск =====
  const searchInput = document.getElementById('serviceSearch');
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    cards.forEach(card => {
      const h3 = card.querySelector("h3");
      const titleText = h3 ? h3.textContent.toLowerCase() : "";
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
  window.location.href = 'tel:+420912345678';
});

document.querySelector('.chat-btn.order')?.addEventListener('click', () => {
  window.location.href = '/anket';
});


const langSelect = document.querySelector(".lang-select");
let currentLang = localStorage.getItem("lang") || "ru";

async function loadLang(lang) {
  try {
    const res = await fetch(`/static/lang/${lang}.json`);
    if (!res.ok) throw new Error("Не удалось загрузить файл перевода");
    const translations = await res.json();

    const getNested = (obj, path) => path.split('.').reduce((o, k) => (o || {})[k], obj);

    // Перевод элементов с data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const text = getNested(translations, key);
      if (text) el.textContent = text;
    });

    // Перевод placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const text = getNested(translations, key);
      if (text) el.placeholder = text;
    });

    // Перевод категорий карточек
    document.querySelectorAll(".service-card h3").forEach(el => {
      const category = el.closest(".service-card")?.dataset.category;
      const text = getNested(translations, `categories.${category}`);
      if (text) el.textContent = text;
    });

    // Перевод фильтров
    document.querySelectorAll(".filter-checkbox").forEach(el => {
      const category = el.dataset.category;
      const label = el.closest("label");
      const text = getNested(translations, `categories.${category}`);
      const span = label.querySelector("span");
      if (span) span.textContent = text;
    });

  } catch (err) {
    console.error(err);
  }
}

// Смена языка
langSelect?.addEventListener("change", e => {
  const lang = e.target.value === "Czech" ? "cs" : "ru";
  localStorage.setItem("lang", lang);
  loadLang(lang);
});

// Инициализация языка при загрузке
loadLang(currentLang);
langSelect.value = currentLang === "ru" ? "Русский" : "Czech";
document.documentElement.lang = currentLang;