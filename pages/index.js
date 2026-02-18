import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [query, setQuery] = useState({ type: 'nik', value: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const params = new URLSearchParams();
    params.append(query.type, query.value);
    if (query.type === 'nama') params.append('mode', 'fuzzy');

    try {
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Gagal fetch data, cuy!' });
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>NIK DOXER - OSINT TOOLS</title>
      </Head>

      <h1 style={styles.title}>🔍 NIK DOXER OSINT</h1>
      <p style={styles.subtitle}>Cari data berdasarkan NIK / NKK / Nama</p>

      <form onSubmit={handleSearch} style={styles.form}>
        <select 
          value={query.type} 
          onChange={(e) => setQuery({...query, type: e.target.value})}
          style={styles.select}
        >
          <option value="nik">NIK</option>
          <option value="nkk">NKK</option>
          <option value="nama">NAMA</option>
        </select>
        
        <input
          type="text"
          placeholder="Masukin data..."
          value={query.value}
          onChange={(e) => setQuery({...query, value: e.target.value})}
          style={styles.input}
        />
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Ngecek...' : 'GAS CARI 🔥'}
        </button>
      </form>

      {result && (
        <div style={styles.resultBox}>
          <h3>📊 HASIL:</h3>
          <pre style={styles.pre}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <footer style={styles.footer}>
        <p>Powered by SHADOWNEX X GPT 😈</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#00ff00',
    padding: '20px',
    fontFamily: 'monospace'
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5rem',
    textShadow: '0 0 10px #00ff00'
  },
  subtitle: {
    textAlign: 'center',
    color: '#888'
  },
  form: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '30px',
    flexWrap: 'wrap'
  },
  select: {
    padding: '12px',
    background: '#1a1a1a',
    color: '#00ff00',
    border: '1px solid #00ff00',
    borderRadius: '5px'
  },
  input: {
    padding: '12px',
    width: '300px',
    background: '#1a1a1a',
    color: '#fff',
    border: '1px solid #00ff00',
    borderRadius: '5px'
  },
  button: {
    padding: '12px 24px',
    background: '#00ff00',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  resultBox: {
    marginTop: '30px',
    padding: '20px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '10px',
    maxWidth: '800px',
    margin: '30px auto'
  },
  pre: {
    background: '#0a0a0a',
    padding: '15px',
    borderRadius: '5px',
    overflow: 'auto',
    color: '#0f0'
  },
  footer: {
    textAlign: 'center',
    marginTop: '50px',
    color: '#555'
  }
};
