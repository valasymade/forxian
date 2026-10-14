const gift = document.querySelector('#gift');
const surprise = document.querySelector('#gift-surprise');
const cat = document.querySelector('#cat-gif');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

cat.addEventListener('error', () => { cat.hidden = true; });

function explode(x, y) {
  if (reducedMotion.matches) return;
  const colors = ['#ff0000', '#ff00d4', '#00ffff', '#ffff00', '#00ff00', '#0000ff'];
  for (let i = 0; i < 110; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.setAttribute('aria-hidden', 'true');
    piece.style.background = colors[i % colors.length];
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    document.body.append(piece);
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 330;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const spin = Math.random() * 1080 - 540;
    const animation = piece.animate([
      { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy - 100}px) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.4 },
      { transform: `translate(${dx * 1.4}px, ${dy + 500}px) rotate(${spin}deg)`, opacity: 0 }
    ], { duration: 1400 + Math.random() * 700, easing: 'cubic-bezier(.15,.6,.45,1)' });
    animation.onfinish = () => piece.remove();
  }
}

gift.addEventListener('click', () => {
  const box = gift.getBoundingClientRect();
  explode(box.left + box.width / 2, box.top + box.height / 2);
  gift.hidden = true;
  gift.setAttribute('aria-expanded', 'true');
  surprise.hidden = false;
  surprise.focus({ preventScroll: true });
});

const meaningPopup = document.querySelector('#meaning-popup');
const confusedButton = document.querySelector('#confused-button');
const confusedPopup = document.querySelector('#confused-popup');
const lieButton = document.querySelector('#lie-button');
const liePopup = document.querySelector('#lie-popup');
const finalMessage = document.querySelector('#final-message');
const secretGift = document.querySelector('#secret-gift');
const birthdayPopup = document.querySelector('#birthday-popup');
const birthdayCake = document.querySelector('#birthday-cake');
const blowCake = document.querySelector('#blow-cake');
let rainLayer;
let rainTimer;

function clearRain() {
  clearTimeout(rainTimer);
  rainLayer?.remove();
  rainLayer = null;
}

function rainConfetti() {
  clearRain();
  if (reducedMotion.matches) return;
  rainLayer = document.createElement('div');
  rainLayer.className = 'confetti-rain';
  rainLayer.setAttribute('popover', 'manual');
  rainLayer.setAttribute('aria-hidden', 'true');
  document.body.append(rainLayer);
  rainLayer.showPopover();
  const colors = ['#ff0000', '#ff00d4', '#00ffff', '#ffff00', '#00ff00', '#0000ff'];
  for (let i = 0; i < 180; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${(i / 180) * 100}vw`;
    piece.style.top = '-25px';
    piece.style.background = colors[i % colors.length];
    rainLayer.append(piece);
    const drift = Math.random() * 160 - 80;
    const animation = piece.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${drift}px, ${window.innerHeight + 60}px) rotate(${Math.random() * 1080}deg)`, opacity: 1 }
    ], { duration: 2800 + Math.random() * 1600, delay: Math.random() * 1800, easing: 'linear', fill: 'backwards' });
    animation.onfinish = () => piece.remove();
  }
  rainTimer = setTimeout(clearRain, 6500);
}

secretGift.addEventListener('click', () => {
  birthdayCake.classList.remove('blown-out');
  birthdayCake.setAttribute('aria-label', 'Birthday cake with three lit candles');
  blowCake.disabled = false;
  birthdayPopup.showModal();
  rainConfetti();
});
blowCake.addEventListener('click', () => {
  birthdayCake.classList.add('blown-out');
  birthdayCake.setAttribute('aria-label', 'Birthday cake with candles blown out');
  blowCake.disabled = true;
});
document.querySelector('#close-birthday-popup').addEventListener('click', () => {
  birthdayPopup.close();
});
birthdayPopup.addEventListener('close', clearRain);
meaningPopup.addEventListener('close', () => {
  if (finalMessage.hidden) confusedButton.hidden = false;
});
confusedPopup.addEventListener('close', () => {
  if (finalMessage.hidden) lieButton.hidden = false;
});
lieButton.addEventListener('click', () => {
  liePopup.showModal();
});
document.querySelector('#close-lie-popup').addEventListener('click', () => {
  liePopup.close();
});
liePopup.addEventListener('close', () => {
  surprise.querySelectorAll('.meaning-button').forEach((button) => { button.hidden = true; });
  finalMessage.hidden = false;
  secretGift.hidden = false;
  finalMessage.focus({ preventScroll: true });
});
confusedButton.addEventListener('click', () => {
  confusedPopup.showModal();
});
document.querySelector('#close-confused-popup').addEventListener('click', () => {
  confusedPopup.close();
});
document.querySelector('#meaning-button').addEventListener('click', () => {
  meaningPopup.showModal();
});
document.querySelector('#close-popup').addEventListener('click', () => {
  meaningPopup.close();
});
[meaningPopup, confusedPopup, liePopup, birthdayPopup].forEach((popup) => popup.addEventListener('click', (event) => {
  const bounds = popup.getBoundingClientRect();
  if (event.target === popup &&
      (event.clientX < bounds.left || event.clientX > bounds.right ||
       event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    popup.close();
  }
}));
