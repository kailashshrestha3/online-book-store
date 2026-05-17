import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import Loader from "../Loader/Loader";
import { FaCheck, FaUserLarge } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoOpenOutline } from "react-icons/io5";
import SeeUserData from "../../pages/SeeUserData";

const AllOrders = () => {
  const [AllOrders, setAllOrders] = useState();
  const [Options, setOptions] = useState(-1);
  const [values, setValues] = useState({ status: "" });
  const [userDiv, setUserDiv] = useState("hidden");
  const [userDivData, setUserDivData] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/v1/get-all-orders",
        { headers },
      );
      setAllOrders(response.data.data);
    };
    fetch();
  }, []);

  const change = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };

  const openStatusDropdown = (index) => {
    setOptions(index);
    setValues({ status: AllOrders[index].status });
  };

  const submitChanges = async (i) => {
    const id = AllOrders[i]._id;
    const response = await axios.put(
      `http://localhost:3000/api/v1/update-status/${id}`,
      values,
      { headers },
    );
    alert(response.data.message);
  };

  return (
    <div>
      {!AllOrders && (
        <div className="h-full flex items-center justify-center">
          {" "}
          <Loader />
        </div>
      )}
      {AllOrders && AllOrders.length > 0 && (
        <div className="h-full p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            All Orders
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
            <div className="w-[10%] md:w-[5%]">
              <h1 className="">
                <FaUserLarge />{" "}
              </h1>
            </div>
          </div>
        </div>
      )}
      {AllOrders &&
        AllOrders.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300"
            >
              <div className="w-[3%]">
                <h1 className="text-center">{index + 1}</h1>
              </div>
              <div className="w-[40%] md:w-[22%]">
                <Link
                  to={`/view-book-details/${item.book_id}`}
                  className="hover:text-blue-300"
                >
                  {item.book?.title}
                </Link>
              </div>
              <div className="w-0 md:w-[45%] hidden md:block">
                <h1 className="">{item.book?.desc}</h1>
              </div>
              <div className="w-0 md:w-[7%] hidden md:block">
                <h1 className="">Rs. {item.book?.price}</h1>
              </div>
              <div className="w-[30%] md:w-[16%]">
                <h1 className="font-semibold">
                  <button
                    className="hover:scale-105 transition-all duration-300"
                    onClick={() => openStatusDropdown(index)}
                  >
                    {item.status === "Order placed" ? (
                      <div className="text-yellow-500">{item.status}</div>
                    ) : item.status === "Canceled" ? (
                      <div className="text-red-500">{item.status}</div>
                    ) : (
                      <div className="text-green-500">{item.status}</div>
                    )}
                  </button>
                  <div
                    className={`${Options === index ? "flex" : "hidden"} items-center gap-2`}
                  >
                    <select
                      name="status"
                      className="bg-gray-800 text-white px-2 py-1 rounded"
                      onChange={change}
                      value={values.status}
                    >
                      <option value="">Select Status</option>
                      {[
                        "Order placed",
                        "Out for delivery",
                        "Delivered",
                        "Canceled",
                      ].map((item, idx) => (
                        <option key={idx} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-green-500 hover:text-pink-600 hover:scale-110 transition-all duration-200 cursor-pointer text-lg"
                      onClick={() => {
                        setOptions(-1);
                        submitChanges(index);
                      }}
                    >
                      <FaCheck />
                    </button>
                  </div>
                </h1>
              </div>
              <div className="w-[10%] md:w-[5%]">
                <button
                  className="text-xl hover:text-orange-500"
                  onClick={() => {
                    setUserDiv("fixed");
                    setUserDivData(item.user);
                  }}
                >
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          );
        })}
      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setUserDiv={setUserDiv}
        />
      )}
    </div>
  );
};

export default AllOrders;
