import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const EditProductForm = ({ product, onSubmit }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      category_id: product.category_id?._id || "",
      subcategory_id: product.subcategory_id?._id || "",
      price: product.price || "",
      lowStockThreshold: product.lowStockThreshold || "",
    },
  });

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Edit Product</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Product name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            rows={3}
            placeholder="Product description"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Category ID
          </label>
          <input
            type="text"
            {...register("category_id")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Category ID"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Subcategory ID
          </label>
          <input
            type="text"
            {...register("subcategory_id")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Subcategory ID"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Price"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Low Stock Threshold
          </label>
          <input
            type="number"
            {...register("lowStockThreshold")}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="e.g. 10"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
