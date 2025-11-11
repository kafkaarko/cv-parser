import { useState, useEffect } from "react";
import axios from "axios";
import { ENDPOINT } from "../../constant";

export default function KeywordModal() {
  const [keywords, setKeywords] = useState([]);
  const [newWord, setNewWord] = useState("");
// Fetch data
useEffect(() => {
  axios.get(`${ENDPOINT}api/keywords`).then((res) => setKeywords(res.data));
}, []);

// Save data
const saveChanges = async () => {
  await axios.post(`${ENDPOINT}api/keywords`, { skills_keywords: keywords });
  alert("Keywords saved!");
};


  const addKeyword = () => {
    if (newWord.trim()) {
      setKeywords([...keywords, newWord.trim()]);
      setNewWord("");
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="font-bold mb-2">Edit Skill Keywords</h2>
      <ul className="mb-2">
        {keywords.map((k, i) => (
          <li key={i} className="flex justify-between">
            {k}
            <button
              onClick={() => setKeywords(keywords.filter((_, j) => j !== i))}
              className="text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <input
        value={newWord}
        onChange={(e) => setNewWord(e.target.value)}
        placeholder="Add new keyword"
        className="border p-1 rounded w-full mb-2"
      />
      <button onClick={addKeyword} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
        Add
      </button>
      <button onClick={saveChanges} className="bg-green-500 text-white px-3 py-1 rounded">
        Save
      </button>
      <h2 className="text-2xl text-black ">skill yang dibutuhkan saat ini</h2>
      {
        keywords.map((keyword, index) =>(
            <p className="text-black" key={index}>{keyword}</p>
        ))
      }

    </div>
  );
}
