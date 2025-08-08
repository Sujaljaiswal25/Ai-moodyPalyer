


import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formatTime = (t) => {
  if (!t || isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function MoodSongs({ Songs = [], currentMood = "" }) {
  const audioRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    if (!Songs || Songs.length === 0) {
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      return;
    }
    const src = Songs[index]?.audio;
    if (audioRef.current) {
      audioRef.current.src = src || "";
      audioRef.current.load();
      audioRef.current.volume = volume;
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [index, Songs]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      if (Songs.length > 1) {
        setIndex((i) => (i + 1) % Songs.length);
      } else {
        setIsPlaying(false);
      }
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
  }, [Songs]);

  const togglePlay = async () => {
    if (!Songs || Songs.length === 0) return;
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Play failed", err);
      }
    }
  };

  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    const time = pct * (duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const prev = () => {
    if (!Songs || Songs.length === 0) return;
    setIndex((i) => (i - 1 + Songs.length) % Songs.length);
    setIsPlaying(true);
  };

  const next = () => {
    if (!Songs || Songs.length === 0) return;
    setIndex((i) => (i + 1) % Songs.length);
    setIsPlaying(true);
  };

  const volUp = () => setVolume((v) => Math.min(1, +(v + 0.1).toFixed(2)));
  const volDown = () => setVolume((v) => Math.max(0, +(v - 0.1).toFixed(2)));

  return (
    <div className="relative bg-gradient-to-b from-neutral-900/40 to-neutral-900/20 border border-white/6 rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {currentMood
              ? `Songs for ${currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Mood`
              : "Recommended For You"}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Mood:{" "}
            <span className="capitalize text-emerald-300 font-medium">
              {currentMood || "—"}
            </span>
          </p>
        </div>

        <div className="text-sm text-gray-400 flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5">
            <Volume2 className="w-4 h-4 text-gray-300" />
            <div className="text-xs">{Math.round(volume * 100)}%</div>
          </div>
          <div className="text-xs text-gray-500">Tracks: {Songs?.length || 0}</div>
        </div>
      </div>

      {/* Current track card */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-800 border border-white/6 flex-shrink-0">
          {Songs?.[index]?.cover ? (
            <img src={Songs[index].cover} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">🎵</div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{Songs?.[index]?.title || "No song selected"}</div>
              <div className="text-xs text-gray-400 mt-1">{Songs?.[index]?.artist || " — "}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setLiked((s) => ({ ...s, [index]: !s[index] }))} aria-label="like" className="p-2 rounded-md hover:bg-white/5">
                <Heart className={`w-5 h-5 ${liked[index] ? "text-rose-400" : "text-gray-400"}`} />
              </button>
            </div>
          </div>

          {/* Seek bar */}
          <div className="mt-4">
            <div
              className="h-2 bg-white/6 rounded-full cursor-pointer relative"
              onClick={seekTo}
              style={{ userSelect: "none" }}
            >
              <div
                className="h-2 rounded-full bg-emerald-400 absolute left-0 top-0"
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <div>{formatTime(progress)}</div>
              <div>{formatTime(duration)}</div>
            </div>
          </div>
          

          {/* Controls */}
          <div className="mt-4 flex items-center gap-4">
            <button onClick={prev} className="p-2 rounded-md bg-white/5 hover:bg-white/6">
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold shadow-lg hover:scale-105"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button onClick={next} className="p-2 rounded-md bg-white/5 hover:bg-white/6">
              <SkipForward className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button onClick={volDown} className="p-2 bg-white/5 rounded-md hover:bg-white/6">
                <VolumeX className="w-4 h-4" />
              </button>

              <input
                aria-label="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-36"
              />

              <button onClick={volUp} className="p-2 bg-white/5 rounded-md hover:bg-white/6">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="mt-6">
        <div className="text-xs text-gray-400 mb-2">Queue</div>

        <div className="space-y-3 max-h-64 overflow-auto pr-2">
          <AnimatePresence initial={false}>
            {Songs.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer ${i === index ? "bg-gradient-to-r from-emerald-500/10 to-cyan-400/6 ring-1 ring-emerald-500/20" : ""}`}
                onClick={() => {
                  setIndex(i);
                  setIsPlaying(true);
                }}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden bg-neutral-800 flex-shrink-0">
                  {s.cover ? <img src={s.cover} alt="cover" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">🎵</div>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.title}</div>
                  <div className="text-xs text-gray-400 truncate mt-1">{s.artist}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    {i === index && isPlaying ? <span className="text-emerald-300 font-medium">Playing</span> : <span className="text-gray-400">Play</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}
