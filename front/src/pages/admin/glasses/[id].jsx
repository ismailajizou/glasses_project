import Color from "@/components/Color";
import Button from "@/components/forms/buttons/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import ModalWrapper from "@/components/modals/ModalWrapper";
import http, { csrf } from "@/helpers/http";
import { title } from "@/helpers/stringFormatters";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { useNotification } from "@/hooks/useNotification";
import AdminLayout from "@/layouts/AdminLayout";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GlassesById = ({}) => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });

  const { id } = useParams();
  const { data: item, error, mutate } = useFetch("/glasses/" + id);
  const to = useNavigate();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [linksModalOpen, setLinksModalOpen] = useState(false);

  const { showNotification } = useNotification();
  const deleteItem = async () => {
    try {
      await csrf();
      await http.delete("glasses/" + id);
      mutate("/glasses/" + id);
      showNotification({
        variant: "success",
        title: "Success",
        message: "Item deleted successfully",
      });
    } catch (error) {
      showNotification({
        variant: "error",
        title: "Error",
        message: "Something went wrong",
      });
    }
    to("/admin/glasses");
  };
  if (error) return to("/admin/glasses");
  if (!item) return <LoadingSpinner />;
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold ">Glasses N° {item.ref}</h1>
          <div className="flex">
            <Button onClick={() => to("edit")} className="mx-4">
              Modify
            </Button>
            <Button
              variant="danger"
              onClick={() => setConfirmationModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
        <div className="flex mt-4 bg-white shadow-lg rounded-lg">
          <div className="relative max-w-xs overflow-hidden flex justify-center items-center">
            <div className="rounded-lg p-2 overflow-hidden">
              <img
                src={`${import.meta.env.VITE_API_URL}/features/${
                  item.feature_image
                }`}
                height="auto"
                width="100%"
                alt="feature"
              />
            </div>
            <div className="absolute top-2 left-2 px-2 rounded-md text-sm bg-blue-400 text-blue-900 font-semibold">
              {item.price_with_discount ? (
                <>
                  <span className="line-through text-blue-800">
                    {item.price}
                  </span>{" "}
                  <span className="">{item.price_with_discount}</span>
                </>
              ) : (
                item.price
              )}{" "}
              Dhs
            </div>
          </div>
          <div className="flex flex-col justify-between ml-8 py-4 w-full">
            <div>
              <h2 className="text-xl font-semibold">
                <span className="uppercase">{item.title}</span> (
                {item.brand.name} - {item.collection.name})
              </h2>
              <p className="text-md font-semibold text-gray-700">
                {item.description}
              </p>
            </div>
            <div className="flex justify-evenly mt-4">
              <div className="mr-4">
                <h3 className="text-lg font-semibold">Lens</h3>
                <div>
                  <strong>Type: </strong>
                  {item.lens_type ?? "None"}
                </div>
                <div className="flex items-center">
                  <strong>Color: </strong>
                  <Color {...item.lens_color} />
                </div>
              </div>
              <div className="mx-4">
                <h3 className="text-lg font-semibold">Frame</h3>
                <div>
                  <strong>Type: </strong>
                  {title(item.frame_type)}
                </div>
                <div>
                  <strong>Shape: </strong>
                  {title(item.frame_shape.name)}
                </div>
                <div>
                  <strong>Material: </strong>
                  {title(item.frame_material.name)}
                </div>
                <div className="flex items-center">
                  <strong>Color: </strong>
                  <Color {...item.frame_color} />
                </div>
              </div>
            </div>
            <div className="">
              <Button
                onClick={() => setLinksModalOpen(true)}
                className={"flex items-center"}
              >
                See Purchase links{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        closeModal={() => setConfirmationModalOpen(false)}
        title={"Confirmation"}
        onSubmit={deleteItem}
        actionName="Delete"
        variant="danger"
      >
        <p>Are you sure you want to delete this item?</p>
      </ConfirmationModal>
      <ModalWrapper
        closeModal={() => setLinksModalOpen(false)}
        isOpen={linksModalOpen}
        title={"Purchase links"}
      >
        <h2 className="text-gray-500 font-medium">Buy these glasses from the following providers : </h2>
        <div className="flex flex-wrap">
            {item.providers.map(({ name, purchase_link: { link }}) => (
              <a href={link} className='px-4 py-2 m-2 bg-gray-700 text-white uppercase font-semibold rounded-lg'>
                {name}
              </a>
            ))}
        </div>
      </ModalWrapper>
    </AdminLayout>
  );
};

export default GlassesById;
