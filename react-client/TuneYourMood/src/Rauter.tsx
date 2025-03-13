import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import About from "./components/About";

export const Router = createBrowserRouter(
    [{
        path: '/', element: <Layout/>,
        children: [
            { index: true, element: <Home/> },
            { path: '/home', element: <Home /> },
            { path: '/about', element: <About /> },
            { path: '/register', element: <Register /> },
            { path: '/login', element: <Login /> },
            ]     
}])