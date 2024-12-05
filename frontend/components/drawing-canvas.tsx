import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";

interface DrawingCanvasProps {
  onComplete: (response: string) => void; // Expect a base64 string
}

export function DrawingCanvas({ onComplete }: DrawingCanvasProps) {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://172.21.17.52:5000/get-image-list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Received non-JSON response.");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
    const intervalId = setInterval(fetchImages, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.1.33:5000/ai/${encodeURIComponent(prompt)}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Ensure the base64 image is correctly prefixed
      const imageBase64 = `data:image/png;base64,${data.image}`; 
      
      setLoading(false);
      onComplete(imageBase64); // Pass the complete base64 string to the handler
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">Start drawing!</h2>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-white">
        {images.map((image, index) => (
          <img key={index} src={`/imagestack/${image}`} alt={`Image ${index}`} className="max-w-full h-auto" />
        ))}
      </div>
      <Input
        placeholder="Please supply a prompt for the image you would like generated with your drawing"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button
        onClick={handleButtonClick}
        disabled={!prompt || loading}
        className="w-full"
      >
        Looks Good
      </Button>
      {loading && <LoadingSpinner />}
    </div>
  );
}