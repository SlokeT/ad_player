/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";

type Comment = {
  text: string;
  user: string;
};

const comments: Comment[] = [
  { text: "Great start!", user: "Alice" },
  { text: "Nice transition!", user: "Bob" },
  { text: "Amazing scene!", user: "Charlie" },
];

interface HTML5AdProps {
  url: string;
}

export default function PlayableAd({ url }: HTML5AdProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const playableZipUrl = url;

  useEffect(() => {
    const downloadAndExtractZip = async () => {
      try {
        const response = await fetch(playableZipUrl);
        if (!response.ok) throw new Error("Failed to download the ZIP file");

        const blob = await response.blob();
        const zip = await JSZip.loadAsync(blob);

        const htmlFile = Object.keys(zip.files).find((file) =>
          file.endsWith(".html")
        );

        if (!htmlFile) throw new Error("No HTML file found in the ZIP");
        console.log("htmlFile ", htmlFile)
        const htmlContent = await zip.files[htmlFile].async("string");
        const htmlBlob = new Blob([htmlContent], { type: "text/html" });

        // local URL for the  HTML file
        const blobUrl = URL.createObjectURL(htmlBlob);
        console.log("Url",blobUrl);
        setIframeSrc(blobUrl);
      } catch (error) {
        console.error("Error loading playable ad:", error);
      }
    };

    downloadAndExtractZip();
  }, [playableZipUrl]);

  return (
    <div className="flex h-screen p-4">
      {/* Ad Player */}
      <div className="flex-1 relative border rounded-lg overflow-hidden">
        {iframeSrc ? (
          <iframe
            ref={iframeRef}
            src={iframeSrc} // html url //https://files.adinteractive.net/ADInteractive/PlayableAds/sShooter/index.html
            width="100%"
            height="100%"
            allow="autoplay; fullscreen"
            className="w-full h-full"
          ></iframe>
        ) : (
          <p>Loading playable ad...</p>
        )}
      </div>

      {/* Comments Section TEMP */} 
      <div className="w-80 bg-gray-100 p-4 ml-4 rounded-md overflow-y-auto text-black">
        <h3 className="font-bold mb-2">Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="p-2 mb-2 bg-white rounded shadow">
            <p>
              <strong>{comment.user}:</strong> {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
