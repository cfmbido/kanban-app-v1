import axios from "axios";
import React, { useState } from "react";

function ModalEdit({
  closeModal,
  name,
  progress_percentage,
  taskId,
  groupId,
  fetchData,
}) {
  const [form, setForm] = useState({
    name: name,
    progress_percentage: progress_percentage,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleClose = () => {
    setForm({
      name: "",
      progress_percentage: 0,
    });
    closeModal();
  };

  const handleSave = () => {
    axios
      .patch(
        `https://todos-project-api.herokuapp.com/todos/${groupId}/items/${taskId}`,
        {
          name: form.name,
          progress_percentage: +form.progress_percentage,
          target_todo_id: groupId,
        },
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
        zIndex: "999",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "420px",
          height: "300px",
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
          <span>Edit Task</span>
          <div>{JSON.stringify(form)}</div>
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
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "16px",
            fontSize: "12px",
          }}
        >
          <label>Task Name</label>
          <input
            type="text"
            name="name"
            placeholder="Type your task"
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "2px solid #EDEDED",
            }}
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "12px",
          }}
        >
          <label>Progress</label>
          <input
            type="number"
            name="progress_percentage"
            placeholder="70"
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "2px solid #EDEDED",
            }}
            value={form.progress_percentage}
            onChange={handleChange}
          />
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
              backgroundColor: "#01959F",
              padding: "4px 10px",
              borderRadius: "8px",
              color: "white",
            }}
            onClick={handleSave}
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEdit;
