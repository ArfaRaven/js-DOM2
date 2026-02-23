let images = [];
let current = 0;
let page = 1;

async function loadMore() {
  setStatus('Завантаження...', true);
  try {
    const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=4`);
    const data = await res.json();
    const newImgs = data.map(item => ({
      id: item.id,
      author: item.author,
      url: item.download_url
    }));
    images = [...images, ...newImgs];
    page++;
    render();
    setStatus(`Зображень у галереї: ${images.length}`);
  } catch (e) {
    setStatus('Помилка завантаження');
  }
}

function render() {
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
    `<div class="dot ${i === current ? 'active' : ''}" onclick="goTo(${i})"></div>`
  ).join('');

  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === images.length - 1;
}

function slide(dir) {
  current = Math.max(0, Math.min(images.length - 1, current + dir));
  document.getElementById('sliderTrack').style.transform = `translateX(-${current * 100}%)`;
  updateDots();
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === images.length - 1;
}

function goTo(i) {
  current = i;
  document.getElementById('sliderTrack').style.transform = `translateX(-${current * 100}%)`;
  updateDots();
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === images.length - 1;
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}

function clearGallery() {
  images = [];
  page = 1;
  current = 0;
  render();
  setStatus('Галерею очищено');
}

function removeLast() {
  if (images.length === 0) return;
  images.pop();
  if (current >= images.length && current > 0) current = images.length - 1;
  render();
  setStatus(`Зображень у галереї: ${images.length}`);
}

function flipGallery() {
  if (images.length === 0) return;
  images.reverse();
  current = 0;
  render();
  setStatus('Галерею перевернуто');
}

function setStatus(msg, loading = false) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = loading ? 'loading' : '';
}

// Init
loadMore();
