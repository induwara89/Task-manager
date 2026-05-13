import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = 'https://task-manager-production-79f5.up.railway.app'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/login`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response.data.message)
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.logo}>Task.M</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} name="email" placeholder="Email address" onChange={handleChange} />
        <input style={styles.input} name="password" placeholder="Password" type="password" onChange={handleChange} />
        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={styles.link}>Don't have an account? <Link to="/register" style={styles.linkColor}>Register</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #0f0f13 0%, #1a1a2e 100%)' },
  box: { background: '#16213e', padding: '48px 40px', borderRadius: '20px', width: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid #ffffff10' },
  logo: { fontSize: '48px', textAlign: 'center', marginBottom: '16px' ,color: '#66dd5b', fontWeight: '700'},
  title: { fontSize: '28px', fontWeight: '300', textAlign: 'center', color: '#fff', marginBottom: '8px' },
  subtitle: { fontSize: '14px', textAlign: 'center', color: '#64748b', marginBottom: '32px' },
  input: { width: '100%', padding: '14px 16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #ffffff15', fontSize: '14px', background: '#0f3460', color: '#e2e8f0', outline: 'none' },
  button: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6c63ff, #a855f7)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  error: { color: '#f87171', marginBottom: '16px', textAlign: 'center', fontSize: '14px' },
  link: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' },
  linkColor: { color: '#6c63ff', textDecoration: 'none', fontWeight: '600' }
}

export default Login