import "../App.css";
import { useState, useEffect } from 'react';
import { NavLink, Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8000/api/products');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      // Handle different API response formats
      let productsArray;
      if (Array.isArray(result)) {
        // Direct array: [product1, product2, ...]
        productsArray = result;
      } else if (result.data && Array.isArray(result.data)) {
        // Object with data array: {data: [product1, product2, ...]}
        productsArray = result.data;
      } else if (result.products && Array.isArray(result.products)) {
        // Object with products array: {products: [product1, product2, ...]}
        productsArray = result.products;
      } else {
        // Handle other formats or convert object to array
        productsArray = Object.values(result).flat();
      }
      
      setProducts(productsArray);
      console.log(productsArray);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  // Loading state
  if (loading) {
    return (
      <div>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        </div>
      </div>
      </div>
    );
  }
  return (
    <div className="products">
    <div className="min-vh-100 bg-light py-5 px-3">
      <div className="container">
        {products.length === 0 ? (
          <div className="card shadow-sm p-5 text-center">
            <div className="text-secondary fs-5 mb-2">No products available</div>
            <p className="text-muted">Check back later for new products.</p>
          </div>
        ) : (
          <div className="row g-4">
            {Array.isArray(products) && products.map(product => (
              <div key={product.id} className="col-12 col-12 col-lg-6">
                <div className="card_design">
                  <div className="product-image">
                    <img
                      src={product.image}
                      className="product-emoji"
                      // className="w-100 object-fit-cover"
                    />
                  </div>

                  <div className="cart_body">
                    <h5 className="card-title fw-semibold mb-2">{product.name}</h5>
                    <p className="card-text  mb-3" style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fs-4 fw-bold">${product.price}</span>
                      {product.weight && (
                        <span className="badge bg-secondary">{product.weight}</span>
                      )}
                    </div>
                    <NavLink to={`/singleProduct/${product.id}`} className="btn btn-primary w-100 mt-auto">
                      Shop Now
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ProductList;