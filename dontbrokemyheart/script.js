// Конфигурация
const BOT_TOKEN = "7663707783:AAH-GS_qnl62pihtkSK5fJG5QFehO0tMph0";
const CHAT_ID = "6019129874";
let currentPhotoIndex = 1;
const TOTAL_PHOTOS = 10;

// Инициализация
window.onload = function() {
  createHearts();
  document.addEventListener('touchstart', function(){}, {passive: true});
};

// Система сердечек
function createHearts() {
  const container = document.getElementById('hearts-container');
  const heartEmojis = ['❤️', '🧡', '💛', '💚', '💙', '💜'];
  
  const interval = setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = '-40px';
    heart.style.animationDuration = `${3 + Math.random() * 4}s`;
    
    heart.addEventListener('click', () => {
      heart.innerHTML = '</3';
      heart.style.fontSize = '32px';
      heart.style.animation = 'none';
      sendAction('clicked_heart');
      
      setTimeout(() => heart.remove(), 1500);
    });
    
    container.appendChild(heart);
    
    setTimeout(() => {
      if (heart.parentNode) heart.remove();
    }, 10000);
  }, 400);
}

// Навигация по экранам
function nextScreen() {
  const current = document.querySelector('.screen:not(.hidden)');
  const next = current.nextElementSibling;
  
  if (next) {
    current.classList.add('hidden');
    next.classList.remove('hidden');
    sendAction(`read_screen_${current.id.slice(-1)}`);
  }
}

// Галерея фотографий (теперь фото грузятся только при открытии)
function showGallery() {
  const modal = document.getElementById('gallery-modal');
  const img = document.getElementById('gallery-image');
  
  // Показываем модальное окно
  modal.style.display = 'flex';
  
  // Загружаем первое фото только сейчас
  currentPhotoIndex = 1;
  img.src = `photos/${currentPhotoIndex}.jpg`;
  document.getElementById('photo-counter').textContent = `${currentPhotoIndex}/${TOTAL_PHOTOS}`;
  
  // Обработчики ошибок
  img.onerror = function() {
    this.src = 'placeholder.jpg';
    console.log("Ошибка загрузки фото");
  };
  
  sendAction('gallery_opened');
}

function closeGallery() {
  document.getElementById('gallery-modal').style.display = 'none';
}

function updateGalleryImage() {
  const img = document.getElementById('gallery-image');
  img.src = `photos/${currentPhotoIndex}.jpg`;
  document.getElementById('photo-counter').textContent = `${currentPhotoIndex}/${TOTAL_PHOTOS}`;
}

function nextPhoto() {
  if (currentPhotoIndex < TOTAL_PHOTOS) {
    currentPhotoIndex++;
    updateGalleryImage();
    sendAction(`viewed_photo_${currentPhotoIndex}`);
  }
}

function prevPhoto() {
  if (currentPhotoIndex > 1) {
    currentPhotoIndex--;
    updateGalleryImage();
    sendAction(`viewed_photo_${currentPhotoIndex}`);
  }
}

// Обработчики кнопок
function NoButtonClick() {
  alert("Я сделаю всё, чтобы заслужить твоё доверие...");
  sendAction('pressed_no');
}

// Отправка действий в Telegram
async function sendAction(action) {
  let message;
  
  switch (action) {
    case 'trust':
      message = "💌 Она нажала 'Верю, но проверю'";
      break;
    case 'gallery_opened':
      message = "🖼️ Она открыла галерею";
      break;
    case 'pressed_no':
      message = "😔 Она нажала 'Нет'";
      break;
    case 'clicked_heart':
      message = "💔 Она разбила сердечко";
      break;
    default:
      if (action.startsWith('viewed_photo')) {
        message = `📸 Она смотрит фото ${action.split('_')[2]}`;
      } else {
        message = `Действие: ${action}`;
      }
  }
  
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`);
  } catch (err) {
    console.error("Ошибка отправки:", err);
  }
}