import React, { useContext, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import moment from "moment-timezone";

import { AuthContext } from "../util/auth";
import app from "../util/base";

import "../styles/Student.css";
import x from "../assets/icons/x.svg";

moment.tz.setDefault("America/New_York");
const users = app.firestore().collection("users");

const LinkInput = ({ netid, setAddingLink, setRefresh, setError }) => {
  const [slugInput, setSlugInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [urlLink, setUrlLink] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setUrlLink(
      linkInput &&
        linkInput.indexOf("://") === -1 &&
        linkInput.indexOf("mailto:") === -1
        ? "http://" + linkInput
        : linkInput
    );
  }, [linkInput]);

  const addLink = async (slug, name, url) => {
    if (!slug) {
      setError("Missing slug name.");
      return;
    } else if (!slug.match(/^[a-z0-9-+]+$/)) {
      setError("Slug does not match regex.");
      return;
    }
    if (!url) {
      setError("Missing url link.");
      return;
    }

    setError("");
    setPending(true);
    if (netid) {
      await users
        .doc(netid)
        .collection("links")
        .doc(slug)
        .set({
          name: name || slug,
          url: urlLink,
        })
        .then(async () => {
          await users
            .doc(netid)
            .set({
              lastUpdated: new Date(),
            })
            .catch((err) => {
              console.log(err);
            });
          setRefresh(true);
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

  const handleSlugChange = (event) => {
    setSlugInput(event.target.value);
  };
  const handleNameChange = (event) => {
    setNameInput(event.target.value);
  };
  const handleLinkChange = (event) => {
    setLinkInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addLink(slugInput, nameInput, linkInput);
    setAddingLink(false);
  };

  return (
    <form className="form justify-content-center" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="slug-input">
        Slug
      </label>
      <input
        type="text"
        className="form-control mb-2 mr-sm-2 center"
        id="slug-input"
        placeholder="Slug"
        onChange={handleSlugChange}
        required
      />
      <label className="sr-only" htmlFor="name-input">
        Nickname
      </label>
      <input
        type="text"
        className="form-control mb-2 mr-sm-2 center"
        id="name-input"
        placeholder={"Nickname" + (slugInput && ": " + slugInput)}
        onChange={handleNameChange}
      />
      <label className="sr-only" htmlFor="url-input">
        URL Link
      </label>
      <input
        type="text"
        className="form-control mb-2 mr-sm-2 center"
        id="url-input"
        placeholder="URL Link"
        onChange={handleLinkChange}
        required
      />
      {pending ? (
        <p className="text-info">
          Setting redirect link to {urlLink} at /link/{slugInput}
        </p>
      ) : (
        <>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setAddingLink(false);
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-outline-primary">
            Set redirect link{linkInput && " to " + linkInput}
            {slugInput && " at /link/" + slugInput}
          </button>
        </>
      )}
    </form>
  );
};

function ExistingLinks({ netid, refresh }) {
  const [linkDocs, setLinkDocs] = useState([]);
  const [links, setLinks] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const getLinks = () => {
      users
        .doc(netid)
        .collection("links")
        .where("url", ">", "")
        .get()
        .then((docs) => {
          setLinkDocs(docs);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getLastUpdated = () => {
      users
        .doc(netid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // TODO moment formatting
            setLastUpdated(
              moment(doc.data().lastUpdated.toDate()).format("LLLL")
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLinks();
    getLastUpdated();
  }, [refresh, netid]);

  useEffect(() => {
    const deleteLink = (id) => {
      users
        .doc(netid)
        .collection("links")
        .doc(id)
        .delete()
        .catch((err) => {
          console.log(err);
        });
    };

    const formatLinks = () => {
      const formattedLinks = [];
      linkDocs.forEach((linkDoc) => {
        formattedLinks.push({
          id: linkDoc.id,
          data: linkDoc.data(),
        });
      });
      formattedLinks.sort((a, b) => (a.data.name > b.data.name ? 1 : -1));
      return formattedLinks
        .filter(({ id, data }) => id.match(/^[a-z0-9-+]+$/) && data && data.url)
        .map(({ id, data: { name, url } }) => {
          const cornellZoomLink = url.match(
            /^(http:\/\/|https:\/\/)?(cornell\.zoom+\.us+\/j\/)([0-9]{9,11})(\?pwd=[a-zA-Z0-9]+)?$/
          );
          return (
            <Link key={id} to={"/link/" + id}>
              <li className="bg-light">
                <img
                  src={x}
                  width="22"
                  alt="Delete link."
                  className="float-right"
                  onClick={() => deleteLink(id)}
                />
                <h2>
                  {name} {id !== name && `(/${id})`}
                </h2>
                <p className={cornellZoomLink ? "text-success" : "text-info"}>
                  {url}
                </p>
              </li>
            </Link>
          );
        });
    };
    setLinks(formatLinks());
  }, [linkDocs, netid]);

  return (
    <div className="existing-links">
      {links && <ul>{links}</ul>}
      <p>{!!links.length && "Last Updated: " + lastUpdated}</p>
    </div>
  );
}

function Student() {
  const { netid } = useContext(AuthContext);

  const [addingLink, setAddingLink] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

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
        <div className="add-link">
          {addingLink || error ? (
            <LinkInput
              netid={netid}
              setAddingLink={setAddingLink}
              setRefresh={setRefresh}
              setError={(message) => {
                if (message) {
                  setError("Error!");
                  setTimeout(() => {
                    if (!mountedRef.current) return null;
                    setError(message);
                  }, 500);
                } else {
                  setError(message);
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
          {error && <p className="text-danger">{error}</p>}
        </div>
        {!refresh && <ExistingLinks netid={netid} />}
      </div>
    </div>
  );
}

export default Student;
