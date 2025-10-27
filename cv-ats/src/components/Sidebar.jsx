import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import axios from "axios";
import CreateBatch from "./modal/createBatch";

const Sidebar = () => {
  const [batch, setBatch] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const getBatch = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/batches");
      setBatch(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBatch();
  }, []);

  return (
    <aside className="w-64 bg-orange-500 text-white flex flex-col p-4 fixed h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">ATS Parser</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        + Tambah Batch
      </button>

      <CreateBatch
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={getBatch}
      />

      <h2 className="font-bold text-lg mb-2">Daftar Batch</h2>
      <nav className="space-y-1">
  {batch?.batches?.length > 0 ? (
    batch.batches.map((b, i) => (
      <Link
        key={i}
        to={`/batch/${b.batch_id}`} // route dinamis ke CV parser
        className={`block px-4 py-2 rounded-md transition ${
          location.pathname === `/batch/${b.batch_id}`
            ? "bg-white text-orange-600 font-semibold"
            : "hover:bg-orange-600"
        }`}
      >
        {/* nama batch-nya tampil */}
        {b.batch_id}
      </Link>
    ))
  ) : (
    <p>Tidak ditemukan batch</p>
  )}
</nav>


      <div className="mt-auto text-sm text-center opacity-70">
        © 2025 Kafka Dev
      </div>
    </aside>
  );
};

export default Sidebar;
