// import { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ShoppingCart, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

//  const CheckoutForm = () =>{
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const cartData = params.get("cart");

//   let cart = [];
//   try {
//     if (cartData) {
//       cart = JSON.parse(decodeURIComponent(cartData));
//       console.log(cart);
//     }
//   } catch (err) {
//     console.error("Failed to parse cart data", err);
//   }


//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     postalCode: ''
//   });

//   const [errors, setErrors] = useState({});

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
//     if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
//     if (!formData.address.trim()) newErrors.address = 'Address is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state.trim()) newErrors.state = 'State is required';
//     if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
//     if (!formData.postalCode.trim()) newErrors.country = 'Postal Code is required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

// const handleSubmit = async (e) => {
//    ;
//      e.preventDefault();
//     setErrors({})
//     // Validate form
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const requestData = {
//         // Order data (you'll need to populate these based on your cart/order logic)
//         order_code: `ORD-${Date.now()}`, // Generate unique order code
//         product_id: cart[0]?.id || 1, // Assuming first product ID from cart
//         user_id: null, // Set if user is logged in
//         product_details: cart.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity
//         })),
//         unit_price: cart[0]?.price || 0,
//         quantity: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
//         subtotal: cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
//         shipping_fee: 10.00, // Set your shipping fee logic
//         tax: 0, // Set your tax calculation logic
//         order_date: new Date().toISOString().split('T')[0],
        
//         // Checkout data nested as expected by validator
//         checkout: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//           phone: formData.phone,
//           street_address: formData.street_address,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           postalCode: formData.postalCode
//         },
        
//         // Include cart items for processing
//         cart_items: cart
//       };

//       const response = await fetch('/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(requestData)
//       });

//       const orderData = await response.json();

//       if (response.ok) {
        
//         // Clear form
//         setFormData({
//           firstName: '',
//           lastName: '',
//           email: '',
//           phone: '',
//           address: '',
//           city: '',
//           state: '',
//           zipCode: '',
//           postalCode: ''
//         });

//         sessionStorage.removeItem('cart');
//         navigate('/orderconfirmation', { state: orderData });
//       } else {
//         if (orderData.errors) {
//           setErrors(orderData.errors);
//         } 
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//     } 
//   };

//   return (
//     <div className="container py-5" style={{ background: "linear-gradient(135deg, #e3f0ff 0%, #f3e8ff 100%)",     minHeight: "100vh" }}>
//       <div className="row justify-content-center">
//         <div className="col-lg-8">
//           <div className="card shadow-lg rounded-4 border-0">
//             {/* Header */}
//             <div className="card-header bg-primary bg-gradient text-white py-4 rounded-top-4">
//               <div className="d-flex align-items-center gap-3">
//                 <ShoppingCart size={32} />
//                 <h1 className="h3 fw-bold mb-0">Checkout</h1>
//               </div>
//               <p className="mb-0 mt-2 text-white-50">Complete your order details below</p>
//             </div>

//             <div className="card-body p-5">
//               {/* Customer Information */}
//               <div className="mb-5">
//                 <div className="mb-4 d-flex align-items-center gap-2">
//                   <User size={24} className="text-primary" />
//                   <h2 className="h5 fw-semibold mb-0">Customer Information</h2>
//                 </div>
//                 <div className="row g-3">
//                   <div className="col-sm-6">
//                     <label htmlFor="firstName" className="form-label">First Name</label>
//                     <input
//                       type="text"
//                       id="firstName"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
//                       placeholder="Enter first name"
//                     />
//                     {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
//                   </div>
//                   <div className="col-sm-6">
//                     <label htmlFor="lastName" className="form-label">Last Name</label>
//                     <input
//                       type="text"
//                       id="lastName"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
//                       placeholder="Enter last name"
//                     />
//                     {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
//                   </div>
//                 </div>
//                 <div className="mt-3">
//                   <label htmlFor="email" className="form-label d-flex align-items-center gap-2">
//                     <Mail size={18} />
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//                     placeholder="Enter email address"
//                   />
//                   {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//                 </div>
//                 <div className="mt-3">
//                   <label htmlFor="phone" className="form-label d-flex align-items-center gap-2">
//                     <Phone size={18} />
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     id="phone"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
//                     placeholder="Enter phone number"
//                   />
//                   {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="mb-5">
//                 <div className="mb-4 d-flex align-items-center gap-2">
//                   <MapPin size={24} className="text-primary" />
//                   <h2 className="h5 fw-semibold mb-0">Shipping Address</h2>
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="address" className="form-label">Street Address</label>
//                   <input
//                     type="text"
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className={`form-control ${errors.address ? 'is-invalid' : ''}`}
//                     placeholder="Enter street address"
//                   />
//                   {errors.address && <div className="invalid-feedback">{errors.address}</div>}
//                 </div>
//                 <div className="row g-3">
//                   <div className="col-sm-6">
//                     <label htmlFor="city" className="form-label">City</label>
//                     <input
//                       type="text"
//                       id="city"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       className={`form-control ${errors.city ? 'is-invalid' : ''}`}
//                       placeholder="Enter city"
//                     />
//                     {errors.city && <div className="invalid-feedback">{errors.city}</div>}
//                   </div>
//                   <div className="col-sm-6">
//                     <label htmlFor="state" className="form-label">State/Province</label>
//                     <input
//                       type="text"
//                       id="state"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       className={`form-control ${errors.state ? 'is-invalid' : ''}`}
//                       placeholder="Enter state"
//                     />
//                     {errors.state && <div className="invalid-feedback">{errors.state}</div>}
//                   </div>
//                 </div>
//                 <div className="row g-3 mt-3">
//                   <div className="col-sm-6">
//                     <label htmlFor="zipCode" className="form-label">ZIP Code</label>
//                     <input
//                       type="text"
//                       id="zipCode"
//                       name="zipCode"
//                       value={formData.zipCode}
//                       onChange={handleInputChange}
//                       className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
//                       placeholder="Enter ZIP code"
//                     />
//                     {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
//                   </div>
//                   <div className="row g-3 mt-3">
//                   <div className="col-sm-6">
//                     <label htmlFor="postalCode" className="form-label">Postal Code</label>
//                     <input
//                       type="text"
//                       id="postalCode"
//                       name="postalCode"
//                       value={formData.postalCode}
//                       onChange={handleInputChange}
//                       className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
//                       placeholder="Enter Postal code"
//                     />
//                     {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
//                   </div>
//               </div>
//               </div>
//             </div>

//               {/* Submit Button */}
//               <div className="mt-5 pt-4 border-top">
//                 <button
//                   className="btn btn-lg btn-gradient-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold shadow"
//                   style={{
//                     background: "linear-gradient(90deg, #2563eb 0%, #6366f1 100%)",
//                     color: "#fff",
//                     border: "none"
//                   }}
//                   onClick={handleSubmit}
//                 >
//                   <CreditCard size={20} />
//                   <span>Complete Order</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CheckoutForm;


// //proper work code

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../global.css"

const CheckoutForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const cartData = params.get("cart")

  let cart = []
  try {
    if (cartData) {
      cart = JSON.parse(decodeURIComponent(cartData))
      console.log(cart)
    }
  } catch (err) {
    console.error("Failed to parse cart data", err)
  }

  if (cart.length === 0) {
    cart = [
      {
        id: 1,
        name: "Brand Fila World Cup Home Jersey 2024 - Player Edition",
        price: 1290,
        quantity: 1,
        image: "/football-jersey.jpg",
      },
    ]
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    zipCode: "",
    postalCode: "",
    couponCode: "",
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.street_address.trim()) newErrors.street_address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal Code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) {
      return
    }

    try {
      const requestData = {
        order_code: `ORD-${Date.now()}`,
        product_id: cart[0]?.id || 1,
        user_id: null,
        product_details: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        unit_price: cart[0]?.price || 0,
        quantity: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
        subtotal: cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
        shipping_fee: 60,
        tax: 0,
        order_date: new Date().toISOString().split("T")[0],

        checkout: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          postalCode: formData.postalCode,
        },

        cart_items: cart,
      }
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),

      })

      const orderData = await response.json()
  

      if (response.ok) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          street_address: "",
          city: "",
          state: "",
          zipCode: "",
          postalCode: "",
          couponCode: "",
        })

        console.log(orderData);
        sessionStorage.removeItem("cart")
        navigate("/orderconfirmation", { state: orderData })
      } else {
        if (orderData.errors) {
          setErrors(orderData.errors)
        }
      }
    } catch (error) {
      console.error("Order submission error:", error)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const shipping = 60
  const total = subtotal + shipping

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        {/* Left Column - Checkout Form */}
        <div className="checkout-form-section">
          <div className="checkout-header">
            <h1>Checkout Info</h1>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Contact Info */}
            <div className="form-section">
              <h2>Contact Info</h2>
              <div className="form-row">
                <div className="form-group">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="form-group">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={errors.email ? "error" : ""}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className={errors.phone ? "error" : ""}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="form-section">
              <h2>Shipping Info</h2>
              <div className="form-row">
                <div className="form-group full-width">
                  <input
                    type="text"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    placeholder="Detailed Address"
                    className={errors.street_address ? "error" : ""}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Select City"
                    className={errors.city ? "error" : ""}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className={errors.state ? "error" : ""}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter Your postal code"
                    className={errors.postalCode ? "error" : ""}
                  />
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="payment-summary">
              <div className="summary-header">
                <span>Your total payable amount is</span>
              </div>
              <div className="total-amount">৳{total}</div>
              <div className="breakdown-label">Breakdown</div>
              <div className="breakdown-table">
                <div className="breakdown-row">
                  <span className="breakdown-label">Purpose</span>
                  <span className="breakdown-label">Amount</span>
                </div>
                <div className="breakdown-row">
                  <span>Total</span>
                  <span className="amount">৳{subtotal}</span>
                </div>
                <div className="breakdown-row">
                  <span>Shipping</span>
                  <span className="amount">৳{shipping}</span>
                </div>
              </div>
              <div className="delivery-info">
                You will get the delivery <strong>within 2-3 Days</strong> after confirmation.
              </div>
            </div>

            {/* Payment Options */}
            <div className="form-section">
              <h2>Payment Options</h2>
              <div className="payment-options">
                <div className="payment-option selected">
                  <input type="radio" name="payment" id="cash" defaultChecked />
                  <label htmlFor="cash" className="payment-label">
                    <div className="payment-icon cash-icon">
                      <span>CASH</span>
                      <span className="delivery-text">on Delivery</span>
                    </div>
                  </label>
                </div>
                <div className="payment-option">
                  <input type="radio" name="payment" id="card" />
                  <label htmlFor="card" className="payment-label">
                    <div className="payment-icon card-icon">
                      <span>💳</span>
                    </div>
                  </label>
                </div>
                <div className="payment-option">
                  <input type="radio" name="payment" id="bkash" />
                  <label htmlFor="bkash" className="payment-label">
                    <div className="payment-icon bkash-icon">
                      <span>bKash</span>
                      <span className="cashback-text">10% Cashback</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="payment-note">
                Note: bKash 10% Cashback upto BDT 100 on purchase over BDT 500, max BDT 200 during campaign period.
              </div>
            </div>

            {/* Coupon Code */}
            <div className="form-section">
              <h2>Got any Coupon Code?</h2>
              <div className="coupon-section">
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  placeholder="Enter Coupon Code Here"
                  className="coupon-input"
                />
                <button type="button" className="add-coupon-btn">
                  Add Coupon
                </button>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="form-section">
              <div className="terms-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to <a href="#">Terms & Conditions</a>, <a href="#">Refund Policy</a> and{" "}
                  <a href="#">Privacy Policy</a> of Fabrilife.
                </label>
              </div>
              <button type="submit" className="confirm-order-btn">
                Confirm Order
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Cart Overview */}
        <div className="cart-overview-section">
          <div className="cart-header">
            <h2>Cart Overview</h2>
            <button className="modify-order-btn">Modify Order</button>
          </div>

          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image_url || "/placeholder.svg"} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <div className="item-quantity">
                    <span>{item.quantity || 1}</span>
                    <span className="multiply">X</span>
                    <span className="price">৳{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-totals">
            <div className="total-row">
              <span>Total:</span>
              <span className="amount">৳ {subtotal}</span>
            </div>
            <div className="total-row">
              <span>Shipping (+):</span>
              <span className="amount">৳ {shipping}</span>
            </div>
            <div className="total-row payable">
              <span>Payable:</span>
              <span className="amount">৳ {total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
