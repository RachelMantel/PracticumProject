import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { loginUser } from "./redux/AuthSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
  const [formData, setFormData] = useState({ userNameOrEmail: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
    navigate("/home");
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="text" name="userNameOrEmail" placeholder="Username or Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
    </>
  );
};

export default Login;
