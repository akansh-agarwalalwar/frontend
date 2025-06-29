import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AllPostedIDs from './AllPostedId';
import YouTubeVideoGallery from '../components/YouTubeVideoGallery';
import Footer from '../Footer/Footer';
import FAQ from '../Footer/FAQ';
import HowItWorks from '../Footer/HowItWorks';

function UserPanel() {
  const [section, setSection] = useState('home');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [role, setRole] = useState('all');
  const [price, setPrice] = useState([0, 10000000]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Gaming-style Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600 tracking-wider">
                  <span className="text-blue-400">SWARG</span> STORE
                </h1>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setSection('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  section === 'home' 
                    ? 'text-blue-600 bg-blue-100 shadow-lg shadow-blue-400/20' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setSection('all')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  section === 'all' 
                    ? 'text-blue-600 bg-blue-100 shadow-lg shadow-blue-400/20' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setSection('videos')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  section === 'videos' 
                    ? 'text-blue-600 bg-blue-100 shadow-lg shadow-blue-400/20' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Videos
              </button>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-blue-200 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-cyan-400 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-cyan-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bordborder-2 py-4">
              <div className="space-y-1">
                <button
                  onClick={() => { setSection('home'); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    section === 'home' 
                      ? 'text-cyan-400 border-2 shadow-lg shadow-cyan-400/20' 
                      : 'text-gray-300 hover:text-cyan-400 hover:border-2'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => { setSection('all'); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    section === 'all' 
                      ? 'text-cyan-400 border-2 shadow-lg shadow-cyan-400/20' 
                      : 'text-gray-300 hover:text-cyan-400 hover:border-2'
                  }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => { setSection('videos'); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    section === 'videos' 
                      ? 'text-cyan-400 border-2 shadow-lg shadow-cyan-400/20' 
                      : 'text-gray-300 hover:text-cyan-400 hover:border-2'
                  }`}
                >
                  Videos
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {section === 'home' && (
          <div className="space-y-4">
            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center py-4 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl border border-blue-100 max-w-full mx-auto mb-12 shadow-sm">
              <span className="uppercase tracking-widest text-sm text-blue-500 font-semibold mb-3">Featured</span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-4 leading-tight">
                Premium IDs
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                Discover the best BGMI accounts with rare skins, high ranks, and exclusive items.
                <span className="text-blue-600 font-semibold"> Start dominating the battlefield today.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setSection('all')}
                  className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Browse All Products
                </button>
                <button
                  className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-700 bg-white font-bold text-lg hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Featured Products */}
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-8 flex items-center">
                <span className="mr-3">🎮</span>
                Featured Products
              </h2>
              <AllPostedIDs search={search} />
            </div>
          </div>
        )}

        {section === 'all' && (
          <div className="space-y-8">
            {/* Page Header */}
            <div className="border-b border-gray-200 pb-8">
              <h1 className="text-3xl font-bold text-blue-600">All Products</h1>
              <p className="mt-2 text-gray-600">Browse our complete collection of premium BGMI accounts</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      value={price[0]}
                      onChange={e => setPrice([+e.target.value, price[1]])}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      value={price[1]}
                      onChange={e => setPrice([price[0], +e.target.value])}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-400/25">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <AllPostedIDs search={search} status={status} role={role} price={price} />
          </div>
        )}

        {section === 'videos' && (
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h1 className="text-3xl font-bold text-blue-600">YouTube Videos</h1>
              <p className="mt-2 text-gray-600">Watch gameplay and tutorials</p>
            </div>
            <YouTubeVideoGallery />
          </div>
        )}
      </main>
      {section === 'home' && <HowItWorks />}
      {section === 'home' && <FAQ />}
      <Footer />
    </div>
  );
}

export default UserPanel;