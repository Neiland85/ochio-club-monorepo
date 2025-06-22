import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
<<<<<<< HEAD
  variant?: "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg"; // Agregar propiedad 'size'
}

export const Button: React.FC<ButtonProps> = ({ asChild, children, disabled, variant, size, ...props }) => {
  let sizeClass = "";
  if (size === "sm") sizeClass = "text-sm";
  else if (size === "lg") sizeClass = "text-lg";

  const className = `px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${
    disabled ? "opacity-60 cursor-not-allowed" : ""
  } ${variant === "outline" ? "border border-gray-300" : ""} ${
    variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""
  } ${variant === "ghost" ? "bg-transparent" : ""} ${sizeClass} ${props.className || ''}`;
=======
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
>>>>>>> dev

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
