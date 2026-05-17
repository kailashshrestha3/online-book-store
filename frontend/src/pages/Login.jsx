import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    try {
      if (values.username === "" || values.password === "") {
        alert("Please fill all the fields");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/v1/sign-in",
          values,
        );
        dispatch(authActions.login());
        dispatch(authActions.changeRole(response.data.role));
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        // setValues({
        //   username: "",
        //   password: "",
        // });
        navigate("/profile");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className="h-screen bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-1/2 lg:w-1/3">
        <p className="text-zinc-200 text-xl">Login</p>
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
            <label className="text-zinc-400">Password</label>
            <input
              type="password"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="password"
              name="password"
              required
              value={values.password}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
              onClick={submit}
            >
              LogIn
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Don't have an account? &nbsp;
            <Link to="/signup" className="hover:text-blue-500">
              <u>Sign Up</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
