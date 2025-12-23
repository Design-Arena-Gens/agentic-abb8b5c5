'use client'

import { useState } from 'react'
import { Search, Play, Bot, Loader2, ExternalLink } from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
}

interface Analysis {
  summary: string
  keyPoints: string[]
  sentiment: string
  topics: string[]
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const searchVideos = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      setVideos(data.videos)
    } catch (err) {
      setError('Failed to search videos. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const analyzeVideo = async (video: Video) => {
    setSelectedVideo(video)
    setAnalyzing(true)
    setAnalysis(null)
    setError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id, title: video.title, description: video.description })
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      setError('Failed to analyze video. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-10 h-10 text-red-500" />
            <h1 className="text-4xl font-bold">YouTube Agent</h1>
          </div>
          <p className="text-gray-400">AI-powered YouTube search and video analysis</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchVideos()}
                placeholder="Search for YouTube videos..."
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-red-500 text-gray-100 placeholder-gray-500"
              />
            </div>
            <button
              onClick={searchVideos}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Search Results
            </h2>

            {videos.length === 0 && !loading && (
              <p className="text-gray-500 text-center py-8">
                Search for videos to get started
              </p>
            )}

            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => analyzeVideo(video)}
                  className={`p-4 bg-gray-900 border rounded-lg cursor-pointer transition-all hover:border-red-500 ${
                    selectedVideo?.id === video.id ? 'border-red-500' : 'border-gray-800'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">{video.channelTitle}</p>
                      <p className="text-xs text-gray-600">{new Date(video.publishedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Analysis
            </h2>

            {!selectedVideo && !analyzing && (
              <div className="p-8 bg-gray-900 border border-gray-800 rounded-lg text-center text-gray-500">
                Select a video to analyze
              </div>
            )}

            {analyzing && (
              <div className="p-8 bg-gray-900 border border-gray-800 rounded-lg flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                <p className="text-gray-400">Analyzing video...</p>
              </div>
            )}

            {selectedVideo && !analyzing && analysis && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={selectedVideo.thumbnail}
                      alt={selectedVideo.title}
                      className="w-24 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{selectedVideo.title}</h3>
                      <a
                        href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
                      >
                        Watch on YouTube <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-red-500">Summary</h3>
                  <p className="text-sm text-gray-300">{analysis.summary}</p>
                </div>

                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-red-500">Key Points</h3>
                  <ul className="space-y-1">
                    {analysis.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-red-500">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-red-500">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-red-500">Sentiment</h3>
                  <p className="text-sm text-gray-300 capitalize">{analysis.sentiment}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
