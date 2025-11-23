import React, { useEffect, useState } from "react";
import { getProductHistory } from "../api";

export default function InventorySidebar({ product }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (product) {
      getProductHistory(product.id).then(setLogs);
    }
  }, [product]);

  return (
    <div className="p-3 border-start bg-light" style={{ width: "350px" }}>
      {!product ? (
        <p className="text-muted">Select a product to see history</p>
      ) : (
        <>
          <h5 className="mb-3">{product.name} — Inventory History</h5>
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Old</th>
                <th>New</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.timestamp).toLocaleString()}</td>
                  <td>{l.oldStock}</td>
                  <td>{l.newStock}</td>
                  <td>{l.changedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
