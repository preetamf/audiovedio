import React, { useEffect, useState } from 'react';
import useRecorder from '../../hooks/useRecorder';
import { useRecordings } from '../../contexts/RecordingsContext';
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
    const { dispatch } = useRecordings();
    // Local state for mic toggle in idle
    const [micPref, setMicPref] = useState(true);
    const [permission, setPermission] = useState(null); // null | 'granted' | 'denied'
    const [permissionMsg, setPermissionMsg] = useState('');

    useEffect(() => {
        return () => {
            dispatch({ type: 'RESET_TO_IDLE' });
        };
    }, [dispatch]);

    // When recording starts, apply the user's mic preference
    useEffect(() => {
        if (status === 'recording' && isMicEnabled !== micPref) {
            toggleMicrophone();
        }
    }, [status]);

    const handleMicToggle = () => {
        if (status === 'idle' || status === 'stopped') {
            setMicPref((prev) => !prev);
        } else {
            toggleMicrophone();
        }
    };

    const handlePrepare = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermission('granted');
            setPermissionMsg('Microphone access granted!');
            // Immediately stop tracks so we don't keep the stream open
            stream.getTracks().forEach(track => track.stop());
        } catch {
            setPermission('denied');
            setPermissionMsg('Microphone access denied. Please allow access to record audio.');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Use micPref for icon in idle/stopped, isMicEnabled otherwise
    const micOn = (status === 'idle' || status === 'stopped') ? micPref : isMicEnabled;

    return (
        <div className="audio-recorder">
            <h2>Audio Recorder</h2>

            <div className="audio-container">
                <div className="audio-visualizer">
                    <div className="visualizer-bars">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className={`visualizer-bar${status === 'recording' ? ' animate' : ''}`} />
                        ))}
                    </div>
                </div>
                <div className="stream-controls">
                    <button
                        onClick={handleMicToggle}
                        className={`stream-control-btn ${micOn ? 'active' : 'inactive'}`}
                        title={micOn ? 'Disable Microphone' : 'Enable Microphone'}
                        disabled={false}
                    >
                        {micOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                    </button>
                </div>
            </div>

            <div className="controls">
                {(status === 'idle' || status === 'stopped') && (
                    <>
                        <button onClick={handlePrepare} className="prepare-btn">
                            Prepare (Request Mic Permission)
                        </button>
                        <button onClick={startRecording} className="record-btn" disabled={permission !== 'granted'}>
                            <FaRecordVinyl style={{ marginRight: 8 }} /> Start Recording
                        </button>
                    </>
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

            {permissionMsg && (
                <div className={`permission-msg ${permission}`}>{permissionMsg}</div>
            )}

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