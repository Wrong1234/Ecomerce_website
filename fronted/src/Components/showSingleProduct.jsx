import { useState, useEffect } from 'react';
import { Plus, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import '../Products.css';

const SingleProduct = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Product not found');
        }
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = (product, quantity = 1) => {
    // Get current cart from sessionStorage
    const savedCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItem = savedCart.find(item => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      // Update quantity if item exists
      updatedCart = savedCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item to cart
      updatedCart = [...savedCart, { ...product, quantity }];
    }
    
    // Save to sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="products-page">
      <div className="container">
        <div className="product-card">
          <div className="product-image">
            <div className="product-emoji">{product.image}</div>
            <div className="product-rating">
              <Star className="star-icon" />
              <span>{product.rating}</span>
            </div>
          </div>

          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>

            <div className="product-features">
              {product.features?.map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>

            <div className="product-footer">
              <div className="product-price">${product.price}</div>
              <button
                onClick={() => addToCart(product)}
                className="add-to-cart-btn"
              >
                <Plus size={16} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;

