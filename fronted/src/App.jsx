import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import LoginForm from "./Auth/LoginForm";
import SignupForm from "./Auth/SignupForm";
import ProductList from "./Components/Product";
import SingleProduct from "./Components/showSingleProduct";
import CheckoutForm from "./Components/Checout";


function App() {

  return (
    <>
      <Header />
      <div>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Auth/signup" element={<SignupForm />} />
            <Route path="/Auth/login" element={<LoginForm />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/singleProduct/:id"  element={<SingleProduct />} />
            <Route path="/checkout" element={<CheckoutForm />} />
         </Routes>
      </div>
    
    </>
  );
}

export default App;
