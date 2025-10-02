// src/components/PublicLayout.jsx
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* This will render the nested routes */}
    </div>
  );
}