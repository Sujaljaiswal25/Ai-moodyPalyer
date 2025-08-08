// import { useState } from 'react'
// import FacialExpression from "./components/FacialExpression"
// import './App.css'
// import MoodSongs from './components/MoodSongs'

// function App() {

//   const [ Songs, setSongs ] = useState([
       
//     ])

//   return (
//     <>
//       <FacialExpression setSongs={setSongs} />
//       <MoodSongs Songs={Songs} />
//     </>
//   )
// }

// export default App





// import React, { useState } from "react";
// import FacialExpression from "./components/FacialExpression";
// import MoodSongs from "./components/MoodSongs";

// export default function App() {
//   const [songs, setSongs] = useState([]);           // array of song objects
//   const [currentMood, setCurrentMood] = useState(""); // string like "happy", "sad"

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white">
//       <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight">Moody Player</h1>
//           <p className="text-sm text-gray-400 mt-1">AI-powered mood music • Sleek & modern</p>
//         </div>
//         <div className="text-sm text-gray-300">Built with ♥️ • Tailwind • Face-API</div>
//       </header>

//       <main className="max-w-6xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left: facial expression / camera */}
//           <FacialExpression
//             setSongs={setSongs}
//             setCurrentMood={setCurrentMood}
//           />

//           {/* Right: songs + player */}
//           <MoodSongs Songs={songs} currentMood={currentMood} />
//         </div>

//         {/* Footer small note */}
//         <div className="mt-8 text-center text-gray-500 text-sm">
//           Tip: Click <span className="text-emerald-300 font-semibold">Detect Mood</span> to update track suggestions.
//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useState } from "react";
import FacialExpression from "./components/FacialExpression";
import MoodSongs from "./components/MoodSongs";
import SongUploadForm from "./components/SongUploadForm";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentMood, setCurrentMood] = useState("");

  const handleSongAdded = (newSong) => {
    setSongs((prev) => [...prev, newSong]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white overflow-x-hidden">
      <header className="w-full px-4 py-4 sm:px-6 md:max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Moody Player</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              AI-powered mood music • Sleek & modern
            </p>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-4 sm:px-6 md:max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/2">
            <FacialExpression setSongs={setSongs} setCurrentMood={setCurrentMood} />
          </div>
          <div className="w-full lg:w-1/2">
            <MoodSongs Songs={songs} currentMood={currentMood} />
          </div>
        </div>

        <div className="mt-8">
          <SongUploadForm onSongAdded={handleSongAdded} />
        </div>
      </main>
    </div>
  );
}


