import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="pt-16 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center bg-rose-50">
      <h1 className="text-6xl sm:text-7xl font-bold text-rose-500 animate-bounce">
        404
      </h1>
      <p className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-800">
        Oops! Page not found
      </p>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-8 py-3 rounded-full bg-rose-500 text-white font-medium hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200 transition-all duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
