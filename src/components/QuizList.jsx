import React from 'react'
import { Link } from 'react-router-dom'
import './QuizList.css'

export default function QuizList({ quizzes }){
  return (
    <div className="card-grid">
      {quizzes.map(q=> (
        <div key={q._id} className="card">
          <h3>{q.title}</h3>
          <p>{q.description}</p>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
            <Link to={`/quiz/${q._id}`}>
              <button className="btn btn-primary">Start Quiz</button>
            </Link>
            <small style={{color:'#888'}}>{q.questions?.length || 0} Qs</small>
          </div>
        </div>
      ))}
    </div>
  )
}
