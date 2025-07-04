import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import type { AllProduct, Category } from '../types';
import ProductsCard from '../components/ProductsCard';
import { useNavigate } from 'react-router-dom';
import CartPage from './CartPage';

function LandingPage() {
    const [products, setProducts] = useState<AllProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      async function fetchData() {
        setLoading(true);
        try{
          const [prodRes, catRes] = await Promise.all([
            fetch('http://localhost:5000/api/products?limit=8'),
            fetch('http://localhost:5000/api/categories?limit=6'),
          ]);
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          console.log("received products", prodData);
          console.log("received categories", catData);
          setProducts(prodData.data?.products || []);
          setCategories(catData.data?.categories || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []);
  
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center text-2xl">Loading...</div>;
    }
  
    const heroProduct = products[0];
    const heroImage = heroProduct?.image?.url || '';
  
    return (
      <div className="bg-gradient-to-b from-zinc-100 to-zinc-300 min-h-screen w-full font-sans">
        {/* Top Banner/Hero */}
        <section className="relative w-full flex flex-col md:flex-row items-center justify-center gap-8 py-16 bg-gradient-to-r from-indigo-100 via-white to-pink-100 overflow-hidden animate-fade-in">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-indigo-200/40 via-white/0 to-pink-200/40 z-0" />
          <div className="flex-1 flex justify-center z-10">
            {heroImage && (
              <img src={heroImage} alt={heroProduct?.name} className="rounded-3xl w-80 h-96 object-cover shadow-2xl border-4 border-white/80 transition-transform duration-300 hover:scale-105" />
            )}
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start gap-6 z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-center md:text-left leading-tight drop-shadow-lg">
              MOVE.<br />REST.<br />RECOVER.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-md text-center md:text-left">Discover the latest in activewear designed for your lifestyle. Move, rest, and recover in style.</p>
            <Button className="mt-4 px-10 py-4 text-lg rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:scale-105 transition-transform">DISCOVER THE DROP</Button>
          </div>
        </section>
  
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-indigo-200 via-pink-200 to-transparent my-8 rounded-full animate-fade-in" />
  
        {/* The Active Lifestyle Edit */}
        <section className="max-w-7xl mx-auto py-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2 text-center tracking-tight">THE ACTIVE LIFESTYLE EDIT</h2>
          <p className="text-center text-gray-500 mb-12 text-lg max-w-2xl mx-auto">Sleek new rompers, bras & scalloped active sets are just what you need to move, rest and recharge.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14">
            <ProductsCard 
              products={products.slice(0, 8)} 
              cardClassName="rounded-3xl bg-white/90 shadow-xl border-0 hover:shadow-2xl transition-all duration-300" 
              imageClassName="h-56 rounded-2xl" 
              showPrice={true}
              showRating={true}
              showBrand={true}
              showVendor={false}
              showStatus={true}
              buttonText="Add to Cart"
              onProductClick={(product) => navigate(`/products/${product.slug}`)}
            />
          </div>
        </section>
  
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-pink-200 via-indigo-200 to-transparent my-8 rounded-full animate-fade-in" />
  
        {/* Shop by Category */}
        <section className="max-w-6xl mx-auto py-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-center tracking-tight">WHAT ARE YOU LOOKING FOR?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {categories.slice(0, 6).map((cat) => (
              <Card key={cat.id} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-indigo-300 bg-white/80 backdrop-blur-md">
                <CardHeader className="flex flex-col items-center">
                  <img src={cat.image} alt={cat.name} className="w-44 h-44 object-cover rounded-xl mb-2 shadow-md" />
                  <CardTitle className="text-xl text-center font-semibold">{cat.name}</CardTitle>
                  <CardDescription className="text-center text-gray-500">{cat.productCount} products</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Button className="mt-2 w-full bg-gradient-to-r from-indigo-400 to-pink-400 text-white shadow-md hover:scale-105 transition-transform">Shop {cat.name}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
  
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-indigo-200 via-pink-200 to-transparent my-8 rounded-full animate-fade-in" />
  
        {/* Lifestyle/Feature Sections */}
        <section className="max-w-7xl mx-auto py-16 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-8 text-center tracking-tight">FEATURED PICKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ProductsCard 
              products={products.slice(1, 4)} 
              cardClassName="rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 border-0 shadow-md hover:shadow-xl transition-all duration-300" 
              imageClassName="h-60 rounded-xl" 
              showPrice={false}
              showRating={false}
              showBrand={false}
              showVendor={false}
              showStatus={false}
              buttonText="Shop Now"
              onProductClick={(product) => navigate(`/products/${product.slug}`)}
            />
          </div>
        </section>
      </div>
    );
  }

export default LandingPage;