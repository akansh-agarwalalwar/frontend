import { useState } from 'react';

export default function ProductModal({ product, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const postedByName = product.postedBy?.username || 'Unknown';
  const postedByEmail = product.postedBy?.email || '';

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? (product.media?.length - 1) || 0 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === (product.media?.length - 1) ? 0 : prev + 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Vertical Thumbnail Sidebar (left on desktop) */}
            {product.media && product.media.length > 1 && (
              <div className="hidden lg:flex flex-col gap-2 py-6 px-2 overflow-y-auto max-h-[90vh] w-20 bg-gray-50 border-r border-gray-200">
                {product.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 mb-1 ${
                      index === currentImageIndex 
                        ? 'border-blue-400 shadow-lg shadow-blue-400/50' 
                        : 'border-white/50 hover:border-blue-200'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img
                        src={`https://swarg-store-backend.onrender.com${media.url}`}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                        <svg className="w-8 h-8 text-white opacity-90 absolute inset-0 m-auto pointer-events-none" fill="currentColor" viewBox="0 0 48 48">
                          <circle cx="24" cy="24" r="22" fill="rgba(0,0,0,0.5)" />
                          <polygon points="20,16 36,24 20,32" fill="white" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Media Area */}
            <div className="w-full lg:w-3/5 relative flex flex-col justify-center">
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-full flex items-center justify-center">
                {product.media && product.media.length > 0 ? (
                  <>
                    {product.media[currentImageIndex]?.type === 'image' ? (
                      <img
                        src={`https://swarg-store-backend.onrender.com${product.media[currentImageIndex].url}`}
                        alt={product.title}
                        className="w-full h-full object-contain bg-gray-800"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative transition-all duration-300">
                        <video
                          src={`https://swarg-store-backend.onrender.com${product.media[currentImageIndex].url}`}
                          className="w-full h-full object-contain border-2 border-blue-900 shadow-lg transition-all duration-300"
                          controls
                          playsInline
                          muted
                          style={{ background: '#18181b', maxHeight: '100%' }}
                        />
                        {/* Video Icon Overlay */}
                        <div className="absolute top-3 left-3 bg-black/60 rounded-full p-2 z-10 flex items-center pointer-events-none">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="ml-2 text-xs text-white font-semibold">Video</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Navigation Arrows */}
                    {product.media.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg sm:text-xl font-semibold">No Media Available</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Dots Pagination for mobile (bottom) */}
              {product.media && product.media.length > 1 && (
                <div className="lg:hidden flex justify-center items-center gap-2 mt-3 mb-2">
                  {product.media.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className={`rounded-full transition-all duration-200 focus:outline-none
                        ${index === currentImageIndex
                          ? 'w-4 h-4 bg-blue-500 scale-110 shadow-lg'
                          : 'w-2.5 h-2.5 bg-gray-300 opacity-80 hover:bg-blue-300'}
                      `}
                      style={{ minWidth: 10, minHeight: 10 }}
                      aria-label={`Go to media ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details - right side on desktop */}
            <div className="w-full lg:w-2/5 bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[40vh] lg:max-h-screen">
              {/* Product Header */}
              <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                
                {/* Price */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">₹{product.price.toLocaleString()}</div>
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    product.status === 'sold' || product.status === 'sold out'
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {product.status === 'sold' || product.status === 'sold out' ? 'Sold' : 'Available'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              {/* Seller Information */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {postedByName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{postedByName}</p>
                      {/* <p className="text-sm text-gray-500">{product.role}</p> */}
                    </div>
                  </div>
                  {postedByEmail && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {postedByEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {product.status !== 'sold' && product.status !== 'sold out' ? (
                  <>
                    {product.telegramLink && (
                      <button
                        onClick={() => window.open(product.telegramLink, '_blank')}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                          </svg>
                          Contact Seller on Telegram
                        </div>
                      </button>
                    )}

                    {/* Copy Details Button - Tertiary Action */}
                    {/* <button
                      onClick={() => {
                        // Copy product details to clipboard
                        const details = `Product: ${product.title}\nPrice: ₹${product.price}\nDescription: ${product.description}\nSeller: ${postedByName}`;
                        navigator.clipboard.writeText(details);
                        alert('Product details copied to clipboard!');
                      }}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all duration-200 border border-gray-200"
                    >
                      Copy Details
                    </button> */}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-red-500 font-semibold mb-2 text-sm sm:text-base">This product has been sold</div>
                    <p className="text-xs sm:text-sm text-gray-500">Check out our other available products</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}