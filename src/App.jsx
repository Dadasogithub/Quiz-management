import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Admin from './pages/Admin'
import QuizScreen from './pages/QuizScreen'
import './App.css'

function Header(){
  const loc = useLocation()
  return (
    <header className="header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{width:46, height:46, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.08)', borderRadius:8, fontSize:20}}>🧩</div>
      </div>
      {loc.pathname !== '/admin' && (
        <Link to="/admin"><button className="btn btn-primary">Admin Panel</button></Link>
      )}
    </header>
  )
}

function App(){
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/quiz/:id" element={<QuizScreen/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
