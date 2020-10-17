import React, { useContext, useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

import { AuthContext } from "../../util/auth";

import User from "./User";
import { EventInput, EventLinks } from "./StudentEvents";

function EventLinksPage() {
  const { netid } = useContext(AuthContext);

  const [addingEvent, setAddingEvent] = useState(false);
  const [eventError, setEventError] = useState("");
  const [refreshEvents, setRefreshEvents] = useState(false);

  useEffect(() => {
    if (refreshEvents) {
      setEventError("");
      setRefreshEvents(false);
    }
  }, [refreshEvents]);

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="event-links">
      <Helmet>
        <title>Cornell Zoom Hub | Event Links</title>
        <meta name="title" content="Cornell Zoom Hub | Event Links" />
        <meta
          name="description"
          content="Cornell Zoom Hub | Event Links Page"
        />
      </Helmet>
      <User>
        <div className="add-event">
          {addingEvent || eventError ? (
            <EventInput
              netid={netid}
              setAddingEvent={setAddingEvent}
              setRefresh={setRefreshEvents}
              setError={(message) => {
                if (message) {
                  setEventError("Error!");
                  setTimeout(() => {
                    if (!mountedRef.current) return null;
                    setEventError(message);
                  }, 500);
                } else {
                  setEventError(message);
                }
              }}
            />
          ) : (
            <button
              className="btn btn-info"
              onClick={() => {
                setAddingEvent(true);
              }}
            >
              Create/Edit Event Link
            </button>
          )}
          {eventError && <p className="text-danger">{eventError}</p>}
        </div>
        {!refreshEvents && (
          <EventLinks netid={netid} setRefresh={setRefreshEvents} />
        )}
      </User>
    </div>
  );
}

export default EventLinksPage;
