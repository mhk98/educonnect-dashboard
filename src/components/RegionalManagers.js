import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RegionalManagers() {
  const branch = localStorage.getItem("branch");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Fetch users using axios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/user",
        ); // update with your actual API
        const users = response.data.data || [];

        // Filter users with role === "admin"
        const filteredAdmins = users.filter(
          (user) => user.Branch === branch && user.RegionalStatus === "Manager",
        );
        setAdmins(filteredAdmins);
      } catch (err) {
        console.error("Error fetching admins:", err);
        // setError("Failed to load admins.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [branch]);

  if (loading) return <p className="p-4 text-sm sm:text-base">Loading...</p>;

  return (
    <div className="w-full px-0">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Contact Regional Manager
      </h2>

      {admins.length > 0 ? (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {admins.map((admin, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition duration-200"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 md:p-5">
                <img
                  src={admin.image}
                  alt={`${admin.FirstName} ${admin.LastName}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
                />
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-black line-clamp-1">
                    {admin.FirstName} {admin.LastName}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    Regional Officer
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 truncate">
                    {admin.Phone}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-1">
                    {admin.Address}
                  </p>
                </div>
              </div>
              <div className="bg-blue-100 px-3 sm:px-4 md:px-5 py-2 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 text-center truncate">
                {admin.Email}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm sm:text-base text-gray-600">
          No regional manager available
        </p>
      )}
    </div>
  );
}
