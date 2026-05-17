import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (
        values.username === "" ||
        values.email === "" ||
        values.password === "" ||
        values.address === ""
      ) {
        alert("Please fill all the fields");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/v1/sign-up",
          values,
        );
        alert(response.data.message);
        setValues({
          username: "",
          email: "",
          password: "",
          address: "",
        });
        navigate("/login");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className="h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-1/2 lg:w-1/3">
        <p className="text-zinc-200 text-xl">Sign Up</p>
        <div className="mt-4">
          <div>
            <label className="text-zinc-400">Username</label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Username"
              name="username"
              required
              value={values.username}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label className="text-zinc-400">Email</label>
            <input
              type="email"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Email"
              name="email"
              required
              value={values.email}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label className="text-zinc-400">Password</label>
            <input
              type="password"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="password"
              name="password"
              required
              autoComplete="off"
              value={values.password}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label className="text-zinc-400">Address</label>
            <textarea
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="address"
              rows="5"
              name="address"
              required
              value={values.address}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
              onClick={submit}
            >
              Sign Up
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Already have an account? &nbsp;
            <Link to="/login" className="hover:text-blue-500">
              <u>Login</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
