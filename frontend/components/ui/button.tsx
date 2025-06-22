import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "secondary" | "destructive";
}

export const Button: React.FC<ButtonProps> = ({ asChild, variant = "default", children, disabled, ...props }) => {
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const className = `px-4 py-2 rounded transition ${
    disabled ? "opacity-60 cursor-not-allowed" : ""
  } ${variantClasses[variant]} ${props.className || ""}`;

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
