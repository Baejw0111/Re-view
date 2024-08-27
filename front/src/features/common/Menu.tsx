import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <nav className="absolute left-28 w-64">
      <ul className="flex justify-between">
        <li className="hover:text-gray-500 dark:hover:text-gray-300 font-bold">
          <Link to="/">피드</Link>
        </li>
        <li className="hover:text-gray-500 dark:hover:text-gray-300 font-bold">
          <Link to="/test">테스트 페이지</Link>
        </li>
        <li className="hover:text-gray-500 dark:hover:text-gray-300 font-bold">
          <Link to="/create-review">리뷰 작성</Link>
        </li>
      </ul>
    </nav>
  );
}
