import React from 'react';

export const Select = ({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className="border rounded px-3 py-2 w-full" {...props}>
    {children}
  </select>
);

export const SelectTrigger = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2">{children}</div>
);

export const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <option value="" disabled hidden>
    {placeholder}
  </option>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const SelectItem = ({
  value,
  children,
  ...props
}: {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) => (
  <option value={value} disabled={props.disabled} className={props.className}>
    {children}
  </option>
);
