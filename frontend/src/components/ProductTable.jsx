import React from "react";
import ProductRow from "./ProductRow";

export default function ProductTable({
  products,
  total,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  onRefresh,
  onSelect,
  setProducts,
}) {
  const totalPages = Math.ceil(total / itemsPerPage);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="container mt-4">
      <table className="table table-hover table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onRefresh={onRefresh}
              onSelect={onSelect}
              setProducts={setProducts}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </button>
          </li>

          {pages.map((num) => (
            <li
              key={num}
              className={`page-item ${num === currentPage ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(num)}>
                {num}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Page info */}
      <div className="text-center text-muted small mt-2">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
