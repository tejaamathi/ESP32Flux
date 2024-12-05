'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CameraViewProps {
  onConfirm: (imageData: string) => void
}

const ESP32_URL = "http://192.168.1.109:81/stream";

export function CameraView({ onConfirm }: CameraViewProps) {
  const [isReady, setIsReady] = useState(true);
  const [streamActive, setStreamActive] = useState(true);

  const handleConfirm = () => {
    const imgElement = document.getElementById('esp32-image') as HTMLImageElement;
    if (imgElement) {
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(imgElement, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      onConfirm(imageData);
    }

    // Disable the stream and clear the source
    setStreamActive(false);
    if (imgElement) {
      imgElement.src = '';  // Clears the stream connection
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">Please move your paper to be in view of the camera</h2>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {streamActive && (
          <img
            id="esp32-image"
            src={ESP32_URL}
            alt="ESP32 Stream"
            crossOrigin="anonymous"
            className="h-full w-full object-contain"
          />
        )}
      </div>
      <Button
        onClick={handleConfirm}
        disabled={!isReady}
        className="w-full"
      >
        Looks Good
      </Button>
    </div>
  );
}