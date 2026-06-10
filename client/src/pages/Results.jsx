import { useLocation, useNavigate } from 'react-router-dom'

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.data) {
    navigate('/')
    return null
  }

  const { coverLetter, keywords, bullets, interviewQs } = state.data

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <button onClick={() => navigate('/')} style={styles.back}>← Back</button>
        <h1 style={styles.title}>💼 Your Results</h1>

        {/* Match Score */}
        {keywords?.matchScore !== undefined && (
          <Section title="📊 ATS Match Score">
            <div style={styles.scoreRow}>
              <div style={styles.scoreBig}>{keywords.matchScore}%</div>
              <div>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${keywords.matchScore}%` }} />
                </div>
                <p style={styles.scoreLabel}>
                  {keywords.matchScore >= 70 ? '✅ Strong match' : keywords.matchScore >= 40 ? '⚠️ Moderate match' : '❌ Needs improvement'}
                </p>
              </div>
            </div>

            {keywords.missingKeywords?.length > 0 && (
              <>
                <p style={styles.sectionLabel}>Missing Keywords — add these to your resume:</p>
                <div style={styles.tagRow}>
                  {keywords.missingKeywords.map((k) => (
                    <span key={k} style={styles.tagRed}>{k}</span>
                  ))}
                </div>
              </>
            )}

            {keywords.presentKeywords?.length > 0 && (
              <>
                <p style={styles.sectionLabel}>Keywords you already have:</p>
                <div style={styles.tagRow}>
                  {keywords.presentKeywords.map((k) => (
                    <span key={k} style={styles.tagGreen}>{k}</span>
                  ))}
                </div>
              </>
            )}
          </Section>
        )}

        {/* Cover Letter */}
        {coverLetter && (
          <Section title="✉️ Cover Letter">
            <pre style={styles.pre}>{coverLetter}</pre>
            <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(coverLetter)}>
              📋 Copy to Clipboard
            </button>
          </Section>
        )}

        {/* Resume Bullets */}
        {bullets?.length > 0 && (
          <Section title="📝 Rewritten Resume Bullets">
            <ul style={styles.list}>
              {bullets.map((b, i) => <li key={i} style={styles.listItem}>{b}</li>)}
            </ul>
          </Section>
        )}

        {/* Interview Questions */}
        {interviewQs && (
          <Section title="🎤 Interview Prep">
            {interviewQs.technical?.length > 0 && (
              <>
                <p style={styles.sectionLabel}>Technical</p>
                <ol style={styles.list}>
                  {interviewQs.technical.map((q, i) => <li key={i} style={styles.listItem}>{q}</li>)}
                </ol>
              </>
            )}
            {interviewQs.behavioral?.length > 0 && (
              <>
                <p style={styles.sectionLabel}>Behavioral</p>
                <ol style={styles.list}>
                  {interviewQs.behavioral.map((q, i) => <li key={i} style={styles.listItem}>{q}</li>)}
                </ol>
              </>
            )}
            {interviewQs.roleSpecific?.length > 0 && (
              <>
                <p style={styles.sectionLabel}>Role-Specific</p>
                <ol style={styles.list}>
                  {interviewQs.roleSpecific.map((q, i) => <li key={i} style={styles.listItem}>{q}</li>)}
                </ol>
              </>
            )}
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7f8fc',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  wrapper: { maxWidth: '800px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: '1rem', marginBottom: '16px', padding: 0 },
  title: { fontSize: '2rem', color: '#1a1a2e', marginBottom: '24px' },
  section: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '1.2rem', color: '#1a1a2e', marginBottom: '16px', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' },
  sectionLabel: { fontWeight: '600', color: '#555', margin: '12px 0 8px', fontSize: '0.9rem' },
  scoreRow: { display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' },
  scoreBig: { fontSize: '3rem', fontWeight: '700', color: '#667eea' },
  progressBar: { width: '300px', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '6px', transition: 'width 0.5s ease' },
  scoreLabel: { margin: '6px 0 0', fontSize: '0.9rem', color: '#555' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tagRed: { background: '#fff5f5', color: '#e53e3e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid #fed7d7' },
  tagGreen: { background: '#f0fff4', color: '#276749', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid #c6f6d5' },
  pre: { whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#333', fontSize: '0.9rem', margin: '0 0 12px' },
  copyBtn: { background: '#667eea', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  list: { paddingLeft: '20px', margin: 0 },
  listItem: { marginBottom: '8px', lineHeight: 1.6, color: '#333', fontSize: '0.9rem' },
}
