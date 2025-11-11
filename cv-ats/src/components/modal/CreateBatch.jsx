import axios from "axios";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ENDPOINT } from "../../constant";

const CreateBatch = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    role: "",
    uploaded_by: "",
    batch_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toFormData = (obj) => {
    const form = new FormData();
    Object.entries(obj).forEach(([k, v]) => form.append(k, v));
    return form;
  };

  const makeBatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${ENDPOINT}api/batch/create`, toFormData(formData), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ batch_name: "", role: "", uploaded_by: "" });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("🔥 Error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Gagal membuat batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 bg-transparant bg-opacity-50 flex justify-center items-center text-black z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal"
            className="bg-white p-6 rounded-xl shadow-lg w-[400px]"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Buat Batch Baru</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>
            <form onSubmit={makeBatch} className="flex flex-col gap-3 ">
              <div>
                <label className="block text-sm font-semibold">Nama Batch</label>
                <input
                  type="text"
                  name="batch_name"
                  value={formData.batch_name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Nama HRD</label>
                <input
                  type="text"
                  name="uploaded_by"
                  value={formData.uploaded_by}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 transition"
                disabled={loading}
              >
                {loading ? "Membuat..." : "Konfirmasi"}
              </button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateBatch;
