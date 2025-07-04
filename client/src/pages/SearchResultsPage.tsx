import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/search';
import ProductsCard from '../components/ProductsCard';
import { Card } from '../components/ui/card';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (!q) return;
    setLoading(true);
    setError(null);
    searchProducts({ q })
      .then(res => setProducts(res.data.data.products || []))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">Search Results</h2>
        <div className="text-gray-600 mb-4">Showing results for: <span className="font-semibold">{query}</span></div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && products.length === 0 && <div>No products found.</div>}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductsCard 
              products={products} 
              onProductClick={(product) => navigate(`/products/${product.slug}`)}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default SearchResultsPage; 