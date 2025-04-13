import { useEffect } from "react";
import { useSelector } from "react-redux";
import "../assets/css/theme.css";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-white text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-gray-200">
      {children}
    </div>
  );
}
