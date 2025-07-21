import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Github, Twitter, Instagram, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchCategories } from '@/services/category';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
  { name: 'FAQ', to: '/faq' },
];

// Add interfaces for Category
interface Category {
  slug: string;
  name: string;
  image?: string;
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    fetchCategories(100)
      .then(data => setCategories(data.data?.categories || []))
      .catch(() => setCatError('Failed to load categories'))
      .finally(() => setCatLoading(false));
  }, []);

  return (
    <>
      {/* Top promotional bar */}
      <div className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-sm py-2 px-4 flex items-center justify-between font-semibold relative">
        {/* Social media links (left) */}
        <div className="flex items-center gap-3 z-10">
          {/* Add focus-visible ring for accessibility */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white rounded-full p-1 transition-colors duration-200 flex items-center">
            <Globe className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white rounded-full p-1 transition-colors duration-200 flex items-center">
            <Instagram className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white rounded-full p-1 transition-colors duration-200 flex items-center">
            <Twitter className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white rounded-full p-1 transition-colors duration-200 flex items-center">
            <Github className="w-4 h-4 text-white drop-shadow" />
          </a>
        </div>
        {/* Promotional text (center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none">
          <span className="text-white text-base font-bold text-center pointer-events-auto tracking-wide">
            FREE SHIPPING THIS WEEK ORDER OVER - Rs.550
          </span>
        </div>
        {/* Become a seller (right) */}
        <div className="z-10">
          <Link to="/register" className="text-white underline hover:text-indigo-100 focus-visible:ring-2 focus-visible:ring-white text-xs font-normal ml-4 transition-colors">Register</Link>
        </div>
      </div>
      {/* Main header */}
      <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-100 shadow-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5 gap-6">
          {/* Logo/Brand */}
          <Link to="/" className="text-3xl font-black tracking-tight text-indigo-600 flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-3 py-1 rounded-lg shadow-md">V</span>
            <span className="tracking-widest">Veloura</span>
          </Link>
          {/* Nav links */}
          <nav className="hidden lg:flex gap-8 ml-10 items-center">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="text-lg font-semibold text-gray-700 hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-300 px-2 py-1 rounded transition-all duration-150">
                {link.name}
              </Link>
            ))}
          </nav>
          {/* Search bar */}
          <form className="flex-1 max-w-lg mx-8 hidden md:flex" onSubmit={e => { e.preventDefault(); if (search.trim()) navigate(`/products?q=${encodeURIComponent(search)}`); }}>
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, categories..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-2 pl-12 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
                aria-label="Search products, categories"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-400" />
            </div>
          </form>
          {/* Actions */}
          <div className="flex items-center gap-5">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-300 transition-colors">
              <ShoppingCart className="w-7 h-7 text-gray-700" />
              {/* Cart badge dynamic */}
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 shadow-lg animate-bounce font-bold border-2 border-white">
                {cartCount}
              </span>
            </Link>
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-300 mr-2 font-semibold px-5 py-2 rounded-lg">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-pink-600 text-white hover:bg-pink-700 focus-visible:ring-2 focus-visible:ring-pink-300 font-semibold px-5 py-2 rounded-lg">Register</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-0 border-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">
                  <Avatar className="w-10 h-10 shadow-md">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl shadow-xl border border-zinc-100">
                  <DropdownMenuLabel className="font-bold text-indigo-600">Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="hover:bg-indigo-50 rounded-lg px-2 py-1">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="hover:bg-indigo-50 rounded-lg px-2 py-1">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="hover:bg-indigo-50 rounded-lg px-2 py-1">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                      navigate('/login');
                    }}
                    className="hover:bg-pink-50 text-pink-600 rounded-lg px-2 py-1 font-semibold"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    </>
  );
}