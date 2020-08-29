import React, { useState, useEffect } from "react";

import app, { arrayUnion } from "../util/base";

import "../styles/Student.css";

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

export function CourseLinks() {}
