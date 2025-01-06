const fs = require("fs");
const path = require("path");

// Define file structure
const fileStructure = {
  "src/models": {
    "UserModel.js": `export class UserModel {
  constructor() {
    this.user = { name: "John Doe", age: 30 };
  }

  getUser() {
    return this.user;
  }

  updateUser(newData) {
    this.user = { ...this.user, ...newData };
  }
}
`
  },
  "src/views": {
    "UserView.js": `import React from "react";

export const UserView = ({ user, onUpdate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div>
      <h1>User Profile</h1>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Age:
        <input
          type="number"
          name="age"
          value={user.age}
          onChange={handleChange}
        />
      </label>
      <p>
        Current user: {user.name}, {user.age} years old
      </p>
    </div>
  );
};
`
  },
  "src/presenters": {
    "UserPresenter.js": `import React, { useState } from "react";
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
`
  },
  "src": {
    "App.js": `import React from "react";
import { UserPresenter } from "./presenters/UserPresenter";

function App() {
  return (
    <div className="App">
      <UserPresenter />
    </div>
  );
}

export default App;
`,
    "index.js": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
  }
};

// Function to create files
const createFiles = (basePath, structure) => {
  for (const [folder, content] of Object.entries(structure)) {
    const folderPath = path.join(basePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    for (const [fileName, fileContent] of Object.entries(content)) {
      const filePath = path.join(folderPath, fileName);
      fs.writeFileSync(filePath, fileContent, "utf8");
      console.log(`Created: ${filePath}`);
    }
  }
};

// Run script to create files
createFiles(process.cwd(), fileStructure);
