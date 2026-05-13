import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
            const res = await axios.get('https://task-manager-production-79f5.up.railway.app', { headers })
            setTasks(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const createTask = async () => {
        if (!title) return
        try {
            await axios.post('https://task-manager-production-79f5.up.railway.app', { title, description, dueDate }, { headers })
            setTitle('')
            setDescription('')
            setDueDate('')
            fetchTasks()
        } catch (err) {
            console.log(err)
        }
    }

    const deleteTask = async (id) => {
        try {
            await axios.delete(`https://task-manager-production-79f5.up.railway.app/${id}`, { headers })
            fetchTasks()
        } catch (err) {
            console.log(err)
        }
    }

    const completeTask = async (id) => {
        try {
            await axios.put(`https://task-manager-production-79f5.up.railway.app/${id}`, { status: 'completed' }, { headers })
            fetchTasks()
        } catch (err) {
            console.log(err)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    useEffect(() => {
        if (!token) {
            navigate('/login')
        } else {
            fetchTasks()
        }
    }, [])

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h2> Welcome, {user?.name}!</h2>
                <button style={styles.logoutBtn} onClick={logout}>Logout</button>
            </div>

            {/* Add Task */}
            <div style={styles.addBox}>
                <h3 style={{ marginBottom: '16px' }}>➕ Add New Task</h3>
                <input
                    style={styles.input}
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    style={styles.input}
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    style={styles.input}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <button style={styles.addBtn} onClick={createTask}>Add Task</button>
            </div>

            {/* Task List */}
            <div style={styles.taskList}>
                <h3 style={{ marginBottom: '16px' }}>📋 My Tasks ({tasks.length})</h3>
                {tasks.length === 0 && <p style={{ color: '#888' }}>No tasks yet! Add one above 👆</p>}
                {tasks.map(task => (
                    <div key={task._id} style={{
                        ...styles.taskCard,
                        borderLeft: task.status === 'completed' ? '4px solid #22c55e' : '4px solid #4f46e5'
                    }}>
                        <div>
                            <h4 style={{
                                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                color: task.status === 'completed' ? '#888' : '#333'
                            }}>
                                {task.title}
                            </h4>
                            {task.description && <p style={styles.desc}>{task.description}</p>}
                            {task.dueDate && (
                                <p style={styles.desc}>
                                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            )}
                            <span style={{
                                ...styles.badge,
                                background: task.status === 'completed' ? '#dcfce7' : '#ede9fe',
                                color: task.status === 'completed' ? '#16a34a' : '#4f46e5'
                            }}>
                                {task.status}
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
    container: { maxWidth: '700px', margin: '0 auto', padding: '24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    logoutBtn: { padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    addBox: { background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
    input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
    addBtn: { width: '100%', padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
    taskList: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
    taskCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', marginBottom: '12px', borderRadius: '8px', background: '#f9fafb', borderLeft: '4px solid #4f46e5' },
    desc: { fontSize: '13px', color: '#666', marginTop: '4px' },
    badge: { fontSize: '11px', padding: '2px 8px', borderRadius: '12px', marginTop: '6px', display: 'inline-block' },
    actions: { display: 'flex', gap: '8px' },
    completeBtn: { padding: '8px', background: '#f0fdf4', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
    deleteBtn: { padding: '8px', background: '#fef2f2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }
}

export default Dashboard