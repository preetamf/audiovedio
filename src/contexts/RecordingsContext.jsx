import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { RECORDING_TYPES, RECORDING_STATUS, ERROR_TYPES } from '../types';

const RecordingsContext = createContext();

const initialState = {
    recordings: [],
    currentRecording: null,
    recordingType: RECORDING_TYPES.AUDIO,
    status: RECORDING_STATUS.IDLE,
    error: null,
    duration: 0,
};

const recordingsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_RECORDING_TYPE':
            return {
                ...state,
                recordingType: action.payload,
                error: null,
            };

        case 'START_RECORDING':
            return {
                ...state,
                status: RECORDING_STATUS.RECORDING,
                error: null,
                duration: 0,
            };

        case 'PAUSE_RECORDING':
            return {
                ...state,
                status: RECORDING_STATUS.PAUSED,
            };

        case 'RESUME_RECORDING':
            return {
                ...state,
                status: RECORDING_STATUS.RECORDING,
            };

        case 'STOP_RECORDING':
            return {
                ...state,
                status: RECORDING_STATUS.STOPPED,
                currentRecording: action.payload,
                recordings: [...state.recordings, action.payload],
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                status: RECORDING_STATUS.IDLE,
            };

        case 'UPDATE_DURATION':
            return {
                ...state,
                duration: action.payload,
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        case 'DELETE_RECORDING':
            return {
                ...state,
                recordings: state.recordings.filter((_, index) => index !== action.payload),
            };

        default:
            return state;
    }
};

export const RecordingsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(recordingsReducer, initialState);

    // Load recordings from localStorage on mount
    useEffect(() => {
        const savedRecordings = localStorage.getItem('recordings');
        if (savedRecordings) {
            const parsedRecordings = JSON.parse(savedRecordings);
            parsedRecordings.forEach((recording) => {
                dispatch({ type: 'STOP_RECORDING', payload: recording });
            });
        }
    }, []);

    // Save recordings to localStorage when they change
    useEffect(() => {
        localStorage.setItem('recordings', JSON.stringify(state.recordings));
    }, [state.recordings]);

    const value = {
        ...state,
        dispatch,
    };

    return (
        <RecordingsContext.Provider value={value}>
            {children}
        </RecordingsContext.Provider>
    );
};

export const useRecordings = () => {
    const context = useContext(RecordingsContext);
    if (!context) {
        throw new Error('useRecordings must be used within a RecordingsProvider');
    }
    return context;
}; 