import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://task-manager-production-79f5.up.railway.app'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const headers = { Authorization: `Bearer ${token}` }

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`, { headers })
      setTasks(res.data)
    } catch (err) { console.log(err) }
  }

  const createTask = async () => {
    if (!title) return
    try {
      await axios.post(`${API}/api/tasks`, { title, description, dueDate }, { headers })
      setTitle(''); setDescription(''); setDueDate('')
      fetchTasks()
    } catch (err) { console.log(err) }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`, { headers })
      fetchTasks()
    } catch (err) { console.log(err) }
  }

  const completeTask = async (id) => {
    try {
      await axios.put(`${API}/api/tasks/${id}`, { status: 'completed' }, { headers })
      fetchTasks()
    } catch (err) { console.log(err) }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  useEffect(() => {
    if (!token) navigate('/login')
    else fetchTasks()
  }, [])

  const pending = tasks.filter(t => t.status === 'pending').length
  const completed = tasks.filter(t => t.status === 'completed').length

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}> Hey, {user?.name}!</h2>
          <p style={styles.headerSub}>Here's your task overview</p>
        </div>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <p style={styles.statNum}>{tasks.length}</p>
          <p style={styles.statLabel}>Total Tasks</p>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f59e0b20, #f59e0b10)', border: '1px solid #f59e0b30'}}>
          <p style={{...styles.statNum, color: '#f59e0b'}}>{pending}</p>
          <p style={styles.statLabel}>Pending</p>
        </div>
        <div style={{...styles.statCard, background: 'linear-gradient(135deg, #22c55e20, #22c55e10)', border: '1px solid #22c55e30'}}>
          <p style={{...styles.statNum, color: '#22c55e'}}>{completed}</p>
          <p style={styles.statLabel}>Completed</p>
        </div>
      </div>

      {/* Add Task */}
      <div style={styles.addBox}>
        <h3 style={styles.sectionTitle}>➕ Add New Task</h3>
        <input style={styles.input} placeholder="Task title " value={title} onChange={(e) => setTitle(e.target.value)} />
        <input style={styles.input} placeholder="Description " value={description} onChange={(e) => setDescription(e.target.value)} />
        <input style={styles.input} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button style={styles.addBtn} onClick={createTask}>Add Task </button>
      </div>

      {/* Task List */}
      <div style={styles.taskList}>
        <h3 style={styles.sectionTitle}>📋 My Tasks ({tasks.length})</h3>
        {tasks.length === 0 && (
          <div style={styles.empty}>
            <p style={{fontSize: '48px'}}>📝</p>
            <p style={{color: '#64748b', marginTop: '8px'}}>No tasks yet! Add one above</p>
          </div>
        )}
        {tasks.map(task => (
          <div key={task._id} style={{
            ...styles.taskCard,
            borderLeft: task.status === 'completed' ? '4px solid #22c55e' : '4px solid #6c63ff'
          }}>
            <div style={{flex: 1}}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: task.status === 'completed' ? '#64748b' : '#e2e8f0',
                textDecoration: task.status === 'completed' ? 'line-through' : 'none'
              }}>
                {task.title}
              </h4>
              {task.description && <p style={styles.taskDesc}>{task.description}</p>}
              {task.dueDate && (
                <p style={styles.taskDate}>
                  📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <span style={{
                ...styles.badge,
                background: task.status === 'completed' ? '#22c55e20' : '#6c63ff20',
                color: task.status === 'completed' ? '#22c55e' : '#6c63ff'
              }}>
                {task.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
              </span>
            </div>
            <div style={styles.actions}>
              {task.status !== 'completed' && (
                <button style={styles.completeBtn} onClick={() => completeTask(task._id)}>✅</button>
              )}
              <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '750px', margin: '0 auto', padding: '24px 16px', minHeight: '100vh', background: '#0f0f13' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#16213e', padding: '20px 24px', borderRadius: '16px', border: '1px solid #ffffff10' },
  headerTitle: { fontSize: '22px', fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  logoutBtn: { padding: '8px 20px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: 'linear-gradient(135deg, #6c63ff20, #6c63ff10)', border: '1px solid #6c63ff30', padding: '20px', borderRadius: '16px', textAlign: 'center' },
  statNum: { fontSize: '32px', fontWeight: '700', color: '#6c63ff' },
  statLabel: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  addBox: { background: '#16213e', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #ffffff10' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' },
  input: { width: '100%', padding: '14px 16px', marginBottom: '12px', borderRadius: '12px', border: '1px solid #ffffff15', fontSize: '14px', background: '#0f3460', color: '#e2e8f0', outline: 'none' },
  addBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6c63ff, #a855f7)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  taskList: { background: '#16213e', padding: '24px', borderRadius: '16px', border: '1px solid #ffffff10' },
  taskCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', marginBottom: '12px', borderRadius: '12px', background: '#0f3460', border: '1px solid #ffffff08' },
  taskDesc: { fontSize: '13px', color: '#94a3b8', marginTop: '4px' },
  taskDate: { fontSize: '12px', color: '#ff7676', marginTop: '4px' },
  badge: { fontSize: '11px', padding: '4px 10px', borderRadius: '20px', marginTop: '8px', display: 'inline-block', fontWeight: '600' },
  actions: { display: 'flex', gap: '8px', marginLeft: '16px' },
  completeBtn: { padding: '8px 12px', background: '#22c55e20', border: '1px solid #22c55e30', borderRadius: '10px', cursor: 'pointer', fontSize: '16px' },
  deleteBtn: { padding: '8px 12px', background: '#ef444420', border: '1px solid #ef444430', borderRadius: '10px', cursor: 'pointer', fontSize: '16px' },
  empty: { textAlign: 'center', padding: '40px' }
}

export default Dashboard