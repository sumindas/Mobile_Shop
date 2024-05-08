
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "./ProductList";
import { BASE_URL } from "../../Api/api";

function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`);
        setProducts(response.data);
        console.log("Res:", response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductList key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
