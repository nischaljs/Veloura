export async function fetchCategories(limit = 100) {
  const res = await fetch(`http://localhost:5000/api/categories?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchCategoryTree() {
  const res = await fetch('http://localhost:5000/api/categories/tree');
  if (!res.ok) throw new Error('Failed to fetch category tree');
  return res.json();
}

export async function fetchCategoryBySlug(slug: string) {
  const res = await fetch(`http://localhost:5000/api/categories/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
} 