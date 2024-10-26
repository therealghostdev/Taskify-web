import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for does not exist.</p>
      <Link to="/">Go back to Homepage</Link>
    </div>
  );
}

export default NotFound;
