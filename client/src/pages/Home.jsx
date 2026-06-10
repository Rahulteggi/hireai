import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!jobDescription.trim()) return setError('Please paste a job description')
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('jobDescription', jobDescription)
      if (resume) formData.append('resume', resume)

      const { data } = await axios.post('http://localhost:8080/api/analyze', formData)
      navigate('/results', { state: { data } })
    } catch (err) {
      setError('Something went wrong. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💼 HireAI</h1>
        <p style={styles.subtitle}>Paste a job description and upload your resume — get a tailored cover letter, ATS analysis, and interview prep instantly.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Job Description *</label>
          <textarea
            style={styles.textarea}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
          />

          <label style={styles.label}>Resume (PDF, optional)</label>
          <input
            type="file"
            accept=".pdf"
            style={styles.fileInput}
            onChange={(e) => setResume(e.target.files[0])}
          />
          {resume && <p style={styles.fileName}>✅ {resume.name}</p>}

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🚀 Analyze Now'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  title: { fontSize: '2rem', margin: '0 0 8px', color: '#1a1a2e' },
  subtitle: { color: '#666', marginBottom: '32px', lineHeight: 1.6 },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  label: { fontWeight: '600', color: '#333', fontSize: '0.9rem' },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '0.9rem',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
  },
  fileInput: { padding: '8px 0', cursor: 'pointer' },
  fileName: { color: '#48bb78', fontSize: '0.85rem', margin: '0' },
  error: { color: '#e53e3e', fontSize: '0.85rem', margin: '0' },
  button: {
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
}
