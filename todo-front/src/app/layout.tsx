// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

export const metadata = {
	title: "Todo App",
	description:
		"A simple Todo app built with Next.js 13, React 19 and TypeScript",
};

// app/layout.tsx (または app/page.tsx など)
import ClearLocalStorage from "./components/ClearLocalStorage";
import { SidebarProvider } from "@/components/ui/sidebar";
import ClientProviders from "./components/ClientProviders";
import { FolderProvider } from "./hooks/FolderContext";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="antialiased">
				<SidebarProvider>
					<ClearLocalStorage>
						<ClientProviders>
							<FolderProvider>{children}</FolderProvider>
						</ClientProviders>
					</ClearLocalStorage>
				</SidebarProvider>
			</body>
		</html>
	);
}
