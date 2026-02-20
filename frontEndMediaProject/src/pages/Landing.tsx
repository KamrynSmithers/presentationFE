// Landing.tsx
import { useNavigate } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", cursor: "pointer" }}
    >
      <div
        onClick={() => navigate("/signin")}
        style={{ flex: 1, overflow: "hidden" }}
      >
        <Spline scene="https://prod.spline.design/AgkILtbsOlq4KJt1/scene.splinecode" />
      </div>
      <Carousel/>
      <Footer />
    </div>
  );
}
