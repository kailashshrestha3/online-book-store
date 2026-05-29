import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${BACKEND_URL}/get-order-history`, {
        headers,
      });
      setOrderHistory(response.data.data);
    };
    fetch();
  }, []);
  return (
    <div>
      {!orderHistory && (
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      )}
      {orderHistory && orderHistory.length === 0 && (
        <div className="h-[80vh] p-4 text-zinc-100">
          <div className="h-full flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
              No Order History
            </h1>
            <img src="" alt="" className="h-[20vh] mb-8" />
          </div>
        </div>
      )}
      {orderHistory && orderHistory.length > 0 && (
        <div className="h-full p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Your Order History
          </h1>
          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%]">
              <h1 className="text-center">Sr. </h1>
            </div>
            <div className="w-[22%]">
              <h1 className="text-center">Books </h1>
            </div>
            <div className="w-[45%]">
              <h1 className="text-center">Description </h1>
            </div>
            <div className="w-[9%]">
              <h1 className="text-center">Price </h1>
            </div>
            <div className="w-[16%]">
              <h1 className="text-center">Status </h1>
            </div>
            <div className="w-none md:w-[5%] hidden md:block">
              <h1 className="">Mode </h1>
            </div>
          </div>
          {orderHistory.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer"
            >
              <div className="w-[3%]">
                <h1 className="text-center">{index + 1}</h1>
              </div>
              <div className="w-[22%]">
                {item.book ? (
                  <Link
                    to={`/view-book-details/${item.book._id}`}
                    className="hover:text-blue-300"
                  >
                    {item.book.title}
                  </Link>
                ) : (
                  <span>No book found</span>
                )}
              </div>
              <div className="w-[45%]">
                {item.book ? (
                  <p>{item.book.desc}</p>
                ) : (
                  <span>No book description found</span>
                )}
              </div>
              <div className="w-[9%]">
                {item.book ? (
                  <h1 className="">Rs. {item.book.price}</h1>
                ) : (
                  <span>No book price found</span>
                )}
              </div>
              <div className="w-[16%]">
                <h1 className="font-semibold text-green-500">
                  {item.status === "Order Placed" ? (
                    <div className="text-yellow-500">{item.status}</div>
                  ) : item.status === "Canceled" ? (
                    <div className="text-red-500">{item.status}</div>
                  ) : item.status === "Delivered" ? (
                    <div className="text-green-500">{item.status}</div>
                  ) : (
                    <div className="text-yellow-500">{item.status}</div>
                  )}
                </h1>
              </div>
              <div className="w-none md:w-[5%] hidden md:block">
                <h1 className="text-sm text-zinc-400">COD</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
