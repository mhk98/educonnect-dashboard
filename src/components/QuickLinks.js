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
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-4">Quick Links</h2>
      <div className="divide-y divide-gray-100">
        {quickLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2.5 hover:text-blue-700 group transition"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition truncate pr-2">
              {link.name}
            </span>
            <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-gray-300 group-hover:text-blue-500 transition" />
          </a>
        ))}
      </div>
    </div>
  );
}
