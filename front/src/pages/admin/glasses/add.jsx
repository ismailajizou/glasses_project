import AddGlassesForm from "@/components/complex/AddGlassesForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";

const AddGlassesPage = () => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  return <AddGlassesForm />;
};
export default AddGlassesPage;
