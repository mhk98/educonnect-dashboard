import { FiExternalLink } from "react-icons/fi";
import React from "react";

const quickLinks = [
  { name: "Commission Structure", href: "#" },
  { name: "EduAnchor Represented Universities", href: "#" },
  { name: "Contact List", href: "#" },
  { name: "Webinars by EduAnchor", href: "#" },
  { name: "Webinars by Institutions", href: "#" },
  { name: "Flywire Payments", href: "#" },
  { name: "Profile", href: "#" },
  { name: "Promotional Schemes", href: "#" },
];

export default function QuickLinks() {
  return (
    <div className="w-full px-0">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Quick Links
      </h2>
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {quickLinks.map((link, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition duration-200"
          >
            <a
              href={link.href}
              className="text-sm sm:text-base md:text-lg text-black hover:underline font-medium flex-1 truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
            <FiExternalLink className="text-gray-400 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
