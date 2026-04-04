import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineGrading } from "react-icons/md";
import { Modal, ModalHeader, ModalBody, Button } from "@windmill/react-ui";
import { Input } from "@windmill/react-ui";
import toast from "react-hot-toast";
import {
  useGetDataByIdQuery,
  useUpdateTestsMutation,
} from "../../features/tests/tests";

const Tests = ({ id }) => {
  const userId = localStorage.getItem("userId");

  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [updateTests] = useUpdateTestsMutation();
  const onEditSubmit = async (info) => {
    const data = {
      ...info,
      userId,
    };
    try {
      const res = await updateTests({ data, id });
      if (res.data.success === true) {
        toast.success(res.data.message);
      } else {
        toast.error(res?.error?.data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const { data, isLoading, isError, error } = useGetDataByIdQuery(id);
  const [test, setTest] = useState(null);

  useEffect(() => {
    if (isError) {
      console.log(error?.data?.message || "An error occurred");
    } else if (!isLoading && data) {
      setTest(data.data);
    }
  }, [data, isLoading, isError, error]);

  console.log("academic", test);
  return (
    <div className="p-4 space-y-6  mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <MdOutlineGrading className="w-5 h-5" />
            IELTS
          </div>
          <button
            onClick={() => {
              reset({
                //   dob: profile?.dob || "",
                //   gender: profile?.gender || "",
                //   maritalStatus: profile?.maritalStatus || "",
              });
              setIsModalOpen(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>

        {test ? (
          <div className="card-body p-8 shadow-md bg-base-100 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-md">
                <span className="text-gray-600">Examination Date</span>
                <br />
                <span>{test?.examinationDate}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Waiver </span>
                <br />
                <span>{test?.waiver}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Overall Score</span>
                <br />
                <span>{test?.overallScore}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Listening</span>
                <br />
                <span>{test?.listening}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
              <div className="text-md">
                <span className="text-gray-600">Reading</span>
                <br />
                <span>{test?.reading}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Writing</span>
                <br />
                <span>{test?.writing}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Speaking</span>
                <br />
                <span>{test?.speaking}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">TRF No</span>
                <br />
                <span>{test?.trfNo}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader>IELTS</ModalHeader>
          <ModalBody className="max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Examination Date
                  </label>
                  <Input
                    type="date"
                    {...register("examinationDate")}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.examinationDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.examinationDate.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Waiver
                  </label>
                  <Input
                    type="text"
                    {...register("waiver")}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.waiver && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.waiver.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Overall Score
                  </label>
                  <Input
                    type="text"
                    {...register("overallScore")}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.overallScore && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.overallScore.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Listening
                  </label>
                  <Input
                    type="text"
                    {...register("listening")}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.listening && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.listening.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Reading
                  </label>
                  <Input
                    type="text"
                    {...register("reading")}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.reading && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reading.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Writing
                  </label>
                  <Input
                    type="text"
                    {...register("writing")}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.writing && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.writing.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Speaking
                  </label>
                  <Input
                    type="text"
                    {...register("speaking")}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.speaking && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.speaking.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    TRF No
                  </label>
                  <Input
                    type="text"
                    {...register("trfNo")}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.trfNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.trfNo.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#C71320" }}
                >
                  Save
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default Tests;
