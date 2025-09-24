import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import "../header.css";

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
      <header className="bg-dark text-white py-3 shadow-sm">
        <div className="navber">
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
            <ul className="nav_auth">
              <li>
                <button
                  className="btn btn-primary position-relative me-1"
                  onClick={() => {
                    refreshCart();
                    setShowCart(!showCart);
                  }}>
                  <ShoppingCart size={22} className="me-3" />
                  <span className="cart-label">Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">{getTotalItems()}</span>
                  )}
                </button>
              </li>
              <li><NavLink  to="/auth/login" className="nav_li">Login</NavLink></li>
              <li><NavLink  to="/auth/signup" className="nav_li">Sign Up</NavLink></li>
            </ul>
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

// import { useState, useEffect } from "react"
// import { ShoppingCart, X, Plus, Minus, Trash2, Menu } from "lucide-react"

// const Header = () => {
//   const [cart, setCart] = useState([])
//   const [showCart, setShowCart] = useState(false)
//   const [showMobileMenu, setShowMobileMenu] = useState(false)

//   // Load cart from sessionStorage on component mount
//   useEffect(() => {
//     refreshCart()

//     // Listen for cart updates
//     const handleCartUpdate = () => {
//       refreshCart()
//     }

//     window.addEventListener("cartUpdated", handleCartUpdate)

//     return () => {
//       window.removeEventListener("cartUpdated", handleCartUpdate)
//     }
//   }, [])

//   // Save cart to sessionStorage whenever cart changes
//   useEffect(() => {
//     if (cart.length > 0 || sessionStorage.getItem("cart")) {
//       sessionStorage.setItem("cart", JSON.stringify(cart))
//     }
//   }, [cart])

//   // Refresh cart from sessionStorage
//   const refreshCart = () => {
//     const savedCart = JSON.parse(sessionStorage.getItem("cart") || "[]")
//     setCart(savedCart)
//   }

//   // Encode cart for URL
//   const encodeCart = (cart) => {
//     return encodeURIComponent(JSON.stringify(cart))
//   }

//   // Update item quantity
//   const updateQuantity = (id, newQuantity) => {
//     const updatedCart = cart.map((item) => (item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item))
//     setCart(updatedCart)
//     sessionStorage.setItem("cart", JSON.stringify(updatedCart))
//   }

//   // Remove item from cart
//   const removeFromCart = (id) => {
//     const updatedCart = cart.filter((item) => item.id !== id)
//     setCart(updatedCart)
//     sessionStorage.setItem("cart", JSON.stringify(updatedCart))
//   }

//   // Calculate total price
//   const getTotalPrice = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0)
//   }

//   // Get total items count
//   const getTotalItems = () => {
//     return cart.reduce((total, item) => total + item.quantity, 0)
//   }

//   // Clear entire cart
//   const clearCart = () => {
//     setCart([])
//     sessionStorage.setItem("cart", JSON.stringify([]))
//   }

//   const CartItem = ({ item }) => (
//     <div className="cart-item-card rounded-lg p-4 mb-3">
//       <div className="flex items-center justify-between">
//         <div className="flex-1">
//           <h3 className="font-semibold text-white mb-1">{item.name}</h3>
//           <p className="text-sm text-gray-400">${item.price.toFixed(2)} each</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <button
//               className="h-8 w-8 p-0 border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center"
//               onClick={() => updateQuantity(item.id, item.quantity - 1)}
//             >
//               <Minus size={14} />
//             </button>
//             <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
//             <button
//               className="h-8 w-8 p-0 border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center"
//               onClick={() => updateQuantity(item.id, item.quantity + 1)}
//             >
//               <Plus size={14} />
//             </button>
//           </div>
//           <div className="text-right">
//             <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
//           </div>
//           <button
//             className="h-8 w-8 p-0 border border-gray-600 rounded bg-gray-800 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center"
//             onClick={() => removeFromCart(item.id)}
//           >
//             <Trash2 size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       <header className="header-glass sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex-shrink-0">
//               <a href="/" className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
//                   <ShoppingCart size={18} className="text-white" />
//                 </div>
//                 <span className="text-xl font-bold text-white">Elite Store</span>
//               </a>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-8">
//               <a href="/products" className="nav-link-hover text-white hover:text-purple-400 font-medium py-2">
//                 Products
//               </a>
//               <a href="/about" className="nav-link-hover text-white hover:text-purple-400 font-medium py-2">
//                 About
//               </a>
//               <a href="/contact" className="nav-link-hover text-white hover:text-purple-400 font-medium py-2">
//                 Contact
//               </a>
//             </nav>

//             {/* Right side actions */}
//             <div className="flex items-center space-x-4">
//               {/* Cart Button */}
//               <button
//                 className="relative border border-gray-600 rounded-lg px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white flex items-center"
//                 onClick={() => {
//                   refreshCart()
//                   setShowCart(!showCart)
//                 }}
//               >
//                 <ShoppingCart size={18} className="mr-2" />
//                 <span className="hidden sm:inline">Cart</span>
//                 {getTotalItems() > 0 && (
//                   <span className="cart-badge absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {getTotalItems()}
//                   </span>
//                 )}
//               </button>

//               {/* Auth Links - Desktop */}
//               <div className="hidden md:flex items-center space-x-2">
//                 <a
//                   href="/auth/login"
//                   className="px-4 py-2 text-white hover:bg-gray-800/50 rounded-lg transition-colors"
//                 >
//                   Login
//                 </a>
//                 <a
//                   href="/auth/signup"
//                   className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
//                 >
//                   Sign Up
//                 </a>
//               </div>

//               {/* Mobile menu button */}
//               <button
//                 className="md:hidden p-2 text-white hover:bg-gray-800/50 rounded-lg"
//                 onClick={() => setShowMobileMenu(!showMobileMenu)}
//               >
//                 <Menu size={20} />
//               </button>
//             </div>
//           </div>

//           {/* Mobile Navigation */}
//           {showMobileMenu && (
//             <div className="md:hidden border-t border-gray-700 mt-2 pt-4 pb-4">
//               <div className="flex flex-col space-y-3">
//                 <a href="/products" className="text-white hover:text-purple-400 font-medium">
//                   Products
//                 </a>
//                 <a href="/about" className="text-white hover:text-purple-400 font-medium">
//                   About
//                 </a>
//                 <a href="/contact" className="text-white hover:text-purple-400 font-medium">
//                   Contact
//                 </a>
//                 <div className="flex space-x-2 pt-2">
//                   <a href="/auth/login" className="px-3 py-1 text-sm text-white hover:bg-gray-800/50 rounded">
//                     Login
//                   </a>
//                   <a
//                     href="/auth/signup"
//                     className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
//                   >
//                     Sign Up
//                   </a>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Cart Modal */}
//       {showCart && (
//         <>
//           <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCart(false)} />
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="cart-modal rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
//               <div className="flex items-center justify-between p-6 border-b border-gray-700">
//                 <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
//                 <button className="h-8 w-8 p-0 text-gray-400 hover:text-white" onClick={() => setShowCart(false)}>
//                   <X size={18} />
//                 </button>
//               </div>

//               <div className="p-6 overflow-y-auto max-h-[60vh]">
//                 {cart.length === 0 ? (
//                   <div className="text-center py-12">
//                     <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
//                     <p className="text-xl font-medium text-white mb-2">Your cart is empty</p>
//                     <p className="text-gray-400 mb-6">Add some products to get started</p>
//                     <a
//                       href="/products"
//                       className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
//                       onClick={() => setShowCart(false)}
//                     >
//                       Shop Now
//                     </a>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="space-y-4">
//                       {cart.map((item) => (
//                         <CartItem key={item.id} item={item} />
//                       ))}
//                     </div>

//                     <div className="border-t border-gray-700 pt-6 mt-6">
//                       <div className="flex items-center justify-between mb-6">
//                         <span className="text-2xl font-bold text-white">Total: ${getTotalPrice().toFixed(2)}</span>
//                         <div className="flex space-x-3">
//                           <button
//                             className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
//                             onClick={clearCart}
//                           >
//                             Clear Cart
//                           </button>
//                           <a
//                             href={`/checkout?cart=${encodeCart(cart)}`}
//                             className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
//                             onClick={() => setShowCart(false)}
//                           >
//                             Checkout
//                           </a>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   )
// }

// export default Header
