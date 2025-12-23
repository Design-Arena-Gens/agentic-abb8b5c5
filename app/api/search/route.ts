import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Using YouTube's oEmbed and search-based approach for demo
    // In production, use YouTube Data API v3 with proper API key
    const searchQuery = encodeURIComponent(query)

    // Simulated video search results with real YouTube video IDs
    const mockVideos = [
      {
        id: 'dQw4w9WgXcQ',
        title: `${query} - Introduction and Overview`,
        description: `A comprehensive introduction to ${query}. Learn the basics and fundamentals in this detailed video tutorial.`,
        thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
        channelTitle: 'Tech Learning Channel',
        publishedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'jNQXAC9IVRw',
        title: `Advanced ${query} Techniques`,
        description: `Master advanced concepts and techniques related to ${query}. Perfect for intermediate learners.`,
        thumbnail: `https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg`,
        channelTitle: 'Expert Academy',
        publishedAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'L_jWHffIx5E',
        title: `${query} Best Practices 2024`,
        description: `Learn the best practices and industry standards for ${query} in 2024. Stay up to date with the latest trends.`,
        thumbnail: `https://img.youtube.com/vi/L_jWHffIx5E/mqdefault.jpg`,
        channelTitle: 'Modern Developer',
        publishedAt: new Date(Date.now() - 86400000 * 10).toISOString()
      },
      {
        id: '9bZkp7q19f0',
        title: `${query} Tutorial for Beginners`,
        description: `Complete beginner-friendly tutorial on ${query}. Start from scratch and build your knowledge step by step.`,
        thumbnail: `https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg`,
        channelTitle: 'Coding Bootcamp',
        publishedAt: new Date(Date.now() - 86400000 * 15).toISOString()
      },
      {
        id: 'kJQP7kiw5Fk',
        title: `Common ${query} Mistakes to Avoid`,
        description: `Avoid these common mistakes when working with ${query}. Learn from others' experiences and save time.`,
        thumbnail: `https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg`,
        channelTitle: 'Code Review Pro',
        publishedAt: new Date(Date.now() - 86400000 * 20).toISOString()
      }
    ]

    return NextResponse.json({ videos: mockVideos })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
