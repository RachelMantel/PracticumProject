// Layout.tsx
import { Outlet } from "react-router-dom";
import AuthButtons from "./AuthButtons"; // אפשר להכניס את הכפתורים ב-Layout

const Layout = () => {
  return (
    <div>
      <header>
        <h1>My App</h1>
        <AuthButtons />
      </header>
      <main>
        <Outlet /> {/* כאן ייטענו כל הקומפוננטות לפי הניתוב */}
      </main>
      <footer>
        <p>&copy; 2025 My App</p>
      </footer>
    </div>
  );
};

export default Layout;
