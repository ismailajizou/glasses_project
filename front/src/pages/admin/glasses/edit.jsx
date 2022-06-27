import AddGlassesForm from "@/components/complex/AddGlassesForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";

const EditPage = () => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  const { id } = useParams()
  const { data, error } =  useFetch("/api/glasses/form/all");
  const { data: initials, error: itemError } =  useFetch("/glasses/" + id);
  if (error || itemError) return <div>failed to load</div>
  if (!data || !initials) return <LoadingSpinner />
  return <AddGlassesForm data={data} initialValues={initials} edit/>
};
export default EditPage;