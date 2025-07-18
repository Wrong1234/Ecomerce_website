import {NavLink , Link} from "react-router-dom";
import "../header.css";

const Header = () => {

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>My E-commerce</h1>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
        <div className="nav">
          <ul>
            <li>
               <a href="/Auth/login">Login</a>
            </li>
            <li>
              <a href="/Auth/signup">Sign Up</a>
            </li>
          </ul>
         
        </div>
      </div>
    </header>
  );
};

export default Header;