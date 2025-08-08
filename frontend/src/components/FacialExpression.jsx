

// import React, { useEffect, useRef } from "react";
// import * as faceapi from "face-api.js";
// import axios from "axios";
// import { Target } from "lucide-react"; // Lucide icon

// export default function FacialExpression({ setSongs }) {
//   const videoRef = useRef();

//   const loadModels = async () => {
//     const MODEL_URL = "/models";
//     await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//     await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
//   };

//   const startVideo = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then((stream) => {
//         videoRef.current.srcObject = stream;
//       })
//       .catch((err) => console.error("Error accessing webcam: ", err));
//   };

//   async function detectMood() {
//     const detections = await faceapi
//       .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//       .withFaceExpressions();

//     if (!detections || detections.length === 0) {
//       console.log("No face detected");
//       return;
//     }

//     let mostProbableExpression = 0;
//     let _expression = "";

//     for (const expression of Object.keys(detections[0].expressions)) {
//       if (detections[0].expressions[expression] > mostProbableExpression) {
//         mostProbableExpression = detections[0].expressions[expression];
//         _expression = expression;
//         console.log(_expression);
//       }
//     }

//     axios
//       .get(`http://localhost:3000/songs?mood=${_expression}`)
//       .then((response) => {
//         setSongs(response.data.songs);
//       });
//   }

//   useEffect(() => {
//     loadModels().then(startVideo);
//   }, []);

//   return (
//     <div className="flex flex-col items-center bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 max-w-md w-full mx-auto border border-white/10">
//       <div className="rounded-xl overflow-hidden border border-white/10 mb-4">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           className="w-full h-auto rounded-xl"
//         />
//       </div>
//       <button
//         onClick={detectMood}
//         className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
//       >
//         <Target className="w-5 h-5" /> Detect Mood
//       </button>
//     </div>
//   );
// }






// import React, { useEffect, useRef } from "react";
// import * as faceapi from "face-api.js";
// import axios from "axios";
// import { Target } from "lucide-react"; // Lucide icon

// export default function FacialExpression({ setSongs }) {
//   const videoRef = useRef();

//   const loadModels = async () => {
//     const MODEL_URL = "/models";
//     await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//     await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
//   };

//   const startVideo = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then((stream) => {
//         videoRef.current.srcObject = stream;
//       })
//       .catch((err) => console.error("Error accessing webcam: ", err));
//   };

//   async function detectMood() {
//     const detections = await faceapi
//       .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//       .withFaceExpressions();

//     if (!detections || detections.length === 0) {
//       console.log("No face detected");
//       return;
//     }

//     let mostProbableExpression = 0;
//     let _expression = "";

//     for (const expression of Object.keys(detections[0].expressions)) {
//       if (detections[0].expressions[expression] > mostProbableExpression) {
//         mostProbableExpression = detections[0].expressions[expression];
//         _expression = expression;
//         console.log(_expression);
//       }
//     }

//     axios
//       .get(`http://localhost:3000/songs?mood=${_expression}`)
//       .then((response) => {
//         setSongs(response.data.songs);
//       });
//   }

//   useEffect(() => {
//     loadModels().then(startVideo);
//   }, []);

//   return (
//     <div className="flex flex-col items-center bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 max-w-md w-full mx-auto border border-white/10">
//       <div className="rounded-xl overflow-hidden border border-white/10 mb-4">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           className="w-full h-auto rounded-xl"
//         />
//       </div>
//       <button
//         onClick={detectMood}
//         className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
//       >
//         <Target className="w-5 h-5" /> Detect Mood
//       </button>
//     </div>
//   );
// }






// import React, { useEffect, useRef, useState } from "react";
// import * as faceapi from "face-api.js";
// import axios from "axios";
// import { Target, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";

// /**
//  * Props:
//  * - setSongs(songsArray)
//  * - setCurrentMood(moodString)
//  *
//  * Notes:
//  * - Make sure face-api models exist at /public/models (or change MODEL_URL).
//  * - This component does NOT auto-detect — user presses the Detect button.
//  */

// export default function FacialExpression({ setSongs, setCurrentMood }) {
//   const videoRef = useRef(null);
//   const [loadingModels, setLoadingModels] = useState(true);
//   const [detecting, setDetecting] = useState(false);
//   const [detectedMood, setDetectedMood] = useState("");
//   const [lastDetectedAt, setLastDetectedAt] = useState(null);

//   const MODEL_URL = "/models";

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//         await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
//       } catch (err) {
//         console.error("Error loading face-api models", err);
//       } finally {
//         if (mounted) setLoadingModels(false);
//       }
//     };
//     load();
//     return () => (mounted = false);
//   }, []);

//   const startVideo = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (err) {
//       console.error("Webcam access denied or not available:", err);
//     }
//   };

//   useEffect(() => {
//     // start the camera once models are loaded
//     if (!loadingModels) startVideo();
//     // cleanup: stop stream on unmount
//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach((t) => t.stop());
//       }
//     };
//   }, [loadingModels]);

//   const emojiForMood = {
//     happy: "😄",
//     sad: "😢",
//     angry: "😠",
//     surprised: "😲",
//     // fearful: "😨",
//     // disgusted: "🤢",
//     neutral: "😐",
//   };

//   const detectMood = async () => {
//     if (!videoRef.current) return;
//     setDetecting(true);
//     try {
//       const detections = await faceapi
//         .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//         .withFaceExpressions();

//       if (!detections || detections.length === 0) {
//         setDetectedMood("no_face");
//         setDetecting(false);
//         return;
//       }

//       // choose highest probability expression from first face
//       const exprs = detections[0].expressions;
//       let best = { name: "neutral", prob: 0 };
//       for (const key of Object.keys(exprs)) {
//         if (exprs[key] > best.prob) best = { name: key, prob: exprs[key] };
//       }

//       setDetectedMood(best.name);
//       setLastDetectedAt(new Date().toISOString());
//       if (setCurrentMood) setCurrentMood(best.name);

//       // fetch songs from backend
//       try {
//         const res = await axios.get(`http://localhost:3000/songs?mood=${best.name}`);
//         if (res?.data?.songs?.length) {
//           setSongs(res.data.songs);
//         } else {
//           // fallback: empty or placeholder list
//           setSongs([
//             {
//               title: "Ambient Reflection",
//               artist: "Moody Beats",
//               audio: "/samples/ambient-reflection.mp3",
//               cover: null,
//             },
//           ]);
//         }
//       } catch (err) {
//         console.error("Error fetching songs:", err);
//         setSongs([
//           {
//             title: "Offline Chill",
//             artist: "Local Fallback",
//             audio: "/samples/offline-chill.mp3",
//             cover: null,
//           },
//         ]);
//       }
//     } catch (err) {
//       console.error("Detection error:", err);
//     } finally {
//       setDetecting(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ y: 8, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.45 }}
//       className="relative bg-gradient-to-b from-neutral-900/40 to-neutral-900/30 border border-white/6 rounded-3xl p-5 backdrop-blur-md shadow-xl"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h2 className="text-lg font-semibold">Live Mood Detector</h2>
//           <p className="text-xs text-gray-400">Open your camera and press detect</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="text-sm text-gray-300">
//             <div>Model: {loadingModels ? "Loading..." : "Ready"}</div>
//             <div className="text-xs text-gray-500">
//               {lastDetectedAt ? `Last: ${new Date(lastDetectedAt).toLocaleTimeString()}` : ""}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Video with animated gradient border */}
//       <div className="rounded-2xl p-1 bg-gradient-to-r from-emerald-500/20 via-cyan-400/15 to-indigo-500/10">
//         <div className="bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full h-72 object-cover bg-black"
//             aria-label="Webcam feed"
//           />
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="mt-4 flex items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={detectMood}
//             disabled={loadingModels || detecting}
//             className={`relative inline-flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-transform focus:outline-none
//               ${detecting ? "bg-gradient-to-r from-indigo-500 to-emerald-400 text-black shadow-lg" : "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:scale-[1.03]"}`
//             }
//           >
//             {detecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
//             <span>{detecting ? "Detecting..." : "Detect Mood"}</span>
//           </button>

//           <button
//             onClick={() => {
//               // restart camera stream
//               if (videoRef.current && videoRef.current.srcObject) {
//                 const tracks = videoRef.current.srcObject.getTracks();
//                 tracks.forEach((t) => t.stop());
//               }
//               startVideo();
//             }}
//             className="px-3 py-2 text-sm rounded-md bg-white/5 border border-white/6 hover:bg-white/6"
//           >
//             Restart Camera
//           </button>
//         </div>

//         {/* Mood display */}
//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <div className="text-xs text-gray-400">Detected Mood</div>
//             <div className="flex items-center gap-2">
//               <div className="text-2xl">
//                 {detectedMood && detectedMood !== "no_face" ? (
//                   <span>{emojiForMood[detectedMood] ?? "✨"}</span>
//                 ) : detectedMood === "no_face" ? (
//                   <span>—</span>
//                 ) : (
//                   <span className="text-gray-500">—</span>
//                 )}
//               </div>
//               <div className="text-sm font-medium capitalize tracking-wide">
//                 {detectedMood === "no_face" ? "No face" : detectedMood || "—"}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }













import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { Target, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FacialExpression({ setSongs, setCurrentMood }) {
  const videoRef = useRef(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [detectedMood, setDetectedMood] = useState("");

  const MODEL_URL = "/models";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      } catch (err) {
        console.error("Error loading face-api models", err);
      } finally {
        if (mounted) setLoadingModels(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Webcam access error:", err);
    }
  };

  useEffect(() => {
    if (!loadingModels) startVideo();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, [loadingModels]);

  const emojiForMood = {
    happy: "😄",
    sad: "😢",
    angry: "😠",
    surprised: "😲",
  };

  const detectMood = async () => {
    if (!videoRef.current) return;
    setDetecting(true);
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections?.length) {
        setDetectedMood("no_face");
        setDetecting(false);
        return;
      }

      const exprs = detections[0].expressions;
      let best = { name: "neutral", prob: 0 };
      for (const key of ["happy", "sad", "angry", "surprised"]) {
        if (exprs[key] > best.prob) best = { name: key, prob: exprs[key] };
      }

      setDetectedMood(best.name);
      setCurrentMood(best.name);

      const res = await axios.get(`http://localhost:3000/songs?mood=${best.name}`);
      setSongs(res.data?.songs || []);
    } catch (err) {
      console.error("Detection error:", err);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-lg font-semibold mb-4">Live Mood Detector</h2>
      <div className="rounded-xl overflow-hidden border border-white/10 mb-4">
        <video ref={videoRef} autoPlay muted className="w-full h-72 object-cover" />
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={detectMood}
          disabled={loadingModels || detecting}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
        >
          {detecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
          {detecting ? "Detecting..." : "Detect Mood"}
        </button>
        <div className="text-right">
          <div className="text-xs text-gray-400">Detected Mood</div>
          <div className="text-lg font-semibold capitalize">
            {emojiForMood[detectedMood] || "—"} {detectedMood}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
