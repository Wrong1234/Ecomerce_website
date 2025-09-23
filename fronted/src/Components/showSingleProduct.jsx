import { useState, useEffect } from "react"
import { Plus, ArrowLeft } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import "../global.css"

const SingleProduct = () => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/products/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched product data:", data)

        // Handle the API response structure
        if (data.success && data.product) {
          setProduct(data.product)
        } else {
          throw new Error(data.message || "Product not found")
        }
      } catch (err) {
        setError(err.message)
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])
  
  const addToCart = (product, quantity = 1) => {
    try {
      // Use sessionStorage to match Header component
      const savedCart = JSON.parse(sessionStorage.getItem("cart") || "[]")

      const existingItem = savedCart.find((item) => item.id === product.id)

      let updatedCart
      if (existingItem) {
        // Update quantity if item exists
        updatedCart = savedCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Add new item to cart
        updatedCart = [
          ...savedCart,
          {
            id: product.id,
            name: product.name,
            price: Number.parseFloat(product.price),
            image_url: product.image_url,
            slug: product.slug,
            quantity,
          },
        ]
      }

      // Save to sessionStorage (same as Header component)
      sessionStorage.setItem("cart", JSON.stringify(updatedCart))

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCart }))


    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add product to cart")
    }
  }

  const parseMetaData = (metaDataString) => {
    try {
      return JSON.parse(metaDataString || "{}")
    } catch {
      return {}
    }
  }

  const formatPrice = (price) => {
    return Number.parseFloat(price).toFixed(2)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="loading-spinner">Loading product...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="error-message">
            <h2>Error: {error}</h2>
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="error-message">
            <h2>Product not found</h2>
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const metaData = parseMetaData(product.meta_data)

  return (
    <div className="products-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button mb-4">
          <ArrowLeft size={16} /> Back to Products
        </button>

        <div className="product-card single-product-card">
          <div className="product-image">
            {product.image_url ? (
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="product-img"
                onError={(e) => {
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "block"
                }}
              />
            ) : (
              <div className="product-placeholder">📦</div>
            )}

            {!product.image_url && (
              <div className="product-placeholder" style={{ display: "none" }}>
                📦
              </div>
            )}

            {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
              <div className="stock-warning">Only {product.stock_quantity} left!</div>
            )}

            {product.stock_quantity === 0 && <div className="out-of-stock">Out of Stock</div>}
          </div>

          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>

            {product.short_description && <p className="product-short-description">{product.short_description}</p>}

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Display meta data as features */}
            {Object.keys(metaData).length > 0 && (
              <div className="product-features">
                <h4>Features:</h4>
                {Object.entries(metaData).map(([key, value], index) => (
                  <span key={index} className="feature-tag">
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </span>
                ))}
              </div>
            )}

            <div className="product-details">
              <div className="detail-item">
                <strong>Weight:</strong> {product.weight} kg
              </div>
              <div className="detail-item">
                <strong>Stock:</strong> {product.stock_quantity} units
              </div>
              <div className="detail-item">
                <strong>SKU:</strong> {product.slug}
              </div>
              <div className="detail-item">
                <strong>Added:</strong> {formatDate(product.created_at)}
              </div>
              {product.updated_at !== product.created_at && (
                <div className="detail-item">
                  <strong>Updated:</strong> {formatDate(product.updated_at)}
                </div>
              )}
            </div>

            <div className="product-footer">
              <div className="product-price">
                <span className="currency">$</span>
                <span className="price">{formatPrice(product.price)}</span>
              </div>

              <button
                onClick={() => addToCart(product)}
                className={`add-to-cart-btn ${product.stock_quantity === 0 ? "disabled" : ""}`}
                disabled={product.stock_quantity === 0}
              >
                <Plus size={16} />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleProduct