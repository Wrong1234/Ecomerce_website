import { useState, useEffect } from "react"
import { ShoppingCart, Menu, X, Plus, Minus, Trash2 } from "lucide-react"
import "../header.css"

const Header = () => {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [user, setUser] = useState(null);

  // Load cart from sessionStorage on component mount
  useEffect(() => {

   const storedUser = localStorage.getItem("user");
   if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
      // window.location.reload();
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user"); // clear the bad value
    }
  }
    refreshCart()

    // Listen for cart updates
    const handleCartUpdate = () => {
      refreshCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  // Save cart to sessionStorage whenever cart changes
  useEffect(() => {
    if (cart.length > 0 || sessionStorage.getItem("cart")) {
      sessionStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  // Refresh cart from sessionStorage
  const refreshCart = () => {
    const savedCart = JSON.parse(sessionStorage.getItem("cart") || "[]")
    setCart(savedCart)
  }

  // Encode cart for URL
  const encodeCart = (cart) => {
    return encodeURIComponent(JSON.stringify(cart))
  }

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) => (item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item))
    setCart(updatedCart)
    sessionStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    setCart(updatedCart)
    sessionStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Get total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Clear entire cart
  const clearCart = () => {
    setCart([])
    sessionStorage.setItem("cart", JSON.stringify([]))
  }

  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }


  const CartItem = ({ item }) => (
    <div className="cart-item">
      <div className="cart-item-content">
        <div className="cart-item-info">
          <h3 className="cart-item-name">{item.name}</h3>
          <p className="cart-item-price">${item.price.toFixed(2)} each</p>
        </div>
        <div className="cart-item-actions">
          <div className="quantity-controls">
            <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              <Minus size={14} />
            </button>
            <span className="quantity">{item.quantity}</span>
            <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <Plus size={14} />
            </button>
          </div>
          <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo">
            <a href="/" className="logo-link">
              <div className="logo-icon">
                <ShoppingCart size={20} />
              </div>
              <span className="logo-text">Shopping Store</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="/products" className="nav-link">
              Products
            </a>
            <a href="/about" className="nav-link">
              About
            </a>
            <a href="/contact" className="nav-link">
              Contact
            </a>
            <a href="/messages" className="nav-link">
              Massangers
            </a>
          </nav>

          {/* Right side actions */}
          <div className="header-actions">
            {/* Cart Button */}
            <button
              className="cart-btn"
              onClick={() => {
                refreshCart()
                setShowCart(!showCart)
              }}
            >
              <ShoppingCart size={18} />
              <span className="cart-text">Cart</span>
              {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
            </button>

            {/* Auth Links - Desktop */}
            <div className="auth-links">
              {user ? (
                <>
                   <span className="user-name">Hello, {user.name}</span>
                  <button onClick={handleLogout} className="auth-link logout-link">
                    Logout
                  </button>
                </>
              ):(
                <>
                  <a href="/auth/login" className="auth-link login-link">
                    Login
                  </a>
                  <a href="/auth/signup" className="auth-link signup-link">
                    Sign Up
                  </a>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="mobile-nav">
            <div className="mobile-nav-content">
              <a href="/products" className="mobile-nav-link">
                Products
              </a>
              <a href="/about" className="mobile-nav-link">
                About
              </a>
              <a href="/contact" className="mobile-nav-link">
                Contact
              </a>
               <a href="/messages" className="nav-link">
                Messanger
              </a>
              <div className="mobile-auth flex flex-col">
                 {user ? (
                <>
                   <span className="user-name">Hello, {user.name}</span>
                  <button onClick={handleLogout} className="mobile-auth-link">
                    Logout
                  </button>
                </>
              ):(
                <>
                  <a href="/auth/login" className="mobile-auth-link">
                    Login
                  </a>
                  <a href="/auth/signup" className="mobile-auth-link signup">
                    Sign Up
                  </a>
                </>
              )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Modal */}
      {showCart && (
        <>
          <div className="cart-overlay" onClick={() => setShowCart(false)} />
          <div className="cart-modal">
            <div className="cart-modal-content">
              <div className="cart-header">
                <h2 className="cart-title">Shopping Cart</h2>
                <button className="cart-close-btn" onClick={() => setShowCart(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="cart-body">
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingCart size={48} className="empty-cart-icon" />
                    <p className="empty-cart-title">Your cart is empty</p>
                    <p className="empty-cart-text">Add some products to get started</p>
                    <a href="/products" className="shop-now-btn" onClick={() => setShowCart(false)}>
                      Shop Now
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cart.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>

                    <div className="cart-footer">
                      <div className="cart-total">
                        <span className="total-text">Total: ${getTotalPrice().toFixed(2)}</span>
                        <div className="cart-actions">
                          <button className="clear-cart-btn" onClick={clearCart}>
                            Clear Cart
                          </button>
                          <a
                            href={`/checkout?cart=${encodeCart(cart)}`}
                            className="checkout-btn"
                            onClick={() => setShowCart(false)}
                          >
                            Checkout
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Header
