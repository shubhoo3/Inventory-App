import React, { useState } from "react";
import { updateProduct } from "../api";

export default function ProductRow({ product, onRefresh, onSelect, setProducts }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...product });

  async function save() {
    try {
      const updated = await updateProduct(product.id, { ...form, changedBy: "admin" });
      setProducts((p) => p.map((x) => (x.id === product.id ? updated : x)));
      setEditing(false);
    } catch (err) {
      alert("Update failed");
      onRefresh();
    }
  }

  if (editing) {
    return (
      <tr>
        <td>—</td>
        <td>
          <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </td>
        <td>
          <input className="form-control" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        </td>
        <td>
          <input className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </td>
        <td>
          <input className="form-control" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          />
        </td>
        <td>{form.stock > 0 ? "In Stock" : "Out of Stock"}</td>
        <td>
          <button className="btn btn-success btn-sm me-2" onClick={save}>
            Save
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr onClick={() => onSelect(product)} style={{ cursor: "pointer" }}>
      <td>—</td>
      <td>{product.name}</td>
      <td>{product.unit}</td>
      <td>{product.category}</td>
      <td>{product.brand}</td>
      <td>{product.stock}</td>
      <td>
        <span className={`badge ${product.stock > 0 ? "bg-success" : "bg-danger"}`}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td>
        <button
          className="btn btn-primary btn-sm me-2"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            alert("Delete functionality not implemented yet.");
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
