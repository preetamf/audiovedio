import React, { useRef, useEffect, useState } from 'react';
import useRecorder from '../../hooks/useRecorder';
import { useRecordings } from '../../contexts/RecordingsContext';
import './VideoRecorder.css';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPlay, FaPause, FaStop, FaRecordVinyl } from 'react-icons/fa';

const VideoRecorder = () => {
    const videoRef = useRef(null);
    const {
        status,
        duration,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        toggleCamera,
        toggleMicrophone,
        isCameraEnabled,
        isMicEnabled,
        stream
    } = useRecorder();
    const { dispatch } = useRecordings();
    // Local state for pre-toggle in idle
    const [micPref, setMicPref] = useState(true);
    const [camPref, setCamPref] = useState(true);

    console.log('[VideoRecorder] Rendered. Status:', status);

    useEffect(() => {
        return () => {
            dispatch({ type: 'RESET_TO_IDLE' });
        };
    }, [dispatch]);

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // When recording starts, apply the user's mic/cam preference
    useEffect(() => {
        if (status === 'recording') {
            if (isMicEnabled !== micPref) toggleMicrophone();
            if (isCameraEnabled !== camPref) toggleCamera();
        }
    }, [status]);

    const handleMicToggle = () => {
        if (status === 'idle' || status === 'stopped') {
            setMicPref((prev) => !prev);
        } else {
            toggleMicrophone();
        }
    };
    const handleCameraToggle = () => {
        if (status === 'idle' || status === 'stopped') {
            setCamPref((prev) => !prev);
        } else {
            toggleCamera();
        }
    };

    // Use pref for icon in idle/stopped, actual state otherwise
    const micOn = (status === 'idle' || status === 'stopped') ? micPref : isMicEnabled;
    const camOn = (status === 'idle' || status === 'stopped') ? camPref : isCameraEnabled;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="video-recorder">
            <h2>Video Recorder</h2>

            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="preview-video"
                />
                <div className="stream-controls">
                    <button
                        onClick={handleCameraToggle}
                        className={`stream-control-btn ${camOn ? 'active' : 'inactive'}`}
                        title={camOn ? 'Disable Camera' : 'Enable Camera'}
                        disabled={false}
                    >
                        {camOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
                    </button>
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
                {status === 'idle' && (
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

export default VideoRecorder; 