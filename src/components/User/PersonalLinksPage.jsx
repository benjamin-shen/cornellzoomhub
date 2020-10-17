import React, { useContext, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { AuthContext } from "../../util/auth";

import User from "./User";
import { LinkInput, ExistingLinks } from "./StudentLinks";

function PersonalLinksPage() {
  const { netid } = useContext(AuthContext);

  const [addingLink, setAddingLink] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [refreshLinks, setRefreshLinks] = useState(false);

  useEffect(() => {
    if (refreshLinks) {
      setLinkError("");
      setRefreshLinks(false);
    }
  }, [refreshLinks]);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="personal-links">
      <Helmet>
        <title>Cornell Zoom Hub | Personal Links</title>
        <meta name="title" content="Cornell Zoom Hub | Personal Links" />
        <meta
          name="description"
          content="Cornell Zoom Hub | Personal Links Page"
        />
      </Helmet>
      <User>
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
      </User>
    </div>
  );
}

export default PersonalLinksPage;
