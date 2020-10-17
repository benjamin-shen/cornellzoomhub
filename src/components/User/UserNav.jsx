import React from "react";
import { Link } from "react-router-dom";

function UserNav() {
  return (
    <div className="user-nav">
      <h2>
        <Link to="/user/personal">Personal Links</Link>
      </h2>
      <br />
      <h2>
        <Link to="/user/events">Event Links</Link>
      </h2>
      <br />
      <h2>
        <Link to="/user/courses">Course Links</Link>
      </h2>
    </div>
  );
}

export default UserNav;
