import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  getAllProducts,
  getFeaturedProducts,
  getTrendingProducts
} from '../services/product';
import {
  getAllCategories,
  getFeaturedCategories
} from '../services/category';
import ProductsCard from '../components/ProductsCard';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  image?: {
    url: string;
    altText?: string;
  };
  rating?: number;
  reviewCount?: number;
  vendor?: {
    businessName: string;
  };
  status: string;
  createdAt: string;
  stockQuantity?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [cartLoading, setCartLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [
          featuredRes,
          trendingRes,
          newArrivalsRes,
          categoriesRes,
          featuredCategoriesRes,
        ] = await Promise.all([
          getFeaturedProducts(8),
          getTrendingProducts(8),
          getAllProducts({ limit: 8, sort: 'newest' }),
          getAllCategories({ limit: 20 }),
          getFeaturedCategories(20),
        ]);

        setFeaturedProducts(featuredRes.data?.data?.products || []);
        setTrendingProducts(trendingRes.data?.data?.products || []);
        setNewArrivals(newArrivalsRes.data?.data?.products || []);
        setCategories(categoriesRes.data?.data?.categories || []);
        setFeaturedCategories(featuredCategoriesRes.data?.data?.categories || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
        {/* Categories Skeleton */}
        <section className="py-10 bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="text-center space-y-2 mb-6">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-full mx-auto" />
              ))}
            </div>
          </div>
        </section>
        {/* Products Skeleton */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        {/* Trending Products Skeleton */}
        <section className="py-10 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        {/* New Arrivals Skeleton */}
        <section className="py-10 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const handleAddToCart = (product:any) => {
    if (!product?.id) return;
    addToCart({ productId: product.id, quantity: 1 });
  };

  // New Arrivals will display all new products for now
  const inhouseProducts = newArrivals;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
      <Separator className="my-8" />
      {/* Reduce separator margin */}
      <Separator className="my-2" />

      {/* Featured Categories - Circle Grid */}
      <section className="py-4 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center space-y-2 mb-4 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              Explore our carefully curated categories designed for every lifestyle and occasion
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {categories.map((category, index) => (
              <Link to={`/category/${category.slug}`} key={category.id} className={`group flex flex-col items-center justify-center p-1 md:p-2 cursor-pointer border-0 shadow-none hover:shadow-md transition-all duration-200 bg-transparent animate-scale-in animate-stagger-${index + 1}`}>
                <div className="relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-indigo-500 transition-all duration-200 bg-white">
                  <img 
                    src={category.image || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                  />
                </div>
                <div className="mt-1 text-center">
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-xs md:text-sm truncate max-w-[70px] md:max-w-[90px]">
                    {category.name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500">
                    {category.productCount || 0} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Inhouse Products Section */}
      {inhouseProducts.length > 0 && (
        <section className="py-4 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="space-y-1 md:space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Our Inhouse Picks</h2>
                <p className="text-sm md:text-base text-slate-600">Exclusive products from our own brand</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-2 bg-gradient-to-br from-yellow-50 via-orange-50 to-white rounded-2xl shadow-inner">
              <ProductsCard 
                products={inhouseProducts}
                cardClassName="max-w-xs w-72 mx-auto"
                imageClassName="h-32 md:h-40"
                buttonText="Add to Cart"
                showPrice={true}
                showRating={true}
                showVendor={true}
                showStatus={true}
                onProductClick={(product) => navigate(`/products/${product.slug}`)}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </section>
      )}

      {/* Featured Products - Bento Grid */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="space-y-1 md:space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-sm md:text-base text-slate-600">Handpicked for you</p>
            </div>
            <Button 
              variant="outline" 
              className="border border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => navigate('/products')}
            >
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-2 bg-gradient-to-br from-white via-slate-50 to-indigo-50 rounded-2xl shadow-inner">
            <ProductsCard 
              products={featuredProducts.slice(0, 5)} 
              cardClassName="max-w-xs w-72 mx-auto" 
              imageClassName="h-32 md:h-40" 
              buttonText="Add to Cart"
              showPrice={true}
              showRating={true}
              showVendor={true}
              showStatus={true}
              onProductClick={(product) => navigate(`/products/${product.slug}`)}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Trending Now</h2>
              <p className="text-sm md:text-base text-slate-600">What's hot this season</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-2 bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-2xl shadow-inner">
            <ProductsCard 
              products={trendingProducts.slice(0, 5)} 
              cardClassName="max-w-xs w-72 mx-auto" 
              imageClassName="h-32 md:h-40" 
              buttonText="Add to Cart"
              showPrice={true}
              showRating={true}
              showVendor={true}
              showStatus={true}
              onProductClick={(product) => navigate(`/products/${product.slug}`)}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </section>

      {/* New Arrivals - Bento Grid */}
      <section className="py-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">New Arrivals</h2>
              <p className="text-sm md:text-base text-slate-600">Fresh products just in</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-2 bg-gradient-to-br from-indigo-50 via-purple-50 to-white rounded-2xl shadow-inner">
            <ProductsCard 
              products={newArrivals.slice(0, 5)} 
              cardClassName="max-w-xs w-72 mx-auto" 
              imageClassName="h-32 md:h-40" 
              buttonText="Add to Cart"
              showPrice={true}
              showRating={true}
              showVendor={true}
              showStatus={true}
              onProductClick={(product) => navigate(`/products/${product.slug}`)}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;