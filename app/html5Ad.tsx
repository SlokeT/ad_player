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
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string | null>(null);

  useEffect(() => {
    const downloadAndExtractZip = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to download the ZIP file");

        const blob = await response.blob();
        const zip = await JSZip.loadAsync(blob);

        const fileBlobs: Record<string, string> = {}; // urls

        //extracting all of the resources
        for (const fileName of Object.keys(zip.files)) {
          const file = zip.files[fileName];
          if (!file.dir) {
            const fileBlob = new Blob([await file.async("uint8array")], {
              type: getMimeType(fileName),
            });
            fileBlobs[fileName] = URL.createObjectURL(fileBlob);
          }
        }

        //main HTML file
        const htmlFile = Object.keys(zip.files).find((file) =>
          file.endsWith(".html")
        );
        if (!htmlFile) throw new Error("No HTML file found in the ZIP");

        let htmlContent = await zip.files[htmlFile].async("text");

        htmlContent = htmlContent.replace(
          /(?:src|href)=["']([^"']+)["']/g,
          (match, assetPath) => {
            const cleanPath = assetPath.replace(/^\.\//, ""); // Remove leading './' if present
            return fileBlobs[cleanPath]
              ? match.replace(assetPath, fileBlobs[cleanPath])
              : match;
          }
        );

        setIframeSrcDoc(htmlContent);
      } catch (error) {
        console.error("Error loading playable ad:", error);
      }
    };

    downloadAndExtractZip();
  }, [url]);

  return (
    <div className="flex h-screen p-4">
      {/* Ad Player */}
      <div className="flex-1 relative border rounded-lg overflow-hidden">
        {iframeSrcDoc ? (
          <iframe
            ref={iframeRef}
            srcDoc={iframeSrcDoc}
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

// get each mime type seperately
function getMimeType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    case "json":
      return "application/json";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    default:
      return "application/octet-stream";
  }
}
