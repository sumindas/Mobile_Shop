import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const ProductList = ({ product }) => {
  const handleAddToCart = () => {
    console.log("Adding", product.name, "to cart");
  };

  const handleViewMore = () => {
    console.log("Viewing more details for", product.name);
  };

  return (
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
      <div className="px-6 py-4 flex justify-center">
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-2"
          onClick={handleAddToCart}
        />
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-2 ml-2"
          onClick={handleViewMore}
        />
      </div>
    </div>
  );
};

export default ProductList;
