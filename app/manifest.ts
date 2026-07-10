import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Portfolio`,
    short_name: SITE_NAME,
    description:
      "Portfolio of Dhiraj KC covering engineering, design, research, and leadership work.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      {
        src: "/DKC.png",
        sizes: "any",
        type: "image/png"
      }
    ]
  };
}
