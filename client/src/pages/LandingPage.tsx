import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';
import { AspectRatio } from '../components/ui/aspect-ratio';
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
import { 
  getAllBrands, 
  getFeaturedBrands 
} from '../services/brand';
import ProductsCard from '../components/ProductsCard';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Heart,
  ShoppingBag,
  Award,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

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
  brand?: {
    name: string;
    slug: string;
  };
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

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  productCount?: number;
}

function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([]);
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
          brandsRes,
          featuredBrandsRes
        ] = await Promise.all([
          getFeaturedProducts(8),
          getTrendingProducts(8),
          getAllProducts({ limit: 8, sort: 'newest' }),
          getAllCategories({ limit: 20 }), // Increased limit
          getFeaturedCategories(20), // Increased limit
          getAllBrands({ limit: 20 }), // Increased limit
          getFeaturedBrands(20) // Increased limit
        ]);

        setFeaturedProducts(featuredRes.data?.data?.products || []);
        setTrendingProducts(trendingRes.data?.data?.products || []);
        setNewArrivals(newArrivalsRes.data?.data?.products || []);
        setCategories(categoriesRes.data?.data?.categories || []);
        setFeaturedCategories(featuredCategoriesRes.data?.data?.categories || []);
        setBrands(brandsRes.data?.data?.brands || []);
        setFeaturedBrands(featuredBrandsRes.data?.data?.brands || []);
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
        {/* Hero Section Skeleton */}
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6 items-center">
              {/* Left Column Skeleton */}
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="w-32 h-8 mb-4" />
                <Skeleton className="w-2/3 h-16 mb-4" />
                <Skeleton className="w-1/2 h-6 mb-4" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-12 w-40 rounded-xl" />
                  <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-8">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              </div>
              {/* Right Column Skeleton */}
              <div className="lg:col-span-1 relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Skeleton className="w-full h-full rounded-3xl" />
              </div>
            </div>
          </div>
        </section>
        {/* Features Section Skeleton */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        <Separator />
        {/* Categories Skeleton */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="text-center space-y-4 mb-8">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-full mx-auto" />
              ))}
            </div>
          </div>
        </section>
        {/* Products Skeleton */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        {/* Trending Products Skeleton */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        {/* Brands Skeleton */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="text-center space-y-4 mb-8 md:mb-12">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        {/* New Arrivals Skeleton */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const heroProduct = featuredProducts[0] || trendingProducts[0];
  const heroImage = heroProduct?.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
      {/* Hero Section - Bento Box Inspired */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            {/* Left Column - Text Content */}
            <div className="lg:col-span-2 space-y-8 animate-slide-in-left">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-scale-in bg-purple-200 text-purple-800">
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Collection 2024
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent animate-gradient-shift">
                  Discover Your
                  <br />
                  <span className="text-slate-900">Next Favorite</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                  Explore a curated selection of premium products, blending innovation with timeless style.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow"
                  onClick={() => navigate('/search')}
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-slate-300 text-slate-700 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300"
                  onClick={() => navigate('/categories')}
                >
                  Browse Categories
                </Button>
              </div>

              {/* Stats - Integrated into the bento feel */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <Card className="p-4 text-center bg-white/70 backdrop-blur-sm shadow-md rounded-xl animate-stagger-1">
                  <div className="text-3xl font-bold text-indigo-600">{featuredProducts.length}+</div>
                  <div className="text-sm text-slate-500">Featured Products</div>
                </Card>
                <Card className="p-4 text-center bg-white/70 backdrop-blur-sm shadow-md rounded-xl animate-stagger-2">
                  <div className="text-3xl font-bold text-purple-600">{categories.length}+</div>
                  <div className="text-sm text-slate-500">Categories</div>
                </Card>
                <Card className="p-4 text-center bg-white/70 backdrop-blur-sm shadow-md rounded-xl animate-stagger-3">
                  <div className="text-3xl font-bold text-pink-600">{brands.length}+</div>
                  <div className="text-sm text-slate-500">Premium Brands</div>
                </Card>
              </div>
            </div>

            {/* Right Column - Hero Image (Bento Style) */}
            <div className="lg:col-span-1 relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl animate-slide-in-right group">
              {heroImage && (
                <img 
                  src={heroImage} 
                  alt={heroProduct?.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="font-semibold text-2xl mb-1">{heroProduct?.name || 'Featured Product'}</h3>
                <p className="text-lg text-gray-200">{heroProduct?.brand?.name || 'Explore Now'}</p>
                <Button size="sm" className="mt-3 bg-white text-indigo-600 hover:bg-gray-100">
                  View Product
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-3 animate-fade-in animate-stagger-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Free Shipping</h3>
              <p className="text-sm text-slate-500">On orders over Rs.5000</p>
            </div>
            <div className="text-center space-y-3 animate-fade-in animate-stagger-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Easy Returns</h3>
              <p className="text-sm text-slate-500">30-day return policy</p>
            </div>
            <div className="text-center space-y-3 animate-fade-in animate-stagger-3">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Secure Payment</h3>
              <p className="text-sm text-slate-500">100% secure checkout</p>
            </div>
            <div className="text-center space-y-3 animate-fade-in animate-stagger-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Quality Guarantee</h3>
              <p className="text-sm text-slate-500">Premium products only</p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Featured Categories - Circle Grid */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center space-y-4 mb-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our carefully curated categories designed for every lifestyle and occasion
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link to={`/category/${category.slug}`} key={category.id} className={`group flex flex-col items-center justify-center p-2 md:p-3 cursor-pointer border-0 shadow-none hover:shadow-md transition-all duration-200 bg-transparent animate-scale-in animate-stagger-${index + 1}`}>
                <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-indigo-500 transition-all duration-200 bg-white">
                  <img 
                    src={category.image || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                  />
                </div>
                <div className="mt-2 text-center">
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-xs md:text-sm truncate max-w-[80px] md:max-w-[100px]">
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

      {/* Featured Products - Bento Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="space-y-1 md:space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-base md:text-xl text-slate-600">Handpicked for you</p>
            </div>
            <Button 
              variant="outline" 
              className="border border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => navigate('/search')}
            >
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {featuredProducts.slice(0, 5).map((product, index) => (
              <Card 
                key={product.id} 
                className={`group cursor-pointer border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/90 backdrop-blur-sm rounded-xl animate-scale-in animate-stagger-${index + 1}`}
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="relative mb-2 md:mb-3">
                    <AspectRatio ratio={1} className="rounded-lg overflow-hidden">
                      <img 
                        src={product.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                      />
                    </AspectRatio>
                    {product.status === 'ACTIVE' && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-xs px-2 py-0.5 rounded">
                        In Stock
                      </Badge>
                    )}
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute top-2 right-2 w-7 h-7 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={e => e.stopPropagation()}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {product.brand && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {product.brand.name}
                        </Badge>
                      )}
                      {product.rating && (
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-slate-600">{product.rating}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm md:text-base">{product.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-bold text-indigo-600">Rs.{product.price}</span>
                      <Button 
                        size="icon" 
                        className="bg-indigo-600 hover:bg-indigo-700 w-8 h-8" 
                        onClick={async e => {
                          e.stopPropagation();
                          setCartLoading(prev => ({ ...prev, [product.id]: true }));
                          try {
                            await addToCart({ productId: product.id, quantity: 1 });
                            toast.success('Added to cart!');
                          } catch (err) {
                            toast.error('Failed to add to cart');
                          } finally {
                            setCartLoading(prev => ({ ...prev, [product.id]: false }));
                          }
                        }}
                        disabled={cartLoading[product.id] || product.stockQuantity === 0}
                      >
                        {cartLoading[product.id] ? (
                          <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full block mx-auto" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Trending Now</h2>
              <p className="text-base md:text-xl text-slate-600">What's hot this season</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {trendingProducts.slice(0, 5).map((product, index) => (
              <Card key={product.id} className="border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/90 backdrop-blur-sm rounded-xl group cursor-pointer animate-scale-in animate-stagger-1">
                <CardContent className="p-3 md:p-4">
                  <div className="relative mb-2 md:mb-3">
                    <AspectRatio ratio={1} className="rounded-lg overflow-hidden">
                      <img 
                        src={product.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                      />
                    </AspectRatio>
                    <Badge className="absolute top-2 left-2 bg-red-500 text-xs px-2 py-0.5 rounded">
                      Trending
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm md:text-base">{product.name}</h3>
                    <p className="text-xs md:text-sm text-slate-500">{product.brand?.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-bold text-purple-600">Rs.{product.price}</span>
                      <Button 
                        size="icon" 
                        className="bg-purple-600 hover:bg-purple-700 w-8 h-8"
                        onClick={async e => {
                          e.stopPropagation();
                          setCartLoading(prev => ({ ...prev, [product.id]: true }));
                          try {
                            await addToCart({ productId: product.id, quantity: 1 });
                            toast.success('Added to cart!');
                          } catch (err) {
                            toast.error('Failed to add to cart');
                          } finally {
                            setCartLoading(prev => ({ ...prev, [product.id]: false }));
                          }
                        }}
                        disabled={cartLoading[product.id] || product.stockQuantity === 0}
                      >
                        {cartLoading[product.id] ? (
                          <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full block mx-auto" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands - Bento Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center space-y-4 mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Premium Brands</h2>
            <p className="text-base md:text-xl text-slate-600">Shop your favorite brands</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {featuredBrands.map((brand, index) => (
              <Card 
                key={brand.id} 
                className={`group cursor-pointer border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/90 backdrop-blur-sm rounded-xl animate-scale-in animate-stagger-${index + 1}`}
                onClick={() => navigate(`/brands/${brand.slug}`)}
              >
                <CardContent className="p-3 md:p-4 text-center flex flex-col h-full">
                  <div className="relative flex-grow">
                    <AspectRatio ratio={1} className="rounded-lg overflow-hidden bg-gray-50">
                      <img 
                        src={brand.logo || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                        alt={brand.name} 
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200" 
                      />
                    </AspectRatio>
                  </div>
                  <div className="mt-2 md:mt-3">
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-base md:text-lg">
                      {brand.name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500">
                      {brand.productCount || 0} products
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals - Bento Grid */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">New Arrivals</h2>
              <p className="text-base md:text-xl text-slate-600">Fresh products just in</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {newArrivals.slice(0, 5).map((product, index) => (
              <Card 
                key={product.id} 
                className={`group cursor-pointer border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/90 backdrop-blur-sm rounded-xl animate-scale-in animate-stagger-${index + 1}`}
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="relative mb-2 md:mb-3">
                    <AspectRatio ratio={1} className="rounded-lg overflow-hidden">
                      <img 
                        src={product.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                      />
                    </AspectRatio>
                    <Badge className="absolute top-2 left-2 bg-blue-500 text-xs px-2 py-0.5 rounded">
                      New
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm md:text-base">{product.name}</h3>
                    <p className="text-xs md:text-sm text-slate-500">{product.brand?.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-bold text-indigo-600">Rs.{product.price}</span>
                      <Button 
                        size="icon" 
                        className="bg-indigo-600 hover:bg-indigo-700 w-8 h-8"
                        onClick={async e => {
                          e.stopPropagation();
                          setCartLoading(prev => ({ ...prev, [product.id]: true }));
                          try {
                            await addToCart({ productId: product.id, quantity: 1 });
                            toast.success('Added to cart!');
                          } catch (err) {
                            toast.error('Failed to add to cart');
                          } finally {
                            setCartLoading(prev => ({ ...prev, [product.id]: false }));
                          }
                        }}
                        disabled={cartLoading[product.id] || product.stockQuantity === 0}
                      >
                        {cartLoading[product.id] ? (
                          <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full block mx-auto" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white">
              Ready to Shop?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their shopping needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl"
                onClick={() => navigate('/search')}
              >
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-blue-600 hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg font-semibold rounded-xl"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;