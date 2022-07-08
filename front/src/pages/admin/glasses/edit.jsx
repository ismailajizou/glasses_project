import AddGlassesForm from "@/components/complex/AddGlassesForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";

const EditPage = () => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });

  const { id } = useParams()
  const { data: initials, error } =  useFetch("/glasses/" + id);
  if (error) return <div>failed to load</div>
  if (!initials) return <LoadingSpinner />
  return <AddGlassesForm initialValues={initials} edit/>
};
export default EditPage;