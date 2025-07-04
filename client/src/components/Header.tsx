import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Github, Twitter, Instagram, Globe, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchCategories } from '@/services/category';
import { fetchBrands } from '@/services/brand';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { getCart } from '../services/cart';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
  { name: 'FAQ', to: '/faq' },
];

// Add interfaces for Category and Brand
interface Category {
  slug: string;
  name: string;
  image?: string;
}

interface Brand {
  slug: string;
  name: string;
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(true);
  const [catError, setCatError] = useState('');
  const [brandError, setBrandError] = useState('');
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCategories(100)
      .then(data => setCategories(data.data?.categories || []))
      .catch(() => setCatError('Failed to load categories'))
      .finally(() => setCatLoading(false));
    fetchBrands(100)
      .then(data => setBrands(data.data?.brands || []))
      .catch(() => setBrandError('Failed to load brands'))
      .finally(() => setBrandLoading(false));
    // Fetch cart count
    getCart()
      .then(res => {
        const cart = res.data?.data?.cart;
        const count = cart?.summary?.itemCount || 0;
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  }, []);

  return (
    <>
      {/* Top promotional bar */}
      <div className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-sm py-2 px-4 flex items-center justify-between font-semibold relative">
        {/* Social media links (left) */}
        <div className="flex items-center gap-3 z-10">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200 flex items-center">
            <Globe className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200 flex items-center">
            <Instagram className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200 flex items-center">
            <Twitter className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200 flex items-center">
            <Github className="w-4 h-4 text-white drop-shadow" />
          </a>
        </div>
        {/* Promotional text (center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none">
          <span className="text-white text-sm font-semibold text-center pointer-events-auto">
            FREE SHIPPING THIS WEEK ORDER OVER - Rs.550
          </span>
        </div>
        {/* Become a seller (right) */}
        <div className="z-10">
          <Link to="/register-business" className="text-white underline hover:text-indigo-100 text-xs font-normal ml-4">become a seller</Link>
        </div>
      </div>
      {/* Main header */}
      <header className="w-full bg-white/95 shadow-lg sticky top-0 z-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-indigo-600 flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-2 py-1 rounded-lg">V</span>
            <span>Veloura</span>
          </Link>
          {/* Nav links */}
          <nav className="hidden lg:flex gap-6 ml-8 items-center">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
          {/* Search bar */}
          <form className="flex-1 max-w-md mx-6 hidden md:flex" onSubmit={e => { e.preventDefault(); if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`); }}>
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-zinc-400" />
            </div>
          </form>
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-indigo-50 transition-colors">
              <Heart className="w-6 h-6 text-gray-700" />
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-indigo-50 transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {/* Cart badge dynamic */}
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1">{cartCount}</span>
            </Link>
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 mr-2">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-pink-600 text-white hover:bg-pink-700">Register</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-0 border-0 bg-transparent focus:outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://via.placeholder.com/40x40.png?text=User" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/logout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        {/* Category and Brands bar below header */}
        <div className="w-full bg-zinc-50 border-t border-zinc-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-200 py-2">
            {/* Categories (left) */}
            <div className="flex gap-4">
              {catLoading ? (
                <span className="text-xs text-gray-400">Loading categories...</span>
              ) : catError ? (
                <span className="text-xs text-red-500">{catError}</span>
              ) : (
                categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white shadow hover:bg-indigo-50 text-gray-700 font-medium text-sm whitespace-nowrap border border-zinc-100 transition-colors"
                  >
                    {cat.image && <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-full object-cover" />}
                    <span>{cat.name}</span>
                  </Link>
                ))
              )}
            </div>
            {/* Brands (right) */}
            <div className="flex gap-4">
              {brandLoading ? (
                <span className="text-xs text-gray-400">Loading brands...</span>
              ) : brandError ? (
                <span className="text-xs text-red-500">{brandError}</span>
              ) : (
                brands.slice(0, 4).map((brand) => (
                  <Link
                    key={brand.slug}
                    to={`/brand/${brand.slug}`}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50 text-gray-700 font-medium text-sm transition-colors border border-zinc-100"
                  >
                    <span className="w-6 h-6 bg-zinc-200 rounded-full flex items-center justify-center text-xs font-bold uppercase">{brand.name?.[0]}</span>
                    <span>{brand.name}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
} 