import React, { useRef, useEffect } from 'react';
import useRecorder from '../../hooks/useRecorder';
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
        downloadRecording,
        toggleCamera,
        toggleMicrophone,
        isCameraEnabled,
        isMicEnabled,
        stream
    } = useRecorder();

    console.log('[VideoRecorder] Rendered. Status:', status);

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

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
                        onClick={toggleCamera}
                        className={`control-btn ${isCameraEnabled ? 'active' : 'inactive'}`}
                        title={isCameraEnabled ? 'Disable Camera' : 'Enable Camera'}
                    >
                        {isCameraEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
                    </button>
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