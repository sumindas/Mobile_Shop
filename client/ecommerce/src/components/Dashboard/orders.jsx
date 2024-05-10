import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api/api";
import axios from "axios";
import Footer from "../Footer/footer";
import Navbar from "../NavBar/navBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const token = useSelector((state) => state.auth.token);

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

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen justify-between">
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-4">Your Orders</h2>
            {orders.length === 0? (
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
                      <td className="border px-4 py-2">{order.invoice_number}</td>
                      <td className="border px-4 py-2">{order.user.username}</td>
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
