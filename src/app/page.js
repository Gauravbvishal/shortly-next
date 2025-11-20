'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [q, setQ] = useState('');

  async function fetchLinks() {
    setLoading(true);
    const url = '/api/links' + (q ? `?q=${encodeURIComponent(q)}` : '');
    const res = await fetch(url);
    const json = await res.json();
    setLinks(json.data);
    setLoading(false);
  }

  useEffect(() => { fetchLinks(); }, [q]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 30 }}>
        <input className="input search" placeholder="Search by code or URL" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="button" onClick={() => setShowAdd(true)}>Add Link</button>
      </div>

      {loading && <div>Loading...</div>}

      {!loading && links && links.length === 0 && <div className="card">No links yet. Click "Add Link" to create one.</div>}

      {!loading && links && links.length > 0 && (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '600px',
              background: '#fff',
              borderRadius: '8px',
            }}
          >
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Code</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Target URL</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Clicks</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Last Clicked</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map(link => (
                <tr
                  key={link.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: 500 }}>
                    <a href={`/${link.code}`} target="_blank" rel="noreferrer">{link.code}</a>
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#111' }}>{link.url}</a>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{link.clicks}</td>
                  <td style={{ padding: '12px 16px' }}>{link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</td>
                  <td style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ef4444',
                        background: '#ef4444',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
                      onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
                      onClick={async () => {
                        if (!confirm('Delete this link?')) return;
                        await fetch(`/api/links/${link.code}`, { method: 'DELETE' });
                        fetchLinks();
                      }}
                    >
                      Delete
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #3b82f6',
                        background: '#3b82f6',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
                      onClick={() => navigator.clipboard.writeText(window.location.origin + '/' + link.code)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {showAdd && <AddModal onClose={() => { setShowAdd(false); fetchLinks(); }} />}
    </div>
  );
}

function AddModal({ onClose }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, code: code || undefined }) });
      if (res.status === 201) {
        onClose();
      } else if (res.status === 409) {
        setError('Code already exists');
      } else {
        const data = await res.json();
        setError(data?.error ? JSON.stringify(data.error) : 'Error');
      }
    } catch (e) { setError('Network error'); }
    setLoading(false);
  }

  return (
    <div className="modal">
      <div className="card">
        <h3>Create Link</h3>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 8 }}>
            <label className="small">Target URL</label><br />
            <input className="input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/docs" required />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label className="small">Custom code (optional, 6-8 alnum)</label><br />
            <input className="input" value={code} onChange={e => setCode(e.target.value)} placeholder="abc123" />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="button" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
            <button type="button" className="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
