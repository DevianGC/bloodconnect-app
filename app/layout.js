import "./globals.css";
import ToastProvider from "./providers/ToastProvider";
import QueryProvider from "./providers/QueryProvider";
import BotpressWidget from "../components/BotpressWidget";

export const metadata = {
  title: "BloodConnect Olongapo",
  description: "Centralized blood donor communication and alert system for Olongapo City",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ToastProvider>
            {children}
            <BotpressWidget />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

