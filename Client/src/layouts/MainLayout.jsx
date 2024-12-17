import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { CircleLoader, } from "react-spinners";
import Navbar from "../pages/Shared/Navbar";
import Footer from "../pages/Shared/Footer";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div>
      {loading ? (
        <div className="h-screen  flex justify-center items-center">
          <CircleLoader className="text-5xl" color={"#d19945"} loading={loading} size={150} />
        </div>

      ) : (
        <div>

          <div className="max-w-7xl mx-auto my-3">
            <div className="">
              <Navbar />
            </div>
            <Outlet />
          </div>
          <Footer/>
        </div>
      )}

    </div>

  );
};

export default MainLayout;
