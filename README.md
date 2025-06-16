# Media Recorder Web Application

A modern web application built with React that allows users to record audio and video from their devices. The application provides a clean and intuitive interface for recording, previewing, and downloading media files.

## Features

- **Audio Recording**
  - Record audio from microphone
  - Pause/Resume recording
  - Preview recorded audio
  - Download as .webm file
  - Recording duration display

- **Video Recording**
  - Record video with audio from camera
  - Live camera preview
  - Pause/Resume recording
  - Preview recorded video
  - Download as .webm file
  - Recording duration display

## Technologies Used

- React
- Vite
- MediaRecorder API
- Modern CSS with CSS Modules

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd media-recorder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Select between Audio or Video recording mode using the tabs
2. Click "Start Recording" to begin
3. Use Pause/Stop buttons to control the recording
4. Preview your recording
5. Download the recording using the download button

## Browser Support

The application uses the MediaRecorder API, which is supported in most modern browsers:
- Chrome 49+
- Firefox 36+
- Edge 79+
- Safari 14.1+

## Project Structure

```
src/
├── components/
│   ├── AudioRecorder/
│   │   ├── AudioRecorder.jsx
│   │   └── AudioRecorder.css
│   └── VideoRecorder/
│       ├── VideoRecorder.jsx
│       └── VideoRecorder.css
├── hooks/
│   └── useRecorder.js
├── App.jsx
└── App.css
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Documentation
- MDN Web Docs for MediaRecorder API
- Vite Documentation
