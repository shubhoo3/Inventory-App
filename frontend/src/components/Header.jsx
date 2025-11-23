import React, { useState } from "react";

export default function Header({
  onSearch,
  onCategoryChange,
  categories,
  children,
}) {
  const [q, setQ] = useState("");

  return (
    <header className="container-fluid bg-dark text-white py-3 shadow-sm">
      <div className="container d-flex flex-wrap align-items-center justify-content-between">
        {/* Left Side */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          <input
            className="form-control"
            style={{ width: "200px" }}
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
          />

          <button className="btn btn-primary" onClick={() => onSearch(q)}>
            Search
          </button>

          <select
            className="form-select"
            style={{ width: "160px" }}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button className="btn btn-success">Add New Product</button>
        </div>

        {/* Right Side */}
        <div className="d-flex gap-2">{children}</div>
      </div>
    </header>
  );
}
