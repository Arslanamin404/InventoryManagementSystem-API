import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { showToast } from "../utils/showToast";
import axiosInstance from "../api/api";

export const Inventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data.data.products);
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
    fetchProducts();
  }, []);

  return (
    <>
      <div className="mb-2">
        <Button className="bg-blue-600 hover:bg-blue-700 duration-300">
          ADD PRODUCT
        </Button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-md text-gray-700 uppercase bg-slate-300/70">
            <tr>
              <th scope="col" className="px-6 py-3">
                Slug
              </th>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Subcategory
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="text-xs px-6 py-3">
                lowStockThresh
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="bg-white border-b border-gray-200 hover:bg-gray-100">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {product.slug}
                </th>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4">{product.category_id?.name}</td>
                <td className="px-6 py-4">{product.subcategory_id?.name}</td>
                <td className="px-6 py-4 text-right">${product.price}</td>
                <td className="px-6 py-4 text-right">${product.quantity}</td>
                <td className="px-6 py-4 text-right">
                  ${product.lowStockThreshold}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
