import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { addQuiz, updateQuiz } from '../api'
import './AdminAddQuiz.css'

function emptyQuestion(){
  return { text:'', options:[{text:''},{text:''}], correctOptionIndex:0 }
}

export default function AdminAddQuiz({ adminCredentials, initialQuiz, onSaved }){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([ emptyQuestion() ])
  const [msg, setMsg] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [createdQuizId, setCreatedQuizId] = useState(null)

  function addQuestion(){
    // prevent adding a new empty question if the last question is empty
    const last = questions[questions.length-1]
    if (last && (!last.text.trim() || !last.options || last.options.length < 2 || last.options.some(opt=>!opt.text.trim()))) {
      setMsg('Please fill the current question before adding a new one')
      return
    }
    setQuestions(qs=>[...qs, emptyQuestion()])
  }

  function updateQuestion(idx, newVal){
    const copy = [...questions]
    copy[idx] = newVal
    setQuestions(copy)
  }

  useEffect(()=>{
    if (initialQuiz){
      setTitle(initialQuiz.title || '')
      setDescription(initialQuiz.description || '')
      setQuestions(initialQuiz.questions && initialQuiz.questions.length ? initialQuiz.questions : [emptyQuestion()])
      setIsEditing(true)
    }
  }, [initialQuiz])

  function removeQuestion(idx){
    const copy = questions.filter((_, i)=>i!==idx)
    setQuestions(copy)
  }

  async function submit(e){
    e.preventDefault()
    try{
      if (!adminCredentials?.username || !adminCredentials?.password){
        setMsg('Admin credentials missing - cannot submit. Please add credentials or login.')
        return
      }
      // validation
      if (!title.trim()) {
        setMsg('Title is required')
        return
      }
      if (!questions || !questions.length){
        setMsg('Add at least one question')
        return
      }
      const invalid = questions.some((q, qi)=>{
        if (!q.text || !q.text.trim()) return true
        if (!q.options || q.options.length < 2) return true
        if (q.options.some(opt=>!opt.text || !opt.text.trim())) return true
        if (typeof q.correctOptionIndex !== 'number' || q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) return true
        return false
      })
      if (invalid) {
        setMsg('Each question must have text, at least two non-empty options, and a valid correct option.')
        return
      }
      if (isEditing && initialQuiz?._id){
        const res = await updateQuiz(initialQuiz._id, { title, description, questions }, adminCredentials.username, adminCredentials.password)
        setMsg('Quiz updated successfully')
        setCreatedQuizId(res.quiz?._id || initialQuiz._id)
        if (onSaved) onSaved(res.quiz || res)
      } else {
        const res = await addQuiz({ title, description, questions }, adminCredentials.username, adminCredentials.password)
        setMsg('Quiz added successfully')
        setCreatedQuizId(res.quiz?._id || null)
        if (onSaved) onSaved(res.quiz || res)
      }
      setTitle(''); setDescription(''); setQuestions([emptyQuestion()])
      setIsEditing(false)
    } catch(err){
      setMsg('Error: ' + err.message)
    }
  }

  return (
    <div className="component-container">
      <h2 className="title">{isEditing ? 'Edit Quiz' : 'Create a new quiz'}</h2>
      <form onSubmit={submit} className="stack form-fullwidth">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="textarea" value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
        <div>
          <h3>Questions</h3>
          {questions.map((q, idx)=> (
            <div key={idx} className="card card-full" style={{marginBottom:8}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <strong>Question {idx+1}</strong>
                <div>
                  <button className="btn btn-danger" type="button" onClick={()=>removeQuestion(idx)}>Remove</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Question text</label>
                <input className="input" value={q.text} onChange={e=>updateQuestion(idx, {...q, text:e.target.value})} />
              </div>
              <div>
                <label>Options</label>
                {q.options.map((opt,i)=> (
                  <div key={i} className="form-group" style={{display:'flex', alignItems:'center', gap:8}}>
                    <input className="input" style={{flex:1}} value={opt.text} onChange={e=>{
                      const opts = q.options.map((o,j)=> j===i?{text:e.target.value}:o)
                      updateQuestion(idx, {...q, options:opts})
                    }} />
                    <label style={{display:'inline-flex', alignItems:'center', gap:8}}>
                      <input type="radio" checked={q.correctOptionIndex===i} onChange={()=>updateQuestion(idx,{...q, correctOptionIndex:i})} /> <span className="muted">correct</span>
                    </label>
                  </div>
                ))}
                <div>
                  <button className="btn btn-secondary" type="button" onClick={()=>{
                    const opts = [...q.options, {text:''}]
                    updateQuestion(idx, {...q, options:opts})
                  }}>Add option</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <button className="btn btn-secondary" type="button" onClick={addQuestion}>Add Question</button>
        </div>
          <div>
            <button className="btn btn-primary" type="submit" disabled={!adminCredentials?.username || !adminCredentials?.password}>{isEditing ? 'Update Quiz' : 'Save Quiz'}</button>
            {isEditing && <button className="btn btn-secondary" type="button" onClick={()=>{ setIsEditing(false); setTitle(''); setDescription(''); setQuestions([emptyQuestion()]); if (onSaved) onSaved(null) }}>Cancel</button>}
          </div>
      </form>
      {msg && <div style={{marginTop:10}}>{msg}</div>}
      {createdQuizId && (
        <div style={{marginTop:12}}>
          <Link to="/">
            <button className="btn btn-secondary">Go to user page</button>
          </Link>
          <Link to={`/quiz/${createdQuizId}`} style={{marginLeft:8}}>
            <button className="btn btn-primary">View quiz</button>
          </Link>
        </div>
      )}
    </div>
  )
}
