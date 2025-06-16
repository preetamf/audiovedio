import React, { useState } from 'react'
import AudioRecorder from './components/AudioRecorder/AudioRecorder'
import VideoRecorder from './components/VideoRecorder/VideoRecorder'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('audio')

  return (
    <div className="app">
      <header>
        <h1>Media Recorder</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            Audio Recorder
          </button>
          <button
            className={`tab ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            Video Recorder
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'audio' ? <AudioRecorder /> : <VideoRecorder />}
      </main>
    </div>
  )
}

export default App
