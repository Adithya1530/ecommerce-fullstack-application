import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
      <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }}/>
      </h2>
    );
  }

  return (
    <div className="products-container">
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h2>No Products Available</h2>
            <p>Try selecting a different category or check back later.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl, stockQuantity } = product;
            
            return (
              <div className="product-card" key={id}>
                <Link to={`/product/${id}`} className="product-link">
                  {/* Product Image */}
                  <div className="product-image-container">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="product-image"
                    />
                    {!productAvailable && (
                      <div className="out-of-stock-badge">
                        Out of Stock
                      </div>
                    )}
                    {productAvailable && stockQuantity <= 5 && stockQuantity > 0 && (
                      <div className="low-stock-badge">
                        Only {stockQuantity} left
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="product-details">
                    {/* Brand */}
                    <div className="product-brand">
                      {brand}
                    </div>

                    {/* Product Name */}
                    <h3 className="product-name">
                      {name}
                    </h3>

                    {/* Price */}
                    <div className="product-price">
                      <span className="price-currency">₹</span>
                      <span className="price-amount">{price}</span>
                    </div>

                    {/* Stock Status */}
                    {productAvailable && (
                      <div className="stock-status">
                        <span className="in-stock">In Stock</span>
                        {stockQuantity <= 10 && (
                          <span className="stock-count">({stockQuantity} available)</span>
                        )}
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      className={`add-to-cart-btn ${!productAvailable ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (productAvailable) {
                          addToCart(product);
                        }
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? (
                        <>
                          <i className="bi bi-cart-plus"></i>
                          Add to Cart
                        </>
                      ) : (
                        <>
                          <i className="bi bi-x-circle"></i>
                          Out of Stock
                        </>
                      )}
                    </button>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
