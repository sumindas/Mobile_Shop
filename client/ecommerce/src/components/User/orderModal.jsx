import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../../Api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";


const OrderDetails = ({
  isOpen,
  setIsOpen,
  cartItems,
  orderTotal,
  onClose,
  update,
}) => {

  const [order,setOrder] = useState({
    name : "",
    mobile : "",
    address : ""
  })

  const token = useSelector((state)=>state.auth.token)
  if (!isOpen) {
    return null;
  }
  const handleChange = (e) => {
    setOrder({...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
        const response = await axios.post(`${BASE_URL}/place_order/`,{
            order_data :{
                name : order.name,
                mobile : order.mobile,
                address : order.address,
                total_price : orderTotal,
            },
            cartItems : cartItems.map(item=>({
                product_id : item.product.id,
                quantity : item.quantity,
                price_at_purchase : (item.product.price * item.quantity).toFixed(2)
            }))
        },{
            headers : {
                Authorization : `Bearer ${token}`
            }
        },)
        console.log("Response:",response.status)
        if(response.status === 200){
            toast.success("Order placed and cart cleared successfully")
            onClose()
            update()
        }
        else{
            toast.error("Error Placing Order")
        }
    }catch(error){
        console.log("Error:",error)
    }
  }

  return (
   <>
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Customer Details
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please fill in your details below:
                  </p>
                  <form>
                    <div className="mt-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block  py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Your Name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mobile
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        id="mobile"
                        className="mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Your Mobile Number"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className="mt-1 block  py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Your Address"
                        onChange={handleChange}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Order Details
                </h3>
                <div className="mt-2">
                  <ul>
                    {cartItems.map((item) => (
                      <li key={item.id} className="text-gray-700">
                        <span className="font-bold">{item.product.name}</span> -{" "}
                        {item.quantity} x ₹{item.product.price} = ₹
                        {(item.product.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-lg font-bold text-green-600">
                    Total: ₹{orderTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSubmit}
            >
              Place Order
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
   </>
  );
};

export default OrderDetails;
