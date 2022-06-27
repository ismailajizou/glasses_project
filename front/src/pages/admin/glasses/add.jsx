import AddGlassesForm from "@/components/complex/AddGlassesForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";

const AddGlassesPage = () => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  const { data, error } =  useFetch("/api/glasses/form/all");
  if (error) return <div>failed to load</div>
  if (!data) return <LoadingSpinner />
  return <AddGlassesForm data={data} />
};
export default AddGlassesPage;