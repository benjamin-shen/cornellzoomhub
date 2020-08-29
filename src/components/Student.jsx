import React, { useContext, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { AuthContext } from "../util/auth";
import app from "../util/base";

import { LinkInput, ExistingLinks } from "./StudentLinks";
import { CourseInput, CourseLinks } from "./StudentCourses";
import "../styles/Student.css";

function Student() {
  const { netid } = useContext(AuthContext);

  const [addingLink, setAddingLink] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [refreshLinks, setRefreshLinks] = useState(false);

  const [addingCourse, setAddingCourse] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [refreshCourses, setRefreshCourses] = useState(false);

  useEffect(() => {
    if (refreshLinks) {
      setLinkError("");
      setRefreshLinks(false);
    }
  }, [refreshLinks]);
  useEffect(() => {
    if (refreshCourses) {
      setCourseError("");
      setRefreshCourses(false);
    }
  }, [refreshCourses]);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="student">
      <Helmet>
        <title>Cornell Zoom Hub | Student</title>
        <meta name="title" content="Cornell Zoom Hub | Student" />
        <meta name="description" content="Cornell Zoom Hub | Student Page" />
      </Helmet>
      <div className="container">
        <h1>Signed in{netid && " as " + netid}</h1>
        <button
          className="btn btn-danger"
          onClick={() => {
            app.auth().signOut();
            document.location.href = "/";
          }}
        >
          Sign Out
        </button>
        <hr />
        <div className="add-link">
          {addingLink || linkError ? (
            <LinkInput
              netid={netid}
              setAddingLink={setAddingLink}
              setRefresh={setRefreshLinks}
              setError={(message) => {
                if (message) {
                  setLinkError("Error!");
                  setTimeout(() => {
                    if (!mountedRef.current) return null;
                    setLinkError(message);
                  }, 500);
                } else {
                  setLinkError(message);
                }
              }}
            />
          ) : (
            <button
              className="btn btn-info"
              onClick={() => {
                setAddingLink(true);
              }}
            >
              Create/edit Link
            </button>
          )}
          {linkError && <p className="text-danger">{linkError}</p>}
        </div>
        {!refreshLinks && <ExistingLinks netid={netid} />}
        <hr />
        {addingCourse || courseError ? (
          <CourseInput
            netid={netid}
            setAddingCourse={setAddingCourse}
            setRefresh={setRefreshCourses}
            setError={(message) => {
              if (message) {
                setCourseError("Error!");
                setTimeout(() => {
                  if (!mountedRef.current) return null;
                  setCourseError(message);
                }, 500);
              } else {
                setCourseError(message);
              }
            }}
          />
        ) : (
          <button
            className="btn btn-info"
            onClick={() => {
              setAddingCourse(true);
            }}
          >
            Add Course Link
          </button>
        )}
        {courseError && <p className="text-danger">{courseError}</p>}
      </div>
    </div>
  );
}

export default Student;
