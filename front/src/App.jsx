import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import { NotificationProvider } from "./hooks/useNotification";

const HomePage = lazy(() => import("./pages"));
const NotFound = lazy(() => import("./pages/404"));
const TryOnPage = lazy(() => import("./pages/[ref]/try-on"));
const LoginAdmin = lazy(() => import("./pages/admin/login"));
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const AdminProfile = lazy(() => import("./pages/admin/profile"));
const BrandsPage = lazy(() => import("./pages/admin/brands"));
const ProvidersPage = lazy(() => import("./pages/admin/providers"));
const CollectionsPage = lazy(() => import("./pages/admin/collections"));
const FrameColorsPage = lazy(() => import("./pages/admin/frames/colors"));
const MaterialsPage = lazy(() => import("./pages/admin/frames/materials"));
const AddGlassesPage = lazy(() => import("./pages/admin/glasses/add"));
const EditPage = lazy(() => import("./pages/admin/glasses/edit"));
const GlassesPage = lazy(() => import("./pages/admin/glasses/index"));
const GlassesById = lazy(() => import("./pages/admin/glasses/[id]"));
const LensColorsPage = lazy(() => import("./pages/admin/lens/colors"));


function App({}) {
  return (
    <NotificationProvider>
      <Suspense fallback={<LoadingSpinner />}>
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
            <Route path="providers" element={<ProvidersPage />} />
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
      </Suspense>
    </NotificationProvider>
  );
}

export default App;
