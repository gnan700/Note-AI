// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import AnimatedFooter from "@/components/AnimatedFooter"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NotePilot AI",
  description: "Personal productivity app with notes, tasks, and AI summaries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <Providers>
          <div className="flex-grow">
            {children}
          </div>
          <AnimatedFooter />
        </Providers>
      </body>
    </html>
  );
}