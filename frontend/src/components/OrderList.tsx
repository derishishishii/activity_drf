// src/components/OrderList.tsx
import React, { useEffect, useState } from "react";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../api";
import type { Order } from "./types";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: "badge badge-pending",
    processing: "badge badge-processing",
    shipped: "badge badge-shipped",
    delivered: "badge badge-delivered",
    cancelled: "badge badge-cancelled",
  };
  return map[status] || "badge";
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState<number | "">("");
  const [status, setStatus] = useState<Order["status"]>("pending");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCustomerId, setEditCustomerId] = useState<number | "">("");
  const [editStatus, setEditStatus] = useState<Order["status"]>("pending");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { setOrders(await getOrders()); }
    catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!customerId) return;
    try {
      const o = await createOrder({ customer: Number(customerId), status, notes });
      setOrders(p => [...p, o]);
      setCustomerId(""); setStatus("pending"); setNotes("");
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteOrder(id); setOrders(p => p.filter(o => o.id !== id)); }
    catch (e) { console.error(e); }
  };

  const startEdit = (o: Order) => {
    setEditingId(o.id); setEditCustomerId(o.customer);
    setEditStatus(o.status); setEditNotes(o.notes || "");
  };

  const cancelEdit = () => { setEditingId(null); setEditCustomerId(""); setEditStatus("pending"); setEditNotes(""); };

  const handleUpdate = async (id: number) => {
    if (!editCustomerId) return;
    try {
      const updated = await updateOrder(id, { customer: Number(editCustomerId), status: editStatus, notes: editNotes });
      setOrders(p => p.map(o => o.id === updated.id ? updated : o));
      cancelEdit();
    } catch (e) { console.error(e); }
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return (
      String(o.id).includes(q) ||
      String(o.customer).includes(q) ||
      o.status.toLowerCase().includes(q) ||
      (o.notes || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <p className="section-label">➕ Create New Order</p>
        <div className="grid-form grid-3">
          <input type="number" placeholder="Customer ID *" value={customerId} onChange={e => setCustomerId(e.target.valueAsNumber || "")} min="1" />
          <select value={status} onChange={e => setStatus(e.target.value as Order["status"])}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>+ Create Order</button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#5a5878" }}>🔍</span>
            <input className="search-input" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 12, color: "#5a5878", background: "#1e1e2e", padding: "3px 10px", borderRadius: 20, border: "1px solid #2a2a3a", whiteSpace: "nowrap" }}>
            {filtered.length} / {orders.length}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Date</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🔍</div>
                  {search ? `No orders matching "${search}"` : "No orders yet. Create one above!"}
                </div>
              </td></tr>
            )}
            {filtered.map(o => (
              <tr key={o.id}>
                {editingId === o.id ? (
                  <>
                    <td style={{ color: "#5a5878" }}>#{o.id}</td>
                    <td><input type="number" value={editCustomerId} onChange={e => setEditCustomerId(e.target.valueAsNumber || "")} /></td>
                    <td>
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value as Order["status"])}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td><input value={editNotes} onChange={e => setEditNotes(e.target.value)} /></td>
                    <td style={{ color: "#5a5878", fontSize: 12 }}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}</td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button className="btn btn-save" onClick={() => handleUpdate(o.id)}>Save</button>
                        <button className="btn btn-cancel" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td><span style={{ fontWeight: 700, color: "#a78bfa", fontFamily: "'Playfair Display', serif", fontSize: 15 }}>#{o.id}</span></td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 24, height: 24, borderRadius: 6, background: "#2a2040", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>👤</span>
                        Customer #{o.customer}
                      </span>
                    </td>
                    <td><span className={statusBadge(o.status)}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.notes || <span style={{ color: "#3a3a52" }}>—</span>}</td>
                    <td style={{ color: "#5a5878", fontSize: 12 }}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}</td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button className="btn btn-edit" onClick={() => startEdit(o)}>Edit</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(o.id)}>Delete</button>
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

export default OrderList;
