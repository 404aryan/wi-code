import React, { useState, useRef, useEffect } from 'react';
import { Play, X, MessageCircle, TrendingUp, CheckCircle, Target, Clock, Mic, MicOff, Volume2, Download, BarChart3 } from 'lucide-react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import OpenAI from 'openai';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AIVideoCoach = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState('waiting');
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    accuracy: 0,
    encouragements: 0
  });
  const [poseData, setPoseData] = useState({
    leftHandRaised: false,
    rightHandRaised: false,
    sitting: false,
    standing: true,
    bothHandsRaised: false
  });
  const [feedback, setFeedback] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const poseRef = useRef(null);
  const recognitionRef = useRef(null);
  const openaiRef = useRef(null);

  // Initialize OpenAI (optional - can work without it)
  useEffect(() => {
    // You would set your API key in environment variables
    // For now, we'll use a mock response
    openaiRef.current = null; // Set to null to use mock mode
  }, []);

  const taskLibrary = [
    { id: 1, instruction: "Raise your right hand up high", check: (pose) => pose.rightHandRaised, difficulty: 1 },
    { id: 2, instruction: "Raise your left hand up high", check: (pose) => pose.leftHandRaised, difficulty: 1 },
    { id: 3, instruction: "Raise both hands above your head", check: (pose) => pose.bothHandsRaised, difficulty: 2 },
    { id: 4, instruction: "Wave with your right hand", check: (pose) => pose.rightHandRaised, difficulty: 2 },
    { id: 5, instruction: "Touch your nose with your right hand", check: (pose) => pose.rightHandRaised, difficulty: 3 },
    { id: 6, instruction: "Stand up straight and tall", check: (pose) => pose.standing, difficulty: 1 },
    { id: 7, instruction: "Clap your hands together", check: (pose) => pose.bothHandsRaised, difficulty: 2 },
    { id: 8, instruction: "Bend your knees and squat down", check: (pose) => pose.sitting, difficulty: 2 },
    { id: 9, instruction: "Raise your hands and jump", check: (pose) => pose.bothHandsRaised, difficulty: 3 },
    { id: 10, instruction: "Touch your shoulders with both hands", check: (pose) => pose.bothHandsRaised, difficulty: 2 },
  ];

  const speak = async (text) => {
    if (!text || text.trim() === '') return;
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Small delay to ensure cancellation completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🔊 Speaking:', text);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('🔊 Finished speaking');
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Speech error:', event.error);
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, { type: 'bot', text, timestamp: new Date() }]);
  };

  const getAIResponse = async (userText) => {
    // Mock AI responses for now (can integrate OpenAI later)
    const responses = {
      'hello': ["Hello! I'm your AI coach. Let's get started with some exercises!",
                "Hi there! Ready to begin your session?",
                "Great to see you! Let's work on some movements today!"],
      'tired': ["That's okay! Take a rest. You've been doing great!",
                "Let's take a short break. You're making excellent progress!",
                "Rest is important! When you're ready, we can continue."],
      'help': ["I'll guide you through each movement step by step.",
               "Just follow my instructions. I'll help you every step of the way!",
               "Don't worry! I'm here to help you learn and improve."],
      'done': ["Amazing work today! You completed all tasks successfully!",
               "Great session! You should be proud of your progress!",
               "Excellent job! You're getting stronger every day!"],
    };
    
    const lowerText = userText.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerText.includes(key)) {
        return value[Math.floor(Math.random() * value.length)];
      }
    }
    
    return "I'm here to help you through your exercises. Let's keep going!";
  };

  const startListening = () => {
    if (!micEnabled || !isActive) return;
    
    // Stop any existing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Stopping existing recognition');
      }
    }
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('🎤 Speech recognition started');
      };
      
      recognitionRef.current.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
        // Only restart if still active and mic enabled
        if (isActive && micEnabled) {
          setTimeout(() => {
            if (isActive && micEnabled) {
              startListening();
            }
          }, 500);
        }
      };

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log('🎤 User said:', transcript);
        
        setConversationHistory(prev => [...prev, { type: 'user', text: transcript, timestamp: new Date() }]);
        
        const response = await getAIResponse(transcript);
        await speak(response);
        setFeedback(`💬 ${response}`);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        
        // Don't restart on certain errors
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          console.log('Not restarting due to error type');
        } else if (isActive && micEnabled) {
          setTimeout(() => {
            if (isActive && micEnabled) {
              startListening();
            }
          }, 1000);
        }
      };

      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('❌ Failed to start recognition:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const initializePose = async () => {
    try {
      const pose = new Pose({
        locateFile: (file) => {
          // First try local package, fallback to CDN if needed
          if (file.includes('pose_landmark')) {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        enableSegmentation: false,
        // Additional options for better offline performance
        staticImageMode: false,
        enableSegmentationMask: false
      });

      pose.onResults(onPoseResults);
      poseRef.current = pose;

      console.log('✅ MediaPipe Pose initialized successfully (offline mode)');
      return pose;
    } catch (error) {
      console.error('❌ MediaPipe initialization failed:', error);
      alert('Failed to initialize pose detection. Please refresh the page.');
      return null;
    }
  };

  const onPoseResults = (results) => {
    if (!results.poseLandmarks) {
      // Draw video frame even without pose detection
      if (canvasRef.current && videoRef.current) {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.restore();
      }
      return;
    }

    const landmarks = results.poseLandmarks;
    
    // Draw on canvas
    if (canvasRef.current && videoRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Draw the video frame - use results.image if available, otherwise use videoRef
      const imageSource = results.image || videoRef.current;
      canvasCtx.drawImage(imageSource, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Draw the pose landmarks
      drawConnectors(canvasCtx, landmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4
      });
      drawLandmarks(canvasCtx, landmarks, {
        color: '#FF0000',
        lineWidth: 2,
        radius: 6
      });
      
      canvasCtx.restore();
    }

    // Analyze pose
    analyzePose(landmarks);
  };

  const analyzePose = (landmarks) => {
    try {
      // Get key body landmarks with visibility checks
      const leftWrist = landmarks[15];
      const rightWrist = landmarks[16];
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const nose = landmarks[0];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      const leftAnkle = landmarks[27];
      const rightAnkle = landmarks[28];

      // Validate visibility (MediaPipe provides visibility scores)
      const isLeftVisible = leftWrist.visibility && leftShoulder.visibility > 0.5;
      const isRightVisible = rightWrist.visibility && rightShoulder.visibility > 0.5;
      const isBodyVisible = leftHip.visibility && rightHip.visibility > 0.5;

      // Check if hands are raised with visibility check
      const leftHandRaised = isLeftVisible && leftWrist.y < leftShoulder.y - 0.1;
      const rightHandRaised = isRightVisible && rightWrist.y < rightShoulder.y - 0.1;
      const bothHandsRaised = leftHandRaised && rightHandRaised;

      // Check posture with visibility checks
      const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const avgHipY = (leftHip.y + rightHip.y) / 2;
      const avgAnkleY = (leftAnkle.y + rightAnkle.y) / 2;
      
      const standing = isBodyVisible && avgHipY > avgShoulderY + 0.2 && avgAnkleY > avgHipY + 0.15;
      const sitting = isBodyVisible && (!standing || avgHipY < avgAnkleY + 0.3);

      const newPoseData = {
        leftHandRaised,
        rightHandRaised,
        bothHandsRaised,
        sitting,
        standing
      };

      setPoseData(newPoseData);

      // Check task completion with debouncing
      if (currentTask && taskStatus === 'performing') {
        if (currentTask.check(newPoseData)) {
          // Only complete if pose is held for a moment (prevent accidental triggers)
          clearTimeout(window.taskCompletionTimeout);
          window.taskCompletionTimeout = setTimeout(() => {
            completeTask(true);
          }, 500); // Require 500ms hold
        } else {
          clearTimeout(window.taskCompletionTimeout);
        }
      }
    } catch (error) {
      console.error('Error analyzing pose:', error);
    }
  };

  const startSession = async () => {
    try {
      console.log('🎥 Requesting camera and microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1280, 
          height: 720,
          facingMode: 'user'
        }, 
        audio: micEnabled 
      });
      
      console.log('✅ Media stream obtained successfully');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await videoRef.current.play();
        
        // Set canvas dimensions
        if (canvasRef.current && videoRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
        
        console.log('🎯 Initializing MediaPipe Pose...');
        const pose = await initializePose();
        
        if (pose && videoRef.current) {
          console.log('📹 Starting camera processing...');
          cameraRef.current = new Camera(videoRef.current, {
            onFrame: async () => {
              if (poseRef.current && videoRef.current.readyState === 4) {
                await poseRef.current.send({ image: videoRef.current });
              }
            },
            width: 1280,
            height: 720
          });
          
          cameraRef.current.start();
          console.log('✅ Camera processing started');
        } else {
          console.error('❌ Failed to initialize pose detection');
          alert('Failed to initialize pose detection. Please refresh and try again.');
          return;
        }
      }
      
      setIsActive(true);
      console.log('🎉 AI Video Coach session started successfully!');
      
      if (micEnabled) {
        startListening();
      }
      
      speak("Hello! Welcome to your AI coaching session. I'm here to guide you through some fun exercises!");
      setFeedback("👋 Welcome! Let's begin your session!");
      
      setTimeout(() => {
        assignNewTask();
      }, 3000);
      
    } catch (error) {
      console.error('❌ Media setup error:', error);
      if (error.name === 'NotAllowedError') {
        alert('❌ Camera/Microphone access denied. Please allow permissions and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('❌ No camera found. Please connect a camera and try again.');
      } else {
        alert('❌ Failed to start session. Please try again.');
      }
    }
  };

  const assignNewTask = () => {
    const difficulty = Math.min(3, Math.floor(sessionStats.tasksCompleted / 3) + 1);
    const availableTasks = taskLibrary.filter(t => t.difficulty <= difficulty);
    const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
    
    setCurrentTask(randomTask);
    setTaskStatus('performing');
    
    speak(randomTask.instruction);
    setFeedback(`🎯 ${randomTask.instruction}`);
  };

  const completeTask = (success) => {
    setTaskStatus(success ? 'success' : 'failed');
    
    if (success) {
      const encouragements = [
        "Excellent work! You did it perfectly!",
        "Amazing! You're getting so good at this!",
        "Wonderful! That was fantastic!",
        "Great job! You nailed it!",
        "Perfect! You're a superstar!",
        "Outstanding! Keep it up!",
        "Fantastic! You're improving every day!"
      ];
      
      const message = encouragements[Math.floor(Math.random() * encouragements.length)];
      speak(message);
      setFeedback(`✅ ${message}`);
      
      const newAccuracy = Math.min(100, sessionStats.accuracy + 5);
      setSessionStats(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
        encouragements: prev.encouragements + 1,
        accuracy: newAccuracy
      }));

      // Save task completion data
      setSessionData(prev => [...prev, {
        taskId: currentTask.id,
        task: currentTask.instruction,
        completed: true,
        timestamp: new Date(),
        accuracy: newAccuracy
      }]);

      // Store in localStorage
      const progressData = JSON.parse(localStorage.getItem('sessionProgress') || '[]');
      progressData.push({
        taskId: currentTask.id,
        task: currentTask.instruction,
        completed: true,
        timestamp: new Date().toISOString(),
        accuracy: newAccuracy
      });
      localStorage.setItem('sessionProgress', JSON.stringify(progressData));
      
    } else {
      speak("That's okay! Let's try again. Take your time, you can do this!");
      setFeedback("💪 Don't worry! Let's try once more!");
      
      setSessionStats(prev => ({
        ...prev,
        tasksFailed: prev.tasksFailed + 1
      }));
    }
    
    setTimeout(() => {
      assignNewTask();
    }, 3000);
  };

  const stopSession = () => {
    console.log('🛑 Stopping AI Video Coach session...');
    
    // Clear any pending task completion timeouts
    clearTimeout(window.taskCompletionTimeout);
    
    // Stop camera processing
    if (cameraRef.current) {
      cameraRef.current.stop();
      console.log('📹 Camera processing stopped');
    }
    
    // Stop all media tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log('🎥 Track stopped:', track.kind);
      });
      videoRef.current.srcObject = null;
    }
    
    // Stop voice recognition
    stopListening();
    
    // Cancel any speaking
    window.speechSynthesis.cancel();
    
    // Clear pose reference
    poseRef.current = null;
    
    setIsActive(false);
    setCurrentTask(null);
    
    // Speak final message
    speak("Great session! You did an amazing job today!");
    
    // Save final session stats
    const finalStats = {
      ...sessionStats,
      endTime: new Date().toISOString(),
      totalTasks: sessionStats.tasksCompleted + sessionStats.tasksFailed
    };
    
    const allSessions = JSON.parse(localStorage.getItem('allSessions') || '[]');
    allSessions.push(finalStats);
    localStorage.setItem('allSessions', JSON.stringify(allSessions));
    
    console.log('✅ Session saved successfully');
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    if (!micEnabled) {
      startListening();
    } else {
      stopListening();
    }
  };

  const exportProgress = () => {
    const progressData = JSON.parse(localStorage.getItem('sessionProgress') || '[]');
    const blob = new Blob([JSON.stringify(progressData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Session timer
  useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => {
        setSessionStats(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      stopListening();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Get progress data from localStorage
  const getProgressData = () => {
    const allProgress = JSON.parse(localStorage.getItem('sessionProgress') || '[]');
    const allSessions = JSON.parse(localStorage.getItem('allSessions') || '[]');
    
    return { allProgress, allSessions };
  };

  const renderProgressReport = () => {
    const { allProgress, allSessions } = getProgressData();
    
    // Prepare chart data
    const taskProgress = allProgress.slice(-10);
    const labels = taskProgress.map((_, i) => `Task ${i + 1}`);
    const successData = taskProgress.map(p => p.completed ? 1 : 0);
    
    const sessionsData = allSessions.slice(-7);
    const sessionLabels = sessionsData.map((_, i) => `Session ${i + 1}`);
    const accuracyData = sessionsData.map(s => s.accuracy || 0);
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Task Completion Progress</h3>
          <Line
            data={{
              labels: labels,
              datasets: [{
                label: 'Task Success',
                data: successData,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 1,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Accuracy Over Sessions</h3>
          <Bar
            data={{
              labels: sessionLabels,
              datasets: [{
                label: 'Accuracy %',
                data: accuracyData,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="text-4xl font-bold mb-2">{allSessions.length}</div>
            <div className="text-green-100 font-medium">Total Sessions</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="text-4xl font-bold mb-2">{allProgress.length}</div>
            <div className="text-blue-100 font-medium">Tasks Completed</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="text-4xl font-bold mb-2">
              {allSessions.length > 0 
                ? Math.round(allSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / allSessions.length)
                : 0}%
            </div>
            <div className="text-purple-100 font-medium">Average Accuracy</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">AI Video Coach</h2>
        <p className="text-gray-600 mt-1">Real-time motion tracking with intelligent voice guidance</p>
      </div>

      {!isActive ? (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 text-center shadow-xl border border-emerald-100">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 shadow-lg animate-pulse">
            🤖
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Advanced AI Coach</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience cutting-edge computer vision and voice AI. I'll track your movements in real-time, 
            give you tasks, and provide instant feedback through voice and visual cues.
          </p>
          
          <div className="grid md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-3">🎯</div>
              <div className="font-bold text-gray-900 mb-2">Pose Detection</div>
              <div className="text-sm text-gray-600">MediaPipe tracking</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-3">🗣️</div>
              <div className="font-bold text-gray-900 mb-2">Voice Interaction</div>
              <div className="text-sm text-gray-600">Speak and listen</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-3">✅</div>
              <div className="font-bold text-gray-900 mb-2">Task System</div>
              <div className="text-sm text-gray-600">Dynamic exercises</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-3">📊</div>
              <div className="font-bold text-gray-900 mb-2">Progress Reports</div>
              <div className="text-sm text-gray-600">Track improvements</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setShowProgress(true)}
              className="bg-white border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Progress
            </button>
            <button
              onClick={exportProgress}
              className="bg-white border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
          </div>
          
          <button
            onClick={startSession}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Advanced Session
          </button>
          
          <p className="text-sm text-gray-500 mt-6">
            🔒 All processing happens locally. Your privacy is fully protected.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Video Feed with Pose Overlay */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 shadow-xl border border-emerald-100">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-96 object-cover rounded-2xl bg-gray-900 shadow-lg hidden"
              />
              
              <canvas
                ref={canvasRef}
                className="w-full h-96 object-cover rounded-2xl bg-gray-900 shadow-lg"
              />
              
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                LIVE AI TRACKING
              </div>
              
              {/* Timer */}
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-gray-900 shadow-lg">
                ⏱️ {Math.floor(sessionStats.duration / 60)}:{(sessionStats.duration % 60).toString().padStart(2, '0')}
              </div>
              
              {/* Voice Status */}
              {(isSpeaking || isListening) && (
                <div className="absolute top-16 left-4 bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                  {isSpeaking && <Volume2 className="w-4 h-4" />}
                  {isListening && <Mic className="w-4 h-4" />}
                  {isSpeaking && <span>Speaking...</span>}
                  {isListening && <span>Listening...</span>}
                </div>
              )}
              
              {/* Current Task */}
              {currentTask && (
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-95 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-2xl text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {currentTask.instruction}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${taskStatus === 'performing' ? 'bg-yellow-500 animate-pulse' : taskStatus === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-600">
                      {taskStatus === 'performing' ? 'Try it now!' : taskStatus === 'success' ? 'Perfect!' : 'Try again!'}
                    </span>
                  </div>
                </div>
              )}
              
              {/* AI Feedback */}
              <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-sm bg-opacity-95">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                    🤖
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1">AI Coach:</div>
                    <div className="text-xl">{feedback}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pose Detection Status */}
          <div className="grid md:grid-cols-5 gap-4">
            <div className={`rounded-2xl p-6 shadow-lg border-2 ${poseData.leftHandRaised ? 'bg-green-100 border-green-500' : 'bg-white border-gray-200'}`}>
              <div className="text-3xl mb-2">👈</div>
              <div className="font-bold text-gray-900 text-sm">Left Hand</div>
              <div className={`text-lg font-semibold ${poseData.leftHandRaised ? 'text-green-600' : 'text-gray-400'}`}>
                {poseData.leftHandRaised ? 'RAISED' : 'Down'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 shadow-lg border-2 ${poseData.rightHandRaised ? 'bg-green-100 border-green-500' : 'bg-white border-gray-200'}`}>
              <div className="text-3xl mb-2">👉</div>
              <div className="font-bold text-gray-900 text-sm">Right Hand</div>
              <div className={`text-lg font-semibold ${poseData.rightHandRaised ? 'text-green-600' : 'text-gray-400'}`}>
                {poseData.rightHandRaised ? 'RAISED' : 'Down'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 shadow-lg border-2 ${poseData.bothHandsRaised ? 'bg-green-100 border-green-500' : 'bg-white border-gray-200'}`}>
              <div className="text-3xl mb-2">🙌</div>
              <div className="font-bold text-gray-900 text-sm">Both Hands</div>
              <div className={`text-lg font-semibold ${poseData.bothHandsRaised ? 'text-green-600' : 'text-gray-400'}`}>
                {poseData.bothHandsRaised ? 'RAISED' : 'Down'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 shadow-lg border-2 ${poseData.standing ? 'bg-green-100 border-green-500' : 'bg-white border-gray-200'}`}>
              <div className="text-3xl mb-2">🧍</div>
              <div className="font-bold text-gray-900 text-sm">Posture</div>
              <div className={`text-lg font-semibold ${poseData.standing ? 'text-green-600' : 'text-blue-600'}`}>
                {poseData.standing ? 'STANDING' : 'Sitting'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 shadow-lg border-2 ${taskStatus === 'success' ? 'bg-green-100 border-green-500' : 'bg-white border-gray-200'}`}>
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold text-gray-900 text-sm">Task Status</div>
              <div className={`text-lg font-semibold ${
                taskStatus === 'success' ? 'text-green-600' : 
                taskStatus === 'performing' ? 'text-yellow-600' : 'text-gray-400'
              }`}>
                {taskStatus.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Session Statistics */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Session Performance</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-emerald-600 mb-2">
                  {sessionStats.tasksCompleted}
                </div>
                <div className="text-gray-600 font-medium">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {sessionStats.encouragements}
                </div>
                <div className="text-gray-600 font-medium">Encouragements</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {Math.floor(sessionStats.accuracy)}%
                </div>
                <div className="text-gray-600 font-medium">Accuracy Score</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">
                  {currentTask ? currentTask.difficulty : 1}
                </div>
                <div className="text-gray-600 font-medium">Difficulty Level</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={stopSession}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl py-4 font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <X className="w-6 h-6" />
              End Session & Save Report
            </button>
            <button
              onClick={toggleMic}
              className={`flex-1 rounded-2xl py-4 font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 ${
                micEnabled 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              {micEnabled ? 'Microphone On' : 'Microphone Off'}
            </button>
          </div>
        </div>
      )}

      {/* Progress Report Modal */}
      {showProgress && !isActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900">Progress Reports</h3>
              <button
                onClick={() => setShowProgress(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {renderProgressReport()}
          </div>
        </div>
      )}

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            Conversation History
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {conversationHistory.slice(-5).map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md rounded-2xl p-3 ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="text-sm font-medium opacity-90 mb-1">
                    {msg.type === 'user' ? 'You' : 'AI Coach'}
                  </div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIVideoCoach;

