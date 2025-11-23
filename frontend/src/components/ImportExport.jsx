import React, { useRef } from "react";
import { importCSV } from "../api";

export default function ImportExport({ onImported, onExported }) {
  const fileRef = useRef();

  async function handleImport() {
    const f = fileRef.current.files[0];
    if (!f) return alert("Choose a CSV file first.");

    const res = await importCSV(f);
    alert(`Imported: ${res.added}, Skipped: ${res.skipped}`);
    onImported && onImported();
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <input ref={fileRef} type="file" accept=".csv" className="form-control" />

      <button className="btn btn-outline-primary" onClick={handleImport}>
        Import
      </button>

      <button className="btn btn-outline-warning" onClick={onExported}>
        Export
      </button>
    </div>
  );
}
