let current = 0;

export function render(images) {
  const track = document.getElementById('sliderTrack');
  const empty = document.getElementById('emptyState');
  const dots = document.getElementById('dots');

  if (images.length === 0) {
    track.innerHTML = '';
    track.appendChild(empty);
    empty.style.display = 'flex';
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true;
    dots.innerHTML = '';
    return;
  }

  if (current >= images.length) current = images.length - 1;

  track.innerHTML = images.map((img, i) => `
    <div class="slide">
      <img src="${img.url}" alt="Фото ${i + 1}" loading="lazy">
      <span class="slide-num">${img.author ? '© ' + img.author + ' &nbsp;·&nbsp; ' : ''}${i + 1} / ${images.length}</span>
    </div>
  `).join('');

  track.style.transform = `translateX(-${current * 100}%)`;

  dots.innerHTML = images.map((_, i) =>
    `<div class="dot ${i === current ? 'active' : ''}" data-index="${i}"></div>`
  ).join('');

  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index), images));
  });

  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === images.length - 1;
}

export function slide(dir, images) {
  current = Math.max(0, Math.min(images.length - 1, current + dir));
  document.getElementById('sliderTrack').style.transform = `translateX(-${current * 100}%)`;
  updateDots();
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === images.length - 1;
}

export function goTo(i, images) {
  current = i;
  document.getElementById('sliderTrack').style.transform = `translateX(-${current * 100}%)`;
  updateDots();
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === images.length - 1;
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}

export function resetCurrent() {
  current = 0;
}

export function setStatus(msg, loading = false) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = loading ? 'loading' : '';
}
