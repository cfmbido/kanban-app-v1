import axios from "axios";
import React from "react";

function ModalDelete({ closeModal, taskId, groupId, fetchData }) {
  const handleClose = () => {
    closeModal();
  };

  const handleDelete = () => {
    axios
      .delete(
        `https://todos-project-api.herokuapp.com/todos/${groupId}/items/${taskId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2NTk2MjU1Nzd9.ffLtKAjsoL-FR3xcwSeWCdEdid0UGjSXKh4VrRAacCc",
          },
        }
      )
      .then(async (data) => {
        handleClose();
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        zIndex: "9999",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "420px",
          height: "150px",
          borderRadius: "6px",
          padding: "20px 20px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={"20px"}
              width={"20px"}
              fill="none"
              viewBox="0 0 24 24"
              stroke="#E11428"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Delete Task
          </div>
          <button onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={"20px"}
              width={"20px"}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          style={{
            fontSize: "12px",
          }}
        >
          Are you sure want to delete this task? your action cant be reverted.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            gap: "10px",
            bottom: 0,
            right: 0,
            position: "absolute",
            margin: "20px",
            fontSize: "14px",
            fontWeight: "semibold",
          }}
        >
          <button
            style={{
              backgroundColor: "white",
              border: "2px solid #EDEDED",
              padding: "4px 10px",
              borderRadius: "8px",
            }}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            style={{
              backgroundColor: "#E11428",
              padding: "4px 10px",
              borderRadius: "8px",
              color: "white",
            }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDelete;
