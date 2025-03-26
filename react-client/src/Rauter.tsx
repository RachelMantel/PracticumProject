import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./components/user/Register";
import Login from "./components/user/Login";
import Home from "./components/Home";
import About from "./components/About";
import Mood from "./components/Mood";
import EditUser from "./components/user/EditUser";
import AllFolders from "./components/folders/AllFolders";
import AllSongs from "./components/songs/AllSongs";


export const Router = createBrowserRouter(
    [{
        path: '/', element: <Layout/>,
        children: [
            { index: true, element: <Home/> },
            { path: '/home', element: <Home /> },
            { path: '/about', element: <About /> },
            { path: '/register', element: <Register /> },
            { path: '/login', element: <Login /> },
            { path: '/my-playlists', element: <AllFolders /> },
            { path: '/mood', element: <Mood/> },
            { path: '/edit-user', element: <EditUser/> },
            { path: '/my-songs', element: <AllSongs /> },
            ]     
}])