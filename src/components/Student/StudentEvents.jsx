import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import app, { arrayUnion, arrayRemove } from "../../util/base";

import x from "../../assets/icons/x.svg";

const users = app.firestore().collection("users");
const events = app.firestore().collection("events");

export function EventInput({ netid, setAddingEvent, setRefresh, setError }) {
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
    } else if (!slug.match(/^[a-z0-9-&+]+$/)) {
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

    const setLink = () => {
      events
        .doc(slug)
        .set({
          name,
          owner: netid,
          link: urlLink,
          created: new Date(),
        })
        .then(async () => {
          await users
            .doc(netid)
            .update({
              events: arrayUnion(slug),
            })
            .catch((err) => {
              console.log(err);
              setError("The user could not be associated with this event.");
              return;
            });
          setRefresh(true);
        })
        .catch((err) => {
          console.log(err);
          setError("The link could not be added.");
          return;
        });
    };
    setPending(true);
    if (netid) {
      await events
        .doc(slug)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data.owner && data.owner === netid) {
              setLink();
            } else {
              setError("This slug is already in use. Please choose another.");
              return;
            }
          } else {
            setLink();
          }
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
      setAddingEvent(false);
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
          Setting redirect link to {urlLink} at /event/{slugInput}
        </p>
      ) : (
        <>
          <button type="submit" className="btn btn-outline-primary">
            Set redirect link{linkInput && " to " + linkInput}
            {slugInput && " at /event/" + slugInput}
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setError("");
              setAddingEvent(false);
            }}
          >
            Cancel
          </button>
        </>
      )}
    </form>
  );
}

export function EventLinks({ netid, setRefresh }) {
  const [eventsArray, setEventsArray] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const getLinks = () => {
      users
        .doc(netid)
        .get()
        .then((doc) => {
          const data = doc.data();
          if (data && data.events) {
            setEventsArray(data.events);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLinks();
  }, [netid]);

  useEffect(() => {
    const deleteCourse = async (event) => {
      await users
        .doc(netid)
        .update({ events: arrayRemove(event) })
        .catch((err) => {
          console.log(err);
        });
      setRefresh(true);
    };

    const formatLinks = async () => {
      const result = [];
      eventsArray.sort();
      for (const slug of eventsArray) {
        await events
          .doc(slug)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const { name, link, owner } = doc.data();
              if (link) {
                result.push({
                  name,
                  slug,
                  url: link,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      const generateUrl = (slug) => {
        const href = window.location.href;
        const root = href.substring(0, href.lastIndexOf("/"));
        return root + "/events/" + slug;
      };
      return result
        .filter(({ name, slug, url }) => name && slug && url)
        .map(({ name, slug, url }) => {
          const cornellZoomLink = url.match(
            /^(http:\/\/|https:\/\/)?(cornell\.zoom+\.us+\/j\/)([0-9]{9,11})(\?pwd=[a-zA-Z0-9]+)?$/
          );
          return (
            <li className="bg-light" key={slug}>
              <img
                src={x}
                width="22"
                alt="Delete course."
                className="delete-x"
                onClick={() => deleteCourse(slug)}
              />
              <h2>
                <Link
                  to={"/event/" + slug}
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
    formatLinks().then((res) => {
      setLinks(res);
    });
  }, [eventsArray, netid, setRefresh]);

  return (
    <div className="course-links">{!!links.length && <ul>{links}</ul>}</div>
  );
}
