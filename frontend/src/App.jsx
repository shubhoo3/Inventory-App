import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  searchProducts,
  importCSV,
  exportCSV,
} from "./api";
import Header from "./components/Header";
import ProductTable from "./components/ProductTable";
import InventorySidebar from "./components/InventorySidebar";
import ImportExport from "./components/ImportExport";

export default function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Load all products
  async function loadAll() {
    const p = await fetchProducts();
    setProducts(p);
  }

  useEffect(() => {
    loadAll();
  }, []);

  // Handle search
  async function onSearch(name) {
    setQuery(name);
    setCurrentPage(1); // reset pagination

    if (!name) {
      await loadAll();
      return;
    }

    const p = await searchProducts(name);
    setProducts(p);
  }

  // Category filter
  function onCategoryChange(cat) {
    setCategoryFilter(cat);
    setCurrentPage(1);
  }

  // Get filtered products
  const visible = products.filter(
    (p) => !categoryFilter || p.category === categoryFilter
  );

  // Pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedProducts = visible.slice(indexOfFirst, indexOfLast);

  // Category list for dropdown
  const categoryList = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <div className="app">
      {/* Top Header */}
      <Header
        onSearch={onSearch}
        onCategoryChange={onCategoryChange}
        categories={categoryList}
      >
        <ImportExport
          onImported={loadAll}
          onExported={() =>
            exportCSV().then((blob) => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "products_export.csv";
              a.click();
              URL.revokeObjectURL(url);
            })
          }
        />
      </Header>

      {/* Layout: Table Left + History Right */}
      <main
        className="d-flex"
        style={{  minHeight: "100vh", width: "100vw", background: "#f8f9fa", overflowX: "hidden", }}
      >
        {/* Product Table */}
        <div style={{ flex: 1 }}>
          <ProductTable
            products={paginatedProducts}
            total={visible.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            onRefresh={loadAll}
            onSelect={(p) => setSelectedProduct(p)}
            setProducts={setProducts}
          />
        </div>

        {/* Sidebar */}
        <InventorySidebar product={selectedProduct} />
      </main>
    </div>
  );
}
