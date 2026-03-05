// src/App.tsx
import React, { useState } from "react";
import CustomerList from "./components/CustomerList";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";
import OrderItemList from "./components/OrderItemList";

type Page = "customers" | "products" | "orders" | "order-items";

const NAV_ITEMS: { id: Page; label: string; icon: string; desc: string }[] = [
  { id: "customers", label: "Customers", icon: "👤", desc: "Manage your clients" },
  { id: "products", label: "Products", icon: "📦", desc: "Inventory & catalog" },
  { id: "orders", label: "Orders", icon: "🧾", desc: "Track transactions" },
  { id: "order-items", label: "Order Items", icon: "🔖", desc: "Line item details" },
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>("customers");
  const active = NAV_ITEMS.find(n => n.id === activePage)!;

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", fontFamily: "'DM Sans', sans-serif", color: "#e8e6f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f13; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a24; }
        ::-webkit-scrollbar-thumb { background: #3d3a52; border-radius: 3px; }

        .nav-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 12px; border: none;
          cursor: pointer; transition: all 0.2s ease; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; background: transparent; color: #7c7a94;
          white-space: nowrap;
        }
        .nav-btn:hover { background: #1e1e2e; color: #e8e6f0; }
        .nav-btn.active { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; box-shadow: 0 4px 20px rgba(124,58,237,0.4); }

        .card { background: #16161f; border: 1px solid #2a2a3a; border-radius: 16px; }

        input, select, textarea {
          background: #1e1e2e !important; border: 1px solid #2a2a3a !important;
          color: #e8e6f0 !important; border-radius: 10px !important;
          padding: 10px 14px !important; font-family: 'DM Sans', sans-serif !important;
          font-size: 14px !important; outline: none !important; width: 100% !important;
          transition: border-color 0.2s !important;
        }
        input:focus, select:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.15) !important; }
        input::placeholder { color: #4a4a64 !important; }
        select option { background: #1e1e2e; color: #e8e6f0; }

        table { width: 100%; border-collapse: collapse; }
        thead th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #5a5878; border-bottom: 1px solid #2a2a3a; }
        tbody tr { border-bottom: 1px solid #1e1e2e; transition: background 0.15s; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #1a1a26; }
        tbody td { padding: 14px 16px; font-size: 14px; color: #c8c6d8; }

        .btn { padding: 9px 18px; border-radius: 9px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .btn-primary { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; box-shadow: 0 4px 15px rgba(124,58,237,0.35); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.5); }
        .btn-edit { background: #2a2040; color: #a78bfa; border: 1px solid #3d2f6e; }
        .btn-edit:hover { background: #352a52; }
        .btn-save { background: #0d3320; color: #34d399; border: 1px solid #1a5c3a; }
        .btn-save:hover { background: #124028; }
        .btn-cancel { background: #1e1e2e; color: #7c7a94; border: 1px solid #2a2a3a; }
        .btn-cancel:hover { background: #252535; }
        .btn-delete { background: #2a1520; color: #f87171; border: 1px solid #5c1f2e; }
        .btn-delete:hover { background: #351a25; }

        .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; }
        .badge-pending { background: #2a2010; color: #fbbf24; border: 1px solid #4a3a18; }
        .badge-processing { background: #0d1f3a; color: #60a5fa; border: 1px solid #1a3a6a; }
        .badge-shipped { background: #1a1040; color: #818cf8; border: 1px solid #2a2060; }
        .badge-delivered { background: #0a2a1a; color: #34d399; border: 1px solid #1a4a30; }
        .badge-cancelled { background: #2a1015; color: #f87171; border: 1px solid #5a2020; }
        .badge-stock-ok { background: #0a2a1a; color: #34d399; border: 1px solid #1a4a30; }
        .badge-stock-low { background: #2a2010; color: #fbbf24; border: 1px solid #4a3a18; }
        .badge-stock-out { background: #2a1015; color: #f87171; border: 1px solid #5a2020; }

        .page-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #e8e6f0; margin-bottom: 4px; }
        .page-sub { font-size: 14px; color: #5a5878; margin-bottom: 24px; }
        .section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #5a5878; margin-bottom: 14px; }
        .grid-form { display: grid; gap: 12px; margin-bottom: 16px; }
        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 640px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }
        .empty-state { padding: 48px; text-align: center; color: #3a3a52; font-size: 14px; }
        .search-input { padding-left: 38px !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#e8e6f0" }}>OrderFlow</span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} className={`nav-btn ${activePage === item.id ? "active" : ""}`} onClick={() => setActivePage(item.id)}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div style={{ width: 32, height: 32, borderRadius: 50, background: "#1e1e2e", border: "1px solid #2a2a3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22 }}>{active.icon}</span>
            <h1 className="page-title">{active.label}</h1>
          </div>
          <p className="page-sub">{active.desc}</p>
        </div>

        {activePage === "customers" && <CustomerList />}
        {activePage === "products" && <ProductList />}
        {activePage === "orders" && <OrderList />}
        {activePage === "order-items" && <OrderItemList />}
      </div>
    </div>
  );
};

export default App;
