import { useState, useRef, useCallback } from 'react';

const useRecorder = (type = 'audio') => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const startRecording = useCallback(async () => {
        try {
            const constraints = type === 'audio'
                ? { audio: true }
                : { audio: true, video: true };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: type === 'audio' ? 'audio/webm' : 'video/webm'
                });
                setRecordedBlob(blob);
                setDuration(0);
                clearInterval(timerRef.current);
            };

            mediaRecorder.start();
            setIsRecording(true);
            startTimeRef.current = Date.now();

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);

        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    }, [type]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            streamRef.current.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    }, [isRecording]);

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.pause();
            setIsRecording(false);
        }
    }, [isRecording]);

    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && !isRecording) {
            mediaRecorderRef.current.resume();
            setIsRecording(true);
        }
    }, [isRecording]);

    const downloadRecording = useCallback(() => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recording-${new Date().toISOString()}.${type === 'audio' ? 'webm' : 'webm'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }, [recordedBlob, type]);

    return {
        isRecording,
        recordedBlob,
        duration,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        downloadRecording,
        stream: streamRef.current
    };
};

export default useRecorder; 