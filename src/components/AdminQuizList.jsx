import React, { useEffect, useState } from 'react'
import './AdminQuizList.css'
import { adminListQuizzes, deleteQuiz } from '../api'

export default function AdminQuizList({ adminCredentials, onEdit }){
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load(){
    setLoading(true)
    try{
      const data = await adminListQuizzes(adminCredentials.username, adminCredentials.password)
      setQuizzes(data)
    }catch(err){
      setError(err.message)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ if (adminCredentials?.username) load() }, [adminCredentials])

  async function handleDelete(id){
    if (!confirm('Delete this quiz?')) return
    try{
      await deleteQuiz(id, adminCredentials.username, adminCredentials.password)
      load()
    }catch(err){
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h2 className="admin-title">All Quizzes</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && !error && (
        <div>
          {quizzes.length === 0 ? <p>No quizzes yet.</p> : (
            <div className="card-grid">
              {quizzes.map(q => (
                <div key={q._id} className="card">
                  <h4>{q.title}</h4>
                  <p>{q.description}</p>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn btn-secondary" onClick={()=>onEdit(q)}>Edit</button>
                    <button className="btn btn-danger" onClick={()=>handleDelete(q._id)}>Delete</button>
                    <a href={`/quiz/${q._id}`} target="_blank" rel="noreferrer"><button className="btn btn-primary">View</button></a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
