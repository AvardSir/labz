import React from "react";

export const AudioUploader = ({ onFileSelect }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <label htmlFor="audio" style={{ display: "block", marginBottom: "0.5rem" }}>
        Озвучка (mp3):
      </label>
      <input
        type="file"
        id="audio"
        accept="audio/*"
        onChange={handleFileChange}
        style={{
          width: "100%",
          padding: "0.75rem",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          fontSize: "1rem",
        }}
      />
    </div>
  );
};

