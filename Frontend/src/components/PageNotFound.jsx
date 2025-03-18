import { Link } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

export const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-200/50 rounded-lg shadow-xl">
      <Typography variant="h1" color="blue-gray" className="text-8xl font-bold">
        404
      </Typography>
      <Typography variant="h4" color="blue-gray" className="mt-4">
        Oops! Page Not Found
      </Typography>
      <Typography className="mt-2 text-gray-600 max-w-md text-center">
        The page you are looking for does not exist. It might have been moved or
        deleted.
      </Typography>
      <Link to="/" className="mt-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
          Go Home
        </button>
      </Link>
    </div>
  );
};
