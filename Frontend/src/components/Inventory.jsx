import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { showToast } from "../utils/showToast";
import axiosInstance from "../api/api";

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [slug, setSlug] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products", {
        params: {
          page,
          limit,
          slug: slug.trim(),
        },
      });

      const data = response.data.data;
      setProducts(data.products);
      setTotalPages(data.totalPages);
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

  useEffect(() => {
    fetchProducts();
  }, [page, slug]);

  const handleSearch = () => {
    setPage(1);
    setSlug(searchTerm);
  };

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex w-full flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <input
            placeholder="Search by Slug"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <button className="text-sm bg-blue-600 hover:bg-blue-700 duration-300">
          ADD PRODUCT
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-md text-gray-700 uppercase bg-slate-300/70">
              <tr>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Product name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Subcategory</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">lowStockThresh</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="bg-white border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {product.slug}
                    </td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.description}</td>
                    <td className="px-6 py-4">{product.category_id?.name}</td>
                    <td className="px-6 py-4">
                      {product.subcategory_id?.name}
                    </td>
                    <td className="px-6 py-4 text-right">${product.price}</td>
                    <td className="px-6 py-4 text-right">{product.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      {product.lowStockThreshold}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center gap-4">
        <Button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="bg-gray-700 hover:bg-gray-900 duration-300 hover:cursor-pointer"
        >
          Prev
        </Button>
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="bg-gray-700 hover:bg-gray-900 duration-300 hover:cursor-pointer"
        >
          Next
        </Button>
      </div>
    </>
  );
};
