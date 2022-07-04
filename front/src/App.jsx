import { Route, Routes } from "react-router-dom";
import { NotificationProvider } from "./hooks/useNotification";
import HomePage from "./pages";
import NotFound from "./pages/404";
import BrandsPage from "./pages/admin/brands";
import CollectionsPage from "./pages/admin/collections";
import Dashboard from "./pages/admin/dashboard";
import FrameColorsPage from "./pages/admin/frames/colors";
import MaterialsPage from "./pages/admin/frames/materials";
import AddGlassesPage from "./pages/admin/glasses/add";
import EditPage from "./pages/admin/glasses/edit";
import GlassesPage from "./pages/admin/glasses/index";
import GlassesById from "./pages/admin/glasses/[id]";
import LensColorsPage from "./pages/admin/lens/colors";
import LoginAdmin from "./pages/admin/login";
import AdminProfile from "./pages/admin/profile";
import TryOnPage from "./pages/[ref]/try-on";

function App({}) {
  return (
    <NotificationProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="try-on/:ref" element={<TryOnPage />} />
        <Route path="admin">
          <Route index element={<Dashboard />} />
          <Route path="login" element={<LoginAdmin />} />
          <Route path="profile" element={<AdminProfile />} />

          <Route path="glasses">
            <Route index element={<GlassesPage />} />
            <Route path="add" element={<AddGlassesPage />} />
            <Route path=":id" element={<GlassesById />} />
            <Route path=":id/edit" element={<EditPage />} />
          </Route>
          <Route path="brands" element={<BrandsPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="frames">
            <Route path="colors" element={<FrameColorsPage />} />
            <Route path="materials" element={<MaterialsPage />} />
          </Route>
          <Route path="lens">
            <Route path="colors" element={<LensColorsPage />} />
          </Route>
          
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
