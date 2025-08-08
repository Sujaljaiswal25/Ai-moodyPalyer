import React, { useState } from "react";
import axios from "axios";
import { Music, Upload, Loader2 } from "lucide-react";

const moods = [
  { value: "happy", label: "Happy 😄" },
  { value: "sad", label: "Sad 😢" },
  { value: "angry", label: "Angry 😠" },
  { value: "surprised", label: "Surprised 😲" },
];

export default function SongUploadForm({ onSongAdded }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artist || !mood || !audio) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("mood", mood);
      formData.append("audio", audio);

      const res = await axios.post("http://localhost:3000/songs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.song) {
        onSongAdded(res.data.song);
        setTitle("");
        setArtist("");
        setMood("");
        setAudio(null);
        alert("Song uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload song.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 border border-white/10 w-full">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
        <Music className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> Add a New Song
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="text"
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Select Mood</option>
            {moods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        
        <label className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-emerald-400 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition p-2 sm:p-4">
          <Upload className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-emerald-400" />
          <span className="text-xs sm:text-sm text-center text-gray-300">
            {audio ? (
              <span className="truncate max-w-[200px] sm:max-w-none">{audio.name}</span>
            ) : (
              <span>Click or drag audio file here</span>
            )}
          </span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => setAudio(e.target.files[0])}
          />
        </label>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-lg shadow-md hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              Upload Song
            </>
          )}
        </button>
      </form>
    </div>
  );
}
