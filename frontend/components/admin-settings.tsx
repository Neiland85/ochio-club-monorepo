export const AdminSettingsPanel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};

export const AdminSettingsSection = ({ title }: { title: string }) => {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
};

export const AdminSettingsButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <button>{children}</button>;
};
