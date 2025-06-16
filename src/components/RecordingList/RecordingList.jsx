import React from 'react';
import { useRecordings } from '../../contexts/RecordingsContext';
import { formatTime } from '../../utils/recordingUtils';
import './RecordingList.css';

const RecordingList = () => {
    const { recordings, dispatch } = useRecordings();

    const handleDelete = (index) => {
        dispatch({ type: 'DELETE_RECORDING', payload: index });
    };

    const handleDownload = (recording) => {
        const url = URL.createObjectURL(recording.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${recording.id}.${recording.type === 'audio' ? 'webm' : 'webm'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (recordings.length === 0) {
        return (
            <div className="recording-list empty">
                <p>No recordings yet. Start recording to see them here!</p>
            </div>
        );
    }

    return (
        <div className="recording-list">
            <h3>Your Recordings</h3>
            <div className="recordings-grid">
                {recordings.map((recording, index) => (
                    <div key={recording.id} className="recording-item">
                        {recording.type === 'video' ? (
                            <video src={recording.url} controls className="recording-preview" />
                        ) : (
                            <audio src={recording.url} controls className="recording-preview" />
                        )}
                        <div className="recording-info">
                            <span className="recording-type">
                                {recording.type === 'audio' ? '🎤 Audio' : '🎥 Video'}
                            </span>
                            <span className="recording-duration">
                                {formatTime(recording.duration)}
                            </span>
                            <span className="recording-date">
                                {new Date(recording.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <div className="recording-actions">
                            <button
                                onClick={() => handleDownload(recording)}
                                className="download-btn"
                            >
                                Download
                            </button>
                            <button
                                onClick={() => handleDelete(index)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecordingList; 