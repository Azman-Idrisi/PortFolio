"use client";

import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiOutlineGlobe } from "react-icons/hi";

export function SocialIcon({
  iconKey,
  size = 14,
}: {
  iconKey: "github" | "linkedin" | "website" | "instagram";
  size?: number;
}) {
  switch (iconKey) {
    case "github":
      return <FaGithub size={size} />;
    case "linkedin":
      return <FaLinkedin size={size} />;
    case "website":
      return <HiOutlineGlobe size={size} />;
    case "instagram":
      return <FaInstagram size={size} />;
  }
}
