import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

function LinkRedirect({ url }) {
  useEffect(() => {
    if (url) {
      window.location.href = url;
    }
  }, [url]);

  return (
    <div className="link-redirect">
      <Helmet>
        <title>Cornell Zoom Hub | Redirecting</title>
        <meta name="title" content="Cornell Zoom Hub | Redirecting" />
        <meta
          name="description"
          content={`Cornell Zoom Hub | Redirecting to ${
            url || "external link"
          }...`}
        />
      </Helmet>
      <p className="message">Redirecting{url && ` to ${url}`}...</p>
    </div>
  );
}

export default LinkRedirect;
