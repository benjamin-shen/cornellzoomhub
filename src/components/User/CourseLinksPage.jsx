import React, { useContext, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { AuthContext } from "../../util/auth";

import User from "./User";
import { CourseInput, CourseLinks } from "./StudentCourses";

function CourseLinksPage() {
  const { netid } = useContext(AuthContext);

  const [addingCourse, setAddingCourse] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [refreshCourses, setRefreshCourses] = useState(false);

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
      <User>
        <div className="add-course">
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
        {!refreshCourses && (
          <CourseLinks netid={netid} setRefresh={setRefreshCourses} />
        )}
      </User>
    </div>
  );
}

export default CourseLinksPage;
