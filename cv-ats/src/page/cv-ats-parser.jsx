import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";



export default function CVATSParser() {
  const { batch_id  } = useParams();
  const [files, setFiles] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()


  const handleUpload = async () => {
    if (files.length === 0) return setError("Silahkan Pilih cv lalu akan diproses");

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("batch_id", batch_id);
      for (let file of files) formData.append("files", file);

      const res = await fetch("http://localhost:8000/api/batch/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setUploaded(result.uploaded);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
    <motion.div
      className="ml-64 p-8 min-h-screen   bg-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6    text-orange-600">
        Upload CV untuk Batch {batch_id}
      </h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Uploading..." : "Upload Files"}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        <AnimatePresence>
          {uploaded.length > 0 && (
            <motion.div
              key="uploadSuccess"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-green-100 border border-green-400 text-green-700 p-3 rounded"
            >
              <h3 className="font-semibold mb-2">File berhasil diupload:</h3>
              <ul className="list-disc list-inside">
                {uploaded.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button 
  onClick={() => navigate(`/batch/${batch_id}/filter`)} 
  className="text-orange-600 underline mt-3"
>
  Lihat Hasil Parsing →
</button>

    </motion.div>
    </div>
  );
}
