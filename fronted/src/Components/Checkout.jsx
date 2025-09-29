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
        // console.log(data.payment_url);
        // window.location.href = result.redirect_url;
        
        sessionStorage.removeItem("cart")
        navigate("/orderconfirmation", { state: orderData, replace: true })
        
        // window.location.href = "/orderconfirmation?success=true"; 
      } else {
        if (orderData.errors) {
          setErrors(orderData.errors)
        }
      }
    } catch (error) {
      console.error("Order submission error:", error)
    }
  }
//   const handleSubmit = async (e) => {
//   e.preventDefault()
//   setErrors({})

//   if (!validateForm()) {
//     return
//   }

//   try {
//     const requestData = {
//       order_code: `ORD-${Date.now()}`,
//       product_id: cart[0]?.id || 1,
//       user_id: null,
//       product_details: cart.map((item) => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//       })),
//       unit_price: cart[0]?.price || 0,
//       quantity: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
//       subtotal: cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
//       shipping_fee: 60,
//       tax: 0,
//       order_date: new Date().toISOString().split("T")[0],

//       checkout: {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         street_address: formData.street_address,
//         city: formData.city,
//         state: formData.state,
//         zipCode: formData.zipCode,
//         postalCode: formData.postalCode,
//       },

//       cart_items: cart,
//     }

//     const response = await fetch("/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "X-Requested-With": "XMLHttpRequest", // This helps Laravel recognize it as an AJAX request
//       },
//       body: JSON.stringify(requestData),
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const orderData = await response.json()
//     console.log('Response data:', orderData);
//     console.log("check");
//     if (orderData.status === "success" && orderData.redirect_url) {
//       // Clear form data
//       setFormData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         street_address: "",
//         city: "",
//         state: "",
//         zipCode: "",
//         postalCode: "",
//         couponCode: "",
//       })

//       // Clear cart
//       sessionStorage.removeItem("cart")
      
//       // Redirect to SSLCommerz payment gateway
//       console.log("mahabur");
//       console.log(orderData.redirect_url);
//       window.location.href = orderData.redirect_url;
      
//     } else {
//       console.error('Payment initialization failed:', orderData);
//       if (orderData.errors) {
//         setErrors(orderData.errors)
//       } else {
//         setErrors({ general: 'Payment initialization failed. Please try again.' })
//       }
//     }
//   } catch (error) {
//     console.error("Order submission error:", error)
//     setErrors({ general: 'Network error. Please check your connection and try again.' })
//   }
// }

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
