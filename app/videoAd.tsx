"use client";

import { useState, useRef } from "react";
import ReactPlayer from "react-player";

type Comment = {
  time: number;
  text: string;
  user: string;
};

interface VideoAdProps {
  url: string;
}

const comments: Comment[] = [
  { time: 5, text: "Great start!", user: "Alice" },
  { time: 15, text: "Nice transition!", user: "Bob" },
  { time: 30, text: "Amazing scene!", user: "Charlie" }
];

export default function VideoAd({ url }: VideoAdProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    setCurrentTime(playedSeconds);
  };

  return (
    <div className="flex gap-4 p-8 h-screen">
      {/* Video Player */}
      <div className="flex-3 w-3/4 h-full">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          controls
          onProgress={handleProgress}
        />
      </div>

      {/* Comments Section TEMP */}
      <div className="flex-1 bg-gray-100 p-4 rounded-md w-1/4 h-full overflow-y-auto text-black"> 
        <h3 className="font-bold mb-2">Comments</h3>
        {comments.map((comment) => (
          <div
            key={comment.time}
            className={`p-2 mb-2 rounded cursor-pointer ${currentTime >= comment.time ? "bg-gray-300" : "bg-white"}`}
            onClick={() => playerRef.current?.seekTo(comment.time)}
          >
            <p>
              <strong>{comment.user}:</strong> {comment.text}
            </p>
            <small className="text-black-500">⏱ {comment.time}s</small>
          </div>
        ))}
      </div>
      
    </div>
  );
}
