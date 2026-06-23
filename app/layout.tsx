import type { Metadata } from "next";
import WebflowScripts from "@/components/WebflowScripts";
import PageEffects from "@/components/PageEffects";
import CretoMenu from "@/components/CretoMenu";
import ProjectOverlay from "@/components/ProjectOverlay";
import CVTimelineControls from "@/components/CVTimelineControls";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leon Kountouras | Full-Stack Developer",
  description:
    "Migrated from Paul A. - Webflow HTML website template. Paul Andrew is a clean and modern Webflow portfolio template designed for creatives, freelancers, and professionals. Showcase your projects, highlight your skills, and tell your story with elegant layouts and a fully responsive design that looks great on every device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-wf-domain="paul-andrew.webflow.io"
      data-wf-page="699bf5549ae9a99a06373c82"
      data-wf-site="699bf5529ae9a99a06373c58"
      className="w-mod-js"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://cdn.prod.website-files.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700%7CPoppins:300,400,500,600,700"
        />
        <link
          rel="stylesheet"
          href="https://cdn.prod.website-files.com/699bf5529ae9a99a06373c58/css/paul-andrew.webflow.shared.e6753056a.css"
          crossOrigin="anonymous"
        />
      </head>

      <body suppressHydrationWarning>
        <CretoMenu />
        {children}
        <ProjectOverlay />
        <CVTimelineControls />
        <WebflowScripts />
        <PageEffects />
      </body>
    </html>
  );
}
