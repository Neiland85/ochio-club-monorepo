import React from 'react';

export const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-4 border-b ${className}`}>{children}</div>;

export const CardTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;

export const CardDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className="text-sm text-gray-500">{children}</p>;

export const CardContent = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-4 ${className}`}>{children}</div>;

export const CardFooter = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-4 border-t flex gap-2 ${className}`}>{children}</div>;
