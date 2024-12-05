import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const [drawingCount, setDrawingCount] = useState(0)

  useEffect(() => {
    // Simulate fetching the drawing count
    const fetchDrawingCount = () => {
      // Replace this with an actual API call in a real application
      const simulatedCount = Math.floor(Math.random() * 1000)
      setDrawingCount(simulatedCount)
    }

    fetchDrawingCount()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-gradient-x">
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-text">
            AI Paper Tablet
          </h1>
          <p className="text-center text-gray-600">
            Unleash your creativity with our AI-powered drawing tool. Create, explore, and innovate!
          </p>
          <Link href="/draw">
            <Button className="bg-purple-600 text-white hover:bg-purple-700 transform transition-all duration-300 ease-in-out hover:scale-105 animate-pulse">
              Start Drawing
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            Join {drawingCount.toLocaleString()} creations and counting!
          </p>
        </div>
      </Card>
    </main>
  )
}

