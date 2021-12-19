import { Outlet } from "react-router-dom";
import Header from "../containers/Header";

function SingleColumnLayout() {
  return (
    <>
      <Header/>
      <Outlet />
    </>
  )
}

export default SingleColumnLayout;
