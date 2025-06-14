import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

import { Button } from "@/components/ui/button"

*/
export const Button: React.FC<ButtonProps> = ({ asChild, children, disabled, ...props }) => {
  const className = `px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${
    disabled ? "opacity-60 cursor-not-allowed" : ""
  } ${props.className || ''}`;

  if (asChild && React.isValidElement(children) && children.type === "a") {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: [((children.props as { className?: string })?.className || ""), className].filter(Boolean).join(" "),
    });
  }
  return (
    <button
      {...props}
      disabled={disabled}
      className={className}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};
