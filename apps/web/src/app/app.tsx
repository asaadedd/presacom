import { Route, Routes } from "react-router-dom";
import Header from "./shared/container/Header";
import Home from "./features/home/pages/Home";
import Suppliers from "./features/supplier/pages/Suppliers";
import SupplierDetails from "./features/supplier/pages/SupplierDetails";
import { ToastContainer } from "react-toastify";

export function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/:id" element={<SupplierDetails />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
