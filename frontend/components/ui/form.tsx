import React from "react";

export const Form = ({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) => (
  <form {...props}>{children}</form>
);

export const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

export const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block font-medium mb-1">{children}</label>
);

export const FormControl = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const FormDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-gray-500 mb-1">{children}</p>
);

export const FormMessage = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-red-500 mt-1">{children}</p>
);

export const FormField = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
