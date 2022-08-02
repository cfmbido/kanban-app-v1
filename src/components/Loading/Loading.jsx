import React from "react";

function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0, 0.5)",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "999",
        color: "white",
      }}
    >
      Loading...
    </div>
  );
}

export default Loading;
