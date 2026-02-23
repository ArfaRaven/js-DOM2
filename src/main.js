import { fetchImages } from './api.js';
import { render, slide, resetCurrent, setStatus } from './gallery.js';

let images = [];
let page = 1;

async function loadMore() {
  setStatus('Завантаження...', true);
  try {
    const newImgs = await fetchImages(page);
    images = [...images, ...newImgs];
    page++;
    render(images);
    setStatus(`Зображень у галереї: ${images.length}`);
  } catch (e) {
    setStatus('Помилка завантаження');
  }
}

function clearGallery() {
  images = [];
  page = 1;
  resetCurrent();
  render(images);
  setStatus('Галерею очищено');
}

function removeLast() {
  if (images.length === 0) return;
  images.pop();
  render(images);
  setStatus(`Зображень у галереї: ${images.length}`);
}

function flipGallery() {
  if (images.length === 0) return;
  images.reverse();
  resetCurrent();
  render(images);
  setStatus('Галерею перевернуто');
}

document.getElementById('prevBtn').addEventListener('click', () => slide(-1, images));
document.getElementById('nextBtn').addEventListener('click', () => slide(1, images));
document.querySelector('[data-action="load"]').addEventListener('click', loadMore);
document.querySelector('[data-action="flip"]').addEventListener('click', flipGallery);
document.querySelector('[data-action="remove"]').addEventListener('click', removeLast);
document.querySelector('[data-action="clear"]').addEventListener('click', clearGallery);

loadMore();
