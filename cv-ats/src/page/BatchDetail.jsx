import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import FilterBar from "../components/FilterBar";
import CVTable from "../components/CVTable";

const BatchDetail = () => {
  const { batch_id } = useParams();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ status: "", ats: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/batch/${batch_id}/results`);
        setData({ ...res.data, cvs: res.data.results }); // 🔥 normalize key
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [batch_id]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!data) return <p className="text-center mt-10 text-red-600">Data not found</p>;

// const filteredCvs = data.cvs?.filter((cv) => {
//   const byStatus = filters.status ? cv.status === filters.status : true;
//   const byAts = filters.ats ? String(cv.ats_score) === filters.ats : true;
//   return byStatus && byAts;
// });

  console.log("data:", data);


  return (
    <div className=" bg-orange-50 ml-64 p-8 min-h-screen ">
      <Breadcrumbs batchId={data.batch_id} />

      <h1 className="text-2xl font-bold text-orange-700 ">
        Batch: {data.role?.toUpperCase()} — Uploaded by {data.uploaded_by}
      </h1>
      <p className="text-gray-500">
        Uploaded at: {new Date(data.uploaded_at).toLocaleString()}
      </p>

      <FilterBar filters={filters} setFilters={setFilters} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CVTable cvs={data.cvs} />
      </motion.div>
    </div>
  );
};

export default BatchDetail;
