import React, { useEffect, useState } from 'react'
import { fetchQuiz } from '../api'
import './QuizPlayer.css'

export default function QuizPlayer({ quizId }){
  const [quiz, setQuiz] = useState(null)
  const [index, setIndex] = useState(0)
  // score will be computed at the end from answers
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState([]) // selected answers per question

  useEffect(()=>{
    setLoading(true)
    fetchQuiz(quizId).then(data=>{setQuiz(data); setLoading(false)}).catch(err=>{setError(err.message); setLoading(false)})
  },[quizId])

  if (loading) return <p>Loading quiz...</p>
  if (error) return <p style={{color:'red'}}>Error: {error}</p>
  if (!quiz) return <p>Quiz not found</p>

  const question = quiz.questions[index]

  function next(){
    const selected = answers[index]
    if (typeof selected !== 'number') return
    setIndex(i=>i+1)
  }

  function back(){
    setIndex(i=>Math.max(0, i-1))
  }

  function selectAnswer(i){
    setAnswers(a=>{
      const copy = [...a]
      copy[index] = i
      return copy
    })
  }

  if (index >= quiz.questions.length){
    const total = quiz.questions.length
    const calcScore = answers.reduce((acc, ans, i) => ans === quiz.questions[i].correctOptionIndex ? acc + 1 : acc, 0)
    const percent = Math.round((calcScore/total)*100)
    let remark = 'Needs Improvement'
    if (percent >= 90) remark = 'Excellent'
    else if (percent >= 75) remark = 'Best'
    else if (percent >= 50) remark = 'Good'
    const statusClass = percent >= 90 ? 'result-excellent' : percent >= 75 ? 'result-best' : percent >= 50 ? 'result-good' : 'result-need'
    return <div style={{padding:20}}>
      <div className={`result-banner ${statusClass}`}>
        <div style={{fontSize:22}}>Finished — {remark}</div>
        <div style={{fontSize:18, opacity:0.95}}>Your score: <strong style={{fontSize:20}}>{calcScore}</strong> / {quiz.questions.length} ({percent}%)</div>
      </div>
      <div>
        <button className="btn btn-primary" onClick={()=>{
          // restart
          setIndex(0); setAnswers([])
        }}>Restart</button>
      </div>
    </div>
  }

  const percent = Math.round((index/quiz.questions.length)*100)
  return (
    <div className="quiz-player" style={{padding:20}}>
      <h2>{quiz.title}</h2>
      <div className="card">
        <div className="progress-wrap">
          <div className="progress" style={{width: `${percent}%`}}></div>
        </div>
        <p style={{fontSize:14, color:'#666'}}>Question {index+1} of {quiz.questions.length}</p>
        <h3 style={{marginTop:4}}>{question.text}</h3>
        <div>
          {question.options.map((opt,i)=> (
            <div key={i} className={`option ${answers[index]===i ? 'selected':''}`} onClick={()=>selectAnswer(i)}>
              <label>
                <input style={{marginRight:8}} type="radio" name={`option-${index}`} checked={answers[index]===i} onChange={()=>selectAnswer(i)} /> {opt.text}
              </label>
            </div>
          ))}
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-secondary" onClick={back} disabled={index===0}>Back</button>
          {index < quiz.questions.length-1 ? (
            <button className="btn btn-primary" onClick={next} disabled={typeof answers[index] !== 'number'}>Next</button>
          ) : (
            <button className="btn btn-primary" onClick={next} disabled={typeof answers[index] !== 'number'}>Submit</button>
          )}
        </div>
      </div>
    </div>
  )
}
