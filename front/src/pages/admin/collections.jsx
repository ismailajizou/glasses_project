import InputField from "@/components/forms/InputField";
import SubmitButton from "@/components/forms/SubmitButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import ModalWrapper from "@/components/modals/ModalWrapper";
import Pagination from "@/components/pagination/Pagination";
import http, { csrf } from "@/helpers/http";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import AdminLayout from "@/layouts/AdminLayout";
import { Form, Formik } from "formik";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiSearch, HiX } from "react-icons/hi";
import { useLocation, useSearchParams } from "react-router-dom";
import { object, string } from "yup";

const CollectionsPage = () => {
  useAuth({ middleware: "auth", redirectIfError: "/admin/login" });
  const [params, setParams] = useSearchParams();
  const [pageIndex, setPageIndex] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ item: null, isOpen: false });
  const [editModal, setEditModal] = useState({ item: null, isOpen: false });
  const [query, setQuery] = useState("");
  const l = useLocation();
  const {
    data: collections,
    error,
    mutate,
  } = useFetch("/collections" + l.search);

  const handleShowDeleted = (checked) => {
    if (checked) {
      params.set("deleted", "true");
    } else {
      params.delete("deleted");
    }
    setParams(params);
  };

  const handleDelete = async (item) => {
    try {
      await csrf();
      if (item.deleted_at) await http.post(`/collections/${item.id}/restore`);
      else await http.delete(`/collections/${item.id}`);
      setDeleteModal({ item: null, isOpen: false });
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <h1>ERROR: {error.message}</h1>;
  if (!collections) return <LoadingSpinner />;
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-center text-4xl  font-semibold">
            LIST OF COLLECTIONS
          </h1>
        </div>
        <div className="flex justify-between items-center my-4">
          <button
            onClick={() => setIsOpen(true)}
            className="text-white flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
          >
            <AiOutlinePlus className="mr-2" />
            Add
          </button>
          <div className="flex justify-end items-center">
            <input
              onChange={(e) => handleShowDeleted(e.target.checked)}
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Show archived
            </label>
          </div>

          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="py-2 px-2 w-56 text-sm rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
              placeholder="Search"
            />
            <button
              type="submit"
              onClick={() => {
                setPageIndex(1);
                setParams({ page: pageIndex, q: query });
              }}
              className="text-white right-2 bottom-1 focus:ring-4 focus:outline-none font-medium rounded-lg bg-blue-700 text-sm px-4 py-2 mr-2 ml-4"
            >
              <HiSearch className="h-4 w-4" />
            </button>
            <button
              type="reset"
              onClick={() => {
                setQuery("");
                setPageIndex(1);
                setParams({ page: 1 });
              }}
              className="text-white right-2 bottom-1 focus:ring-4 focus:outline-none font-medium rounded-lg bg-red-700 text-sm px-4 py-2 ml-2"
            >
              <HiX className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="relative my-2 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.data?.length ? (
                collections.data.map(({ id, name, deleted_at }) => (
                  <tr key={id} className="border-b bg-gray-800 border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap"
                    >
                      {id}
                    </th>
                    <td className="px-6 py-4">{name}</td>
                    <td className="text-center px-6 py-4">
                      <div
                        className={`w-3.5 h-3.5 ${
                          deleted_at ? "bg-red-600" : "bg-green-600"
                        } rounded-full`}
                      />
                    </td>
                    <td className="px-6 py-4 flex justify-start">
                      <button
                        onClick={() =>
                          setEditModal({ item: { id, name }, isOpen: true })
                        }
                        className="font-medium mr-3 text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      {deleted_at ? (
                        <button
                          onClick={() =>
                            setDeleteModal({
                              item: { id, name, deleted_at },
                              isOpen: true,
                            })
                          }
                          className="font-medium mr-3 text-green-500 hover:underline"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setDeleteModal({
                              item: { id, name, deleted_at },
                              isOpen: true,
                            })
                          }
                          className="font-medium mr-3 text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="">
                  <td colSpan={4} className="text-center text-4xl ">
                    No Records were found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          from={collections.from}
          to={collections.to}
          total={collections.total}
          links={collections.links}
          setPageIndex={setPageIndex}
          pageIndex={pageIndex}
        />
      </div>
      <ModalWrapper
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
        title={"Add Collection"}
      >
        <Formik
          validationSchema={object({
            name: string().required("Name is required"),
          })}
          initialValues={{ name: "" }}
          onSubmit={async (values, { setErrors }) => {
            setErrors({});
            try {
              await csrf();
              await http.post("/collections/add", values);
              mutate();
              setIsOpen(false);
            } catch (error) {
              setErrors(error.response.data.errors);
            }
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <InputField
                label={"Collection name"}
                name="name"
                id="collection_name"
              />
              <div className="flex justify-end mt-4">
                <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
              </div>
            </Form>
          )}
        </Formik>
      </ModalWrapper>
      <ModalWrapper
        closeModal={() => setEditModal({ isOpen: false, item: null })}
        isOpen={editModal.isOpen}
        title={"Edit Collection"}
      >
        <Formik
          validationSchema={object({
            name: string().required("Name is required"),
          })}
          initialValues={{ name: editModal.item?.name ?? "" }}
          onSubmit={async (values, { setErrors }) => {
            setErrors({});
            try {
              await csrf();
              await http.post(`/collections/${editModal.item.id}`, values);
              mutate();
              setEditModal({ isOpen: false, item: null });
            } catch (error) {
              console.error(error);
              if (error.response.data.status === 401)
                setErrors(error.response.data.errors);
            }
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <InputField
                label={"Collection name"}
                name="name"
                id="collection_name"
              />
              <div className="flex justify-end mt-4">
                <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
              </div>
            </Form>
          )}
        </Formik>
      </ModalWrapper>

      <ConfirmationModal
        closeModal={() => setDeleteModal({ isOpen: false, item: null })}
        isOpen={deleteModal.isOpen}
        title={"Delete Collection"}
        onSubmit={() => handleDelete(deleteModal.item)}
        actionName={deleteModal.item?.deleted_at ? "Restore" : "Delete"}
        actionColor={deleteModal.item?.deleted_at ? "success" : "danger"}
      >
        <p>
          Are you sure you want to{" "}
          {deleteModal.item?.deleted_at ? "restore" : "delete"} this collection?
        </p>
      </ConfirmationModal>
    </AdminLayout>
  );
};

export default CollectionsPage;
