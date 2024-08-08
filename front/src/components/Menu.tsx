import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div className="fixed top-0 left-0 w-48 h-full bg-gray-800 text-white p-4">
      <ul>
        <li className="my-4 hover:text-blue-500 hover:underline font-bold">
          <Link to="/test">Test</Link>
        </li>
        <li className="my-4 hover:text-blue-500 hover:underline font-bold">
          <Link to="/">Home</Link>
        </li>
        <li className="my-4 hover:text-blue-500 hover:underline font-bold">
          <Link to="/review">Review</Link>
        </li>
      </ul>
    </div>
  );
}
