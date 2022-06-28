import Color from "@/components/Color";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import http, { csrf } from "@/helpers/http";
import { capitalize } from "@/helpers/stringFormatters";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import AdminLayout from "@/layouts/AdminLayout";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GlassesById = ({}) => {
  useAuth({ middleware: "auth", redirectIfError: "/admin" });
  const { id } = useParams();
  const { data: item, error, mutate } = useFetch("/glasses/" + id);
  const to = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const deleteItem = async () => {
    try {
      await csrf();
      await http.delete("glasses/" + id);
      mutate("/glasses/" + id);
      to("/admin/glasses");
    } catch (error) {
      if (error.response.data.status) to("/admin");
    }
  };
  if (error) return to("/admin/glasses");
  if (!item) return <LoadingSpinner />;
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold ">Glasses N° {item.ref}</h1>
          <div className="flex">
            <button
              onClick={() => to("edit")}
              className="text-white mr-4 flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
            >
              Modify
            </button>
            <button
              onClick={() => openModal()}
              className="text-white flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
            >
              Delete
            </button>
          </div>
        </div>
        <div>
          <div className="w-80 h-60 flex items-center justify-center mx-auto relative">
            <img
              className="object-center"
              src={`${import.meta.env.VITE_API_URL}/features/${
                item.feature_image
              }`}
              alt={`feature of ${item.ref}`}
            />
            <div className="absolute text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-200 text-blue-800 top-4 right-0">
              {item.price} DHs
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <p className="text-xl font-medium text-center text-gray-900">
              {item.brand.name} - {item.collection.name}
            </p>
            <p className="text-lg font-medium text-center text-gray-700">
              {item.description}
            </p>
          </div>
        </div>
        <div className="flex justify-evenly flex-wrap max-w-xl mx-auto mt-4">
          <div className="bg-white rounded-lg py-4 px-8 shadow-md">
            <h2 className="text-center font-semibold text-lg">LENS</h2>
            <p className="my-2">
              <strong>Type: </strong>
              {item.lens_type || "None"}
            </p>
            <div className="flex items-center my-2">
              <strong>Color: </strong>
              <Color code={item.lens_color.code} name={item.lens_color.name} />
            </div>
          </div>
          <div className="bg-white rounded-lg py-4 px-8 shadow-md">
            <h2 className="text-center font-semibold text-lg">FRAME</h2>
            <p className="my-2">
              <strong>Type: </strong>
              {capitalize(item.frame_type)}
            </p>
            <p className="my-2">
              <strong>Shape: </strong>
              {capitalize(item.frame_shape.name)}
            </p>
            <p className="my-2">
              <strong>Material: </strong>
              {capitalize(item.frame_material.name)}
            </p>
            <div className="flex items-center my-2">
              <strong>Color: </strong>
              <Color
                code={item.frame_color.code}
                name={item.frame_color.name}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isOpen}
        closeModal={closeModal}
        title={"Confirmation"}
        onSubmit={deleteItem}
        actionName="Delete"
        actionColor="danger"
      >
        <p>Are you sure you want to delete this item?</p>
      </ConfirmationModal>
    </AdminLayout>
  );
};

export default GlassesById;
