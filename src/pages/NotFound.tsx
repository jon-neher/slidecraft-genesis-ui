
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ice-white">
      <div className="text-center bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-4xl font-bold mb-4 text-slate-gray">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-electric-indigo hover:text-electric-indigo/80 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
