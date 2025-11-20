import React from 'react';

export default async function Page({ params }){
  const code =await params.code;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/links/${code}`, { cache: 'no-store' });
  if (res.status === 404) return <div className="card">Not found</div>;
  const json = await res.json();
  const link = json.data;
  return (
    <div>
      <h2>Stats for {link.code}</h2>
      <div className="card">
        <p><strong>Target:</strong> <a href={link.url}>{link.url}</a></p>
        <p><strong>Clicks:</strong> {link.clicks}</p>
        <p><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
        <p><strong>Last clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</p>
        <div style={{marginTop:12}}>
          <form onSubmit={async(e)=>{ e.preventDefault(); if (!confirm('Delete link?')) return; await fetch(`/api/links/${link.code}`, { method: 'DELETE' }); window.location.href = '/'; }}>
            <button className="button" type="submit">Delete</button>
            <button className="button" type="button" style={{marginLeft:8}} onClick={()=>navigator.clipboard.writeText(window.location.origin + '/' + link.code)}>Copy</button>
          </form>
        </div>
      </div>
    </div>
  );
}
