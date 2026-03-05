// src/components/OrderItemList.tsx
import React, { useEffect, useState } from "react";
import { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem } from "../api";
import type { OrderItem } from "./types";

const OrderItemList: React.FC = () => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState("");
  const [orderId, setOrderId] = useState<number | "">("");
  const [productId, setProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unitPrice, setUnitPrice] = useState<number | "">("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editOrderId, setEditOrderId] = useState<number | "">("");
  const [editProductId, setEditProductId] = useState<number | "">("");
  const [editQuantity, setEditQuantity] = useState<number | "">("");
  const [editUnitPrice, setEditUnitPrice] = useState<number | "">("");

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { setItems(await getOrderItems()); }
    catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!orderId || !productId || !quantity || !unitPrice) return;
    try {
      const item = await createOrderItem({ order: Number(orderId), product: Number(productId), quantity: Number(quantity), unit_price: Number(unitPrice) });
      setItems(p => [...p, item]);
      setOrderId(""); setProductId(""); setQuantity(""); setUnitPrice("");
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteOrderItem(id); setItems(p => p.filter(i => i.id !== id)); }
    catch (e) { console.error(e); }
  };

  const startEdit = (i: OrderItem) => {
    setEditingId(i.id); setEditOrderId(i.order); setEditProductId(i.product);
    setEditQuantity(i.quantity); setEditUnitPrice(i.unit_price);
  };

  const cancelEdit = () => { setEditingId(null); setEditOrderId(""); setEditProductId(""); setEditQuantity(""); setEditUnitPrice(""); };

  const handleUpdate = async (id: number) => {
    if (!editOrderId || !editProductId || !editQuantity || !editUnitPrice) return;
    try {
      const updated = await updateOrderItem(id, { order: Number(editOrderId), product: Number(editProductId), quantity: Number(editQuantity), unit_price: Number(editUnitPrice) });
      setItems(p => p.map(i => i.id === updated.id ? updated : i));
      cancelEdit();
    } catch (e) { console.error(e); }
  };

  const subtotal = (q: number | "", u: number | "") =>
    q && u ? `$${(Number(q) * Number(u)).toFixed(2)}` : "—";

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    return (
      String(i.order).includes(q) ||
      String(i.product).includes(q) ||
      String(i.quantity).includes(q) ||
      String(i.unit_price).includes(q)
    );
  });

  return (
    <div>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <p className="section-label">➕ Add Order Item</p>
        <div className="grid-form grid-2">
          <input type="number" placeholder="Order ID *" value={orderId} onChange={e => setOrderId(e.target.valueAsNumber || "")} min="1" />
          <input type="number" placeholder="Product ID *" value={productId} onChange={e => setProductId(e.target.valueAsNumber || "")} min="1" />
          <input type="number" placeholder="Quantity *" value={quantity} onChange={e => setQuantity(e.target.valueAsNumber || "")} min="1" />
          <input type="number" placeholder="Unit Price *" value={unitPrice} onChange={e => setUnitPrice(e.target.valueAsNumber || "")} step="0.01" min="0" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn btn-primary" onClick={handleCreate}>+ Add Item</button>
          {quantity && unitPrice && (
            <span style={{ fontSize: 13, color: "#5a5878" }}>
              Subtotal: <span style={{ color: "#34d399", fontWeight: 700 }}>{subtotal(quantity, unitPrice)}</span>
            </span>
          )}
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#5a5878" }}>🔍</span>
            <input className="search-input" placeholder="Search order items..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 12, color: "#5a5878", background: "#1e1e2e", padding: "3px 10px", borderRadius: 20, border: "1px solid #2a2a3a", whiteSpace: "nowrap" }}>
            {filtered.length} / {items.length}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🔍</div>
                  {search ? `No items matching "${search}"` : "No order items yet. Add one above!"}
                </div>
              </td></tr>
            )}
            {filtered.map(i => (
              <tr key={i.id}>
                {editingId === i.id ? (
                  <>
                    <td><input type="number" value={editOrderId} onChange={e => setEditOrderId(e.target.valueAsNumber || "")} /></td>
                    <td><input type="number" value={editProductId} onChange={e => setEditProductId(e.target.valueAsNumber || "")} /></td>
                    <td><input type="number" value={editQuantity} onChange={e => setEditQuantity(e.target.valueAsNumber || "")} /></td>
                    <td><input type="number" value={editUnitPrice} onChange={e => setEditUnitPrice(e.target.valueAsNumber || "")} step="0.01" /></td>
                    <td style={{ color: "#34d399", fontWeight: 700 }}>{subtotal(editQuantity, editUnitPrice)}</td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button className="btn btn-save" onClick={() => handleUpdate(i.id)}>Save</button>
                        <button className="btn btn-cancel" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td><span style={{ fontWeight: 700, color: "#a78bfa" }}>#{i.order}</span></td>
                    <td><span style={{ fontWeight: 600, color: "#e8e6f0" }}>Product #{i.product}</span></td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "#1e1e2e", border: "1px solid #2a2a3a", fontWeight: 700, color: "#e8e6f0", fontSize: 13 }}>{i.quantity}</span>
                    </td>
                    <td style={{ color: "#c8c6d8" }}>${Number(i.unit_price).toFixed(2)}</td>
                    <td><span style={{ fontWeight: 700, color: "#34d399", fontSize: 15 }}>${(Number(i.quantity) * Number(i.unit_price)).toFixed(2)}</span></td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button className="btn btn-edit" onClick={() => startEdit(i)}>Edit</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(i.id)}>Delete</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderItemList;
