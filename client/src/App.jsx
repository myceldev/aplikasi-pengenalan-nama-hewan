import './index.css'

function App() {

  return (
    <>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Cantarell, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Aplikasi Pengenalan Nama Hewan</h1>
          <p style={{ color: '#666' }}>Vite + React is running. Start building your UI in <code>client/src/App.jsx</code>.</p>
        </div>
      </main>
    </>
  )
}

export default App
