import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import axiosInstance from "../api/api";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${productId}`);
        setProduct(res.data.data.product);
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-4">
      <ProductCard product={product} />
    </div>
  );
};

export default ProductDetail;
