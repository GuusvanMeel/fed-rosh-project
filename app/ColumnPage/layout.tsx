"use client";

export default function ColumnPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",          // ⭐ FIX WIDTH COLLAPSE
        display: "flex",
        padding: "20px",
        background: "#f9f9f9",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%" }}>   {/* ⭐ ENSURE CHILD EXPANDS */}
        {children}
      </div>
    </div>
  );
}