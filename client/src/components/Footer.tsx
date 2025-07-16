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
    <footer className="bg-zinc-900 text-zinc-100 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 border-b border-zinc-800 pb-10">
          {/* Popular Categories */}
          <div>
            <h3 className="font-extrabold text-xl mb-3 border-b-2 border-pink-400 inline-block pb-1 tracking-wide">POPULAR CATEGORIES</h3>
            <ul className="mt-3 space-y-2 text-base">
              <li>Fashion</li>
              <li>Electronic</li>
              <li>Cosmetic</li>
              <li>Health</li>
              <li>Watches</li>
            </ul>
          </div>
          {/* Products */}
          <div>
            <h3 className="font-extrabold text-xl mb-3 border-b-2 border-pink-400 inline-block pb-1 tracking-wide">PRODUCTS</h3>
            <ul className="mt-3 space-y-2 text-base">
              <li>Prices Dr</li>
              <li>New Produc</li>
              <li>Best Sal</li>
              <li>Contact</li>
              <li>Sitemap</li>
            </ul>
          </div>
          {/* Our Company */}
          <div>
            <h3 className="font-extrabold text-xl mb-3 border-b-2 border-pink-400 inline-block pb-1 tracking-wide">OUR COMPANY</h3>
            <ul className="mt-3 space-y-2 text-base">
              <li>Delivery</li>
              <li>Legal Notice</li>
              <li>Terms And Conditions</li>
              <li>About Us</li>
              <li>Secure Payment</li>
            </ul>
          </div>
          {/* Services */}
          <div>
            <h3 className="font-extrabold text-xl mb-3 border-b-2 border-pink-400 inline-block pb-1 tracking-wide">SERVICES</h3>
            <ul className="mt-3 space-y-2 text-base">
              <li>Prices Drop</li>
              <li>New Products</li>
              <li>Best Sales</li>
              <li>Contact Us</li>
              <li>Sitemap</li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="font-extrabold text-xl mb-3 border-b-2 border-pink-400 inline-block pb-1 tracking-wide">CONTACT</h3>
            <ul className="mt-3 space-y-3 text-base">
              <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-pink-400" aria-label="Location" /> Ramdhuni Municipality, Sunsari, Nepal</li>
              <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-pink-400" aria-label="Phone" /> 9806348932</li>
              <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-pink-400" aria-label="Email" /> nishchalb21@gmail.com</li>
            </ul>
          </div>
        </div>
        {/* Payment icons row */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-10 bg-white rounded-lg p-2 shadow transition-transform hover:scale-105" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-10 bg-white rounded-lg p-2 shadow transition-transform hover:scale-105" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-10 bg-white rounded-lg p-2 shadow transition-transform hover:scale-105" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Skrill_logo.svg" alt="Skrill" className="h-10 bg-white rounded-lg p-2 shadow transition-transform hover:scale-105" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Maestro_2016.svg" alt="Maestro" className="h-10 bg-white rounded-lg p-2 shadow transition-transform hover:scale-105" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Visa_Electron.png" alt="Visa Electron" className="h-10 bg-white rounded-lg p-2 shadow transition-transform hover:scale-105" />
        </div>
        {/* Social icons row */}
        <div className="flex justify-center gap-6 mb-2">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 transition-colors text-2xl"><Twitter /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 transition-colors text-2xl"><Facebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 transition-colors text-2xl"><Instagram /></a>
        </div>
        {/* Copyright */}
        <div className="text-center text-base text-zinc-400 mt-2 tracking-wide">
          Copyright © <span className="font-bold text-white">NISCHAL</span>  All Rights Reserved.
        </div>
      </div>
    </footer>
  );
} 