import React, { useEffect, useState } from "react";
import { Input, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  useCreateCountryMutation,
  useGetAllCountryQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} from "../../features/country/country";

export default function Country() {
  const [editingId, setEditingId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [createCountry] = useCreateCountryMutation();
  const [updateCountry] = useUpdateCountryMutation();
  const [deleteCountry] = useDeleteCountryMutation();
  const { data, isLoading, isError, error } = useGetAllCountryQuery();

  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setCountryList(data.data);
    } else {
      setCountryList([]);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.error("Country fetch error:", error);
      toast.error(error?.data?.message || "Failed to load countries");
    }
  }, [isError, error]);

  const onSubmit = async (formData) => {
    const payload = {
      name: formData.name?.trim(),
    };

    if (!payload.name) {
      toast.error("Country name is required");
      return;
    }

    try {
      if (editingId) {
        const res = await updateCountry({
          id: editingId,
          data: payload,
        }).unwrap();
        if (res?.success) {
          toast.success(res.message || "Country updated successfully");
          reset();
          setEditingId(null);
        } else {
          toast.error(res?.message || "Failed to update country");
        }
      } else {
        const res = await createCountry(payload).unwrap();
        if (res?.success) {
          toast.success(res.message || "Country created successfully");
          reset();
        } else {
          toast.error(res?.message || "Failed to create country");
        }
      }
    } catch (err) {
      console.error("Country save error:", err);
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setValue("name", item.country || item.name || item.Country || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this country?"))
      return;

    try {
      const res = await deleteCountry(id).unwrap();
      if (res?.success) {
        toast.success(res.message || "Country deleted");
      } else {
        toast.error(res?.message || "Failed to delete country");
      }
    } catch (err) {
      console.error("Delete country error:", err);
      toast.error(err?.data?.message || "Deletion failed");
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-6 bg-gray-50 max-w-screen-2xl mx-auto">
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 sm:p-6 mb-5 sm:mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brandBlue">
          Global Settings
        </p>
        <h4 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">
          Country Management
        </h4>
        <p className="mt-1 text-sm sm:text-base text-gray-500">
          Add, update, and manage destination countries.
        </p>
        {/* <p className="text-sm text-gray-600">
          Add, edit, and delete country names using API.
        </p> */}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-5 sm:mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 sm:p-6"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country Name
          </label>
          <Input
            type="text"
            placeholder="Enter country name"
            className="w-full rounded-xl border-gray-200 bg-gray-50 text-sm"
            {...register("name", { required: "Country name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <Button
            type="submit"
            className="bg-brandBlue text-white w-full rounded-xl"
          >
            {editingId ? "Update" : "Add"}
          </Button>
          {editingId && (
            <Button
              onClick={cancelEdit}
              type="button"
              className="bg-gray-400 text-white w-full sm:w-auto rounded-xl"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Country Name</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                  Loading countries...
                </td>
              </tr>
            ) : countryList?.length > 0 ? (
              countryList.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {item.country || item.name || item.Country || "-"}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="small"
                      layout="outline"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      layout="outline"
                      className="text-red-600 border-red-300 hover:text-red-700"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  No countries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center text-sm text-gray-500">
            Loading countries...
          </div>
        ) : countryList?.length > 0 ? (
          countryList.map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Country #{index + 1}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-gray-900 break-words">
                    {item.country || item.name || item.Country || "-"}
                  </h3>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center text-sm text-gray-500">
            No countries found.
          </div>
        )}
      </div>
    </div>
  );
}
