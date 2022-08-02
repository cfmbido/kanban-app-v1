import React from "react";
import Board from "../components/Board/Board";

function Home() {
  return (
    <div>
      <div style={{ padding: "20px", borderBottom: "1px solid black" }}>
        Product Roadmap
      </div>
      <Board />
    </div>
  );
}

export default Home;
