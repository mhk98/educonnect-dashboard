/* eslint-disable no-mixed-spaces-and-tabs */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUpdateUserMutation } from "../features/auth/auth";

const Profile = () => {
  const [file, setFile] = useState("");
  const [image, setImage] = useState(null);

  const [currentProfile, setCurrentProfile] = useState(null);

  const hasProfileImage = (imageUrl) =>
    Boolean(imageUrl && imageUrl !== "null" && imageUrl !== "undefined");

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.trim()?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.trim()?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "U";
  };

  const renderInitialAvatar = (firstName, lastName, className = "") => (
    <div
      className={`flex items-center justify-center rounded-full bg-brandBlue font-bold uppercase text-white shadow-md ${className}`}
    >
      {getInitials(firstName, lastName)}
    </div>
  );

  // Function to handle file input and set image file
  function handleChange(e) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(URL.createObjectURL(selectedFile));
      setImage(selectedFile); // Set the actual file object for upload
    }
  }

  const [userUpdate] = useUpdateUserMutation();

  // Function to handle form submission
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Create a new FormData object to handle the multipart form data
      const data = new FormData();
      data.append("FirstName", currentProfile.FirstName);
      data.append("LastName", currentProfile.LastName);
      data.append("Phone", currentProfile.Phone);
      data.append("Address", currentProfile.Address);
      if (image) {
        data.append("image", image); // Append the image file to FormData
      }

      const id = localStorage.getItem("userId");

      console.log("userData", data);

      // Call the userRegister mutation
      const res = await userUpdate({ id, data }).unwrap();

      console.log("userRes", res);

      if (res.success) {
        toast.success("Profile update successfully");
        // window.location.reload();
      }
    } catch (err) {
      console.error("Profile update failed", err);
      toast.error("Profile update failed. Please try again.");
    }
  };

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://backend.eaconsultancy.org/api/v1/user/${id}`,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        setIsError(true);
        console.error("Error fetching the user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching user data</div>;

  const handleEditUser = (user) => {
    console.log("user", user);
    setCurrentProfile(user);
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Profile Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
          {hasProfileImage(user?.image) ? (
            <img
              className="w-20 h-20 rounded-full object-cover"
              src={user?.image}
              alt="User avatar"
            />
          ) : (
            renderInitialAvatar(
              user?.FirstName,
              user?.LastName,
              "h-20 w-20 text-2xl",
            )
          )}
          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {user?.FirstName} {user?.LastName}
            </h2>
            <p className="text-sm text-gray-500 font-bold">{user?.Role}</p>
            <p className="text-sm text-gray-500">
              {user?.City}, {user?.Country}
            </p>
          </div>
        </div>
        <div className="flex justify-center md:justify-end mt-2">
          <button
            className="text-brandBlue hover:text-brandBlue"
            onClick={() => {
              document.getElementById("my_modal_4").showModal();
              // eslint-disable-next-line no-undef
              handleEditUser(user);
            }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            User Information
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="font-medium text-gray-900">{user?.FirstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="font-medium text-gray-900">{user?.LastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium text-gray-900">{user?.Email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium text-gray-900">{user?.Phone}</p>
          </div>
          {/* <div>
            <p className="text-sm text-gray-500">User Role</p>
            <p className="font-medium text-gray-900">
				{user.Role}
				</p>
          </div> */}
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            Address
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            {/* <p className="text-sm text-gray-500">Country</p> */}
            <p className="font-medium text-gray-900">{user?.Address}</p>
          </div>
        </div>
      </div>

      {/* Modal for Editing Information */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-lg text-center p-4">
          <h3 className="font-bold text-lg text-gray-900">
            Edit User Information
          </h3>
          <form
            className="space-y-4 mx-auto w-full max-w-lg"
            onSubmit={handleSave}
          >
            <div>
              <label className="block text-sm text-gray-600 text-left">
                First Name
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 text-gray-900"
                value={currentProfile?.FirstName}
                onChange={(e) =>
                  setCurrentProfile({
                    ...currentProfile,
                    FirstName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 text-left">
                Last Name
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 text-gray-900"
                value={currentProfile?.LastName}
                onChange={(e) =>
                  setCurrentProfile({
                    ...currentProfile,
                    LastName: e.target.value,
                  })
                }
              />
            </div>
            {/* <div>
              <label className="block text-sm text-gray-600 text-left">Email Address</label>
              <input
                type="email"
                className="w-full border rounded p-2 text-gray-900"
				value={currentProfile?.Email} onChange={(e) => setCurrentProfile({ ...currentProfile, Email: e.target.value })}

              />
            </div> */}
            <div>
              <label className="block text-sm text-gray-600 text-left">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 text-gray-900"
                value={currentProfile?.Phone}
                onChange={(e) =>
                  setCurrentProfile({
                    ...currentProfile,
                    Phone: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 text-left">
                Address
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 text-gray-900"
                value={currentProfile?.Address}
                onChange={(e) =>
                  setCurrentProfile({
                    ...currentProfile,
                    Address: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700 text-left"
              >
                Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="w-full mt-1 cursor-pointer"
              />
              {file ? (
                <img
                  src={file}
                  alt="Profile Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              ) : hasProfileImage(user?.image) ? (
                <img
                  src={user?.image}
                  alt="Profile Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="mt-2">
                  {renderInitialAvatar(
                    currentProfile?.FirstName || user?.FirstName,
                    currentProfile?.LastName || user?.LastName,
                    "h-20 w-20 text-2xl",
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => document.getElementById("my_modal_4").close()}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brandBlue text-white rounded hover:bg-brandBlue"
                onClick={() => document.getElementById("my_modal_4").close()}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Profile;
