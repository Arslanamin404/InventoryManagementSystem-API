import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { showToast } from "../utils/showToast";
import axiosInstance from "../api/api";

export const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.data.categories);
      } catch (error) {
        if (Array.isArray(error.response?.data?.errors)) {
          const errorMessages = error.response.data.errors[0].msg;
          showToast("error", errorMessages);
        } else {
          showToast(
            "error",
            error.response?.data?.message || "An error occurred"
          );
        }
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="px-4 sm:px-8 py-6">
      {/* Header and Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 duration-300">
          ADD CATEGORY
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="text-sm text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-4">
                Slug
              </th>
              <th scope="col" className="px-6 py-4">
                Category Name
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {category.slug}
                </td>
                <td className="px-6 py-4">{category.name}</td>
                <td className="px-6 py-4 text-right">
                  {/* Placeholder for future actions like Edit/Delete */}
                  <Button
                    size="sm"
                    variant="text"
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="text"
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
