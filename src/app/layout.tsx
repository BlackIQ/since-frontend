import type { Metadata } from "next";
import Providers from "@/app/providers";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Since - Every moment counts",
  description: "A simple way to keep track of the things that matter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          {children}

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "8px",
                background: "#171717",
                color: "#FFFFFF",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
