import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import "../ProductList.css"

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)

      const response = await fetch("http://127.0.0.1:8000/api/products")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)
      let productsArray = []

      if (result.products && Array.isArray(result.products.data)) productsArray = result.products.data
      else if (Array.isArray(result.products)) productsArray = result.products
      else if (Array.isArray(result.data)) productsArray = result.data
      else productsArray = []

      setProducts(productsArray)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading products...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="products-container">
      <div className="products-wrapper">
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3>No products available</h3>
              <p>Check back later for new products.</p>
            </div>
          </div>
        ) : (
          <div className="products-grid">
            {Array.isArray(products) &&
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="product-image" />
                    <div className="product-overlay">
                      <span className="quick-view">Quick View</span>
                    </div>
                  </div>

                  <div className="product-content">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description}</p>

                    <div className="product-meta">
                      <div className="product-price">${product.price}</div>
                      {product.weight && <div className="product-weight">{product.weight}</div>}
                    </div>

                    <NavLink to={`/singleProduct/${product.id}`} className="shop-now-btn">
                      Shop Now
                    </NavLink>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
