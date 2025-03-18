import {
  BadgeDollarSign,
  Boxes,
  Layers,
  PackageCheck,
  ArrowLeft,
  Pencil,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";
import axiosInstance from "../api/api";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      showToast("success", response.data.message);
      navigate("/inventory");
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

  const handleEditProduct = (id) => {
    navigate(`/edit-product/${id}`, { replace: true });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 w-full max-w-xl mx-auto">
      {/* Top Actions */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/inventory")}
          className="flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Inventory
        </button>

        {/* Optional Edit/Delete Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleEditProduct(product._id)}
            className="text-gray-600 hover:text-blue-500"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteProduct(product._id)}
            className="text-gray-600 hover:text-red-500"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {product.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {product.description || "No description provided."}
          </p>
        </div>
        <BadgeDollarSign className="text-blue-500 w-6 h-6" />
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-400" />
          <span>
            <span className="font-medium">Category:</span>{" "}
            {product.category_id?.name || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-gray-400" />
          <span>
            <span className="font-medium">Subcategory:</span>{" "}
            {product.subcategory_id?.name || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="w-4 h-4 text-gray-400" />
          <span>
            <span className="font-medium">Price:</span> ${product.price}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4 text-gray-400" />
          <span>
            <span className="font-medium">Quantity:</span> {product.quantity}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 text-gray-400">⚠️</span>
          <span>
            <span className="font-medium">Low Stock Alert:</span>{" "}
            {product.lowStockThreshold}
          </span>
        </div>
      </div>
    </div>
  );
};
