import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraUIProvider } from "./providers/chakraUIProvider";
import { ReactQueryProvider } from "./providers/reactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "Next.js & Nest.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <ChakraUIProvider>{children}</ChakraUIProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
