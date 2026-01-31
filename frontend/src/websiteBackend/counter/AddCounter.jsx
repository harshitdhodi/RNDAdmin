import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCounter = () => {
  const [title, setTitle] = useState("");
  const [count, setCount] = useState("");
  const [sign, setSign] = useState("+");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/counter/createCounter",
        { title, count, sign, icon, status },
        { withCredentials: true }
      );
      navigate("/counter");
    } catch (error) {
      console.error("Error adding counter:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mt-10 mx-auto bg-white shadow-md rounded">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-4">
        Add Counter
      </h1>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
          placeholder="e.g. Happy Clients"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Count</label>
        <input
          type="text"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
          placeholder="e.g. 150"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Sign</label>
        <input
          type="text"
          value={sign}
          onChange={(e) => setSign(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          placeholder="e.g. +"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Icon (Class Name)</label>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          placeholder="e.g. fa fa-user"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-yellow-500 text-white rounded-md p-2 hover:bg-yellow-600">
        Add Counter
      </button>
    </form>
  );
};

export default AddCounter;
