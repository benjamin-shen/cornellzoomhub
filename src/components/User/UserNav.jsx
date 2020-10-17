import React from "react";
import { Link } from "react-router-dom";

function UserNav() {
  return (
    <div className="user-nav">
      <Link to="/user/personal">Personal Links</Link>
      <br />
      <Link to="/user/events">Event Links</Link>
      <br />
      <Link to="/user/courses">Course Links</Link>
    </div>
  );
}

export default UserNav;
