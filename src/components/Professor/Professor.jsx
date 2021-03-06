import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import { AuthContext } from "../../util/auth";
import app from "../../util/base";

import "../../styles/Professor.css";

const professors = app.firestore().collection("professors");
const courses = app.firestore().collection("courses");

function ClassCard({ subject, number }) {
  const course = subject + number;

  const { netid } = useContext(AuthContext);

  const [modal, setModal] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [whitelistString, setWhitelistString] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [urlLink, setUrlLink] = useState("");
  const [backgroundUrlLink, setBackgroundUrlLink] = useState("");
  const [loading, setLoading] = useState(true);

  const generateUrl = (course) => {
    const root = window.location.origin;
    return root + "/course/" + course;
  };

  useEffect(() => {
    setUrlLink(
      linkInput &&
        linkInput.indexOf("://") === -1 &&
        linkInput.indexOf("mailto:") === -1
        ? "http://" + linkInput
        : linkInput
    );
  }, [linkInput]);

  useEffect(() => {
    if (loading) {
      const prePopulate = async () => {
        await courses
          .doc(subject)
          .collection(number + "")
          .doc("default")
          .get()
          .then((res) => {
            const data = res.data();
            setLinkInput(data.link);
            setBackgroundUrlLink(data.link);
            setWhitelistString(data.netids.join("\n"));
          });
      };
      prePopulate();
      setLoading(false);
    }
  }, [loading, number, subject]);
  const handleLinkChange = (event) => {
    setLinkInput(event.target.value);
  };
  const handleWhitelistChange = (event) => {
    setWhitelistString(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    await addLink(linkInput);
    await addWhitelist(whitelistString);
    setModal(false);
    setBackgroundUrlLink(urlLink);
  };

  const addLink = async (url) => {
    if (!url) {
      setError("Missing url link.");
      return;
    }

    setError("");
    setPending(true);
    if (netid) {
      await courses
        .doc(subject)
        .collection(number + "")
        .doc("default")
        .update({
          link: urlLink,
        })
        .catch((err) => {
          console.log(err);
          setError("There was an error adding the link.");
        });
    } else {
      setError("Missing netid.");
    }
    setPending(false);
  };

  const addWhitelist = async (whitelist) => {
    const courses = app.firestore().collection("courses");
    const split = whitelist.split("\n");
    if (netid) {
      await courses
        .doc(subject)
        .collection(number + "")
        .doc("default")
        .update({
          netids: split,
        })
        .catch((err) => {
          console.log(err);
          setError("There was an error adding the whitelist.");
        });
    }
  };

  const cornellZoomLink = urlLink.match(
    /^(http:\/\/|https:\/\/)?(cornell\.zoom+\.us+\/j\/)([0-9]{9,11})(\?pwd=[a-zA-Z0-9]+)?$/
  );

  return (
    <>
      <Modal
        show={modal}
        onHide={() => setModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <h3>Zoom link settings for {course}</h3>
        </Modal.Header>
        <Modal.Body>
          <form className="form justify-content-center" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control mb-2 mr-sm-2 center"
              value={linkInput}
              id="url-input"
              placeholder="URL Link"
              onChange={handleLinkChange}
              required
            />
            <br />
            <h5> Whitelist of NetIDs (newline separated) </h5>
            <textarea
              value={whitelistString}
              className="form-control mb-2 mr-sm-10 center"
              onChange={handleWhitelistChange}
            />
            {error && <p className="text-danger">{error}</p>}
            {pending && (
              <div>
                {" "}
                Link updating... <br />{" "}
              </div>
            )}
            <button type="submit" className="btn btn-outline-primary">
              Set redirect link
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <Link
        key={course}
        onClick={(e) => {
          setModal(true);
        }}
      >
        <li className="bg-light">
          <h2>{course}</h2>
          {urlLink !== "" && (
            <p className="text-dark"> {generateUrl(course)} </p>
          )}
          {
            <p className={cornellZoomLink ? "text-success" : "text-info"}>
              {backgroundUrlLink}
            </p>
          }
          {/* // TODO add link as in student page */}
        </li>
      </Link>
    </>
  );
}

function Professor() {
  const { netid } = useContext(AuthContext);
  const [courseDocs, setCourseDocs] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    const getCourses = () => {
      if (refresh) {
        professors
          .doc(netid)
          .collection("courses")
          .get()
          .then((docs) => {
            setCourseDocs(docs);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setRefresh(false);
    };
    getCourses();
  }, [netid, refresh]);

  const getCards = () => {
    const cards = [];
    courseDocs.forEach((doc) => {
      const data = doc.data();
      cards.push(<ClassCard key={data.subject + data.number} {...data} />);
    });
    return cards;
  };

  return (
    <div className="professor">
      <Helmet>
        <title>Cornell Zoom Hub | Professor</title>
        <meta name="title" content="Cornell Zoom Hub | Professor" />
        <meta name="description" content="Cornell Zoom Hub | Professor Page" />
      </Helmet>
      <div className="container">
        <h1>Professor{netid && ": " + netid}</h1>
        <button
          className="btn btn-danger"
          onClick={() => {
            app.auth().signOut();
            document.location.href = "/";
          }}
        >
          Sign Out
        </button>
        <div className="courses">
          <ul>{getCards().map((card) => card)}</ul>
        </div>
      </div>
    </div>
  );
}

export default Professor;
