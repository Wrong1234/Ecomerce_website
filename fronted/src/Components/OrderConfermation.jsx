import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const {
    order_id,
    firstName,
    lastName,
    email,
    status,
    total_amount,
    created_at,
    cartItem,
  } = state || {};

  return (
    <div className="container my-5">
      <div className="card shadow-lg rounded-4 mx-auto" style={{maxWidth: "650px"}}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="mb-3">
              <span className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: 64, height: 64}}>
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#fff"/>
                  <path d="M7 13l3 3 7-7" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <h1 className="fw-bold text-primary mb-2" style={{fontSize: "2rem"}}>Thank You for Your Order!</h1>
            <p className="text-secondary fs-5">Your order has been placed successfully.</p>
          </div>
          <div className="bg-light rounded-3 p-4 mb-4">
            <div className="row mb-2">
              <div className="col-6 text-secondary">Order ID:</div>
              <div className="col-6 fw-semibold text-end">{order_id}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-secondary">Name:</div>
              <div className="col-6 fw-semibold text-end">{firstName} {lastName}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-secondary">Email:</div>
              <div className="col-6 fw-semibold text-end">{email}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-secondary">Status:</div>
              <div className="col-6 fw-semibold text-end">{status}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-secondary">Total:</div>
              <div className="col-6 fw-bold text-primary text-end">${total_amount}</div>
            </div>
            <div className="row">
              <div className="col-6 text-secondary">Order Date:</div>
              <div className="col-6 fw-semibold text-end">{created_at}</div>
            </div>
          </div>
          <h2 className="text-primary fw-semibold fs-4 mb-3">Order Items</h2>
          <div>
            {cartItem?.map((item, i) => (
              <div key={i} className="card mb-3 border-0 shadow-sm rounded-3">
                <div className="card-body py-3 px-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold">{item.name}</span>
                    <span className="fw-bold text-primary">${item.price}</span>
                  </div>
                  <div className="text-secondary">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button
              className="btn btn-primary btn-lg px-4 rounded-pill shadow"
              onClick={() => window.location.href = "/"}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;