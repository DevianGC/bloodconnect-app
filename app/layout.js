import "./globals.css";

export const metadata = {
  title: "BloodConnect Olongapo",
  description: "Centralized blood donor communication and alert system for Olongapo City",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
