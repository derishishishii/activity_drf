// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api";
import type { Product } from "./types";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [editStock, setEditStock] = useState<number | "">("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try { setProducts(await getProducts()); }
    catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!name || !price || stock === "") return;
    try {
      const p = await createProduct({ name, description, price: Number(price), stock: Number(stock) });
      setProducts(prev => [...prev, p]);
      setName(""); setDescription(""); setPrice(""); setStock("");
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteProduct(id); setProducts(p => p.filter(x => x.id !== id)); }
    catch (e) { console.error(e); }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id); setEditName(p.name);
    setEditDescription(p.description ?? ""); setEditPrice(p.price); setEditStock(p.stock);
  };

  const cancelEdit = () => { setEditingId(null); setEditName(""); setEditDescription(""); setEditPrice(""); setEditStock(""); };

  const handleUpdate = async (id: number) => {
    if (!editName || !editPrice || editStock === "") return;
    try {
      const updated = await updateProduct(id, { name: editName, description: editDescription, price: Number(editPrice), stock: Number(editStock) });
      setProducts(p => p.map(x => x.id === updated.id ? updated : x));
      cancelEdit();
    } catch (e) { console.error(e); }
  };

  const stockBadge = (s: number) => {
    if (s === 0) return { cls: "badge badge-stock-out", label: "Out of Stock" };
    if (s < 10) return { cls: "badge badge-stock-low", label: `${s} low` };
    return { cls: "badge badge-stock-ok", label: `${s} in stock` };
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      String(p.price).includes(q) ||
      String(p.stock).includes(q)
    );
  });

  return (
    <div>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <p className="section-label">➕ Add New Product</p>
        <div className="grid-form grid-2">
          <input placeholder="Product Name *" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <input type="number" placeholder="Price *" value={price} onChange={e => setPrice(e.target.valueAsNumber || "")} step="0.01" min="0" />
          <input type="number" placeholder="Stock Quantity *" value={stock} onChange={e => setStock(e.target.valueAsNumber || "")} min="0" />
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>+ Add Product</button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#5a5878" }}>🔍</span>
            <input className="search-input" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 12, color: "#5a5878", background: "#1e1e2e", padding: "3px 10px", borderRadius: 20, border: "1px solid #2a2a3a", whiteSpace: "nowrap" }}>
            {filtered.length} / {products.length}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5}>
                <div className="empty-state">
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🔍</div>
                  {search ? `No products matching "${search}"` : "No products yet. Add one above!"}
                </div>
              </td></tr>
            )}
            {filtered.map(p => {
              const sb = stockBadge(p.stock);
              return (
                <tr key={p.id}>
                  {editingId === p.id ? (
                    <>
                      <td><input value={editName} onChange={e => setEditName(e.target.value)} /></td>
                      <td><input value={editDescription} onChange={e => setEditDescription(e.target.value)} /></td>
                      <td><input type="number" value={editPrice} onChange={e => setEditPrice(e.target.valueAsNumber || "")} step="0.01" /></td>
                      <td><input type="number" value={editStock} onChange={e => setEditStock(e.target.valueAsNumber || "")} /></td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="btn btn-save" onClick={() => handleUpdate(p.id)}>Save</button>
                          <button className="btn btn-cancel" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1e1e2e", border: "1px solid #2a2a3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>
                          <span style={{ fontWeight: 600, color: "#e8e6f0" }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description || <span style={{ color: "#3a3a52" }}>—</span>}</td>
                      <td><span style={{ fontWeight: 700, color: "#34d399", fontSize: 15 }}>${Number(p.price).toFixed(2)}</span></td>
                      <td><span className={sb.cls}>{sb.label}</span></td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="btn btn-edit" onClick={() => startEdit(p)}>Edit</button>
                          <button className="btn btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
