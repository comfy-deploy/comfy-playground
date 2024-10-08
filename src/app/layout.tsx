import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ComfyDeployProvider } from "./hooks/hooks";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/system";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
  title: "Comfy Playground",
  description: "Comfy Playground",

  category: "technology",

  openGraph: {
    type: "website",
    title: "Comfy Playground",
    description: "Comfy Playground",
    locale: "en_US",
  },

  icons: {
    icon: [
      // default icon
      {
        url: "/icon-light.svg",
        href: "/icon-light.svg",
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/icon-light.svg",
        href: "/icon-light.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icon.svg",
        href: "/icon.svg",
      },
    ],
  },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextUIProvider>
					<ThemeProvider attribute="class">
						<ComfyDeployProvider>{children}</ComfyDeployProvider>
					</ThemeProvider>
				</NextUIProvider>
			</body>
		</html>
	);
}
