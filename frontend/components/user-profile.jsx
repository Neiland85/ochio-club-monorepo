import React from 'react';

const UserProfile = ({
  initialUserData,
  onUpdateProfile,
  onChangePassword,
}) => {
  return (
    <div>
      <h1>{initialUserData.name}</h1>
      <p>{initialUserData.email}</p>
      {initialUserData.avatar && (
        <img src={initialUserData.avatar} alt="Avatar" />
      )}
      <button onClick={() => onUpdateProfile({})}>Actualizar perfil</button>
      <button onClick={() => onChangePassword({})}>Cambiar contraseña</button>
    </div>
  );
};

export default UserProfile;
