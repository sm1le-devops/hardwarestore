
function renderReviews(translations) {
    const reviewsTitle = translations.reviews.reviewsTitle;
    const reviews = translations.reviews.reviews;

    document.getElementById('reviews-title').textContent = reviewsTitle;

    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = "";
    reviews.forEach(review => {
        const div = document.createElement('div');
        div.className = "review";
        div.innerHTML = `<strong>${review.name}:</strong> ${review.text}`;
        reviewsList.appendChild(div);
    });
}

// === Анимации ===
const faders = document.querySelectorAll('.fade-in');
const appear = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            appear.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
faders.forEach(f => appear.observe(f));

// === Навигация при скролле ===
const sections = document.querySelectorAll("section");
const navDots = document.querySelectorAll(".side-nav a");

function updateActiveDot() {
    let current = "";
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop) current = sec.getAttribute("id");
    });
    navDots.forEach(dot => {
        dot.classList.remove("active");
        if (dot.getAttribute("href") === "#" + current) {
            dot.classList.add("active");
        }
    });
}
window.addEventListener("scroll", updateActiveDot);
window.addEventListener("load", updateActiveDot);

// === Меню для мобильных ===
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
menuToggle.onclick = () => {
    const isVisible = navbar.style.display === 'flex';
    navbar.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
        navbar.style.flexDirection = 'column';
        navbar.style.background = 'rgba(0,0,0,0.9)';
        navbar.style.position = 'absolute';
        navbar.style.top = '60px';
        navbar.style.right = '50px';
        navbar.style.padding = '20px';
        navbar.style.borderRadius = '10px';
    }
};

// === Языки ===
const langSelect = document.querySelector(".lang-select");
let currentLang = localStorage.getItem("lang") || "ru";

async function loadLang(lang) {
    try {
        const res = await fetch(`/static/lang/${lang}.json`);
        const translations = await res.json();

        // Если на странице есть категория, загружаем её данные
        const category = document.querySelector("[data-category]")?.dataset.category;
        const ad = translations.servicesList.find(s => s.category === category);

        // --- Тексты из JSON по ключам data-i18n ---
        const getNested = (obj, path) =>
            path.split('.').reduce((o, k) => (o ? o[k] : null), obj);

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            let text = getNested(translations, key);

            // Замена {{ ad.title }} и {{ ad.category }}
            if (text && ad) {
                text = text.replace(/\{\{\s*ad\.title\s*\}\}/g, ad.title);
                const categoryText = getNested(translations, "categories." + ad.category) || ad.category;
                text = text.replace(/\{\{\s*ad\.category\s*\}\}/g, categoryText);
            }

            if (el.tagName === "A" && el.hasAttribute("data-title")) {
                el.setAttribute("data-title", text || el.getAttribute("data-title"));
            } else if (text) {
                el.textContent = text;
            }

        });
        if (translations.reviews) {
            renderReviews(translations);
        }
        // --- Если это страница услуги, заполним динамически контент ---
        if (ad) {
            document.querySelector("h1").textContent = ad.title;
            document.querySelector("#description p").textContent = ad.description;

            const featuresContainer = document.querySelector(".features-list");
            if (featuresContainer) {
                featuresContainer.innerHTML = ""; // очистить
                Object.entries(ad.features).forEach(([main, subs]) => {
                    const li = document.createElement("li");
                    li.textContent = main;
                    const subList = document.createElement("ul");
                    subList.className = "sub-list";
                    subs.forEach(sub => {
                        const subLi = document.createElement("li");
                        subLi.textContent = sub;
                        subList.appendChild(subLi);
                    });
                    li.appendChild(subList);
                    featuresContainer.appendChild(li);
                });
            }
        }

    } catch (err) {
        console.error("Ошибка загрузки перевода:", err);
    }
}

langSelect?.addEventListener("change", e => {
    const lang = e.target.value === "Czech" ? "cs" : "ru";
    localStorage.setItem("lang", lang);
    loadLang(lang);
});

loadLang(currentLang);
langSelect.value = currentLang === "ru" ? "Русский" : "Czech";
document.documentElement.lang = currentLang;

