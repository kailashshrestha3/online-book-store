import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RecentlyAdd = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${BACKEND_URL}/get-recent-books`);
      setData(response.data.data);
    };
    fetch();
  }, []);
  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-100">Recently Added Books</h4>
      {!data && (
        <div className="flex items-center justify-center my-8">
          <Loader />{" "}
        </div>
      )}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {data &&
          data.map((item, index) => (
            <div key={index}>
              <BookCard data={item} />{" "}
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentlyAdd;
