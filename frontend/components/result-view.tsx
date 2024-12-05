import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ResultViewProps {
  generatedImage: string | null;
}

export function ResultView({ generatedImage }: ResultViewProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">This is what our AI generated</h2>
      {generatedImage ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <img src={`${generatedImage}`} alt="Generated" className="object-cover w-full h-full" />
        </div>
      ) : (
        <p className="text-center text-gray-600">No image available.</p>
      )}
      <p className="text-center text-gray-600">Thanks for using AI Paper Tablet!</p>
      <Link href="/page">
        <Button variant="outline">Start Over</Button>
      </Link>
    </div>
  );
}