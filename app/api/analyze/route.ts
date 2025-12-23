import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { videoId, title, description } = await request.json()

    if (!videoId || !title) {
      return NextResponse.json({ error: 'Video ID and title are required' }, { status: 400 })
    }

    // Simulate AI analysis based on title and description
    const analysis = generateAnalysis(title, description)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

function generateAnalysis(title: string, description: string) {
  const content = `${title} ${description}`.toLowerCase()

  // Extract key topics
  const topicKeywords = [
    'javascript', 'python', 'react', 'node', 'typescript', 'api',
    'database', 'cloud', 'tutorial', 'programming', 'development',
    'design', 'architecture', 'testing', 'deployment', 'security',
    'performance', 'optimization', 'machine learning', 'ai', 'data'
  ]

  const topics = topicKeywords.filter(keyword =>
    content.includes(keyword)
  ).slice(0, 5)

  if (topics.length === 0) {
    topics.push('Technology', 'Tutorial', 'Education')
  }

  // Determine sentiment
  const positiveWords = ['best', 'great', 'amazing', 'excellent', 'complete', 'comprehensive', 'perfect']
  const negativeWords = ['mistake', 'avoid', 'problem', 'issue', 'error', 'wrong', 'bad']

  const positiveCount = positiveWords.filter(word => content.includes(word)).length
  const negativeCount = negativeWords.filter(word => content.includes(word)).length

  let sentiment = 'neutral'
  if (positiveCount > negativeCount) sentiment = 'positive'
  else if (negativeCount > positiveCount) sentiment = 'informative'

  // Generate summary
  const summary = `This video covers ${topics.slice(0, 2).join(' and ')}, providing ${
    content.includes('beginner') ? 'beginner-friendly' :
    content.includes('advanced') ? 'advanced' : 'comprehensive'
  } insights. ${
    content.includes('tutorial') ? 'The tutorial format makes it easy to follow along.' :
    content.includes('best practice') ? 'It focuses on industry best practices and standards.' :
    'The content is well-structured for learning.'
  }`

  // Generate key points
  const keyPoints = []

  if (content.includes('introduction') || content.includes('beginner')) {
    keyPoints.push('Covers fundamental concepts and basics')
  }
  if (content.includes('advanced') || content.includes('expert')) {
    keyPoints.push('Explores advanced techniques and patterns')
  }
  if (content.includes('best practice') || content.includes('2024')) {
    keyPoints.push('Includes modern best practices and current standards')
  }
  if (content.includes('tutorial') || content.includes('step')) {
    keyPoints.push('Provides step-by-step instructions')
  }
  if (content.includes('mistake') || content.includes('avoid')) {
    keyPoints.push('Highlights common pitfalls to avoid')
  }
  if (content.includes('example') || content.includes('demo')) {
    keyPoints.push('Includes practical examples and demonstrations')
  }

  if (keyPoints.length === 0) {
    keyPoints.push(
      'Provides valuable insights on the topic',
      'Well-structured educational content',
      'Suitable for skill development'
    )
  }

  return {
    summary,
    keyPoints: keyPoints.slice(0, 4),
    sentiment,
    topics: topics.map(t => t.charAt(0).toUpperCase() + t.slice(1))
  }
}
