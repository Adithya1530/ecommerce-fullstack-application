import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8080/api/product/${id}`);
        removeFromCart(id);
        console.log("Product deleted successfully");
        alert("Product deleted successfully");
        refreshData();
        navigate("/");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart successfully!");
  };

  if (!product) {
    return (
      <div className="product-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Product Images Section */}
        <div className="product-images-section">
          <div className="main-image-container">
            <img
              src={imageUrl}
              alt={product.name}
              className="main-product-image"
            />
            {!product.productAvailable && (
              <div className="out-of-stock-overlay">
                <span>Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="product-details-section">
          {/* Breadcrumb */}
          <div className="product-breadcrumb">
            <span>Home</span>
            <span>›</span>
            <span>{product.category}</span>
            <span>›</span>
            <span>{product.name}</span>
          </div>

          {/* Product Header */}
          <div className="product-header">
            <div className="product-category">
              {product.category}
            </div>
            <div className="product-listed-date">
              Listed: {new Date(product.releaseDate).toLocaleDateString()}
            </div>
          </div>

          {/* Product Title */}
          <h1 className="product-title">
            {product.name}
          </h1>

          {/* Product Brand */}
          <div className="product-brand">
            by {product.brand}
          </div>

          {/* Product Rating (Placeholder) */}
          <div className="product-rating">
            <div className="stars">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
            </div>
            <span className="rating-text">4.5 out of 5</span>
            <span className="rating-count">(128 reviews)</span>
          </div>

          {/* Price Section */}
          <div className="product-price-section">
            <div className="price-container">
              <span className="price-currency">₹</span>
              <span className="price-amount">{product.price}</span>
            </div>
            <div className="price-info">
              <span className="price-label">Price</span>
              <span className="price-note">Inclusive of all taxes</span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="stock-status-section">
            {product.productAvailable ? (
              <div className="in-stock-status">
                <i className="bi bi-check-circle-fill"></i>
                <span>In Stock</span>
                {product.stockQuantity <= 10 && (
                  <span className="stock-warning">Only {product.stockQuantity} left</span>
                )}
              </div>
            ) : (
              <div className="out-of-stock-status">
                <i className="bi bi-x-circle-fill"></i>
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Description */}
          <div className="product-description-section">
            <h3 className="section-title">Product Description</h3>
            <p className="product-description-text">
              {product.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="product-features">
            <h3 className="section-title">Key Features</h3>
            <ul className="features-list">
              <li>High-quality product from {product.brand}</li>
              <li>Excellent performance and reliability</li>
              <li>Warranty included</li>
              <li>Fast delivery available</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button
              className={`add-to-cart-button ${!product.productAvailable ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!product.productAvailable}
            >
              <i className="bi bi-cart-plus"></i>
              {product.productAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              className="buy-now-button"
              disabled={!product.productAvailable}
            >
              <i className="bi bi-lightning-fill"></i>
              Buy Now
            </button>
          </div>

          {/* Admin Actions */}
          <div className="admin-actions">
            <button
              className="update-button"
              onClick={handleEditClick}
            >
              <i className="bi bi-pencil"></i>
              Update Product
            </button>
            <button
              className="delete-button"
              onClick={deleteProduct}
            >
              <i className="bi bi-trash"></i>
              Delete Product
            </button>
          </div>

          {/* Additional Info */}
          <div className="product-additional-info">
            <div className="info-item">
              <span className="info-label">SKU:</span>
              <span className="info-value">{product.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{product.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Brand:</span>
              <span className="info-value">{product.brand}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;