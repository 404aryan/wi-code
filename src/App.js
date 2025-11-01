import React, { useState } from 'react';
import { Heart, Gamepad2, Users, MessageCircle, Brain, BookOpen, TrendingUp, Phone, Star, Award, Sparkles, Home, User, Menu, X, Play, CheckCircle, ArrowRight, Zap, Shield, Clock, Target } from 'lucide-react';

// ============================================
// FEATURE REGISTRY SYSTEM
// ============================================
const FeatureRegistry = {
  features: new Map(),
  
  register(config) {
    this.features.set(config.id, {
      ...config,
      enabled: true,
      version: config.version || '1.0.0'
    });
  },
  
  getAll(category) {
    const all = Array.from(this.features.values());
    return category ? all.filter(f => f.category === category) : all;
  },
  
  get(id) {
    return this.features.get(id);
  }
};

// ============================================
// FEATURE REGISTRATIONS
// ============================================

FeatureRegistry.register({
  id: 'memory-match',
  name: 'Memory Match',
  category: 'games',
  icon: Brain,
  color: 'from-violet-500 to-purple-600',
  description: 'Boost cognitive skills with engaging memory challenges',
  targetSkills: ['memory', 'concentration', 'pattern-recognition'],
  component: 'MemoryMatchGame'
});

FeatureRegistry.register({
  id: 'emotion-detective',
  name: 'Emotion Detective',
  category: 'games',
  icon: Heart,
  color: 'from-rose-500 to-pink-600',
  description: 'Master emotional intelligence through interactive scenarios',
  targetSkills: ['emotional-intelligence', 'social-skills'],
  component: 'EmotionGame'
});

FeatureRegistry.register({
  id: 'word-builder',
  name: 'Word Builder',
  category: 'games',
  icon: BookOpen,
  color: 'from-blue-500 to-cyan-600',
  description: 'Develop speech and vocabulary with fun word puzzles',
  targetSkills: ['speech', 'vocabulary', 'communication'],
  component: 'WordBuilderGame'
});

FeatureRegistry.register({
  id: 'catch-the-stars',
  name: 'Catch the Stars',
  category: 'games',
  icon: Star,
  color: 'from-amber-500 to-orange-600',
  description: 'Enhance motor skills and hand-eye coordination',
  targetSkills: ['motor-skills', 'hand-eye-coordination'],
  component: 'CatchTheStarsGame'
});

FeatureRegistry.register({
  id: 'daily-routine',
  name: 'Daily Routine',
  category: 'activities',
  icon: Clock,
  color: 'from-emerald-500 to-teal-600',
  description: 'Build independence with structured daily schedules',
  targetSkills: ['organization', 'independence'],
  component: 'DailyRoutine'
});

FeatureRegistry.register({
  id: 'social-stories',
  name: 'Social Stories',
  category: 'activities',
  icon: Users,
  color: 'from-indigo-500 to-purple-600',
  description: 'Learn social skills through interactive storytelling',
  targetSkills: ['social-interaction', 'communication'],
  component: 'SocialStories'
});

FeatureRegistry.register({
  id: 'parent-community',
  name: 'Parent Circle',
  category: 'community',
  icon: Users,
  color: 'from-orange-500 to-red-600',
  description: 'Connect with supportive parent community',
  component: 'ParentCommunity'
});

FeatureRegistry.register({
  id: 'ai-assistant',
  name: 'AI Companion',
  category: 'support',
  icon: MessageCircle,
  color: 'from-cyan-500 to-blue-600',
  description: '24/7 intelligent guidance and personalized support',
  component: 'AIChatbot'
});

FeatureRegistry.register({
  id: 'video-consultation',
  name: 'Expert Connect',
  category: 'support',
  icon: Phone,
  color: 'from-purple-500 to-indigo-600',
  description: 'Schedule sessions with certified therapists',
  component: 'VideoConsultation'
});

FeatureRegistry.register({
  id: 'progress-dashboard',
  name: 'Progress Analytics',
  category: 'progress',
  icon: TrendingUp,
  color: 'from-green-500 to-emerald-600',
  description: 'Track growth with detailed insights and reports',
  component: 'ProgressDashboard'
});
FeatureRegistry.register({
  id: 'ai-video-coach',
  name: 'AI Video Coach',
  category: 'support',
  icon: MessageCircle,
  color: 'from-emerald-500 to-teal-600',
  description: 'Real-time AI monitoring with voice and gesture guidance',
  targetSkills: ['all-skills', 'real-time-feedback'],
  component: 'AIVideoCoach'
});

// ============================================
// FEATURE COMPONENTS
// ============================================

const MemoryMatchGame = () => {
  const [score, setScore] = useState(0);
  const [flipped, setFlipped] = useState([]);
  
  const cards = ['🎨', '🎭', '🎪', '🎬', '🎯', '🎲', '🎸', '🎹'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Memory Match</h2>
          <p className="text-gray-600 mt-1">Match pairs to boost cognitive skills</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg">
          <div className="text-sm font-medium opacity-90">Score</div>
          <div className="text-3xl font-bold">{score}</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-violet-100">
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => setScore(score + 10)}
              className="aspect-square bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center text-5xl transform hover:-translate-y-1"
            >
              {card}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-md text-center border border-gray-100">
          <div className="text-2xl font-bold text-violet-600">8/16</div>
          <div className="text-sm text-gray-600">Matches Found</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">2:45</div>
          <div className="text-sm text-gray-600">Time Elapsed</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center border border-gray-100">
          <div className="text-2xl font-bold text-pink-600">Level 3</div>
          <div className="text-sm text-gray-600">Current Level</div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl py-4 font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
          <Play className="w-5 h-5" />
          New Game
        </button>
        <button className="flex-1 bg-white border-2 border-violet-500 text-violet-600 rounded-2xl py-4 font-semibold hover:bg-violet-50 transition-all flex items-center justify-center gap-2">
          <Target className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
};

const EmotionGame = () => {
  const emotions = [
    { emoji: '😊', name: 'Happy', color: 'from-yellow-400 to-orange-400' },
    { emoji: '😢', name: 'Sad', color: 'from-blue-400 to-cyan-400' },
    { emoji: '😠', name: 'Angry', color: 'from-red-400 to-pink-400' },
    { emoji: '😨', name: 'Scared', color: 'from-purple-400 to-indigo-400' },
    { emoji: '😮', name: 'Surprised', color: 'from-green-400 to-teal-400' },
    { emoji: '😌', name: 'Calm', color: 'from-cyan-400 to-blue-400' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Emotion Detective</h2>
        <p className="text-gray-600 mt-1">Recognize and understand emotions</p>
      </div>
      
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-12 shadow-xl border border-rose-100">
        <div className="text-center mb-8">
          <div className="text-9xl mb-6 animate-bounce">😊</div>
          <p className="text-3xl font-bold text-gray-900 mb-2">How is this person feeling?</p>
          <p className="text-gray-600">Choose the correct emotion</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {emotions.map((emotion, i) => (
            <button
              key={i}
              className="bg-white rounded-2xl p-6 hover:shadow-2xl transition-all hover:scale-105 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-5xl mb-3">{emotion.emoji}</div>
              <div className="text-lg font-semibold text-gray-800">{emotion.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Progress</div>
            <div className="text-2xl font-bold text-rose-600">12/20 Correct</div>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < 3 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WordBuilderGame = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Word Builder</h2>
        <p className="text-gray-600 mt-1">Build vocabulary and speech skills</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-xl border border-blue-100">
        <div className="text-center mb-8">
          <div className="text-8xl mb-6">🍎</div>
          <div className="flex justify-center gap-3 mb-6">
            {['A', 'P', 'P', 'L', 'E'].map((letter, i) => (
              <div key={i} className="w-16 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg border border-blue-200">
                {letter}
              </div>
            ))}
          </div>
          <p className="text-xl text-gray-700 font-medium">Spell the word!</p>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {['A', 'B', 'C', 'D', 'E', 'L', 'P', 'Q', 'R', 'S'].map((letter, i) => (
            <button
              key={i}
              className="aspect-square bg-white rounded-xl flex items-center justify-center text-2xl font-bold hover:shadow-xl transition-all hover:scale-110 border border-gray-200 hover:border-blue-400"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CatchTheStarsGame = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Catch the Stars</h2>
          <p className="text-gray-600 mt-1">Enhance hand-eye coordination</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-6 py-3 rounded-2xl shadow-lg">
          <div className="text-sm font-medium opacity-90">Score</div>
          <div className="text-3xl font-bold">{score}</div>
        </div>
      </div>
      
      {!isPlaying ? (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-16 text-center shadow-xl border border-amber-100">
          <div className="text-9xl mb-8 animate-pulse">⭐</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Play?</h3>
          <p className="text-xl text-gray-600 mb-8">Catch as many stars as you can in 30 seconds!</p>
          <button
            onClick={() => setIsPlaying(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 relative h-96 overflow-hidden shadow-xl border border-amber-100">
          <div className="absolute top-4 right-4 bg-white px-6 py-3 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-amber-600">⏱️ 24s</div>
          </div>
          {[...Array(6)].map((_, i) => (
            <button
              key={i}
              onClick={() => setScore(score + 10)}
              className="absolute text-6xl animate-bounce cursor-pointer hover:scale-125 transition-transform"
              style={{ 
                left: `${Math.random() * 80}%`, 
                top: `${Math.random() * 80}%`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              ⭐
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DailyRoutine = () => {
  const routines = [
    { time: '8:00 AM', activity: 'Wake Up', icon: '🌅', done: true, color: 'from-orange-400 to-yellow-400' },
    { time: '8:30 AM', activity: 'Breakfast', icon: '🍳', done: true, color: 'from-green-400 to-teal-400' },
    { time: '9:00 AM', activity: 'Brush Teeth', icon: '🪥', done: false, color: 'from-blue-400 to-cyan-400' },
    { time: '10:00 AM', activity: 'Play Time', icon: '🎮', done: false, color: 'from-purple-400 to-pink-400' },
    { time: '12:00 PM', activity: 'Lunch', icon: '🍱', done: false, color: 'from-red-400 to-orange-400' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Daily Routine</h2>
        <p className="text-gray-600 mt-1">Stay on track with your schedule</p>
      </div>
      
      <div className="space-y-4">
        {routines.map((routine, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-5 flex items-center gap-5 transition-all hover:shadow-xl border-2 ${
              routine.done ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${routine.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
              {routine.icon}
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg text-gray-900">{routine.activity}</div>
              <div className="text-gray-600">{routine.time}</div>
            </div>
            <button className={`w-12 h-12 rounded-full ${routine.done ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white shadow-lg transition-all hover:scale-110`}>
              {routine.done && <CheckCircle className="w-6 h-6" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SocialStories = () => {
  const stories = [
    { title: 'Making Friends', icon: '👋', color: 'from-pink-500 to-rose-600', lessons: 5 },
    { title: 'Sharing Toys', icon: '🎁', color: 'from-blue-500 to-cyan-600', lessons: 4 },
    { title: 'Going to School', icon: '🏫', color: 'from-green-500 to-teal-600', lessons: 6 },
    { title: 'Family Dinner', icon: '🍽️', color: 'from-orange-500 to-red-600', lessons: 3 },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Social Stories</h2>
        <p className="text-gray-600 mt-1">Interactive social learning scenarios</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story, i) => (
          <button
            key={i}
            className="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all hover:scale-105 text-left border-2 border-gray-100 hover:border-transparent group"
          >
            <div className={`w-20 h-20 bg-gradient-to-br ${story.color} rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              {story.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
            <p className="text-gray-600 mb-4">{story.lessons} interactive lessons</p>
            <div className="flex items-center text-indigo-600 font-semibold">
              Start Learning <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ParentCommunity = () => {
  const posts = [
    { author: 'Sarah Mitchell', text: 'Amazing progress! My son completed 5 activities today. The speech therapy games are incredibly effective!', likes: 24, time: '2h ago', avatar: 'SM', color: 'from-pink-500 to-rose-600' },
    { author: 'John Davis', text: 'Looking for recommendations on motor skill activities. What worked best for your children?', likes: 15, time: '4h ago', avatar: 'JD', color: 'from-blue-500 to-cyan-600' },
    { author: 'Emily Rodriguez', text: 'Milestone achieved! First full conversation without prompts. This platform has been life-changing! 🎉', likes: 42, time: '1d ago', avatar: 'ER', color: 'from-green-500 to-teal-600' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Parent Circle</h2>
        <p className="text-gray-600 mt-1">Connect with our supportive community</p>
      </div>
      
      <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl py-4 font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Share Your Story
      </button>
      
      <div className="space-y-4">
        {posts.map((post, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${post.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-gray-900">{post.author}</div>
                  <div className="text-sm text-gray-500">{post.time}</div>
                </div>
                <p className="text-gray-700 mb-3">{post.text}</p>
                <div className="flex gap-6 text-sm">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI Companion. I\'m here to provide personalized guidance and support. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  
  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, 
      { type: 'user', text: input },
      { type: 'bot', text: 'Great question! Based on your child\'s progress, I recommend the Emotion Detective game for social skills development. Would you like me to schedule it?' }
    ]);
    setInput('');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">AI Companion</h2>
        <p className="text-gray-600 mt-1">24/7 intelligent guidance and support</p>
      </div>
      
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-6 h-96 overflow-y-auto shadow-xl border border-cyan-100">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md rounded-2xl p-4 shadow-md ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 rounded-2xl border-2 border-gray-200 px-6 py-4 focus:outline-none focus:border-cyan-400 shadow-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl px-8 font-semibold hover:shadow-xl transition-all hover:scale-105"
        >
          Send
        </button>
      </div>
    </div>
  );
};

const VideoConsultation = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Child Psychologist', rating: 4.9, experience: '15 years', avatar: '👩‍⚕️', color: 'from-purple-500 to-indigo-600' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Speech Therapist', rating: 4.8, experience: '12 years', avatar: '👨‍⚕️', color: 'from-blue-500 to-cyan-600' },
    { id: 3, name: 'Dr. Emily Brown', specialty: 'Behavioral Therapist', rating: 4.9, experience: '10 years', avatar: '👩‍⚕️', color: 'from-pink-500 to-rose-600' },
  ];
  
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Expert Connect</h2>
        <p className="text-gray-600 mt-1">Schedule sessions with certified therapists</p>
      </div>
      
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            onClick={() => setSelectedDoctor(doctor)}
            className={`w-full bg-white rounded-3xl p-6 text-left transition-all hover:shadow-2xl border-2 ${
              selectedDoctor?.id === doctor.id ? 'border-indigo-500 shadow-xl' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-20 h-20 bg-gradient-to-br ${doctor.color} rounded-2xl flex items-center justify-center text-5xl shadow-lg`}>
                {doctor.avatar}
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl text-gray-900">{doctor.name}</div>
                <div className="text-gray-600 mb-2">{doctor.specialty}</div>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1 text-yellow-600 font-medium">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {doctor.rating}
                  </span>
                  <span className="text-gray-600">{doctor.experience} experience</span>
                </div>
              </div>
              {selectedDoctor?.id === doctor.id && (
                <CheckCircle className="w-8 h-8 text-indigo-500" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {selectedDoctor && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 space-y-6 shadow-xl border border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900">Select Date & Time</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-2xl border-2 border-gray-200 px-6 py-4 focus:outline-none focus:border-indigo-400 shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Available Time Slots</label>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`rounded-2xl py-3 text-sm font-semibold transition-all ${
                    selectedTime === time
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          
          {selectedDate && selectedTime && (
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-indigo-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h4>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><User className="w-5 h-5" /> Therapist:</span>
                  <span className="font-semibold">{selectedDoctor.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> Date:</span>
                  <span className="font-semibold">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> Time:</span>
                  <span className="font-semibold">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-lg font-semibold">Session Fee:</span>
                  <span className="text-2xl font-bold text-green-600">$50</span>
                </div>
              </div>
              
              <button
                onClick={() => alert('✅ Appointment confirmed!')}
                className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-4 font-bold hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-6 h-6" />
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProgressDashboard = () => {
  const skills = [
    { name: 'Communication Skills', progress: 75, color: 'from-blue-500 to-cyan-600', icon: MessageCircle },
    { name: 'Social Interaction', progress: 60, color: 'from-green-500 to-teal-600', icon: Users },
    { name: 'Motor Skills', progress: 85, color: 'from-purple-500 to-indigo-600', icon: Zap },
    { name: 'Emotional Intelligence', progress: 70, color: 'from-pink-500 to-rose-600', icon: Heart },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Progress Analytics</h2>
        <p className="text-gray-600 mt-1">Comprehensive development tracking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="text-5xl font-bold mb-1">127</div>
          <div className="text-blue-100 font-medium">Activities Completed</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="text-5xl font-bold mb-1">42</div>
          <div className="text-green-100 font-medium">Achievements Earned</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="text-5xl font-bold mb-1">15</div>
          <div className="text-purple-100 font-medium">Day Streak</div>
        </div>
      </div>
      
      <div className="space-y-4">
        {skills.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${skill.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg text-gray-900">{skill.name}</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{skill.progress}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-1000 shadow-lg`} 
                  style={{width: `${skill.progress}%`}}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const AIVideoCoach = () => {
  const [isActive, setIsActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    encouragements: 0,
    corrections: 0,
    accuracy: 0
  });
  const [detections, setDetections] = useState({
    handPosition: 'center',
    eyeContact: true,
    posture: 'good',
    speechClarity: 'clear'
  });
  const videoRef = React.useRef(null);
  const [stream, setStream] = useState(null);

  // Simulated AI feedback messages
  const encouragementMessages = [
    "🌟 Great job! You're doing amazing!",
    "👏 Excellent focus! Keep it up!",
    "💪 You're making wonderful progress!",
    "🎯 Perfect! Your coordination is improving!",
    "✨ Fantastic effort! I'm proud of you!",
    "🏆 Outstanding work! You're a star!",
    "🎨 Beautiful hand movements!",
    "😊 Your speech is getting clearer!"
  ];

  const guidanceMessages = [
    "👀 Try to look at the screen, you're doing great!",
    "✋ Slow down a bit, take your time!",
    "🗣️ Speak a little louder, I want to hear your wonderful voice!",
    "🎯 Great attempt! Let's try that again together!",
    "💡 Remember to breathe and relax!",
    "🌈 You're almost there, keep going!"
  ];

  const startSession = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setCameraPermission(true);
      setIsActive(true);
      
      // Start AI monitoring simulation
      startAIMonitoring();
    } catch (error) {
      alert('❌ Camera access denied. Please allow camera and microphone permissions.');
      console.error('Camera error:', error);
    }
  };

  const stopSession = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsActive(false);
    setStream(null);
  };

  const startAIMonitoring = () => {
    // Simulate AI detection updates every 3 seconds
    const detectionInterval = setInterval(() => {
      if (!isActive) {
        clearInterval(detectionInterval);
        return;
      }

      // Simulate random detections
      const randomDetections = {
        handPosition: ['center', 'left', 'right', 'raised'][Math.floor(Math.random() * 4)],
        eyeContact: Math.random() > 0.3,
        posture: Math.random() > 0.2 ? 'good' : 'slouching',
        speechClarity: ['clear', 'mumbled', 'excellent'][Math.floor(Math.random() * 3)]
      };

      setDetections(randomDetections);

      // Generate appropriate feedback
      if (randomDetections.eyeContact && randomDetections.posture === 'good') {
        const msg = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setCurrentFeedback(msg);
        setSessionStats(prev => ({ ...prev, encouragements: prev.encouragements + 1 }));
      } else {
        const msg = guidanceMessages[Math.floor(Math.random() * guidanceMessages.length)];
        setCurrentFeedback(msg);
        setSessionStats(prev => ({ ...prev, corrections: prev.corrections + 1 }));
      }

      // Update session duration
      setSessionStats(prev => ({ 
        ...prev, 
        duration: prev.duration + 3,
        accuracy: Math.min(95, prev.accuracy + Math.random() * 5)
      }));
    }, 3000);

    // Initial welcome message
    setCurrentFeedback("👋 Hello! I'm your AI Coach. I'm here to help and encourage you!");
  };

  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">AI Video Coach</h2>
        <p className="text-gray-600 mt-1">Real-time monitoring with intelligent guidance and encouragement</p>
      </div>

      {!isActive ? (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 text-center shadow-xl border border-emerald-100">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 shadow-lg">
            🎥
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Start Your AI Coaching Session</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our AI coach will monitor your activities through video and provide real-time encouragement, 
            guidance for hand-eye coordination, speech clarity, and posture.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-3">👁️</div>
              <div className="font-bold text-gray-900 mb-2">Eye Tracking</div>
              <div className="text-sm text-gray-600">Monitor focus and attention</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-3">✋</div>
              <div className="font-bold text-gray-900 mb-2">Hand Coordination</div>
              <div className="text-sm text-gray-600">Track hand movements</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-3">🗣️</div>
              <div className="font-bold text-gray-900 mb-2">Voice Analysis</div>
              <div className="text-sm text-gray-600">Monitor speech clarity</div>
            </div>
          </div>
          
          <button
            onClick={startSession}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start AI Coaching
          </button>
          
          <p className="text-sm text-gray-500 mt-6">
            🔒 Your privacy is protected. Video is processed locally and never stored.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Live Video Feed */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 shadow-xl border border-emerald-100">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-96 object-cover rounded-2xl bg-gray-900 shadow-lg"
              />
              
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                LIVE
              </div>
              
              {/* Session Timer */}
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-gray-900 shadow-lg">
                ⏱️ {Math.floor(sessionStats.duration / 60)}:{(sessionStats.duration % 60).toString().padStart(2, '0')}
              </div>
              
              {/* AI Feedback Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-sm bg-opacity-95">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                    🤖
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1">AI Coach Says:</div>
                    <div className="text-xl">{currentFeedback}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Detection Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900">Hand Position</div>
                <div className="text-2xl">✋</div>
              </div>
              <div className={`text-lg font-semibold ${
                detections.handPosition === 'center' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {detections.handPosition.toUpperCase()}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900">Eye Contact</div>
                <div className="text-2xl">👁️</div>
              </div>
              <div className={`text-lg font-semibold ${
                detections.eyeContact ? 'text-green-600' : 'text-red-600'
              }`}>
                {detections.eyeContact ? 'GOOD' : 'NEEDS FOCUS'}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900">Posture</div>
                <div className="text-2xl">🧍</div>
              </div>
              <div className={`text-lg font-semibold ${
                detections.posture === 'good' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {detections.posture.toUpperCase()}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900">Speech</div>
                <div className="text-2xl">🗣️</div>
              </div>
              <div className={`text-lg font-semibold ${
                detections.speechClarity === 'excellent' ? 'text-green-600' : 
                detections.speechClarity === 'clear' ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {detections.speechClarity.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Session Statistics */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Session Statistics</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {sessionStats.encouragements}
                </div>
                <div className="text-gray-600 font-medium">Encouragements</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {sessionStats.corrections}
                </div>
                <div className="text-gray-600 font-medium">Guidance Given</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.floor(sessionStats.accuracy)}%
                </div>
                <div className="text-gray-600 font-medium">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {Math.floor(sessionStats.duration / 60)}m
                </div>
                <div className="text-gray-600 font-medium">Duration</div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            <button
              onClick={stopSession}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl py-4 font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <X className="w-6 h-6" />
              End Session
            </button>
            <button
              className="flex-1 bg-white border-2 border-emerald-500 text-emerald-600 rounded-2xl py-4 font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <Target className="w-6 h-6" />
              Pause & Review
            </button>
          </div>
        </div>
      )}

      {/* Features List */}
      {!isActive && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">What AI Coach Monitors:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '👁️', title: 'Eye Tracking & Focus', desc: 'Monitors attention span and screen engagement' },
              { icon: '✋', title: 'Hand-Eye Coordination', desc: 'Tracks hand movements and coordination accuracy' },
              { icon: '🗣️', title: 'Speech Clarity', desc: 'Analyzes pronunciation and speech patterns' },
              { icon: '🧍', title: 'Posture Monitoring', desc: 'Ensures healthy sitting position' },
              { icon: '💪', title: 'Gesture Recognition', desc: 'Detects and guides correct movements' },
              { icon: '🎯', title: 'Task Completion', desc: 'Tracks progress and provides real-time feedback' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{feature.title}</div>
                  <div className="text-sm text-gray-600">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const BrightPathApp = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [activeFeature, setActiveFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const categories = [
    { id: 'games', name: 'Games', icon: Gamepad2, color: 'from-violet-500 to-purple-600', desc: 'Interactive learning games' },
    { id: 'activities', name: 'Activities', icon: Sparkles, color: 'from-emerald-500 to-teal-600', desc: 'Daily routines & exercises' },
    { id: 'community', name: 'Community', icon: Users, color: 'from-orange-500 to-red-600', desc: 'Connect with parents' },
    { id: 'support', name: 'Support', icon: Heart, color: 'from-rose-500 to-pink-600', desc: 'Professional guidance' },
    { id: 'progress', name: 'Progress', icon: TrendingUp, color: 'from-blue-500 to-cyan-600', desc: 'Track development' },
  ];
  
  const renderFeature = () => {
    if (!activeFeature) return null;
    
    const componentMap = {
      'MemoryMatchGame': <MemoryMatchGame />,
      'EmotionGame': <EmotionGame />,
      'WordBuilderGame': <WordBuilderGame />,
      'CatchTheStarsGame': <CatchTheStarsGame />,
      'DailyRoutine': <DailyRoutine />,
      'SocialStories': <SocialStories />,
      'ParentCommunity': <ParentCommunity />,
      'AIChatbot': <AIChatbot />,
      'VideoConsultation': <VideoConsultation />,
        'AIVideoCoach': <AIVideoCoach />,
      'ProgressDashboard': <ProgressDashboard />,
    };
    
    return componentMap[activeFeature.component] || <div>Feature coming soon!</div>;
  };
  
  const renderHome = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[3rem] p-12 md:p-16 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -right-20 -top-20 text-[20rem] opacity-10">🌟</div>
        <div className="absolute -left-20 -bottom-20 text-[20rem] opacity-10">🎨</div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Trusted by 10,000+ Families
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Empowering Children Through
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Personalized Therapy
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
            AI-powered platform combining expert-designed activities, professional support, and community connection for comprehensive child development.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveSection('games')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Free Trial
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-opacity-30 transition-all border-2 border-white border-opacity-40 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Book Consultation
            </button>
          </div>
          
          <div className="flex gap-8 mt-12">
            <div>
              <div className="text-4xl font-bold">98%</div>
              <div className="text-indigo-200">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold">500+</div>
              <div className="text-indigo-200">Activities</div>
            </div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-indigo-200">AI Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Access Feature Buttons */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Explore Our Features</h2>
          <p className="text-xl text-gray-600">Everything you need in one comprehensive platform</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {FeatureRegistry.getAll().slice(0, 10).map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                className="bg-white rounded-3xl p-6 hover:shadow-2xl transition-all hover:scale-105 group border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="font-bold text-gray-900 text-sm">{feature.name}</div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* What We Do Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">What We Offer</h2>
          <p className="text-xl text-gray-600">Comprehensive solutions for every developmental need</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100 hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cognitive Development</h3>
            <p className="text-gray-700 mb-6">Engaging memory games, problem-solving activities, and pattern recognition exercises designed by child psychologists.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Memory enhancement games
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Attention span training
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Logic puzzle activities
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 border border-pink-100 hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Social & Emotional Skills</h3>
            <p className="text-gray-700 mb-6">Interactive scenarios teaching empathy, emotion recognition, and healthy social interactions with peers.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                Emotion recognition training
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                Social story scenarios
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                Friendship building activities
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border border-green-100 hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Motor Skills & Coordination</h3>
            <p className="text-gray-700 mb-6">Fun games and activities improving hand-eye coordination, fine motor skills, and physical development.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Hand-eye coordination games
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Fine motor skill exercises
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Movement tracking activities
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Categories Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Explore by Category</h2>
          <p className="text-xl text-gray-600">Choose what fits your child's needs best</p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveSection(cat.id)}
                className="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all hover:scale-105 group border-2 border-gray-100 hover:border-transparent"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-10 h-10" />
                </div>
                <div className="font-bold text-xl text-gray-900 mb-2">{cat.name}</div>
                <div className="text-sm text-gray-600">{cat.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem] p-12 border border-indigo-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Why Families Trust BrightPath</h2>
          <p className="text-xl text-gray-600">Evidence-based approach with proven results</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <Shield className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Expert Designed</h3>
            <p className="text-gray-600">Created by certified child therapists and psychologists</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">Personalized recommendations based on progress</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <Clock className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">24/7 Available</h3>
            <p className="text-gray-600">Access activities and support anytime, anywhere</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <Target className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Proven Results</h3>
            <p className="text-gray-600">98% of families report significant improvement</p>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Success Stories</h2>
          <p className="text-xl text-gray-600">Hear from our amazing community</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Sarah Mitchell', role: 'Parent', text: 'BrightPath transformed our daily routine. My son now looks forward to therapy sessions!', rating: 5, color: 'from-pink-500 to-rose-600' },
            { name: 'John Davis', role: 'Parent', text: 'The progress tracking feature helps us celebrate every milestone. Highly recommended!', rating: 5, color: 'from-blue-500 to-cyan-600' },
            { name: 'Emily Rodriguez', role: 'Parent', text: 'Finally, a platform that understands our needs. The community support is invaluable.', rating: 5, color: 'from-green-500 to-teal-600' },
          ].map((testimonial, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg">{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start the Journey?</h2>
        <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of families experiencing transformative growth
        </p>
        <button className="bg-white text-indigo-600 px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          Start Free 14-Day Trial
        </button>
        <p className="text-indigo-200 mt-6">No credit card required • Cancel anytime</p>
      </div>
    </div>
  );
  
  const renderCategory = () => {
    const features = FeatureRegistry.getAll(activeSection);
    const category = categories.find(c => c.id === activeSection);
    
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveSection('home')}
            className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2 transition-all"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Back to Home
          </button>
        </div>
        
        <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-12 text-white shadow-2xl`}>
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              {React.createElement(category.icon, { className: "w-10 h-10" })}
            </div>
            <div>
              <h2 className="text-5xl font-bold capitalize">{activeSection}</h2>
              <p className="text-xl text-white text-opacity-90 mt-2">{category.desc}</p>
            </div>
          </div>
          <p className="text-lg text-white text-opacity-80">{features.length} activities available</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 text-left border-2 border-gray-100 hover:border-transparent group"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.name}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    {feature.targetSkills && (
                      <div className="flex flex-wrap gap-2">
                        {feature.targetSkills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {skill.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('home')}>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                B
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  BrightPath
                </span>
                <div className="text-xs text-gray-500 font-medium">Therapy Platform</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveSection(cat.id)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    activeSection === cat.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-all hidden md:block">
                <Award className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>
              <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105">
                <User className="w-5 h-5" />
                My Account
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveSection(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all text-left"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {activeFeature ? (
          <div className="space-y-6">
            <button
              onClick={() => setActiveFeature(null)}
              className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2 transition-all"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back
            </button>
            {renderFeature()}
          </div>
        ) : activeSection === 'home' ? (
          renderHome()
        ) : (
          renderCategory()
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  B
                </div>
                <span className="text-xl font-bold text-gray-900">BrightPath</span>
              </div>
              <p className="text-gray-600">Empowering children through personalized therapy and support.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Games</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Activities</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>© 2024 BrightPath. All rights reserved. Made with ❤️ for families everywhere.</p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 shadow-2xl z-50">
        <div className="flex justify-around">
          <button
            onClick={() => { setActiveSection('home'); setActiveFeature(null); }}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              activeSection === 'home' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button
            onClick={() => { setActiveSection('games'); setActiveFeature(null); }}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              activeSection === 'games' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'
            }`}
          >
            <Gamepad2 className="w-6 h-6" />
            <span className="text-xs font-semibold">Games</span>
          </button>
          <button
            onClick={() => { setActiveSection('community'); setActiveFeature(null); }}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              activeSection === 'community' ? 'bg-orange-100 text-orange-600' : 'text-gray-600'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-semibold">Community</span>
          </button>
          <button
            onClick={() => { setActiveSection('progress'); setActiveFeature(null); }}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              activeSection === 'progress' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-semibold">Progress</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BrightPathApp;