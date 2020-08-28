import React, { useContext, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { AuthContext } from "../util/auth";
import app from "../util/base";

import "../styles/Home.css";

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
        .then(() => {
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
        <button type="submit" className="btn btn-outline-primary mb-2">
          Set redirect link{linkInput && " to " + linkInput}
          {slugInput && " at /link/" + slugInput}
        </button>
      )}
    </form>
  );
};

function ExistingLinks({ netid, refresh }) {
  const [linkDocs, setLinkDocs] = useState([]);
  const [links, setLinks] = useState([]);

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
    getLinks();
  }, [refresh, netid]);

  useEffect(() => {
    const formatLinks = () => {
      const links = [];
      linkDocs.forEach((linkDoc) => {
        links.push({
          id: linkDoc.id,
          data: linkDoc.data(),
        });
      });
      links.sort((a, b) => (a.id > b.id ? 1 : -1));
      return links
        .filter(({ id, data }) => id.match(/^[a-z0-9-+]+$/) && data && data.url)
        .map(({ id, data }) => {
          return (
            <h2 key={id}>
              <Link to={"/link/" + id}>
                {id || data.name} ({data.url})
              </Link>
            </h2>
          );
        });
    };
    setLinks(formatLinks());
  }, [linkDocs]);

  return <div className="existing-links">{links}</div>;
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
    <div className="home">
      <Helmet>
        <title>Cornell Zoom Hub | Student</title>
        <meta name="title" content="Cornell Zoom Hub | Student" />
        <meta name="description" content="Cornell Zoom Hub | Student Page" />
      </Helmet>
      <div className="container">
        <h1>Signed in{netid && " as " + netid}</h1>
        {!refresh && <ExistingLinks netid={netid} />}
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
    </div>
  );
}

export default Student;
