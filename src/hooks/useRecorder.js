import { useCallback, useRef, useEffect } from 'react';
import { useRecordings } from '../contexts/RecordingsContext';
import {
    getMediaConstraints,
    handleMediaError,
    createRecordingObject,
    checkMediaSupport,
} from '../utils/recordingUtils';

const useRecorder = () => {
    const {
        recordingType,
        status,
        dispatch,
        duration,
    } = useRecordings();

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const isCameraEnabledRef = useRef(true);
    const isMicEnabledRef = useRef(true);

    // Ensure media support on mount
    useEffect(() => {
        const { supported, error } = checkMediaSupport();
        if (!supported) {
            console.error('Media recording not supported:', error);
            dispatch({ type: 'SET_ERROR', payload: error });
        }
    }, [dispatch]);

    // Toggle camera
    const toggleCamera = useCallback(() => {
        if (!streamRef.current) return;
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack) {
            isCameraEnabledRef.current = !isCameraEnabledRef.current;
            videoTrack.enabled = isCameraEnabledRef.current;
            console.log(`Camera ${isCameraEnabledRef.current ? 'enabled' : 'disabled'}`);
        }
    }, []);

    // Toggle microphone
    const toggleMicrophone = useCallback(() => {
        if (!streamRef.current) return;
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            isMicEnabledRef.current = !isMicEnabledRef.current;
            audioTrack.enabled = isMicEnabledRef.current;
            console.log(`Microphone ${isMicEnabledRef.current ? 'enabled' : 'disabled'}`);
        }
    }, []);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            console.log('Starting recording...');
            // Clean up any previous stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current = null;
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            chunksRef.current = [];
            isCameraEnabledRef.current = true;
            isMicEnabledRef.current = true;

            const stream = await navigator.mediaDevices.getUserMedia(
                getMediaConstraints(recordingType)
            );
            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                    console.log('Recording chunk received:', e.data.size, 'bytes');
                }
            };

            mediaRecorder.onstop = () => {
                console.log('Recording stopped, processing data...');
                const blob = new Blob(chunksRef.current, {
                    type: recordingType === 'audio' ? 'audio/webm' : 'video/webm',
                });
                const recording = createRecordingObject(blob, recordingType);
                recording.duration = duration;
                dispatch({ type: 'STOP_RECORDING', payload: recording });
                clearInterval(timerRef.current);
                timerRef.current = null;
                setTimeout(() => dispatch({ type: 'SET_RECORDING_TYPE', payload: recordingType }), 100);
                dispatch({ type: 'RESET_TO_IDLE' });
            };

            mediaRecorder.start();
            console.log('MediaRecorder started');
            dispatch({ type: 'START_RECORDING' });
            startTimeRef.current = Date.now();

            timerRef.current = setInterval(() => {
                const newDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
                dispatch({ type: 'UPDATE_DURATION', payload: newDuration });
            }, 1000);
        } catch (error) {
            console.error('Error starting recording:', error);
            const errorDetails = handleMediaError(error);
            dispatch({ type: 'SET_ERROR', payload: errorDetails });
        }
    }, [recordingType, dispatch, duration]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && (status === 'recording' || status === 'paused')) {
            console.log('Stopping recording...');
            mediaRecorderRef.current.stop();
            // Tracks will be stopped in cleanup
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [status]);

    // Pause recording
    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && status === 'recording') {
            console.log('Pausing recording...');
            mediaRecorderRef.current.pause();
            dispatch({ type: 'PAUSE_RECORDING' });
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [status, dispatch]);

    // Resume recording
    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && status === 'paused') {
            console.log('Resuming recording...');
            mediaRecorderRef.current.resume();
            dispatch({ type: 'RESUME_RECORDING' });
            // Continue timer from paused duration
            startTimeRef.current = Date.now() - duration * 1000;
            timerRef.current = setInterval(() => {
                const newDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
                dispatch({ type: 'UPDATE_DURATION', payload: newDuration });
            }, 1000);
        }
    }, [status, dispatch, duration]);

    // Download recording
    const downloadRecording = useCallback((recording) => {
        if (recording?.blob) {
            console.log('Downloading recording:', recording);
            const url = URL.createObjectURL(recording.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recording-${recording.id}.${recording.type === 'audio' ? 'webm' : 'webm'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }, []);

    // Delete recording
    const deleteRecording = useCallback((index) => {
        console.log('Deleting recording at index:', index);
        dispatch({ type: 'DELETE_RECORDING', payload: index });
    }, [dispatch]);

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            console.log('Cleaning up recorder...');
            if (mediaRecorderRef.current) {
                if (mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                }
                mediaRecorderRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log('Media track stopped during cleanup:', track.kind);
                });
                streamRef.current = null;
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            chunksRef.current = [];
        };
    }, []);

    return {
        status,
        duration,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        downloadRecording,
        deleteRecording,
        toggleCamera,
        toggleMicrophone,
        isCameraEnabled: isCameraEnabledRef.current,
        isMicEnabled: isMicEnabledRef.current,
        stream: streamRef.current,
    };
};

export default useRecorder; 