import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <nav className="absolute left-28">
      <ul className="flex justify-between gap-4">
        <li className="hover:text-gray-500 dark:hover:text-gray-300 font-bold">
          <Link to="/test">테스트 페이지</Link>
        </li>
      </ul>
    </nav>
  );
}
