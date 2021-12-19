import { Route, Routes } from "react-router-dom";
import Header from "./shared/containers/Header";
import Home from "./features/home/pages/Home";
import Suppliers from "./features/supplier/pages/Suppliers";
import SupplierDetails from "./features/supplier/pages/SupplierDetails";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import OutletList from "./features/outlet/pages/OutletList";
import SingleColumnLayout from "./shared/layouts/SingleColumnLayout";
import OutletDetails from "./features/outlet/pages/OutletDetails";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SingleColumnLayout />}>
          <Route index element={<Home />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/:id" element={<SupplierDetails />} />
          <Route path="outlets" element={<OutletList />} />
          <Route path="outlets/:id" element={<OutletDetails />} />
        </Route>
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
