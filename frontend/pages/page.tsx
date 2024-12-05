import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">AI Paper Tablet</h1>
          <Link href="/draw">
            <Button className="bg-purple-100 text-purple-900 hover:bg-purple-200">
              Start Drawing
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  )
}

