

import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import Store from "./components/redux/store";
import { Router } from "./Rauter";

function App() {
  return (
    <Provider store={Store}>
      <RouterProvider router={Router} /> {/* מייבא ומבצע את הניתוב */}
    </Provider>
  );
}


export default App;

