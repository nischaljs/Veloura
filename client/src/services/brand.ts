import axios from 'axios';

export async function fetchBrands(limit = 100) {
  const res = await axios.get(`http://localhost:5000/api/brands?limit=${limit}`);
  return res.data;
}

export async function fetchBrandBySlug(slug: string) {
  const res = await axios.get(`http://localhost:5000/api/brands/${slug}`);
  return res.data;
} 