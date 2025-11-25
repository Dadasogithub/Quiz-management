import React, { useEffect, useState } from 'react'
import { fetchQuizzes } from '../api'
import QuizList from '../components/QuizList'
import './Landing.css'

export default function Landing(){
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(true)
    fetchQuizzes().then(data=>{setQuizzes(data); setLoading(false)}).catch(err=>{setError(err.message); setLoading(false)})
  },[])

  return (
    <div className="container landing-main">
      <h2 className="landing-greeting">Hello friend</h2>
      <hr />
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>Error: {error}</p>}
      {!loading && !error && (
        <div>
          {quizzes.length ===0 ? (
            <p>No quizzes available right now.</p>
          ) : (
            <QuizList quizzes={quizzes} />
          )}
        </div>
      )}
    </div>
  )
}
