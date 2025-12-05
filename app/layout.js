import "./globals.css";
import ToastProvider from "./providers/ToastProvider";
import QueryProvider from "./providers/QueryProvider";
import BotpressWrapper from "../components/BotpressWrapper";

export const metadata = {
  title: {
    default: "BloodConnect Olongapo",
    template: "%s | BloodConnect Olongapo"
  },
  description: "Centralized blood donor communication and alert system for Olongapo City. Connect with donors and save lives.",
  keywords: ["blood donation", "Olongapo", "blood donor", "health", "community", "emergency"],
  authors: [{ name: "BloodConnect Team" }],
  openGraph: {
    title: "BloodConnect Olongapo",
    description: "Centralized blood donor communication and alert system for Olongapo City",
    url: "https://bloodconnect-olongapo.vercel.app",
    siteName: "BloodConnect Olongapo",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ToastProvider>
            {children}
            <BotpressWrapper />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

