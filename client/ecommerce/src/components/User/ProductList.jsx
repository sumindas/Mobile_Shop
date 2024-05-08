import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api/api";
import axios from "axios";

const ProductList = ({ product }) => {
  const token = useSelector((state) => state.auth.token);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("You need to log in to add items to the cart.");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/add_to_cart/`,
        {
          product_id: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product Added to the cart.");
      console.log("Product Added To Cart", response.data);
    } catch (error) {
      console.log("Error adding", error);
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 max-w-md mx-4 my-4">
        <div className="mb-4">
          <p className="text-lg font-semibold">{product.name}</p>
          <div className="mt-4 flex justify-center">
            <img
              src={product.image}
              alt=""
              className="w-40 h-30 object-cover rounded-lg"
            />
          </div>
          <p className="text-gray-500">₹ {product.price}</p>
        </div>
        <div className="px-6 py-4 flex justify-center space-x-4">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-2"
            onClick={handleAddToCart}
          />
          <Link to={`/product/${product.id}`}>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-2"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductList;
