import React, { useContext, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { AuthContext } from "../../util/auth";
import app from "../../util/base";

import { LinkInput, ExistingLinks } from "./StudentLinks";
import { EventInput, EventLinks } from "./StudentEvents";
import { CourseInput, CourseLinks } from "./StudentCourses";
import "../../styles/Student.css";

function Student() {
  const { netid } = useContext(AuthContext);

  const [addingLink, setAddingLink] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [refreshLinks, setRefreshLinks] = useState(false);

  const [addingEvent, setAddingEvent] = useState(false);
  const [eventError, setEventError] = useState("");
  const [refreshEvents, setRefreshEvents] = useState(false);

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
    if (refreshEvents) {
      setEventError("");
      setRefreshEvents(false);
    }
  }, [refreshEvents]);
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
        <h1>Student{netid && ": " + netid}</h1>
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
              Create/Edit Personal Link
            </button>
          )}
          {linkError && <p className="text-danger">{linkError}</p>}
        </div>
        {!refreshLinks && (
          <ExistingLinks netid={netid} setRefresh={setRefreshLinks} />
        )}
        <hr />
        <div className="add-event">
          {addingEvent || eventError ? (
            <EventInput
              netid={netid}
              setAddingEvent={setAddingEvent}
              setRefresh={setRefreshEvents}
              setError={(message) => {
                if (message) {
                  setEventError("Error!");
                  setTimeout(() => {
                    if (!mountedRef.current) return null;
                    setEventError(message);
                  }, 500);
                } else {
                  setEventError(message);
                }
              }}
            />
          ) : (
            <button
              className="btn btn-info"
              onClick={() => {
                setAddingEvent(true);
              }}
            >
              Create/Edit Event Link
            </button>
          )}
          {eventError && <p className="text-danger">{eventError}</p>}
        </div>
        {!refreshEvents && (
          <EventLinks netid={netid} setRefresh={setRefreshEvents} />
        )}
        <hr />
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
      </div>
    </div>
  );
}

export default Student;
