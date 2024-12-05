import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CameraView } from "@/components/camera-view";
import { DrawingCanvas } from "@/components/drawing-canvas";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ResultView } from "@/components/result-view";

type DrawingStage = 'camera' | 'drawing' | 'processing' | 'result';

export default function DrawPage() {
  const [stage, setStage] = useState<DrawingStage>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleCameraConfirm = (imageData: string) => {
    setCapturedImage(imageData);
    setStage('drawing');
  };

  const handleDrawingComplete = async (base64Image: string) => {
    setStage('processing');
    // Simulate processing to demonstrate waiting/loading effects
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedImage(base64Image);
    setStage('result');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl p-6">
        {stage === 'camera' && (
          <CameraView onConfirm={handleCameraConfirm} />
        )}
        {stage === 'drawing' && (
          <DrawingCanvas onComplete={handleDrawingComplete} />
        )}
        {stage === 'processing' && (
          <div className="flex flex-col items-center justify-center p-12">
            <LoadingSpinner />
          </div>
        )}
        {stage === 'result' && (
          <ResultView generatedImage={generatedImage} />
        )}
      </Card>
    </main>
  );
}