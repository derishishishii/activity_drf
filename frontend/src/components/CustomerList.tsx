// src/components/CustomerList.tsx
import React, { useEffect, useState } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api";
import type { Customer } from "./types";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try { setCustomers(await getCustomers()); }
    catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!firstName || !lastName || !email) return;
    try {
      const c = await createCustomer({ first_name: firstName, last_name: lastName, email, phone, address });
      setCustomers(p => [...p, c]);
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setAddress("");
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteCustomer(id); setCustomers(p => p.filter(c => c.id !== id)); }
    catch (e) { console.error(e); }
  };

  const startEdit = (c: Customer) => {
    setEditingId(c.id); setEditFirstName(c.first_name); setEditLastName(c.last_name);
    setEditEmail(c.email); setEditPhone(c.phone || ""); setEditAddress(c.address || "");
  };

  const cancelEdit = () => {
    setEditingId(null); setEditFirstName(""); setEditLastName("");
    setEditEmail(""); setEditPhone(""); setEditAddress("");
  };

  const handleUpdate = async (id: number) => {
    if (!editFirstName || !editLastName || !editEmail) return;
    try {
      const updated = await updateCustomer(id, { first_name: editFirstName, last_name: editLastName, email: editEmail, phone: editPhone, address: editAddress });
      setCustomers(p => p.map(c => c.id === updated.id ? updated : c));
      cancelEdit();
    } catch (e) { console.error(e); }
  };

  const getInitials = (first: string, last: string) =>
    `${first[0] || ""}${last[0] || ""}`.toUpperCase();

  const avatarColors = ["#7c3aed", "#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626"];
  const getColor = (id: number) => avatarColors[id % avatarColors.length];

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.address || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Create Form */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <p className="section-label">➕ Add New Customer</p>
        <div className="grid-form grid-3">
          <input placeholder="First Name *" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input placeholder="Last Name *" value={lastName} onChange={e => setLastName(e.target.value)} />
          <input type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
          <input placeholder="Address (optional)" value={address} onChange={e => setAddress(e.target.value)} />
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleCreate}>+ Add Customer</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2a3a", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#5a5878" }}>🔍</span>
            <input className="search-input" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 12, color: "#5a5878", background: "#1e1e2e", padding: "3px 10px", borderRadius: 20, border: "1px solid #2a2a3a", whiteSpace: "nowrap" }}>
            {filtered.length} / {customers.length}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5}>
                <div className="empty-state">
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>🔍</div>
                  {search ? `No customers matching "${search}"` : "No customers yet. Add one above!"}
                </div>
              </td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                {editingId === c.id ? (
                  <>
                    <td><input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} placeholder="First name" /></td>
                    <td><input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email" /></td>
                    <td><input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="Phone" /></td>
                    <td><input value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="Address" /></td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button className="btn btn-save" onClick={() => handleUpdate(c.id)}>Save</button>
                        <button className="btn btn-cancel" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: getColor(c.id), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>
                          {getInitials(c.first_name, c.last_name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#e8e6f0", fontSize: 14 }}>{c.first_name} {c.last_name}</div>
                          <div style={{ fontSize: 11, color: "#5a5878" }}>ID #{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "#a78bfa" }}>{c.email}</td>
                    <td>{c.phone || <span style={{ color: "#3a3a52" }}>—</span>}</td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.address || <span style={{ color: "#3a3a52" }}>—</span>}</td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button className="btn btn-edit" onClick={() => startEdit(c)}>Edit</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
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

export default CustomerList;
