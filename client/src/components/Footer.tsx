import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram } from 'lucide-react';
import { MapPin, Phone, Mail } from 'lucide-react';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Shop', to: '/shop' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-800 text-zinc-100 pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-zinc-700 pb-8">
          {/* Popular Categories */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b-2 border-pink-400 inline-block pb-1">POPULAR CATEGORIES</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Fashion</li>
              <li>Electronic</li>
              <li>Cosmetic</li>
              <li>Health</li>
              <li>Watches</li>
            </ul>
          </div>
          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b-2 border-pink-400 inline-block pb-1">PRODUCTS</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Prices Dr</li>
              <li>New Produc</li>
              <li>Best Sal</li>
              <li>Contact</li>
              <li>Sitemap</li>
            </ul>
          </div>
          {/* Our Company */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b-2 border-pink-400 inline-block pb-1">OUR COMPANY</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Delivery</li>
              <li>Legal Notice</li>
              <li>Terms And Conditions</li>
              <li>About Us</li>
              <li>Secure Payment</li>
            </ul>
          </div>
          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b-2 border-pink-400 inline-block pb-1">SERVICES</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Prices Drop</li>
              <li>New Products</li>
              <li>Best Sales</li>
              <li>Contact Us</li>
              <li>Sitemap</li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-2 border-b-2 border-pink-400 inline-block pb-1">CONTACT</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-pink-400" /> Ramdhuni Municipality, Sunsari, Nepal</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-pink-400" /> 9806348932</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-pink-400" /> nishchalb21@gmail.com</li>
            </ul>
          </div>
        </div>
        {/* Payment icons row */}
        <div className="flex justify-center gap-3 mt-6 mb-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-8 bg-white rounded p-1" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 bg-white rounded p-1" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 bg-white rounded p-1" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Skrill_logo.svg" alt="Skrill" className="h-8 bg-white rounded p-1" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Maestro_2016.svg" alt="Maestro" className="h-8 bg-white rounded p-1" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Visa_Electron.png" alt="Visa Electron" className="h-8 bg-white rounded p-1" />
        </div>
        {/* Copyright */}
        <div className="text-center text-sm text-zinc-300 mt-2">
          Copyright © <span className="font-bold text-white">NISCHAL</span>  All Rights Reserved.
        </div>
      </div>
    </footer>
  );
} 