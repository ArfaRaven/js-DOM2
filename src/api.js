export async function fetchImages(page, limit = 4) {
  const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Помилка мережі');
  const data = await response.json();
  return data.map(item => ({
    id: item.id,
    author: item.author,
    url: item.download_url
  }));
}
