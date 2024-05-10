import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api/api";
import axios from "axios";
import Footer from "../Footer/footer";
import Navbar from "../NavBar/navBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user_orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Data:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const triggerMonthlyReport = async () => {
    if (!token) {
      toast.error("Please Login to View");
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/monthly_csv_report/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Monthly report triggered:", response.data);
      toast.success("CSV Downloaded")
    } catch (error) {
      console.error("Error triggering monthly report:", error);
    }
  };

  const triggerEmailReport = async () => {
    if (!token) {
      toast.error("Please Login to View");
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/email_order_report/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Email report triggered:", response.data);
      toast.success("Email report has been sent...Check Mail");
    } catch (error) {
      console.error("Error triggering email report:", error);
      toast.error("Failed to send email report.");
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="flex flex-col min-h-screen justify-between">
        <main className="flex-grow py-8 ">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-4">Your Orders</h2>
            <button
              onClick={triggerMonthlyReport}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Generate Monthly Report
            </button>
            <button
              onClick={triggerEmailReport}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
              Send Monthly Report via Email
            </button>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg font-semibold">No orders found.</p>
              </div>
            ) : (
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">Invoice Number</th>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Total Price</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">
                        {order.invoice_number}
                      </td>
                      <td className="border px-4 py-2">
                        {order.user.username}
                      </td>
                      <td className="border px-4 py-2">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="border px-4 py-2">{order.status}</td>
                      <td className="border px-4 py-2">{order.total_price}</td>
                      <td className="border px-4 py-2">
                        <Link to={`/order_detail/${order.id}`}>
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-dark hover:text-blue-700"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
