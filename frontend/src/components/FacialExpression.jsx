


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

      const res = await axios.get(`https://ai-moodypalyer.onrender.com/songs?mood=${best.name}`);
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
