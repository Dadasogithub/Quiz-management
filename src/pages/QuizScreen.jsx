import React from 'react'
import { useParams, Link } from 'react-router-dom'
import QuizPlayer from '../components/QuizPlayer'

export default function QuizScreen(){
  const { id } = useParams()
  return (
    <div style={{padding:20}}>
      <Link to="/">← Back to home</Link>
      <QuizPlayer quizId={id} />
    </div>
  )
}
