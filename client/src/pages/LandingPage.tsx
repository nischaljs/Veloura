import {
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductsCard from '../components/ProductsCard';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { useCart } from '../context/CartContext';
import {
  getAllCategories,
  getFeaturedCategories
} from '../services/category';
import {
  getAllProducts,
  getFeaturedProducts,
  getTrendingProducts
} from '../services/product';

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
  // Add loading state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
      <Separator className="my-12" />
      {/* Featured Categories - Circle Grid */}
      <section className="py-10 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center space-y-3 mb-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our carefully curated categories designed for every lifestyle and occasion
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link to={`/category/${category.slug}`} key={category.id} aria-label={category.name} className={`group flex flex-col items-center justify-center p-2 cursor-pointer border-0 shadow-none hover:shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-300 transition-all duration-200 bg-white rounded-full animate-scale-in animate-stagger-${index + 1}`}> 
                <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-indigo-500 transition-all duration-200 bg-white">
                  <img 
                    src={category.image || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" 
                  />
                </div>
                <div className="mt-2 text-center">
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm md:text-base truncate max-w-[90px] md:max-w-[110px]">
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500">
                    {category.productCount || 0} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Separator className="my-12" />
      {/* Inhouse Products Section */}
      {inhouseProducts.length > 0 && (
        <section className="py-10 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Our Inhouse Picks</h2>
                <p className="text-base md:text-lg text-slate-600">Exclusive products from our own brand</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 p-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-white rounded-3xl shadow-xl">
              {inhouseProducts.map(product => (
                <ProductsCard 
                  key={product.id}
                  product={product}
                  cardClassName="max-w-xs w-64 mx-auto hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-orange-300 transition-all"
                  imageClassName="h-40 md:h-48"
                  buttonText="Add to Cart"
                  showPrice={true}
                  showVendor={true}
                  showStatus={true}
                  onProductClick={(product) => navigate(`/products/${product.slug}`)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <Separator className="my-12" />
      {/* Featured Products - Bento Grid */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Featured Products</h2>
              <p className="text-base md:text-lg text-slate-600">Handpicked for you</p>
            </div>
            <Button 
              variant="outline" 
              className="border border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-300 font-semibold px-6 py-2 rounded-lg"
              onClick={() => navigate('/products')}
            >
              View All
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 p-8 bg-gradient-to-br from-white via-slate-50 to-indigo-50 rounded-3xl shadow-xl">
            {featuredProducts.slice(0, 5).map(product => (
              <ProductsCard 
                key={product.id}
                product={product}
                cardClassName="max-w-xs w-64 mx-auto hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-indigo-300 transition-all" 
                imageClassName="h-40 md:h-48" 
                buttonText="Add to Cart"
                showPrice={true}
                showVendor={true}
                showStatus={true}
                onProductClick={(product) => navigate(`/products/${product.slug}`)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
      <Separator className="my-12" />
      {/* Trending Products */}
      <section className="py-10 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Trending Now</h2>
              <p className="text-base md:text-lg text-slate-600">What's hot this season</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-3xl shadow-xl">
            {trendingProducts.slice(0, 5).map(product => (
              <ProductsCard 
                key={product.id}
                product={product}
                cardClassName="max-w-xs w-64 mx-auto hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-purple-300 transition-all" 
                imageClassName="h-40 md:h-48" 
                buttonText="Add to Cart"
                showPrice={true}
                showVendor={true}
                showStatus={true}
                onProductClick={(product) => navigate(`/products/${product.slug}`)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
      <Separator className="my-12" />
      {/* New Arrivals - Bento Grid */}
      <section className="py-10 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <Zap className="w-8 h-8 text-indigo-600" />
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">New Arrivals</h2>
              <p className="text-base md:text-lg text-slate-600">Fresh products just in</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-white rounded-3xl shadow-xl">
            {newArrivals.slice(0, 5).map(product => (
              <ProductsCard 
                key={product.id}
                product={product}
                cardClassName="max-w-xs w-64 mx-auto hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-indigo-300 transition-all" 
                imageClassName="h-40 md:h-48" 
                buttonText="Add to Cart"
                showPrice={true}
                showVendor={true}
                showStatus={true}
                onProductClick={(product) => navigate(`/products/${product.slug}`)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;