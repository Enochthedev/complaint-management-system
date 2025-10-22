import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UI CS Complaint System",
    short_name: "UI CS Complaints",
    description:
      "University of Ibadan Computer Science Department Complaint Management System",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["education", "productivity"],
    lang: "en",
    orientation: "portrait-primary",
  };
}
