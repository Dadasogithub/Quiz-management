import React, { useState } from 'react'
import './AdminLogin.css'
import { adminLogin } from '../api'

export default function AdminLogin({ onSuccess }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function login(e){
    e.preventDefault()
    try{
      await adminLogin(username,password)
      onSuccess({ username, password })
    } catch(err){
      setError(err.message)
    }
  }

  return (
    <form onSubmit={login} style={{maxWidth:400}} className="stack">
      <div className="form-group">
        <label className="form-label">Username</label>
        <input className="input" value={username} onChange={(e)=>setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      </div>
      {error && <div className="error-banner">{error}</div>}
      <button className="btn btn-primary" type="submit">Login</button>
    </form>
  )
}
