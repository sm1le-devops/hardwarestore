
// Анимация появления формы
window.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in');
    fadeEls.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 300);
    });
});

// Отправка формы через fetch
const form = document.querySelector('.order-form');
const submitBtn = form.querySelector('button[type="submit"]');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Делаем кнопку неактивной
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Показать уведомление
            successMessage.style.display = 'block';

            // Редирект через 2 секунды
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            throw new Error('Ошибка при отправке');
        }
    } catch (err) {
        alert('Произошла ошибка при отправке формы. Попробуйте позже.');
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
    }
});
const chatIcon = document.querySelector('.chat-icon');
const chatMenu = document.querySelector('.chat-menu');

chatIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    chatMenu?.classList.toggle('show');
});

chatMenu?.addEventListener('click', (e) => {
    if (e.target === chatMenu) chatMenu.classList.remove('show');
});

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



const langSelect = document.querySelector(".lang-select");
let currentLang = localStorage.getItem("lang") || "ru";

// Функция загрузки JSON с переводом
async function loadLang(lang) {
    try {
        const res = await fetch(`/static/lang/${lang}.json`);
        if (!res.ok) throw new Error("Не удалось загрузить файл перевода");
        const translations = await res.json();

        // Перевод текстов
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[key]) el.textContent = translations[key];
        });

        // Перевод placeholder
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (translations[key]) el.placeholder = translations[key];
        });
    } catch (err) {
        console.error(err);
    }
}

// Смена языка через select
langSelect.addEventListener("change", (e) => {
    const lang = e.target.value === "Русский" ? "ru" : "cs";
    localStorage.setItem("lang", lang);
    loadLang(lang);
});

// Загрузка языка при старте
loadLang(currentLang);
langSelect.value = currentLang === "ru" ? "Русский" : "Czech";
document.documentElement.lang = currentLang;
