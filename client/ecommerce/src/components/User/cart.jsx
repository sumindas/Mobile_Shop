import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../Api/api";
import { useSelector } from "react-redux";
import Navbar from "../NavBar/navBar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate()

  useEffect(() => {
    if(!token){
        toast.error("Please Login to View",{
            onClose:()=>{
                navigate('/login')
            }
        })

    }
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setCartItems(data);
      const total = data.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setOrderTotal(total);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleCheckout = () => {
    console.log("Ordering items:", cartItems);
    console.log("Total:", orderTotal);
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/update_cart_item/`,
        {
          product_id: productId,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      fetchCartItems();
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className=" bg-gray-100 pt-20">
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full rounded-lg sm:w-40"
                />
                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  <div className="mt-5 sm:mt-0">
                    <h2 className="text-lg font-bold text-gray-900">
                      {item.product.name}
                    </h2>
                    <p className="mt-1 text-xs text-gray-700">
                      {item.product.description}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <div className="flex items-center border-gray-100">
                      <span
                        className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        onClick={() =>
                          updateCartItemQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                      >
                        {" "}
                        -{" "}
                      </span>
                      <input
                        className="h-8 w-8 border bg-white text-center text-xs outline-none"
                        value={item.quantity}
                        min="1"
                      />
                      <span
                        className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        onClick={() =>
                          updateCartItemQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                      >
                        {" "}
                        +{" "}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <p className="text-sm">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Sub total */}
          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700">Sub Total</p>
              <p className="text-gray-700">₹{orderTotal}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-700">₹Free</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total</p>
              <div className="">
                <p className="mb-1 text-lg font-bold">₹{orderTotal}</p>
                <p className="text-sm text-gray-700">including GST</p>
              </div>
            </div>
            <button
              className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
              onClick={handleCheckout}
            >
              Check out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;