import React, { useContext, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { AuthContext } from "../util/auth";
import app from "../util/base";

import { LinkInput, ExistingLinks } from "./StudentLinks";
import { CourseInput } from "./StudentCourses";
import "../styles/Student.css";

import { Link } from "react-router-dom";
import { arrayRemove } from "../util/base";
import x from "../assets/icons/x.svg";
const users = app.firestore().collection("users");
const courses = app.firestore().collection("courses");

function CourseLinks({ netid }) {
  const [coursesArray, setCoursesArray] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const getLinks = () => {
      users
        .doc(netid)
        .get()
        .then((doc) => {
          const data = doc.data();
          if (data && data.courses) {
            setCoursesArray(data.courses);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLinks();
  }, [netid]);

  useEffect(() => {
    const deleteCourse = (course) => {
      users
        .doc(netid)
        .update({ courses: arrayRemove(course) })
        .catch((err) => {
          console.log(err);
        });
    };

    const formatLinks = async () => {
      const result = [];
      coursesArray.sort();
      for (const course of coursesArray) {
        const [subject, number] = course
          .toUpperCase()
          .replace(/\s+/g, "")
          .split(/([0-9]+)/);
        await courses
          .doc(subject)
          .collection(number)
          .doc("default")
          .get()
          .then((doc) => {
            if (doc.exists) {
              const { link, netids } = doc.data();
              if (link && netids && netids.length && netids.includes(netid)) {
                result.push({
                  course,
                  url: link,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return result
        .filter(({ course, url }) => course && url)
        .map(({ course, url }) => {
          const cornellZoomLink = url.match(
            /^(http:\/\/|https:\/\/)?(cornell\.zoom+\.us+\/j\/)([0-9]{9,11})(\?pwd=[a-zA-Z0-9]+)?$/
          );
          return (
            <Link key={course} to={"/courses/" + course}>
              <li className="bg-light">
                <img
                  src={x}
                  width="22"
                  alt="Delete course."
                  className="delete-x"
                  onClick={() => deleteCourse(course)}
                />
                <h2>{course}</h2>
                <p className={cornellZoomLink ? "text-success" : "text-info"}>
                  {url}
                </p>
              </li>
            </Link>
          );
        });
    };
    formatLinks().then((res) => {
      setLinks(res);
    });
  }, [coursesArray, netid]);

  return (
    <div className="course-links">{!!links.length && <ul>{links}</ul>}</div>
  );
}

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
              Create/Edit Personal Link
            </button>
          )}
          {linkError && <p className="text-danger">{linkError}</p>}
        </div>
        {!refreshLinks && <ExistingLinks netid={netid} />}
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
        {!refreshCourses && <CourseLinks netid={netid} />}
      </div>
    </div>
  );
}

export default Student;
