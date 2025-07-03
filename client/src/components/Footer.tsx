import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram } from 'lucide-react';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Shop', to: '/shop' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white/90 border-t border-zinc-200 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-6 gap-4">
        {/* Brand/Logo */}
        <Link to="/" className="text-xl font-extrabold tracking-tight text-indigo-600 mb-2 md:mb-0">
          ShopBrand
        </Link>
        {/* Quick Links */}
        <nav className="flex gap-6 mb-2 md:mb-0">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
        {/* Socials */}
        <div className="flex gap-4">
          <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors"><Facebook className="w-5 h-5" /></a>
          <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors"><Instagram className="w-5 h-5" /></a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-2 border-t border-zinc-100">
        &copy; {new Date().getFullYear()} ShopBrand. All rights reserved.
      </div>
    </footer>
  );
} 