import React from 'react';
import { RecordingsProvider } from './contexts/RecordingsContext';
import AudioRecorder from './components/AudioRecorder/AudioRecorder';
import VideoRecorder from './components/VideoRecorder/VideoRecorder';
import RecordingList from './components/RecordingList/RecordingList';
import { useRecordings } from './contexts/RecordingsContext';
import { RECORDING_TYPES } from './types';
import './App.css';

const AppContent = () => {
  const ctx = useRecordings();
  console.log('[AppContent] useRecordings context:', ctx);
  const { recordingType, dispatch, error } = ctx;

  const handleTypeChange = (type) => {
    dispatch({ type: 'SET_RECORDING_TYPE', payload: type });
  };

  return (
    <div className="app">
      <header>
        <h1>Media Recorder</h1>
        <div className="tabs">
          <button
            className={`tab ${recordingType === RECORDING_TYPES.AUDIO ? 'active' : ''}`}
            onClick={() => handleTypeChange(RECORDING_TYPES.AUDIO)}
          >
            Audio Recorder
          </button>
          <button
            className={`tab ${recordingType === RECORDING_TYPES.VIDEO ? 'active' : ''}`}
            onClick={() => handleTypeChange(RECORDING_TYPES.VIDEO)}
          >
            Video Recorder
          </button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p>{error.message}</p>
          <button onClick={() => dispatch({ type: 'CLEAR_ERROR' })}>
            Dismiss
          </button>
        </div>
      )}

      <main>
        {recordingType === RECORDING_TYPES.AUDIO ? (
          <AudioRecorder />
        ) : (
          <VideoRecorder />
        )}
        <RecordingList />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <RecordingsProvider>
      <AppContent />
    </RecordingsProvider>
  );
};

export default App;
