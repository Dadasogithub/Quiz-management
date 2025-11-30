const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export async function fetchQuizzes(){
  try{
    const res = await fetch(`${API_BASE}/quizzes`)
    if (!res.ok) throw new Error('Failed to fetch quizzes')
    return res.json()
  }catch(err){
    if (err instanceof TypeError) throw new Error('Unable to connect to API server. Is the backend running?')
    throw err
  }
}

export async function fetchQuiz(id){
  try{
    const res = await fetch(`${API_BASE}/quizzes/${id}`)
    if (!res.ok) throw new Error('Failed to fetch quiz')
    return res.json()
  }catch(err){
    if (err instanceof TypeError) throw new Error('Unable to connect to API server. Is the backend running?')
    throw err
  }
}

export async function adminLogin(username, password){
  try{
    const res = await fetch(`${API_BASE}/admin/login`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username,password})
    })
    if (!res.ok) {
      // try to read server message or return friendly message for 401
      if (res.status === 401) throw new Error('Your credentials are incorrect')
      let text = await res.text().catch(()=>null)
      throw new Error(text || 'Invalid credentials')
    }
    return res.json()
  }catch(err){
    // network-level errors usually are TypeError: Failed to fetch
    if (err instanceof TypeError) {
      throw new Error('Unable to connect to API server. Is the backend running?')
    }
    throw err
  }
}

export async function addQuiz(quiz, adminUser, adminPass){
  const res = await fetch(`${API_BASE}/admin/quizzes`,{
    method:'POST', headers:{
      'Content-Type':'application/json',
      'x-admin-user': adminUser,
      'x-admin-pass': adminPass
    },
    body: JSON.stringify(quiz)
  })
  if (!res.ok) throw new Error('Failed to add quiz')
  return res.json()
}

export async function adminListQuizzes(adminUser, adminPass){
  try{
    const res = await fetch(`${API_BASE}/admin/quizzes`,{
      headers: {
        'x-admin-user': adminUser,
        'x-admin-pass': adminPass
      }
    })
    if (!res.ok) throw new Error('Failed to list quizzes')
    return res.json()
  }catch(err){
    if (err instanceof TypeError) throw new Error('Unable to connect to API server. Is the backend running?')
    throw err
  }
}

export async function updateQuiz(id, quiz, adminUser, adminPass){
  const res = await fetch(`${API_BASE}/admin/quizzes/${id}`,{
    method: 'PUT', headers: {
      'Content-Type':'application/json',
      'x-admin-user': adminUser,
      'x-admin-pass': adminPass
    }, body: JSON.stringify(quiz)
  })
  if (!res.ok) throw new Error('Failed to update quiz')
  return res.json()
}

export async function deleteQuiz(id, adminUser, adminPass){
  const res = await fetch(`${API_BASE}/admin/quizzes/${id}`,{
    method: 'DELETE', headers: {
      'x-admin-user': adminUser,
      'x-admin-pass': adminPass
    }
  })
  if (!res.ok) throw new Error('Failed to delete quiz')
  return res.json()
}

export default {fetchQuizzes, fetchQuiz, adminLogin, addQuiz, adminListQuizzes, updateQuiz, deleteQuiz}
