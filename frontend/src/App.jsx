import { useEffect, useState } from "react";
import axios from "axios";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  Histogram
} from "recharts";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/songs?skip=${page * 10}&limit=10`)
      .then(res => setSongs(res.data));
  }, [page]);

  const handleSearch = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/songs/${search}`);
    setSongs(res.data);
  };

  // Chart datasets
  const scatterData = songs.map((s, i) => ({ x: i, y: s.danceability }));
  const histogramData = songs.map(s => ({ duration: Math.floor(s.duration_ms / 1000) }));
  const barData = [
    { name: "Acousticness", value: songs.reduce((a, b) => a + (b.acousticness ?? 0), 0) / songs.length || 0 },
    { name: "Tempo", value: songs.reduce((a, b) => a + (b.tempo ?? 0), 0) / songs.length || 0 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Playlist Dashboard</h1>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
          placeholder="Enter song title"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get Song
        </button>
      </div>

      {/* Table */}
      <table className="w-full border mb-6">
        <thead>
          <tr>
            {["id","title","danceability","energy","tempo","duration_ms","star_rating"].map(col => (
              <th key={col} className="border p-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {songs.map((row, i) => (
            <tr key={i}>
              <td className="border p-2">{row.id}</td>
              <td className="border p-2">{row.title}</td>
              <td className="border p-2">{row.danceability}</td>
              <td className="border p-2">{row.energy}</td>
              <td className="border p-2">{row.tempo}</td>
              <td className="border p-2">{Math.floor(row.duration_ms / 1000)}s</td>
              <td className="border p-2">{row.star_rating ?? "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex gap-2 mb-8">
        <button
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 border"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 border"
        >
          Next
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scatter Chart */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Danceability Scatter</h2>
          <ScatterChart width={400} height={300}>
            <CartesianGrid />
            <XAxis dataKey="x" name="Index" />
            <YAxis dataKey="y" name="Danceability" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={scatterData} fill="#8884d8" />
          </ScatterChart>
        </div>

        {/* Histogram */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Duration Histogram</h2>
          <BarChart width={400} height={300} data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="duration" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="duration" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Bar Chart */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Acousticness & Tempo</h2>
          <BarChart width={400} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#ffc658" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
