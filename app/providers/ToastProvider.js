
'use client';

import { Toaster } from "react-hot-toast";

export default function ToastProvider({ children }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
