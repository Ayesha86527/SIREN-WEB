import { useReports } from '@/hooks/userFirestore'
import { Panel, Spinner, EmptyState, Btn } from '@/components/ui/UI'
import { db } from '@/firebase/firebaseConfig'
import { doc, deleteDoc } from 'firebase/firestore'

export default function IncidentsPage() {
  const { reports, loading } = useReports()

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Incident Archive</div>
        <div className="page-subtitle">ALL HISTORICAL REPORTS & CITIZEN SUBMISSIONS</div>
      </div>

      <Panel title="Incident Log" icon="📋">
        {loading && <Spinner />}
        {!loading && reports.length === 0 && <EmptyState icon="📋" msg="No incidents reported" />}
        <div className="feed-list">
          {reports.map(r => (
            <div key={r.id} className="feed-item">
              <div className="feed-dot" style={{ background: r.status === 'active' ? 'var(--red-hot)' : 'var(--green-ok)' }} />
              <div className="feed-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="feed-title">{r.category} — {r.areaName}</div>
                  {r.imageUrl && (
                    <img 
                      src={r.imageUrl} 
                      alt="Incident" 
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, marginLeft: 12, border: '1px solid var(--border-subtle)' }}
                    />
                  )}
                </div>
                <div className="feed-msg">{r.description}</div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <span>📍 {r.city}</span>
                  <span>🕒 {r.timestamp?.toDate().toLocaleTimeString() ?? '—'}</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  User: {r.userId} · Status: {r.status.toUpperCase()}
                </div>
</div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <Btn 
                  variant="danger" 
                  size="sm" 
                  onClick={async () => {
                    try {
                      await deleteDoc(doc(db, 'reports', r.id))
                    } catch (e) {
                      console.error('Failed to delete report', e)
                    }
                  }}
                >
                  Delete
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
