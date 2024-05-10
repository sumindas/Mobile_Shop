import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faInfoCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Api/api";
import Navbar from "../NavBar/navBar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Footer/footer";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const token = useSelector((state) => state.auth.token);
  console.log("Token:", token);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/${id}/`, {});
        setProduct(response.data);
        console.log("Product:", response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("You need to log in to add items to the cart.");
      return;
    }
    console.log("Url:", BASE_URL);
    try {
      const response = await axios.post(
        `${BASE_URL}/add_to_cart/`,
        {
          product_id: product.id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Item Added To Cart')
      console.log("Product Added To Cart", response.data);
    } catch (error) {
      console.log("Error adding", error);
    }
  };

  const handleQuantityIncrease = (e) => {
    e.preventDefault();
    if (!product.quantity_available) {
      toast.error("Product quantity information is not available.");
      return;
    }
    setQuantity(quantity + 1);
    if (quantity + 1 > product.quantity_available) {
      toast.error("Item Out Of Stock");
      return;
    }
  };

  const handleQuantityDecrease = (e) => {
    e.preventDefault();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full object-cover h-auto max-w-xs"
                />
              </div>
              <div className="w-full lg:w-1/2 p-8">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <p className="text-2xl font-bold text-gray-900 mb-6">
                  ${product.price}
                </p>
                <div className="flex items-center mb-6">
                  <button
                    onClick={handleQuantityDecrease}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-2"
                  >
                    -
                  </button>
                  <span className="text-gray-800">{quantity}</span>
                  <button
                    onClick={handleQuantityIncrease}
                    disabled={quantity > product.quantity_available}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ml-2"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleAddToCart}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Add to Cart
                  </button>
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
