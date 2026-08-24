import { RouterProvider } from "react-router-dom";
import router from "./Route";
import "./App.css";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  return <>
      <RouterProvider router={router} />
  </>;
};

export default App;
