import React from 'react';
import { 
  MessageCircle, 
  Mail, 
  Shield, 
  Gamepad2, 
  Twitter, 
  Youtube, 
  Instagram,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white text-gray-700 overflow-hidden border-t border-blue-100">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-blue-50"></div>

      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-blue-600">
                    SwargStore
                  </h3>
                  <p className="text-xs text-gray-500">Premium Gaming Accounts</p>
                </div>
              </div>
              
              <p className="text-gray-500 leading-relaxed mb-6">
                Your gateway to elite gaming. Premium Valorant and BGMI accounts with exclusive skins, 
                high ranks, and instant delivery.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { icon: MessageCircle, label: 'Discord', color: 'hover:text-indigo-400' },
                  { icon: Twitter, label: 'Twitter', color: 'hover:text-blue-400' },
                  { icon: Youtube, label: 'YouTube', color: 'hover:text-red-400' },
                  { icon: Instagram, label: 'Instagram', color: 'hover:text-pink-400' }
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <button
                      key={index}
                      className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-700 ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-600">
                QUICK LINKS
              </h4>
              <ul className="space-y-3">
                {[
                  'Browse Accounts',
                  'Valorant Collection',
                  'BGMI Accounts',
                  'Premium Skins',
                  'Account Rankings',
                  'Special Offers'
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-600">
                SUPPORT
              </h4>
              <ul className="space-y-3">
                {[
                  'Help Center',
                  'Contact Support',
                  'Order Tracking',
                  'Refund Policy',
                  'Account Security',
                  'Live Chat'
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-600">
                CONTACT
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Support</p>
                    <p className="text-blue-700 font-semibold">support@swargstore.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Discord Server</p>
                    <p className="text-blue-700 font-semibold">Join 50K+ Gamers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Security</p>
                    <p className="text-blue-700 font-semibold">24/7 Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-100 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <p>&copy; 2024 SwargStore. All rights reserved.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-blue-600 transition-colors duration-200">Privacy Policy</a>
                  <a href="#" className="hover:text-blue-600 transition-colors duration-200">Terms of Service</a>
                  <a href="#" className="hover:text-blue-600 transition-colors duration-200">Cookies</a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-600 font-semibold">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;