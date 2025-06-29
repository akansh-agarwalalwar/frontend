import { useState, useEffect } from 'react';
import Card from '../components/Card';
import ProductModal from '../components/ProductModal';

export default function AllPostedIDs({ search = '', status = 'all', role = 'all', price = [0, 10000000] }) {
  const [allIDs, setAllIDs] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // console.log('Component mounted');
    fetch('https://swarg-store-backend.onrender.com/api/ids')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        setAllIDs(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const filtered = allIDs.filter(id => {
    // postedBy might be an object if populated or just string id
    const postedByName = id.postedBy?.username || ''; 
    return (
      (id.title.toLowerCase().includes(search.toLowerCase()) ||
        postedByName.toLowerCase().includes(search.toLowerCase())) &&
      (status === 'all' || id.status === status) &&
      (role === 'all' || id.role === role) &&
      id.price >= price[0] &&
      id.price <= price[1]
    );
  });

  // Temporary BGMI image placeholder
  const bgmiPlaceholderImage = "https://prod.assets.earlygamecdn.com/images/BGMI-3.5-Update.png?transform=Article+Webp";

  // Add a simple click handler to test if any clicks work
  const handleTestClick = () => {
    console.log('Test click function called');
    alert('Test click works!');
  };

  return (
    <div className="mb-8">      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto h-16 w-16 text-gray-500 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300">No products found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
        {filtered.map((row) => {
          // Define postedByName here inside the map callback!
          const postedByName = row.postedBy?.username || 'Unknown';

          return (
            <div 
              key={row._id} 
              className="group relative bg-white rounded-lg shadow-lg border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handleProductClick(row)}
            >
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-700 group-hover:opacity-95 transition-opacity duration-300">
                {row.media && row.media.length > 0 && row.media[0]?.type === 'image' ? (
                  <img 
                    src={`https://swarg-store-backend.onrender.com${row.media[0].url}`} 
                    alt={row.title}
                    className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : row.media && row.media.length > 0 && row.media[0]?.type === 'video' ? (
                  <video 
                    src={`https://swarg-store-backend.onrender.com${row.media[0].url}`} 
                    className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                    controls 
                  />
                ) : (
                  // Use BGMI placeholder image when no media is available
                  <img 
                    src={bgmiPlaceholderImage} 
                    alt="BGMI 3.6 Update"
                    className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-cyan-400 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {row.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">ID: {row._id.slice(-8)}</p>
                
                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-green-400">₹{row.price.toLocaleString()}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'sold' || row.status === 'sold out'
                      ? 'bg-red-900/50 text-red-300 border border-red-600' 
                      : 'bg-green-900/50 text-green-300 border border-green-600'
                  }`}>
                    {row.status === 'sold' || row.status === 'sold out' ? 'Sold' : 'Available'}
                  </span>
                </div>

                {/* Seller Info */}
                <div className="text-xs text-gray-400 mb-3">
                  <span className="font-medium text-gray-300">Seller:</span> {postedByName}
                </div>

                {/* Additional Media Thumbnails
                {row.media && row.media.length > 1 && (
                  <div className="flex gap-1 mb-4">
                    {row.media.slice(1, 4).map((m, idx) =>
                      m.type === 'image' ? (
                        <img
                          key={idx}
                          src={`https://swarg-store-backend.onrender.com${m.url}`}
                          alt="media"
                          className="w-8 h-8 rounded object-cover border border-gray-300 hover:border-blue-400 hover:scale-110 transition-all duration-200"
                        />
                      ) : (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded border border-gray-300 bg-gray-100 flex items-center justify-center hover:border-blue-400 hover:scale-110 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                        </div>
                      )
                    )}
                    {row.media.length > 4 && (
                      <div className="w-8 h-8 rounded border border-gray-300 bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-500">+{row.media.length - 4}</span>
                      </div>
                    )}
                  </div>
                )} */}

                {/* Action Button */}
                <button
                  className={`w-full py-2 px-4 rounded-md text-sm font-bold transition-all duration-200 transform hover:scale-105 ${
                    row.status === 'sold' || row.status === 'sold out'
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-gray-900 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg hover:shadow-cyan-400/25 cursor-pointer'
                  }`}
                  disabled={row.status === 'sold' || row.status === 'sold out'}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (row.status !== 'sold' && row.status !== 'sold out') {
                      if (row.telegramLink) {
                        window.open(row.telegramLink, '_blank');
                      } else {
                        alert('No contact information available for this seller. Please try another item.');
                      }
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  {row.status === 'sold' || row.status === 'sold out' ? 'Sold Out' : 'Buy Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
