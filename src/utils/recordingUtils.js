import { ERROR_TYPES } from '../types';

export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getMediaConstraints = (type) => ({
    audio: true,
    video: type === 'video',
});

export const handleMediaError = (error) => {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return {
            type: ERROR_TYPES.PERMISSION_DENIED,
            message: 'Please allow access to your microphone/camera to use this feature.',
        };
    }

    if (error.name === 'NotSupportedError') {
        return {
            type: ERROR_TYPES.NOT_SUPPORTED,
            message: 'Your browser does not support media recording.',
        };
    }

    return {
        type: ERROR_TYPES.UNKNOWN,
        message: 'An unexpected error occurred. Please try again.',
    };
};

export const createRecordingObject = (blob, type) => ({
    id: Date.now(),
    type,
    blob,
    url: URL.createObjectURL(blob),
    timestamp: new Date().toISOString(),
    duration: 0, // This will be updated when the recording is stopped
});

export const checkMediaSupport = () => {
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasMediaRecorder = !!window.MediaRecorder;

    return {
        supported: hasGetUserMedia && hasMediaRecorder,
        error: !hasGetUserMedia || !hasMediaRecorder
            ? {
                type: ERROR_TYPES.NOT_SUPPORTED,
                message: 'Your browser does not support media recording.',
            }
            : null,
    };
}; 