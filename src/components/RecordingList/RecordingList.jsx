import React, { useRef, useState } from 'react';
import { useRecordings } from '../../contexts/RecordingsContext';
import { formatTime } from '../../utils/recordingUtils';
import './RecordingList.css';
import { FaMicrophone, FaVideo, FaPlay, FaPause } from 'react-icons/fa';

const RecordingList = () => {
    const { recordings, dispatch } = useRecordings();
    const [playingIndex, setPlayingIndex] = useState(null);
    const audioRefs = useRef([]);
    const videoRefs = useRef([]);

    const handleDelete = (index) => {
        dispatch({ type: 'DELETE_RECORDING', payload: index });
        if (playingIndex === index) {
            setPlayingIndex(null);
        }
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

    const handleReplay = (index, type) => {
        if (playingIndex === index) {
            // Pause if already playing
            if (type === 'audio') {
                audioRefs.current[index]?.pause();
            } else {
                videoRefs.current[index]?.pause();
            }
            setPlayingIndex(null);
        } else {
            // Pause any other playing
            if (
                playingIndex !== null &&
                recordings[playingIndex] &&
                (audioRefs.current[playingIndex] || videoRefs.current[playingIndex])
            ) {
                if (recordings[playingIndex].type === 'audio') {
                    audioRefs.current[playingIndex]?.pause();
                    audioRefs.current[playingIndex].currentTime = 0;
                } else {
                    videoRefs.current[playingIndex]?.pause();
                    videoRefs.current[playingIndex].currentTime = 0;
                }
            }
            setPlayingIndex(index);
            if (type === 'audio') {
                audioRefs.current[index].currentTime = 0;
                audioRefs.current[index].play();
            } else {
                videoRefs.current[index].currentTime = 0;
                videoRefs.current[index].play();
            }
        }
    };

    const handleEnded = () => {
        setPlayingIndex(null);
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
                        <div className="recording-preview-container">
                            {recording.type === 'video' && recording.url ? (
                                <video
                                    ref={el => videoRefs.current[index] = el}
                                    src={recording.url}
                                    className="recording-preview"
                                    onEnded={handleEnded}
                                    controls={false}
                                />
                            ) : recording.type === 'audio' && recording.url ? (
                                <audio
                                    ref={el => audioRefs.current[index] = el}
                                    src={recording.url}
                                    className="recording-preview"
                                    onEnded={handleEnded}
                                    controls={false}
                                />
                            ) : null}
                            <button
                                className="replay-btn"
                                onClick={() => handleReplay(index, recording.type)}
                                title={playingIndex === index ? 'Pause' : 'Replay'}
                            >
                                {playingIndex === index ? <FaPause /> : <FaPlay />}
                            </button>
                        </div>
                        <div className="recording-info">
                            <span className="recording-type">
                                {recording.type === 'audio' ? <FaMicrophone style={{ marginRight: 4 }} /> : <FaVideo style={{ marginRight: 4 }} />}
                                {recording.type === 'audio' ? 'Audio' : 'Video'}
                            </span>
                            <span className="recording-duration">
                                {formatTime(recording.duration || 0)}
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