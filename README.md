# Product Inventory Management System

A complete full-stack **Inventory Management System** built using:

* **React (Frontend)**
* **Node.js + Express (Backend)**
* **SQLite (Database)**
* **Bootstrap (UI Styling)**

This application supports product management, CSV import/export, inline editing, pagination, and inventory history tracking.

---

## 🚀 Features

### ✅ Frontend (React)

* Search products by name
* Filter by category
* Add New Product (modal)
* Import CSV (products)
* Export products to CSV
* Inline editing of product rows
* Pagination (Bootstrap style)
* Inventory history sidebar
* Modern UI with Bootstrap

### ✅ Backend (Node.js + Express + SQLite)

* Product CRUD operations
* CSV Import API
* CSV Export API
* Search API
* Update product API (with validation)
* Inventory change tracking (logs)
* History API per product
* Auto stock status handling

---

## 🧱 Project Structure

```
inventory-app/
├─ backend/
│  ├─ server.js
│  ├─ db.js
│  ├─ routes/
│  │  └─ products.js
│  ├─ uploads/
│  └─ data.sqlite
│
├─ frontend/
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ api.js
│  │  ├─ components/
│  │  │  ├─ Header.jsx
│  │  │  ├─ ProductTable.jsx
│  │  │  ├─ ProductRow.jsx
│  │  │  ├─ ImportExport.jsx
│  │  │  ├─ InventorySidebar.jsx
│  │  │  └─ AddProductModal.jsx
│  ├─ index.html
│  └─ vite.config.js
│
└─ README.md
```

---

## 📄 CSV Format (Import)

Your CSV must contain **these headers**:

```
name,unit,category,brand,stock,status,image
```

Example:

```
Sample Product A,pcs,Electronics,BrandX,25,In Stock,
```

---

## 🔌 API Endpoints Summary

### **GET /api/products**

Returns all products.

### **GET /api/products/search?name=abc**

Returns filtered products.

### **POST /api/products/import**

Imports CSV file.

### **GET /api/products/export**

Exports database products as CSV.

### **PUT /api/products/:id**

Updates product + auto creates stock log.

### **GET /api/products/:id/history**

Returns product stock change logs.

<img width="1920" height="991" alt="image" src="https://github.com/user-attachments/assets/8370c277-4721-4859-877c-48fba29a0bf8" />

https://github.com/user-attachments/assets/c7fec993-abbf-4dc7-a231-da0e6ffba346
