import axios from "axios";
import React, { useState } from "react";

const CreateBatch = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

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
    // 🔧 bikin form-data dulu
    const form = new FormData();
    form.append("batch_name", formData.batch_name);
    form.append("role", formData.role);
    form.append("uploaded_by", formData.uploaded_by);

    // 🔥 kirim ke backend
    await axios.post("http://192.168.100.47/api/batch/create",  toFormData(formData), {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // reset input
    setFormData({ batch_name: "", role: "", uploaded_by: "" });
    console.log("✅ Batch created:", formData);

    onSuccess?.(); // refresh parent
    onClose(); // tutup modal
  } catch (err) {
    console.error("🔥 Error:", err.response?.data || err.message);
    setError(err.response?.data?.detail || "Gagal membuat batch");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-transparant bg-opacity-50 flex justify-center items-center text-black">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Buat Batch Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
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
            className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Membuat..." : "Konfirmasi"}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateBatch;
