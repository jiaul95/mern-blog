// import { useSelector } from "react-redux";

// export default function ThemeProvider({children}) {

//   const {theme} = useSelector((state)=>state.theme);
  
//   console.log("theme: " + theme);

//     return (
//       <div className={theme}>
//         <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)]">
//             {children}
//         </div>  
//       </div>
//     )
// }


import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply or remove the "dark" class on the <html> element
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  console.log("theme:", theme);

  return (
    <div className="min-h-screen bg-white text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-gray-200">
      {children}
    </div>
  );
}
