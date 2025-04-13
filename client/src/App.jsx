import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header.jsx";
import { FooterComponent } from "./components/FooterComponent.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import AppRoutes from "./AppRoutes"; // 👈 We'll move Routes to a separate file/component
import "./assets/css/theme.css";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <AppRoutes />
      <FooterComponent />
    </BrowserRouter>
  );
}
