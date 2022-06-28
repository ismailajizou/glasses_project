import { Route, Routes } from "react-router-dom";
import HomePage from "./pages";
import NotFound from "./pages/404";
import BrandsPage from "./pages/admin/brands";
import CollectionsPage from "./pages/admin/collections";
import Dashboard from "./pages/admin/dashboard";
import AddGlassesPage from "./pages/admin/glasses/add";
import EditPage from "./pages/admin/glasses/edit";
import GlassesPage from "./pages/admin/glasses/index";
import GlassesById from "./pages/admin/glasses/[id]";
import LoginAdmin from "./pages/admin/login";

function App({}) {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="admin">
        <Route index element={<Dashboard />} />
        <Route path="glasses">
          <Route index element={<GlassesPage />} />
          <Route path="add" element={<AddGlassesPage />} />
          <Route path=":id" element={<GlassesById />} />
          <Route path=":id/edit" element={<EditPage />} />
        </Route>
        <Route path="brands" element={<BrandsPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="login" element={<LoginAdmin />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
