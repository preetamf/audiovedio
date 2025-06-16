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

// Convert Blob to base64 string
export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Convert base64 string to Blob
export const base64ToBlob = (base64, type) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
};

// Update createRecordingObject to accept base64 and reconstruct Blob/URL
export const createRecordingObject = (blob, type, base64) => {
    let recordingBlob = blob;
    let url = '';
    if (base64) {
        recordingBlob = base64ToBlob(base64, type === 'audio' ? 'audio/webm' : 'video/webm');
        url = URL.createObjectURL(recordingBlob);
    } else if (blob) {
        url = URL.createObjectURL(blob);
    }
    return {
        id: Date.now(),
        type,
        blob: recordingBlob,
        base64: base64 || null,
        url,
        timestamp: new Date().toISOString(),
        duration: 0, // This will be updated when the recording is stopped
    };
};

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