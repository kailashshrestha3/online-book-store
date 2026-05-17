import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FaHeart } from "react-icons/fa6";
import { FaEdit, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const ViewBookDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  // console.log(isLoggedIn);
  // console.log(role);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/v1/get-book-by-id/${id}`,
      );
      // console.log(response.data.data);
      setData(response.data.data);
    };
    fetch();
  }, []);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const handleFavorite = async () => {
    const response = await axios.put(
      `http://localhost:3000/api/v1/add-book-to-favourite`,
      {},
      { headers },
    );
    alert(response.data.message);
  };

  const handleCart = async () => {
    const response = await axios.put(
      `http://localhost:3000/api/v1/add-to-cart`,
      {},
      { headers },
    );
    alert(response.data.message);
  };

  const deleteBook = async () => {
    const response = await axios.delete(
      `http://localhost:3000/api/v1/delete-book`,
      { headers },
    );
    alert(response.data.message);
    navigate("/all-books");
  };

  return (
    <>
      {data && (
        <div className="px-4 md:px-12 py-8 bg-zinc-900 flex flex-col md:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            {" "}
            <div className="bg-zinc-800 flex justify-around rounded-md p-12 ">
              {" "}
              <img
                src={data?.url}
                alt=""
                className="h-[60vh] lg:h-[70vh] rounded-md"
              />
              {isLoggedIn === true && role === "user" && (
                <div className="flex md:flex-col gap-4 items-center justify-center">
                  <button
                    className="bg-white rounded-full text-2xl p-3 items-center justify-center text-red-500"
                    onClick={handleFavorite}
                  >
                    <FaHeart />
                    <span className="ms-4 block md:hidden">Favorite</span>
                  </button>
                  <button
                    className="text-white rounded-full flex items-center justify-center text-2xl p-3 mt-8 bg-blue-500"
                    onClick={handleCart}
                  >
                    <FaShoppingCart />
                    <span className="ms-4 block md:hidden">Add to cart</span>
                  </button>
                </div>
              )}
              {isLoggedIn === true && role === "admin" && (
                <div className="flex md:flex-col gap-4 items-center justify-center">
                  <Link
                    to={`/updateBook/${id}`}
                    className="bg-white rounded-full text-2xl p-3 items-center justify-center"
                  >
                    <FaEdit />
                    <span className="ms-4 block md:hidden">Edit</span>
                  </Link>
                  <button
                    className="text-red-500 rounded-full flex items-center justify-center text-2xl p-3 mt-8 bg-white"
                    onClick={deleteBook}
                  >
                    <MdOutlineDelete />
                    <span className="ms-4 block md:hidden">Delete Book</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 w-full lg:w-1/2">
            <h1 className="text-4xl text-zinc-300 font-semibold">
              {data?.title}
            </h1>
            <p className="text-zinc-400 mt-1">by {data?.author}</p>
            <p className="text-zinc-500 mt-4 text-xl">{data?.desc}</p>
            <p className="flex items-center mt-4 justify-start text-zinc-400">
              <GrLanguage className="me-3" /> {data?.language}
            </p>
            <p className="text-zinc-100 mt-4 text-3xl font-semibold">
              Rs {data?.price}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
