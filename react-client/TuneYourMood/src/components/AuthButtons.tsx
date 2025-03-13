import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, StoreType } from "./redux/store";
import { logout } from "./redux/AuthSlice";
import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector((state: StoreType) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
