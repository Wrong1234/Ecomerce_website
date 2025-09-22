import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

 const CheckoutForm = () =>{
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cartData = params.get("cart");

  let cart = [];
  try {
    if (cartData) {
      cart = JSON.parse(decodeURIComponent(cartData));
      console.log(cart);
    }
  } catch (err) {
    console.error("Failed to parse cart data", err);
  }


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.postalCode.trim()) newErrors.country = 'Postal Code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName : formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address:formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          state: formData.state,
          postalCode: formData.postalCode,
          cart_items: cart,

        })
      });

      const orderData = await response.json();

      if (response.ok) {
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          postalCode: ''
        });

        navigate('/Auth/login');
        console.log(orderData);
        navigate('/orderconfirmation', { state: orderData });
      } else {
        if (orderData.errors) {
          setErrors(orderData.errors);
        } 
      }
    } catch (error) {
      console.error('Registration error:', error);
    } 
  };

  return (
    <div className="container py-5" style={{ background: "linear-gradient(135deg, #e3f0ff 0%, #f3e8ff 100%)",     minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg rounded-4 border-0">
            {/* Header */}
            <div className="card-header bg-primary bg-gradient text-white py-4 rounded-top-4">
              <div className="d-flex align-items-center gap-3">
                <ShoppingCart size={32} />
                <h1 className="h3 fw-bold mb-0">Checkout</h1>
              </div>
              <p className="mb-0 mt-2 text-white-50">Complete your order details below</p>
            </div>

            <div className="card-body p-5">
              {/* Customer Information */}
              <div className="mb-5">
                <div className="mb-4 d-flex align-items-center gap-2">
                  <User size={24} className="text-primary" />
                  <h2 className="h5 fw-semibold mb-0">Customer Information</h2>
                </div>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">First Name</label>
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
                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
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
                <div className="mt-3">
                  <label htmlFor="email" className="form-label d-flex align-items-center gap-2">
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mt-3">
                  <label htmlFor="phone" className="form-label d-flex align-items-center gap-2">
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-5">
                <div className="mb-4 d-flex align-items-center gap-2">
                  <MapPin size={24} className="text-primary" />
                  <h2 className="h5 fw-semibold mb-0">Shipping Address</h2>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Enter street address"
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      placeholder="Enter city"
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="state" className="form-label">State/Province</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      placeholder="Enter state"
                    />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>
                </div>
                <div className="row g-3 mt-3">
                  <div className="col-sm-6">
                    <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                      placeholder="Enter ZIP code"
                    />
                    {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
                  </div>
                  <div className="row g-3 mt-3">
                  <div className="col-sm-6">
                    <label htmlFor="postalCode" className="form-label">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                      placeholder="Enter Postal code"
                    />
                    {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
                  </div>
              </div>
              </div>
            </div>

              {/* Submit Button */}
              <div className="mt-5 pt-4 border-top">
                <button
                  className="btn btn-lg btn-gradient-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold shadow"
                  style={{
                    background: "linear-gradient(90deg, #2563eb 0%, #6366f1 100%)",
                    color: "#fff",
                    border: "none"
                  }}
                  onClick={handleSubmit}
                >
                  <CreditCard size={20} />
                  <span>Complete Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;