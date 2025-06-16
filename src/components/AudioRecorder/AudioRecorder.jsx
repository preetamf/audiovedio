import React from 'react';
import useRecorder from '../../hooks/useRecorder';
import './AudioRecorder.css';

const AudioRecorder = () => {
    const {
        isRecording,
        recordedBlob,
        duration,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        downloadRecording
    } = useRecorder('audio');

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="audio-recorder">
            <h2>Audio Recorder</h2>

            <div className="controls">
                {!isRecording && !recordedBlob && (
                    <button onClick={startRecording} className="record-btn">
                        Start Recording
                    </button>
                )}

                {isRecording && (
                    <>
                        <button onClick={pauseRecording} className="pause-btn">
                            Pause
                        </button>
                        <button onClick={stopRecording} className="stop-btn">
                            Stop
                        </button>
                    </>
                )}

                {!isRecording && recordedBlob && (
                    <>
                        <audio src={URL.createObjectURL(recordedBlob)} controls />
                        <button onClick={downloadRecording} className="download-btn">
                            Download Recording
                        </button>
                        <button onClick={startRecording} className="record-btn">
                            New Recording
                        </button>
                    </>
                )}
            </div>

            {isRecording && (
                <div className="recording-info">
                    <div className="recording-indicator">
                        <span className="pulse"></span>
                        Recording in progress...
                    </div>
                    <div className="duration">{formatTime(duration)}</div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder; 