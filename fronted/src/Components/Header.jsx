import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
// import "../header.css";

const Header = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Load cart from sessionStorage on component mount
  useEffect(() => {
    refreshCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      refreshCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Save cart to sessionStorage whenever cart changes
  useEffect(() => {
    if (cart.length > 0 || sessionStorage.getItem('cart')) {
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Refresh cart from sessionStorage
  const refreshCart = () => {
    const savedCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  //Encoded
  const encodeCart = (cart) => {
    return encodeURIComponent(JSON.stringify(cart));
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(newQuantity, 1) }
        : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    sessionStorage.setItem('cart', JSON.stringify([]));
  };

  const CartItem = ({ item }) => (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <h5 className="card-title mb-1">{item.name}</h5>
            <p className="card-text text-muted mb-0">${item.price} each</p>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="btn-group me-3" role="group">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              <Minus size={16} />
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <Plus size={16} />
            </button>
          </div>
          <span className="fw-bold me-3">${(item.price * item.quantity)}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="bg-primary text-white py-3 shadow-sm">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="logo">
            <h1 className="h3 mb-0">🛒 Shopping Store</h1>
          </div>
          <nav className="nav">
            <ul className="nav">
              <li className="nav-item"><NavLink className="nav-link text-white" to="/products" activeClassName="active">Products</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-white" to="/about" activeClassName="active">About</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link text-white" to="/contact" activeClassName="active">Contact</NavLink></li>
            </ul>
          </nav>
          <div>
            <ul className="nav">
              <li className="nav-item">
                <button
                  className="btn btn-light position-relative me-2"
                  onClick={() => {
                    refreshCart();
                    setShowCart(!showCart);
                  }}>
                  <ShoppingCart size={22} className="me-1" />
                  <span className="cart-label">Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">{getTotalItems()}</span>
                  )}
                </button>
              </li>
              <li className="nav-item"><NavLink className="btn btn-outline-light me-2" to="/auth/login" activeClassName="active">Login</NavLink></li>
              <li className="nav-item"><NavLink className="btn btn-warning" to="/auth/signup" activeClassName="active">Sign Up</NavLink></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Cart Dropdown */}
      {showCart && (
        <>
          <div className="modal-backdrop show" onClick={() => setShowCart(false)} />
          <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.05)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Shopping Cart</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowCart(false)} />
                </div>
                <div className="modal-body">
                  {cart.length === 0 ? (
                    <div className="text-center py-5">
                      <ShoppingCart size={48} className="mb-3 text-secondary" />
                      <p className="lead">Your cart is empty</p>
                      <NavLink className="btn btn-primary" to="/products" onClick={() => setShowCart(false)}>
                        Shop Now
                      </NavLink>
                    </div>
                  ) : (
                    <>
                      <div>
                        {cart.map(item => (
                          <CartItem key={item.id} item={item} />
                        ))}
                      </div>
                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong className="fs-5">Total: ${getTotalPrice()}</strong>
                          <div>
                            <button className="btn btn-outline-danger me-2" onClick={clearCart}>Clear Cart</button>
                            <NavLink 
                               className="btn btn-success" 
                               to={`/checkout?cart=${encodeCart(cart)}`}
                               onClick={() => setShowCart(false)}
                            >
                              Proceed to Checkout
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;


