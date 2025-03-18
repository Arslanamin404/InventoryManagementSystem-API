import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { showToast } from "../utils/showToast";
import axiosInstance from "../api/api";

export const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.data.categories);
      } catch (error) {
        showToast(
          "error",
          error.response?.data?.message || "Failed to load categories"
        );
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axiosInstance.get("/subcategories");
        setSubcategories(response.data.data.subcategories);
      } catch (error) {
        showToast(
          "error",
          error.response?.data?.message || "Failed to load subcategories"
        );
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      console.log(data);

      await axiosInstance.post("/products", data);
      showToast("success", "Product added successfully");
      reset();
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link
            to="/dashboard"
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Add New Product
              </h1>
              <p className="text-sm text-gray-500">
                Fill in the details to add a new product to inventory
              </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name", {
                      required: "Product name is required",
                    })}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } focus:outline-none focus:ring-1 px-3 py-2 text-gray-900 shadow-sm`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    {...register("description")}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter product description"
                  ></textarea>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("category_id", {
                      required: "Category is required",
                    })}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.category_id
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1`}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subcategory
                  </label>
                  <select
                    {...register("subcategory_id")}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select subcategory</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be at least 0" },
                      })}
                      className={`block w-full rounded-md border pl-7 pr-3 py-2 ${
                        errors.price
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      } focus:outline-none focus:ring-1`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register("quantity", {
                      required: "Quantity is required",
                      min: { value: 0, message: "Quantity must be at least 0" },
                    })}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.quantity
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1`}
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                {/* Low Stock Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Low Stock Threshold <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register("lowStockThreshold", {
                      required: "Low stock threshold is required",
                      min: {
                        value: 0,
                        message: "Threshold must be a non-negative number",
                      },
                    })}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.lowStockThreshold
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1`}
                    placeholder="Enter threshold value"
                  />
                  {errors.lowStockThreshold ? (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.lowStockThreshold.message}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      System will alert when stock falls below this number
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Link
                  to={"/inventory"}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              All fields marked with <span className="text-red-500">*</span> are
              required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
