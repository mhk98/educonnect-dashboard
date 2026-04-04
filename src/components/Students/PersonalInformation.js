import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";
import { Input, HelperText, Label, Select, Textarea } from "@windmill/react-ui";
import {
  useGetDataByIdQuery,
  useUpdateProfileMutation,
} from "../../features/profile/profile";
import toast from "react-hot-toast";
import { backgroundColor } from "tailwindcss/defaultTheme";

const PersonalInformation = ({ id }) => {
  const userId = localStorage.getItem("userId");

  // const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [isModalOpen5, setIsModalOpen5] = useState(false);
  const [isModalOpen6, setIsModalOpen6] = useState(false);
  const [isModalOpen7, setIsModalOpen7] = useState(false);

  console.log("PersonalInformation", id);

  function closeModal() {
    setIsModalOpen(false);
  }
  function closeModal1() {
    setIsModalOpen1(false);
  }
  function closeModal2() {
    setIsModalOpen2(false);
  }
  function closeModal3() {
    setIsModalOpen3(false);
  }
  function closeModal4() {
    setIsModalOpen4(false);
  }
  function closeModal5() {
    setIsModalOpen5(false);
  }
  function closeModal6() {
    setIsModalOpen6(false);
  }
  function closeModal7() {
    setIsModalOpen7(false);
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [updateProfile] = useUpdateProfileMutation();
  const onEditSubmit = async (info) => {
    const data = {
      ...info,
      userId,
    };

    console.log("personalInfo", data);
    try {
      const res = await updateProfile({ data, id });
      if (res.data.success === true) {
        toast.success(res.data.message);
        reset();
        setIsModalOpen(false);
        setIsModalOpen1(false);
        setIsModalOpen2(false);
        setIsModalOpen3(false);
        setIsModalOpen4(false);
        setIsModalOpen5(false);
        setIsModalOpen6(false);
        setIsModalOpen7(false);
      } else {
        toast.error(res?.error?.data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const { data, isLoading, isError, error } = useGetDataByIdQuery(id);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isError) {
      console.log(error?.data?.message || "An error occurred");
    } else if (!isLoading && data) {
      setProfile(data.data);
    }
  }, [data, isLoading, isError, error]);

  console.log("profile", profile);

  return (
    <div className="p-4 space-y-6  mx-auto">
      {/* Personal Info */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <FaInfoCircle className="w-5 h-5" />
            Personal Information
          </div>
          <button
            onClick={() => {
              reset({
                dob: profile?.dob || "",
                gender: profile?.gender || "",
                maritalStatus: profile?.maritalStatus || "",
              });
              setIsModalOpen(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>

        <div className="card-body p-8 shadow-md bg-base-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-md">
              <span className="text-gray-600">Date of birth</span>
              <br />
              <span>{profile?.dob}</span>
            </div>
            <div className="text-md">
              <span className="text-gray-600">Gender</span>
              <br />
              <span>{profile?.gender}</span>
            </div>
            <div className="text-md">
              <span className="text-gray-600">Marital Status</span>
              <br />
              <span>{profile?.maritalStatus}</span>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader>Personal Information</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  name="dob"
                  {...register("dob")}
                  className="input input-bordered w-full form-control shadow-md p-3"
                />
                {errors.dob && (
                  <p style={{ color: "red", marginTop: "5px" }}>
                    {errors.dob.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Gender
                </label>
                <Select name="gender" {...register("gender")} className="mt-1">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
                {errors.gender && (
                  <p style={{ color: "red", marginTop: "5px" }}>
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Marital Status
                </label>
                <Select
                  name="maritalStatus"
                  {...register("maritalStatus")}
                  className="mt-1"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </Select>
                {errors.maritalStatus && (
                  <p style={{ color: "red", marginTop: "5px" }}>
                    {errors.maritalStatus.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                {/* <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button> */}
                <Button
                  type="submit"
                  onClick={handleSubmit}
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

      <div className="card ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <FaInfoCircle className="w-5 h-5" />
            Mailing Address
          </div>
          <button
            onClick={() => {
              reset({
                mailingAddress1: profile?.mailingAddress1 || "",
                mailingAddress2: profile?.mailingAddress2 || "",
                mailingCountry: profile?.mailingCountry || "",
                mailingState: profile?.mailingState || "",
                mailingCity: profile?.mailingCity || "",
                mailingPostalCode: profile?.mailingPostalCode || "",
              });
              setIsModalOpen1(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>
        <div className="card-body p-12 shadow-md bg-base-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-md">
              <div>
                <span className="text-gray-600">Address 1</span>
                <br />
                <span>{profile?.mailingAddress1}</span>
              </div>
              <div>
                <span className="text-gray-600">Address 2</span>
                <br />
                <span>{profile?.mailingAddress2}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">Country</span>
                <br />
                <span>{profile?.mailingCountry}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">City</span>
                <br />
                <span>{profile?.mailingCity}</span>
              </div>
            </div>

            <div className="text-md">
              <div>
                <span className="text-gray-600">Address 2</span>
                <br />
                <span>{profile?.mailingAddress2}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">State</span>
                <br />
                <span>{profile?.mailingState}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">Postal Code</span>
                <br />
                <span>{profile?.mailingPostalCode}</span>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen1} onClose={closeModal1}>
          <ModalHeader>Mailing Address</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Side */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Address 1
                    </label>
                    <Input
                      type="text"
                      {...register("mailingAddress1")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.mailingAddress1 && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mailingAddress1.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Address 2
                    </label>
                    <Input
                      type="text"
                      {...register("mailingAddress2")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.mailingAddress2 && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mailingAddress2.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Country
                    </label>
                    <Input
                      type="text"
                      {...register("mailingCountry")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.mailingCountry && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mailingCountry.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      City
                    </label>
                    <Input
                      type="text"
                      {...register("mailingCity")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.mailingCity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mailingCity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Address 2
                    </label>
                    <Input
                      type="text"
                      {...register("mailingAddress2")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.mailingAddress2 && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mailingAddress2.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      State
                    </label>
                    <Input
                      type="text"
                      {...register("mailingState")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.mailingState && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mailingState.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      {...register("mailingPostalCode")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.mailingPostalCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mailingPostalCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
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

      <div className="card ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <FaInfoCircle className="w-5 h-5" />
            Permanent Address
          </div>
          <button
            onClick={() => {
              reset({
                permanentAddress1: profile?.permanentAddress1 || "",
                permanentCountry: profile?.permanentCountry || "",
                permanentState: profile?.permanentState || "",
                permanentCity: profile?.permanentCity || "",
                permanentPostalCode: profile?.permanentPostalCode || "",
              });
              setIsModalOpen2(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>
        <div className="card-body p-12 shadow-md bg-base-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-md">
              <div>
                <span className="text-gray-600">Address 1</span>
                <br />
                <span>{profile?.permanentAddress1}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">Country</span>
                <br />
                <span>{profile?.permanentCountry}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">City</span>
                <br />
                <span>{profile?.permanentCity}</span>
              </div>
            </div>

            <div className="text-md">
              <div>
                <span className="text-gray-600">Address 2</span>
                <br />
                <span>{profile?.permanentAddress2}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">State</span>
                <br />
                <span>{profile?.permanentState}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">Postal Code</span>
                <br />
                <span>{profile?.permanentPostalCode}</span>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen2} onClose={closeModal2}>
          <ModalHeader>Permanent Address</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Side */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Address 1
                    </label>
                    <Input
                      type="text"
                      {...register("permanentAddress1")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.permanentAddress1 && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.permanentAddress1.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Country
                    </label>
                    <Input
                      type="text"
                      {...register("permanentCountry")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.permanentCountry && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.permanentCountry.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      City
                    </label>
                    <Input
                      type="text"
                      {...register("permanentCity")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.permanentCity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.permanentCity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Address 2
                    </label>
                    <Input
                      type="text"
                      {...register("permanentAddress2")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.permanentAddress2 && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.permanentAddress2.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      State
                    </label>
                    <Input
                      type="text"
                      {...register("permanentState")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.permanentState && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.permanentState.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      {...register("permanentPostalCode")}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.permanentPostalCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.permanentPostalCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
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

      {/* Passport Information */}
      <div className="card ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <FaInfoCircle className="w-5 h-5" />
            Passport Information
          </div>
          <button
            onClick={() => {
              reset({
                passportNumber: profile?.passportNumber || "",
                passportIssueDate: profile?.passportIssueDate || "",
                passportExpiryDate: profile?.passportExpiryDate || "",
                passportIssueCountry: profile?.passportIssueCountry || "",
                passportCityOfBirth: profile?.passportCityOfBirth || "",
                passportCountryOfBirth: profile?.passportCountryOfBirth || "",
              });
              setIsModalOpen3(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>
        <div className="card-body p-12 shadow-md bg-base-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-md">
              <div>
                <span className="text-gray-600">Passport Number</span>
                <br />
                <span>{profile?.passportNumber}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">Issue Country</span>
                <br />
                <span>{profile?.passportIssueCountry}</span>
              </div>
            </div>
            <div className="text-md">
              <div>
                <span className="text-gray-600">Issue Date</span>
                <br />
                <span>{profile?.passportIssueDate}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">City of Birth</span>
                <br />
                <span>{profile?.passportCityOfBirth}</span>
              </div>
            </div>
            <div className="text-md">
              <div>
                <span className="text-gray-600">Expiry Date</span>
                <br />
                <span>{profile?.passportExpiryDate}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">Country of Birth</span>
                <br />
                <span>{profile?.passportCountryOfBirth}</span>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen3} onClose={closeModal3}>
          <ModalHeader>Passport Information</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Passport Number
                    </label>
                    <Input
                      type="text"
                      {...register("passportNumber")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.passportNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passportNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Issue Country
                    </label>
                    <Input
                      type="text"
                      {...register("passportIssueCountry")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.passportIssueCountry && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passportIssueCountry.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      {...register("passportIssueDate")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.passportIssueDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passportIssueDate.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      City of Birth
                    </label>
                    <input
                      type="text"
                      {...register("passportCityOfBirth")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.passportCityOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passportCityOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 3 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      {...register("passportExpiryDate")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.passportExpiryDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passportExpiryDate.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Country of Birth
                    </label>
                    <input
                      type="text"
                      {...register("passportCountryOfBirth")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.passportCountryOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passportCountryOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6">
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

      {/* Nationality */}
      <div className="card ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <FaInfoCircle className="w-5 h-5" />
            Nationality
          </div>
          <button
            onClick={() => {
              reset({
                nationlity: profile?.nationlity || "",
                citizenship: profile?.citizenship || "",
                isMultiCitizenship: profile?.isMultiCitizenship || "",
                isStudyOrLivingOtherCountry:
                  profile?.isStudyOrLivingOtherCountry || "",
              });
              setIsModalOpen4(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>
        <div className="card-body p-12 shadow-md bg-base-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-md">
              <div>
                <span className="text-gray-600">Nationality*</span>
                <br />
                <span>{profile?.nationlity}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">
                  Is the applicant a citizen of more than one country?*
                </span>
                <br />
                <span>{profile?.isMultiCitizenship}</span>
              </div>
            </div>
            <div className="text-md">
              <div>
                <span className="text-gray-600">Citizenship*</span>
                <br />
                <span>{profile?.citizenship}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">
                  Is the applicant living and studying in any other country?*
                </span>
                <br />
                <span>{profile?.isStudyOrLivingOtherCountry}</span>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen4} onClose={closeModal4}>
          <ModalHeader>Nationality</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Nationality<span className="text-red-500">*</span>
                    </label>

                    <select
                      {...register("nationality")}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select nationality</option>
                      <option value="Yes">Bangladeshi</option>
                      <option value="No">Indian</option>
                      <option value="No">Pakistani</option>
                    </select>
                    {errors.nationality && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Is the applicant a citizen of more than one country?
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("isMultiCitizenship")}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.isMultiCitizenship && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.isMultiCitizenship.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Citizenship<span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("citizenship")}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select Citizenship</option>
                      <option value="Yes">Bangladeshi</option>
                      <option value="No">Indian</option>
                      <option value="No">Pakistani</option>
                    </select>
                    {errors.citizenship && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.citizenship.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Is the applicant living and studying in any other country?
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("isStudyOrLivingOtherCountry")}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.isStudyOrLivingOtherCountry && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.isStudyOrLivingOtherCountry.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 mt-6">
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

      {/* Background Info */}
      <div className="card ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <FaInfoCircle className="w-5 h-5" />
            Background Info
          </div>
          <button
            onClick={() => {
              reset({
                isCriminalOffence: profile?.isCriminalOffence || "",
                isAppliedAnyImmigrationBefore:
                  profile?.isAppliedAnyImmigrationBefore || "",
                isVisaRefusal: profile?.isVisaRefusal || "",
                isSeriousMedicalCondition:
                  profile?.isSeriousMedicalCondition || "",
              });
              setIsModalOpen5(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>
        <div className="card-body p-12 shadow-md bg-base-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-md">
              <div>
                <span className="text-gray-600">
                  Has applicant applied for any type of immigration into any
                  country?
                </span>
                <br />
                <span>{profile?.isAppliedAnyImmigrationBefore}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">
                  Has applicant Visa refusal for any country?
                </span>
                <br />
                <span>{profile?.isVisaRefusal}</span>
              </div>
            </div>
            <div className="text-md">
              <div>
                <span className="text-gray-600">
                  Does applicant suffer from a serious medical condition?
                </span>
                <br />
                <span>{profile?.isSeriousMedicalCondition}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">
                  Has applicant ever been convicted of a criminal offence?
                </span>
                <br />
                <span>{profile?.isCriminalOffence}</span>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen5} onClose={closeModal5}>
          <ModalHeader>Background Info </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Has applicant applied for any type of immigration into any
                      country?<span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("isAppliedAnyImmigrationBefore")}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.isAppliedAnyImmigrationBefore && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.isAppliedAnyImmigrationBefore.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Has applicant Visa refusal for any country?
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("isVisaRefusal")}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.isVisaRefusal && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.isVisaRefusal.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Does applicant suffer from a serious medical condition?
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("isSeriousMedicalCondition")}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.isSeriousMedicalCondition && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.isSeriousMedicalCondition.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Has applicant ever been convicted of a criminal offence?
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("isCriminalOffence")}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.isCriminalOffence && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.isCriminalOffence.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
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

      {/* Important Contacts*/}
      <div className="card ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <FaInfoCircle className="w-5 h-5" />
            Important Contacts
          </div>
          <button
            onClick={() => {
              reset({
                emergencyContactName: profile?.emergencyContactName || "",
                emergencyContactEmail: profile?.emergencyContactEmail || "",
                emergencyContactPhone: profile?.emergencyContactPhone || "",
                emergencyContactRelation:
                  profile?.emergencyContactRelation || "",
              });
              setIsModalOpen6(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>
        <div className="card-body p-12 shadow-md bg-base-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-md">
              <div>
                <span className="text-gray-600">Name</span>
                <br />
                <span>{profile?.emergencyContactName}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">Email</span>
                <br />
                <span>{profile?.emergencyContactEmail}</span>
              </div>
            </div>
            <div className="text-md">
              <div>
                <span className="text-gray-600">Phone</span>
                <br />
                <span>{profile?.emergencyContactPhone}</span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600">Relation with Applicant</span>
                <br />
                <span>{profile?.emergencyContactRelation}</span>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen6} onClose={closeModal6}>
          <ModalHeader>Important Contacts</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("emergencyContactName")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.emergencyContactName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emergencyContactName.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register("emergencyContactEmail")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.emergencyContactEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emergencyContactEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Phone<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("emergencyContactPhone")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.emergencyContactPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emergencyContactPhone.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Relation with Applicant
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("emergencyContactRelation")}
                      className="input input-bordered w-full shadow-md p-3"
                    />
                    {errors.emergencyContactRelation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.emergencyContactRelation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
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

      {/* Additional Information */}
      <div className="card ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
            <FaInfoCircle className="w-5 h-5" />
            Additional Information
          </div>
          <button
            onClick={() => {
              reset({
                gapDetails: profile?.gapDetails || "",
              });
              setIsModalOpen7(true);
            }}
            className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
          >
            Request Edit
          </button>
        </div>
        <div className="card-body p-8 shadow-md bg-base-100 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-md">
              <span className="text-gray-600">Gap Details</span>
              <br />
              <span>{profile?.gapDetails}</span>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen7} onClose={closeModal7}>
          <ModalHeader>Additional Information</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-md">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Gap Details<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      {...register("gapDetails")}
                      className="textarea textarea-bordered w-full shadow-md p-3"
                    ></textarea>
                    {errors.gapDetails && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gapDetails.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
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

export default PersonalInformation;
