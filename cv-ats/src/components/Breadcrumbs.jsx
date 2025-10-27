import { Link, useParams } from "react-router-dom";

const Breadcrumbs = ({ batchId }) => {
  const { batch_id } = useParams();

  return (
    <nav className="p-4 text-sm mb-4 text-gray-500">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-orange-500">Home</Link>
        </li>
        <li>/</li>
        <li>
          <Link to={`/batch/${batch_id}`} className="hover:text-orange-500">Batches</Link>
        </li>
        <li>/</li>
        <li className="text-orange-600 font-semibold">{batchId}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
