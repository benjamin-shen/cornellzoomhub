import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import moment from "moment-timezone";

import app from "../../util/base";

import "../../styles/User.css";
import x from "../../assets/icons/x.svg";

moment.tz.setDefault("America/New_York");
const users = app.firestore().collection("users");

export function LinkInput({ netid, setAddingLink, setRefresh, setError }) {
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
    } else if (!slug.toLowerCase().match(/^[a-z0-9-&+]+$/)) {
      console.log(slug);
      setError(
        "Slug does not match regex." +
          (slug.indexOf(" ") !== -1 ? " Spaces are not allowed." : "")
      );
      return;
    }
    if (!url) {
      setError("Missing url link.");
      return;
    }

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
            .update({
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
    addLink(slugInput, nameInput, linkInput).then(() => {
      setAddingLink(false);
    });
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
          Setting redirect link to {urlLink} at /user/link/{slugInput}
        </p>
      ) : (
        <>
          <button type="submit" className="btn btn-outline-primary">
            Set redirect link{linkInput && " to " + linkInput}
            {slugInput && " at /user/link/" + slugInput}
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setError("");
              setAddingLink(false);
            }}
          >
            Cancel
          </button>
        </>
      )}
    </form>
  );
}

export function ExistingLinks({ netid, setRefresh }) {
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
          const data = doc.data();
          if (data && data.lastUpdated) {
            setLastUpdated(moment(data.lastUpdated.toDate()).format("LLLL"));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLinks();
    getLastUpdated();
  }, [netid]);

  useEffect(() => {
    const deleteLink = (id) => {
      users
        .doc(netid)
        .collection("links")
        .doc(id)
        .delete()
        .then(async () => {
          await users
            .doc(netid)
            .update({
              lastUpdated: new Date(),
            })
            .catch((err) => {
              console.log(err);
            });
          setRefresh(true);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const formatLinks = () => {
      const result = [];
      linkDocs.forEach((linkDoc) => {
        result.push({
          slug: linkDoc.id,
          data: linkDoc.data(),
        });
      });
      result.sort((a, b) => (a.data.name > b.data.name ? 1 : -1));
      const generateUrl = (slug) => {
        const root = window.location.origin;
        return root + "/user/link/" + slug;
      };
      return result
        .filter(
          ({ slug, data }) =>
            slug.toLowerCase().match(/^[a-z0-9-&+]+$/) && data && data.url
        )
        .map(({ slug, data: { name, url } }) => {
          const cornellZoomLink = url.match(
            /^(http:\/\/|https:\/\/)?(cornell\.zoom+\.us+\/j\/)([0-9]{9,11})(\?pwd=[a-zA-Z0-9]+)?$/
          );
          return (
            <li className="bg-light" key={slug}>
              <img
                src={x}
                width="22"
                alt="Delete link."
                className="delete-x"
                onClick={() => deleteLink(slug)}
              />
              <h2>
                <Link
                  to={"/user/link/" + slug}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                </Link>
              </h2>
              {slug && <p className="text-dark">{generateUrl(slug)}</p>}
              <p className={cornellZoomLink ? "text-success" : "text-info"}>
                {url}
              </p>
            </li>
          );
        });
    };
    setLinks(formatLinks());
  }, [linkDocs, netid, setRefresh]);

  return (
    <div className="links">
      {!!links.length && <ul>{links}</ul>}
      {!!links.length && lastUpdated && <p>{"Last Updated: " + lastUpdated}</p>}
    </div>
  );
}
