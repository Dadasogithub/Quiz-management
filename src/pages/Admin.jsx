import React, { useState } from 'react'
import AdminLogin from '../components/AdminLogin'
import AdminAddQuiz from '../components/AdminAddQuiz'
import AdminQuizList from '../components/AdminQuizList'

export default function Admin(){
  // When Vite env variables VITE_ADMIN_USER and VITE_ADMIN_PASS are present,
  // we auto-set admin credentials and bypass interactive login.
  const defaultAdminUser = import.meta.env.VITE_ADMIN_USER || ''
  const defaultAdminPass = import.meta.env.VITE_ADMIN_PASS || ''
  const hasDefaultAdmin = defaultAdminUser && defaultAdminPass

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(hasDefaultAdmin))
  const [adminCredentials, setAdminCredentials] = useState(
    hasDefaultAdmin ? { username: defaultAdminUser, password: defaultAdminPass } : {}
  )
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="admin-container" style={{padding: 20}}>
      <h1 className="title accent">Admin</h1>
      {!isLoggedIn ? (
        <div className="container">
          <AdminLogin onSuccess={(creds)=>{ setAdminCredentials(creds); setIsLoggedIn(true) }} />
        </div>
      ) : (
        <div className="container admin-grid" style={{alignItems:'start'}}>
          <div className="admin-left">
            <AdminAddQuiz adminCredentials={adminCredentials} initialQuiz={selectedQuiz} onSaved={(q)=>{ setSelectedQuiz(null); setRefreshKey(k=>k+1) }} />
          </div>
          <div className="admin-right">
            <AdminQuizList adminCredentials={adminCredentials} onEdit={(q)=> setSelectedQuiz(q)} key={refreshKey} />
          </div>
        </div>
      )}
    </div>
  )
}
