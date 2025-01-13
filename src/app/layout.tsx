import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DebtProvider } from "@/contexts/DebtContext";
import { DebtorProvider } from "@/contexts/DebtorContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Debt Tracker",
  description: "Personal debt tracking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DebtProvider>
          <DebtorProvider>
            <div className="min-h-screen bg-gray-100">
              <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">
                          Debt Tracker
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>
          </DebtorProvider>
        </DebtProvider>
      </body>
    </html>
  );
}
