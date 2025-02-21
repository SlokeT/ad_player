"use client";

import Image from "next/image"; 
interface ImageAdProps {
  url: string;
}

type Comment = {
  text: string;
  user: string;
};

const comments: Comment[] = [
  { text: "Good Colors", user: "Alice" },
  { text: "Posed well", user: "Bob" },
];

export default function AdView({ url }: ImageAdProps) {

  return (
    <div className="flex gap-4 p-8 h-screen">
      {/* Image View */}
      <div className="flex-3 w-3/4 h-full relative">
        <Image
          src={url}
          alt="Ad"
          className="w-full h-full object-contain" // aspect ratio match
        />

      </div>

      {/* Comments Section TEMP*/}
      <div className="flex-1 bg-gray-100 p-4 rounded-md w-1/4 h-full overflow-y-auto text-black"> 
        <h3 className="font-bold mb-2">Comments</h3>
        {comments.map((comment) => (
          <div
            className={`p-2 mb-2 rounded cursor-pointer bg-white`}
            key={comment.user}
          >
            <p>
              <strong>{comment.user}:</strong> {comment.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
