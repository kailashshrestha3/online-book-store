import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import BookCard from "../BookCard/BookCard";

const Favourites = () => {
  const [favourites, setFavourites] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/v1/get-favourite-books",
        { headers },
      );
      setFavourites(response.data.data);
    };
    fetch();
  }, [favourites]);
  return (
    <>
      {favourites && favourites.length === 0 && (
        <div className="text-5xl font-semibold text-zinc-500 flex items-center justify-center w-full h-full">
          No favourites book
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {favourites &&
          favourites.map((item, index) => (
            <div key={index}>
              <BookCard data={item} favourite={true} />
            </div>
          ))}
      </div>
    </>
  );
};

export default Favourites;
