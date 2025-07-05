// Конфигурация Telegram
const BOT_TOKEN = "7663707783:AAH-GS_qnl62pihtkSK5fJG5QFehO0tMph0";
const CHAT_ID = "6019129874";

// Переключение экранов
function nextScreen() {
  const current = document.querySelector('.screen:not(.hidden)');
  const next = current.nextElementSibling;
  
  if (next) {
    current.classList.add('hidden');
    next.classList.remove('hidden');
    sendAction(`read_screen_${current.id.slice(-1)}`);
  }
}

// Отправка действия в Telegram
async function sendAction(action) {
  let message;
  
  switch (action) {
    case 'trust':
      message = "💌 Она нажала 'Верю, но проверю'";
      break;
    case 'showMore':
      message = "📸 Она хочет увидеть больше";
      showGallery();
      break;
    case 'clicked_heart':
      message = "💔 Она разбила сердечко";
      break;
    case 'NoButton':
      message = "😔 Она нажала 'Нет'";
      NoButtonClick();
      break;
    default:
      message = `Действие: ${action}`;
  }
  
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`);
  } catch (err) {
    console.error("Ошибка отправки:", err);
  }
}

// Вспомогательные функции
function showGallery() {
  alert("Здесь будут наши лучшие моменты...");
}

function NoButtonClick() {
  alert("Я сделаю всё, чтобы заслужить твоё доверие...");
}

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

// Инициализация
window.onload = function() {
  createHearts();
  document.addEventListener('touchstart', function(){}, {passive: true});
};