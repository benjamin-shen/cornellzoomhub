import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { AuthContext } from "../util/auth";
import app from "../util/base";

import "../styles/Home.css";

const users = app.firestore().collection("users");

const LinkInput = ({ netid, setAddingLink }) => {
  const [slugInput, setSlugInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const addLink = async (slug, name, url) => {
    setError("");
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
    const urlLink =
      url.indexOf("://") === -1 && url.indexOf("mailto:") === -1
        ? "http://" + url
        : url;

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
        Slug Name
      </label>
      <input
        type="text"
        className="form-control mb-2 mr-sm-2 center"
        id="slug-input"
        placeholder="Slug Name"
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
        placeholder={slugInput || "Nickname"}
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
        <p className="text-info">Adding link at /link/{slugInput}</p>
      ) : (
        <button type="submit" className="btn btn-outline-primary mb-2">
          Add Link
        </button>
      )}
      {error && <p className="text-danger">{error}</p>}
    </form>
  );
};

function Student() {
  const { netid } = useContext(AuthContext);

  const [addingLink, setAddingLink] = useState(false);

  return (
    <div className="home">
      <div className="container">
        <h1>Signed In</h1>
        {addingLink ? (
          <LinkInput netid={netid} setAddingLink={setAddingLink} />
        ) : (
          <button
            className="btn btn-info"
            onClick={() => {
              setAddingLink(true);
            }}
          >
            Add Link
          </button>
        )}
      </div>
    </div>
  );
}

export default Student;
