const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function fetchProducts() {
  const r = await fetch(`${API_BASE}/products`);
  return r.json();
}
export async function searchProducts(name) {
  const r = await fetch(`${API_BASE}/products/search?name=${encodeURIComponent(name)}`);
  return r.json();
}
export async function getProductHistory(id) {
  const r = await fetch(`${API_BASE}/products/${id}/history`);
  return r.json();
}
export async function updateProduct(id, data) {
  const r = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!r.ok) {
    const err = await r.json().catch(()=>({error: 'Unknown'}));
    throw err;
  }
  return r.json();
}
export async function importCSV(file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch(`${API_BASE}/products/import`, { method: 'POST', body: fd });
  return r.json();
}
export async function exportCSV() {
  const r = await fetch(`${API_BASE}/products/export`);
  const blob = await r.blob();
  return blob;
}
