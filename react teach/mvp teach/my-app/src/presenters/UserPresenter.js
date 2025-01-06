import React, { useState } from "react";
import { UserModel } from "../models/UserModel";
import { UserView } from "../views/UserView";

export const UserPresenter = () => {
  const model = new UserModel();
  const [user, setUser] = useState(model.getUser());

  const handleUpdate = (newData) => {
    model.updateUser(newData);
    setUser(model.getUser());
  };

  return <UserView user={user} onUpdate={handleUpdate} />;
};
