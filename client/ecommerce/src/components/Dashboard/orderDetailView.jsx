import React, { useEffect, useState } from "react";
import Navbar from "../NavBar/navBar";
import Footer from "../Footer/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BASE_URL } from "../../Api/api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function OrderDetailView() {
  const [order, setOrder] = useState([]);
  const { order_id } = useParams();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/order_item_detail/${order_id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(response.data);
        console.log("Data:", response.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };

    fetchOrderDetails();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  const handleDownloadInvoice = async() => {
    try{
        const response = await axios.get(`${BASE_URL}/download_invoice/${order_id}`,{ responseType: 'blob' },{
            headers : {
                Authorization : `Bearer ${token}`,
                'Content-Type' : 'application/pdf',
            }
        })
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${order_id}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()

    } catch(error){
        console.log(error)
        toast.error("Failed to download invoice:")
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-wrap bg-gray-100 shadow-md flex-grow">
          <div className="w-full md:w-1/2 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Order Details
            </h2>
            {order.length > 0 && (
              <div className="mb-4">
                <p className="text-lg font-semibold text-green-600">
                  Invoice Number: {order[0].order.invoice_number}
                </p>
                <p className="text-lg font-semibold text-purple-600">
                  Username: {order[0].order.user?.username}
                </p>
                <p className="text-lg font-semibold text-red-600">
                  Date: {formatDate(order[0].order.created_at)}
                </p>
                <p className="text-lg font-semibold text-indigo-600">
                  Status: {order[0].order.status}
                </p>
                <p className="text-lg font-semibold text-blue-500">
                  Total Price: {order[0].order.total_price}
                </p>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 p-4  rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 text-blue-700">Products</h3>
            {order.map((item, index) => (
              <div
                key={index}
                className="mb-4 bg-purple-100 rounded-lg shadow-md"
              >
                <div className="flex justify-center items-center mb-2">
                  <img
                    src={`${BASE_URL}${item.product.image}`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-lg font-semibold text-red-600">
                    {item.product.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      className="text-lg text-blue-500 mr-1"
                    />
                    <p className="text-lg font-semibold text-blue-500">
                      {item.product.price}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-blue-500 mt-2">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons flex justify-center items-center p-4">
          <span
            onClick={handleDownloadInvoice}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faDownload}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            />
            Download Invoice
          </span>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default OrderDetailView;
