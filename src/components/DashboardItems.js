import React from "react";
import { FaUserGraduate, FaWallet, FaBookOpen, FaHome } from "react-icons/fa";

const features = [
  {
    icon: <FaUserGraduate className="text-2xl text-brandRed" />,
    title: "Students",
    href: "/app/students",
    links: [
      { label: "Manage Students", href: "/students/manage" },
      { label: "Manage Applications", href: "/students/applications" },
    ],
  },
  {
    icon: <FaWallet className="text-2xl text-brandRed" />,
    title: "My Wallet",
    href: "/app/wallet",
    description:
      "Add money to your wallet for instant Application Fee payments.",
  },
  {
    icon: <FaBookOpen className="text-2xl text-brandRed" />,
    title: "Learning Resources",
    href: "https://drive.google.com/drive/folders/1fZxeTjsnqDknyE4EhxI11IC0DQljU7kX",
    description:
      "Complete Library of Product Knowledge– Country Guides, Presentation Decks, Outreach Materials.",
  },
  {
    icon: <FaHome className="text-2xl text-brandRed" />,
    title: "Media",
    href: "https://drive.google.com/drive/folders/1heNokqg9OIgQl9iJKxzFXcNxorR1wHYy",
    description:
      "Provide your students with better experience by enabling them to find an accommodation. Choose from a list of properties.",
  },
];

const DashboardItems = () => {
  return (
    <div className="w-full px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brandRed-100 p-3 rounded-full flex-shrink-0">
                {item.icon}
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-base sm:text-lg font-semibold text-gray-800 hover:underline line-clamp-2"
                >
                  {item.title}
                </a>
              ) : (
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
              )}
            </div>

            {item.description && (
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            )}

            {item.links && (
              <div className="flex flex-col gap-1">
                {item.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-800 hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardItems;
