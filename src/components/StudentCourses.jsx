import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import app, { arrayUnion, arrayRemove } from "../util/base";

import "../styles/Student.css";
import x from "../assets/icons/x.svg";

const users = app.firestore().collection("users");
const courses = app.firestore().collection("courses");

export function CourseInput({ netid, setAddingCourse, setRefresh, setError }) {
  const [courseInput, setCourseInput] = useState("");
  const [courseSubject, setCourseSubject] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const [subject, number] = courseInput
      .toUpperCase()
      .replace(/\s+/g, "")
      .split(/([0-9]+)/);
    setCourseSubject(subject);
    setCourseNumber(number);
  }, [courseInput]);

  const addCourse = async (subject, number) => {
    if (!subject) {
      setError("Missing subject.");
      return;
    }

    const subjectExists = await courses
      .doc(subject)
      .get()
      .then((doc) => doc.exists);
    if (!subjectExists) {
      console.log(subject);
      setError("That subject does not exist.");
      return;
    }

    setPending(true);
    // TODO non-default sections
    await courses
      .doc(subject)
      .collection(number)
      .doc("default")
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          const { link, netids } = doc.data();
          if (link && netids && netids.length) {
            if (netids.includes(netid)) {
              await users.doc(netid).update({
                courses: arrayUnion(courseSubject + courseNumber),
              });
              setRefresh(true);
              return;
            } else {
              setError("This professor has not whitelisted your netid.");
              return;
            }
          } else if (netids && netids.length) {
            setError("This professor has not assigned this course a link.");
            return;
          } else {
            setError("This professor has not whitelisted any netids.");
            return;
          }
        }
        setError("This class has no data.");
      })
      .catch((err) => {
        console.log(err);
        setError("There was an error adding the course.");
      });
    setPending(false);
  };

  const handleCourseInputChange = (event) => {
    setCourseInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addCourse(courseSubject, courseNumber).then(() => {
      setAddingCourse(false);
    });
  };

  return (
    <form className="form justify-content-center" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="course-input">
        Course Subject and Number
      </label>
      <input
        type="text"
        className="form-control mb-2 mr-sm-2 center"
        id="course-input"
        placeholder="Course Subject and Number (eg. CS 2110)"
        onChange={handleCourseInputChange}
        required
      />
      {pending ? (
        <p className="text-info">
          Adding course{courseSubject && " " + courseSubject}
          {courseNumber && " " + courseNumber}
        </p>
      ) : (
        <>
          <button type="submit" className="btn btn-outline-primary">
            Add course{courseSubject && " " + courseSubject}
            {courseNumber && " " + courseNumber}
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setError("");
              setAddingCourse(false);
            }}
          >
            Cancel
          </button>
        </>
      )}
    </form>
  );
}

export function CourseLinks({ netid }) {
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
      const generateUrl = (course) => {
        const href = window.location.href;
        const root = href.substring(0, href.lastIndexOf("/"));
        return root + "/courses/" + course;
      };
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
                {course && <p className="text-dark">{generateUrl(course)}</p>}
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
