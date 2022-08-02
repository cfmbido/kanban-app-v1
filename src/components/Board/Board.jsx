import ModalCreate from "../ModalCreate/ModalCreate";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalDelete from "../ModalDelete/ModalDelete";
import ModalEdit from "../ModalEdit/ModalEdit";
import Loading from "../Loading/Loading";
import styles from "./board.module.css";
const colorList = [
  { border: "#01959F", background: "#F7FEFF", title: "#4DB5BC" },
  { border: "#FEEABC", background: "#FFFCF5", title: "#FA9810" },
  { border: "#F5B1B7", background: "#FFFAFA", title: "#E11428" },
  { border: "#B8DBCA", background: "#F8FBF9", title: "#43936C" },
];

function Board() {
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dragData, setDragData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  //modal create task
  const [modalCreate, setModalCreate] = useState(false);
  const [modalCreateGroupId, setModalCreateGroupId] = useState(null);

  //modal delete task
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDeleteData, setModalDeleteData] = useState({
    taskId: null,
    groupId: null,
  });

  //modal edit task
  const [modalEdit, setModalEdit] = useState(false);
  const [modalEditData, setModalEditData] = useState({
    name: "",
    progress_percentage: 0,
    taskId: null,
    groupId: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const resGroups = await fetch(
      "https://todos-project-api.herokuapp.com/todos",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2NTk2MjU1Nzd9.ffLtKAjsoL-FR3xcwSeWCdEdid0UGjSXKh4VrRAacCc",
        },
      }
    );
    const dataGroups = await resGroups.json();
    const resTasks = await Promise.all(
      dataGroups.map((dataGroup) => {
        return fetch(
          `https://todos-project-api.herokuapp.com/todos/${dataGroup.id}/items`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2NTk2MjU1Nzd9.ffLtKAjsoL-FR3xcwSeWCdEdid0UGjSXKh4VrRAacCc",
            },
          }
        );
      })
    );
    const dataTasks = await Promise.all(
      resTasks.map((resTask) => {
        return resTask.json();
      })
    );
    setGroups(dataGroups);
    setTasks(dataTasks);
    setLoading(false);
  };

  const updateGroup = async (taskId, groupId, targetGroupId) => {
    setLoading(true);
    setExpandedId(null);
    axios
      .patch(
        `https://todos-project-api.herokuapp.com/todos/${groupId}/items/${taskId}`,
        {
          target_todo_id: targetGroupId,
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
        await fetchData();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnDragStart = (e, taskId, groupId) => {
    setDragData({ taskId, groupId });
  };

  const handleOnDragEnter = (e, groupId) => {};

  const handleOnDrop = (e, targetGroupId) => {
    const { taskId, groupId } = dragData;

    if (groupId !== targetGroupId) {
      setLoading(true);
      axios
        .patch(
          `https://todos-project-api.herokuapp.com/todos/${groupId}/items/${taskId}`,
          {
            target_todo_id: targetGroupId,
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
          await fetchData();
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className={styles.container}>
        {groups.map((group, idxGroup) => {
          return (
            <div
              key={idxGroup}
              className={styles.groupContainer}
              style={{
                backgroundColor: colorList[idxGroup]
                  ? colorList[idxGroup].background
                  : "grey",
                border: `1px solid ${
                  colorList[idxGroup] ? colorList[idxGroup].border : "black"
                }`,
                borderRadius: "4px",
              }}
              onDragEnter={(e) => handleOnDragEnter(e, group.id)}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => handleOnDrop(e, group.id)}
            >
              <div
                className={styles.groupTitle}
                style={{
                  color: colorList[idxGroup]
                    ? colorList[idxGroup].title
                    : "black",
                  border: `1px solid ${
                    colorList[idxGroup] ? colorList[idxGroup].title : "black"
                  }`,
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              >
                {group.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                {group.description}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {tasks[idxGroup]?.length ? (
                  tasks[idxGroup].map((task, idxTask) => {
                    return (
                      <div key={idxTask} style={{ position: "relative" }}>
                        <div
                          style={{
                            backgroundColor: "#FAFAFA",
                            border: "1px solid #E0E0E0",
                            borderRadius: "4px",
                            padding: "16px",
                            fontSize: "14px",
                            position: "relative",
                          }}
                          draggable
                          onDragStart={(e) => {
                            handleOnDragStart(e, task.id, group.id);
                          }}
                        >
                          <div>{task.name}</div>
                          <div
                            style={{
                              marginTop: "20px",
                              marginBottom: "20px",
                              border: "1px dashed #E0E0E0",
                              alignSelf: "stretch",
                              flex: "none",
                              order: 1,
                              flexGrow: 0,
                            }}
                          ></div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                width: "80%",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  height: "16px",
                                  width: "80%",
                                  backgroundColor: "#EDEDED",
                                  position: "relative",
                                  borderRadius: "9999px",
                                  overflow: "hidden",
                                  marginRight: "4px",
                                }}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    width: `${task.progress_percentage}%`,
                                    backgroundColor: `${
                                      task.progress_percentage >= 100
                                        ? "#43936C"
                                        : "#01959F"
                                    }`,
                                    inset: 0,
                                  }}
                                ></div>
                              </div>
                              {task?.progress_percentage >= 100 ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height={"20px"}
                                  width={"20px"}
                                  viewBox="0 0 20 20"
                                  fill="#43936C"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <div style={{ fontSize: "12px" }}>
                                  {task.progress_percentage}%
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                expandedId === task.id
                                  ? setExpandedId(null)
                                  : setExpandedId(task.id);
                              }}
                            >
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
                                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {expandedId === task.id && (
                          <div
                            style={{
                              position: "absolute",
                              backgroundColor: "white",
                              width: "100%",
                              height: "auto",
                              right: "-80%",
                              zIndex: "10",
                              padding: "12px",
                              borderRadius: "4px",
                              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                            }}
                          >
                            {groups[idxGroup + 1] && (
                              <button
                                onClick={() => {
                                  updateGroup(
                                    task.id,
                                    group.id,
                                    groups[idxGroup + 1].id
                                  );
                                  setExpandedId(null);
                                }}
                                style={{
                                  fontSize: "14px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  width: "fit-content",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height={"16px"}
                                  width={"16px"}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                  />
                                </svg>
                                Move Right
                              </button>
                            )}
                            {groups[idxGroup - 1] && (
                              <button
                                onClick={() => {
                                  updateGroup(
                                    task.id,
                                    group.id,
                                    groups[idxGroup - 1].id
                                  );
                                  setExpandedId(null);
                                }}
                                style={{
                                  fontSize: "14px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height={"16px"}
                                  width={"16px"}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                  />
                                </svg>
                                Move Left
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setModalEdit(true);
                                setModalEditData({
                                  name: task.name,
                                  progress_percentage: task.progress_percentage,
                                  taskId: task.id,
                                  groupId: group.id,
                                });
                                setExpandedId(null);
                              }}
                              style={{
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height={"16px"}
                                width={"16px"}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setModalDelete(true);
                                setModalDeleteData({
                                  taskId: task.id,
                                  groupId: group.id,
                                });
                                setExpandedId(null);
                              }}
                              style={{
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height={"16px"}
                                width={"16px"}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      backgroundColor: "#FAFAFA",
                      border: "2px solid #E0E0E0",
                      borderRadius: "4px",
                      padding: "10px",
                      fontSize: "14px",
                    }}
                  >
                    No Data
                  </div>
                )}
              </div>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  fontSize: "14px",
                  marginTop: "12px",
                }}
                onClick={() => {
                  setModalCreate(true);
                  setModalCreateGroupId(group.id);
                  setExpandedId(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height={"16px"}
                  width={"16px"}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                New Task
              </button>
            </div>
          );
        })}
      </div>
      {loading && <Loading />}

      {modalCreate && (
        <ModalCreate
          closeModal={() => {
            setModalCreate(false);
          }}
          groupId={modalCreateGroupId}
          fetchData={fetchData}
        />
      )}
      {modalDelete && (
        <ModalDelete
          closeModal={() => {
            setModalDelete(false);
          }}
          taskId={modalDeleteData.taskId}
          groupId={modalDeleteData.groupId}
          fetchData={fetchData}
        />
      )}
      {modalEdit && (
        <ModalEdit
          closeModal={() => {
            setModalEdit(false);
          }}
          name={modalEditData.name}
          progress_percentage={modalEditData.progress_percentage}
          taskId={modalEditData.taskId}
          groupId={modalEditData.groupId}
          fetchData={fetchData}
        />
      )}
    </>
  );
}

export default Board;
