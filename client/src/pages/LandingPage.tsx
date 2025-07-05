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
import { useNavigate } from 'react-router-dom';
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
          getAllCategories({ limit: 8 }),
          getFeaturedCategories(6),
          getAllBrands({ limit: 8 }),
          getFeaturedBrands(6)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading amazing products...</span>
        </div>
      </div>
    );
  }

  const heroProduct = featuredProducts[0] || trendingProducts[0];
  const heroImage = heroProduct?.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-scale-in">
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Collection 2024
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift">
                  Elevate Your
                  <br />
                  <span className="text-slate-900">Style Game</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                  Discover curated collections that blend comfort, style, and performance. 
                  From workout essentials to casual elegance.
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center animate-stagger-1">
                  <div className="text-2xl font-bold text-indigo-600">{featuredProducts.length}+</div>
                  <div className="text-sm text-slate-500">Featured Products</div>
                </div>
                <div className="text-center animate-stagger-2">
                  <div className="text-2xl font-bold text-purple-600">{categories.length}+</div>
                  <div className="text-sm text-slate-500">Categories</div>
                </div>
                <div className="text-center animate-stagger-3">
                  <div className="text-2xl font-bold text-pink-600">{brands.length}+</div>
                  <div className="text-sm text-slate-500">Premium Brands</div>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              {heroImage && (
                <div className="relative group animate-float">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <img 
                    src={heroImage} 
                    alt={heroProduct?.name} 
                    className="relative w-full h-[600px] object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                      <h3 className="font-semibold text-slate-900">{heroProduct?.name}</h3>
                      <p className="text-slate-600 text-sm">{heroProduct?.brand?.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-indigo-600">Rs.{heroProduct?.price}</span>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our carefully curated categories designed for every lifestyle and occasion
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredCategories.map((category, index) => (
              <Card 
                key={category.id} 
                className={`group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-scale-in animate-stagger-${index + 1}`}
                onClick={() => navigate(`/categories/${category.slug}`)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative">
                    <AspectRatio ratio={1} className="rounded-2xl overflow-hidden">
                      <img 
                        src={category.image || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                        alt={category.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </AspectRatio>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {category.productCount || 0} products
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-xl text-slate-600">Handpicked for you</p>
            </div>
            <Button 
              variant="outline" 
              className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => navigate('/search')}
            >
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <AspectRatio ratio={1} className="rounded-2xl overflow-hidden">
                          <img 
                            src={product.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                            alt={product.name} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                          />
                        </AspectRatio>
                        {product.status === 'ACTIVE' && (
                          <Badge className="absolute top-2 left-2 bg-green-500">
                            In Stock
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {product.brand && (
                            <Badge variant="outline" className="text-xs">
                              {product.brand.name}
                            </Badge>
                          )}
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-slate-600">{product.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-lg font-bold text-indigo-600">Rs.{product.price}</span>
                            {product.salePrice && product.salePrice > product.price && (
                              <span className="text-sm text-slate-400 line-through">Rs.{product.salePrice}</span>
                            )}
                          </div>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Trending Now</h2>
              <p className="text-xl text-slate-600">What's hot this season</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.slice(0, 4).map((product) => (
              <Card key={product.id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <AspectRatio ratio={1} className="rounded-2xl overflow-hidden">
                      <img 
                        src={product.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                      />
                    </AspectRatio>
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      Trending
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.brand?.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-600">Rs.{product.price}</span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-slate-900">Premium Brands</h2>
            <p className="text-xl text-slate-600">Shop your favorite brands</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {featuredBrands.map((brand) => (
              <Card 
                key={brand.id} 
                className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate(`/brands/${brand.slug}`)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative">
                    <AspectRatio ratio={1} className="rounded-2xl overflow-hidden bg-gray-50">
                      <img 
                        src={brand.logo || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                        alt={brand.name} 
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300" 
                      />
                    </AspectRatio>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {brand.productCount || 0} products
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Zap className="w-8 h-8 text-indigo-600" />
            <div>
              <h2 className="text-4xl font-bold text-slate-900">New Arrivals</h2>
              <p className="text-xl text-slate-600">Fresh products just in</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <Card key={product.id} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <AspectRatio ratio={1} className="rounded-2xl overflow-hidden">
                      <img 
                        src={product.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                      />
                    </AspectRatio>
                    <Badge className="absolute top-2 left-2 bg-blue-500">
                      New
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.brand?.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">Rs.{product.price}</span>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add
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