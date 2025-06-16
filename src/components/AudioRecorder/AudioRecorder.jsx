import React from 'react';
import useRecorder from '../../hooks/useRecorder';
import './AudioRecorder.css';
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaPause, FaStop, FaRecordVinyl } from 'react-icons/fa';

const AudioRecorder = () => {
    const {
        status,
        duration,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        toggleMicrophone,
        isMicEnabled
    } = useRecorder();

    console.log('[AudioRecorder] Rendered. Status:', status);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="audio-recorder">
            <h2>Audio Recorder</h2>

            <div className="audio-container">
                <div className="audio-visualizer">
                    <div className="visualizer-bars">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="visualizer-bar" />
                        ))}
                    </div>
                </div>
                <div className="stream-controls">
                    <button
                        onClick={toggleMicrophone}
                        className={`control-btn ${isMicEnabled ? 'active' : 'inactive'}`}
                        title={isMicEnabled ? 'Disable Microphone' : 'Enable Microphone'}
                    >
                        {isMicEnabled ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                    </button>
                </div>
            </div>

            <div className="controls">
                {(status === 'idle' || status === 'stopped') && (
                    <button onClick={startRecording} className="record-btn">
                        <FaRecordVinyl style={{ marginRight: 8 }} /> Start Recording
                    </button>
                )}

                {status === 'recording' && (
                    <div className="recording-controls">
                        <button onClick={pauseRecording} className="pause-btn">
                            <FaPause style={{ marginRight: 8 }} /> Pause
                        </button>
                        <button onClick={stopRecording} className="stop-btn">
                            <FaStop style={{ marginRight: 8 }} /> Stop
                        </button>
                    </div>
                )}

                {status === 'paused' && (
                    <div className="recording-controls">
                        <button onClick={resumeRecording} className="resume-btn">
                            <FaPlay style={{ marginRight: 8 }} /> Resume
                        </button>
                        <button onClick={stopRecording} className="stop-btn">
                            <FaStop style={{ marginRight: 8 }} /> Stop
                        </button>
                    </div>
                )}
            </div>

            {(status === 'recording' || status === 'paused') && (
                <div className="recording-info">
                    <div className="recording-indicator">
                        <span className="pulse"></span>
                        {status === 'recording' ? 'Recording in progress...' : 'Recording paused'}
                    </div>
                    <div className="duration">{formatTime(duration)}</div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder; 