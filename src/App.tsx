import { useState } from 'react'
import { convertMedia } from '@remotion/webcodecs'
import './App.css'

function App() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string>('')
  const [convertedUrl, setConvertedUrl] = useState<string>('')
  const [isConverting, setIsConverting] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setOriginalFile(file)
    const url = URL.createObjectURL(file)
    setOriginalUrl(url)
    setConvertedUrl('')

    setIsConverting(true)
    try {
      console.log('Starting conversion...')
      const result = await convertMedia({
        src: url,
        container: 'mp4',
      })
      console.log('Conversion complete, saving...')

      const blob = await result.save()
      const convertedUrl = URL.createObjectURL(blob)
      setConvertedUrl(convertedUrl)
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Video conversion failed. Check console for details.')
    } finally {
      setIsConverting(false)
    }
  }

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase() || ''
  }

  const handleRemoveVideo = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    if (convertedUrl) URL.revokeObjectURL(convertedUrl)
    setOriginalFile(null)
    setOriginalUrl('')
    setConvertedUrl('')
  }

  return (
    <div className="App" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ margin: '1rem 0' }}>Video Converter</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          style={{ fontSize: '1rem', padding: '0.5rem' }}
        />
        {originalUrl && (
          <button
            onClick={handleRemoveVideo}
            style={{ marginLeft: '1rem', fontSize: '1rem', padding: '0.5rem' }}
          >
            Remove Video
          </button>
        )}
      </div>

      {isConverting && <p>Converting video...</p>}

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', flex: 1, overflow: 'auto', padding: '1rem' }}>
        {originalUrl && (
          <div>
            <h3>Original Video</h3>
            <video
              src={originalUrl}
              controls
              style={{ maxWidth: '400px', width: '100%', maxHeight: '60vh' }}
            />
            <p>Format: {originalFile ? getFileExtension(originalFile.name) : ''}</p>
          </div>
        )}

        {convertedUrl && (
          <div>
            <h3>Converted Video</h3>
            <video
              src={convertedUrl}
              controls
              style={{ maxWidth: '400px', width: '100%', maxHeight: '60vh' }}
            />
            <p>Format: mp4</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
