import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <nav className="absolute left-28 w-64">
      <ul className="flex justify-between">
        <li className="hover:text-blue-500 hover:underline font-bold">
          <Link to="/test">Test</Link>
        </li>
        <li className="hover:text-blue-500 hover:underline font-bold">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-blue-500 hover:underline font-bold">
          <Link to="/review">Review</Link>
        </li>
        <li className="hover:text-blue-500 hover:underline font-bold">
          <Link to="/oauth/kakao">Log In</Link>
        </li>
      </ul>
    </nav>
  );
}
