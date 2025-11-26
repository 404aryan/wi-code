import React, { useState, useEffect } from 'react';
import { Heart, Gamepad2, Users, MessageCircle, Brain, BookOpen, TrendingUp, Phone, Star, Award, Sparkles, Home, User, Menu, X, Play, CheckCircle, ArrowRight, Zap, Shield, Clock, Target, LogOut } from 'lucide-react';
import AIVideoCoach from './components/AIVideoCoach';
import Auth from './components/Auth';

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
  const [matched, setMatched] = useState([]);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [level, setLevel] = useState(1);
  
  const emojis = ['🎨', '🎭', '🎪', '🎬', '🎯', '🎲', '🎸', '🎹'];
  
  const startNewGame = () => {
    // Create pairs of cards
    const pairs = [...emojis.slice(0, 4 + level), ...emojis.slice(0, 4 + level)];
    // Shuffle
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setTime(0);
    setGameStarted(true);
  };
  
  const handleCardClick = (index) => {
    if (flipped.length === 2 || matched.includes(index) || flipped.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        // Match found!
        setMatched([...matched, first, second]);
        setScore(score + 20);
        setFlipped([]);
        
        // Check if all matched
        if (matched.length + 2 === cards.length) {
          setScore(score + 50);
        }
      } else {
        // No match
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };
  
  React.useEffect(() => {
    if (gameStarted && matched.length < cards.length) {
      const timer = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    } else if (matched.length === cards.length && cards.length > 0) {
      // Level complete
      setTimeout(() => {
        setLevel(level + 1);
        alert(`Great! Level ${level} complete! Starting level ${level + 1}...`);
        startNewGame();
      }, 2000);
    }
  }, [gameStarted, time, matched.length]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
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
      
      {!gameStarted ? (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-12 text-center shadow-xl border border-violet-100">
          <div className="text-6xl mb-6">🧠</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Play?</h3>
          <p className="text-xl text-gray-600 mb-8">Match the pairs to win! Flip cards to reveal them.</p>
          <button 
            onClick={startNewGame}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>
      ) : (
        <>
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-violet-100">
        <div className="grid grid-cols-4 gap-4">
              {cards.map((card, i) => {
                const isFlipped = flipped.includes(i);
                const isMatched = matched.includes(i);
                
                return (
            <button
              key={i}
                    onClick={() => handleCardClick(i)}
                    disabled={isMatched || isFlipped}
                    className={`aspect-square bg-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center text-5xl transform ${
                      isMatched ? 'bg-green-100 border-2 border-green-500' : ''
                    } ${isFlipped ? 'scale-95' : 'hover:shadow-2xl hover:-translate-y-1'}`}
                  >
                    {isFlipped || isMatched ? card : '❓'}
            </button>
                );
              })}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-md text-center border border-gray-100">
              <div className="text-2xl font-bold text-violet-600">{matched.length / 2}/{(cards.length) / 2}</div>
          <div className="text-sm text-gray-600">Matches Found</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{formatTime(time)}</div>
          <div className="text-sm text-gray-600">Time Elapsed</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center border border-gray-100">
              <div className="text-2xl font-bold text-pink-600">Level {level}</div>
          <div className="text-sm text-gray-600">Current Level</div>
        </div>
      </div>
      
      <div className="flex gap-4">
            <button 
              onClick={startNewGame}
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl py-4 font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
          <Play className="w-5 h-5" />
          New Game
        </button>
            <button 
              onClick={() => setLevel(level === 1 ? 2 : 1)}
              className="flex-1 bg-white border-2 border-violet-500 text-violet-600 rounded-2xl py-4 font-semibold hover:bg-violet-50 transition-all flex items-center justify-center gap-2"
            >
          <Target className="w-5 h-5" />
              Change Level
        </button>
      </div>
        </>
      )}
    </div>
  );
};

const EmotionGame = () => {
  const allEmotions = [
    { emoji: '😊', name: 'Happy', color: 'from-yellow-400 to-orange-400' },
    { emoji: '😢', name: 'Sad', color: 'from-blue-400 to-cyan-400' },
    { emoji: '😠', name: 'Angry', color: 'from-red-400 to-pink-400' },
    { emoji: '😨', name: 'Scared', color: 'from-purple-400 to-indigo-400' },
    { emoji: '😮', name: 'Surprised', color: 'from-green-400 to-teal-400' },
    { emoji: '😌', name: 'Calm', color: 'from-cyan-400 to-blue-400' },
  ];
  
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const startGame = () => {
    setGameStarted(true);
    generateNewQuestion();
  };
  
  const generateNewQuestion = () => {
    const random = allEmotions[Math.floor(Math.random() * allEmotions.length)];
    setCurrentEmotion(random);
  };
  
  const handleAnswer = (selected) => {
    const correct = selected.name === currentEmotion.name;
    setTotal(total + 1);
    
    if (correct) {
      setScore(score + 1);
      alert('✅ Correct! Well done!');
    } else {
      alert(`❌ Try again! The correct answer is ${currentEmotion.name}.`);
    }
    
    setTimeout(() => generateNewQuestion(), 1000);
  };
  
  if (!gameStarted) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-12 text-center shadow-xl border border-rose-100">
          <div className="text-6xl mb-6">🎭</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Play Emotion Detective?</h3>
          <p className="text-xl text-gray-600 mb-8">Identify emotions from emojis. Are you up for the challenge?</p>
          <button 
            onClick={startGame}
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Emotion Detective</h2>
        <p className="text-gray-600 mt-1">Recognize and understand emotions</p>
      </div>
      
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-12 shadow-xl border border-rose-100">
        <div className="text-center mb-8">
          <div className="text-9xl mb-6 animate-bounce">{currentEmotion?.emoji}</div>
          <p className="text-3xl font-bold text-gray-900 mb-2">How is this person feeling?</p>
          <p className="text-gray-600">Choose the correct emotion</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allEmotions.map((emotion, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(emotion)}
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
            <div className="text-2xl font-bold text-rose-600">{score}/{total} Correct</div>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-8 h-8 ${i < Math.floor((score/total) * 5) && total > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={startGame}
          className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl py-4 font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          New Game
        </button>
      </div>
    </div>
  );
};

const WordBuilderGame = () => {
  const words = [
    { word: 'APPLE', emoji: '🍎', letters: ['A', 'P', 'P', 'L', 'E'] },
    { word: 'BOOK', emoji: '📚', letters: ['B', 'O', 'O', 'K'] },
    { word: 'CAT', emoji: '🐱', letters: ['C', 'A', 'T'] },
    { word: 'DOG', emoji: '🐶', letters: ['D', 'O', 'G'] },
    { word: 'STAR', emoji: '⭐', letters: ['S', 'T', 'A', 'R'] },
  ];
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const currentWord = words[currentWordIndex];
  const allLetters = Array.from(new Set(words.flatMap(w => w.letters))).sort();
  
  const startGame = () => {
    setGameStarted(true);
    setCurrentWordIndex(0);
    setSelectedLetters([]);
    setScore(0);
  };
  
  const handleLetterClick = (letter) => {
    if (selectedLetters.length >= currentWord.letters.length) return;
    
    setSelectedLetters([...selectedLetters, letter]);
    
    if (selectedLetters.length + 1 === currentWord.letters.length) {
      checkWord();
    }
  };
  
  const checkWord = () => {
    const selected = [...selectedLetters, selectedLetters[selectedLetters.length]];
    const correct = selected.slice(0, currentWord.letters.length).every((l, i) => l === currentWord.letters[i]);
    
    setTimeout(() => {
      if (correct) {
        setScore(score + 10);
        alert('✅ Correct! Well done!');
        
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setSelectedLetters([]);
        } else {
          alert('🎉 All words complete! Great job!');
          setGameStarted(false);
        }
      } else {
        alert('❌ Try again!');
        setSelectedLetters([]);
      }
    }, 300);
  };
  
  const clearSelection = () => {
    setSelectedLetters([]);
  };
  
  if (!gameStarted) {
  return (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 text-center shadow-xl border border-blue-100">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build Words?</h3>
          <p className="text-xl text-gray-600 mb-8">Spell words correctly using the letters provided!</p>
          <button 
            onClick={startGame}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Word Builder</h2>
        <p className="text-gray-600 mt-1">Build vocabulary and speech skills</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-2xl shadow-lg">
          <div className="text-sm font-medium opacity-90">Score</div>
          <div className="text-3xl font-bold">{score}</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-xl border border-blue-100">
        <div className="text-center mb-8">
          <div className="text-8xl mb-6">{currentWord.emoji}</div>
          <div className="flex justify-center gap-3 mb-6">
            {currentWord.letters.map((letter, i) => (
              <div key={i} className={`w-16 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg border-2 ${
                selectedLetters[i] 
                  ? selectedLetters[i] === letter 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-red-100 border-red-500 text-red-700'
                  : 'bg-white border-blue-200'
              }`}>
                {selectedLetters[i] || ''}
              </div>
            ))}
          </div>
          <p className="text-xl text-gray-700 font-medium">Spell the word!</p>
          <p className="text-sm text-gray-500 mt-2">Word {currentWordIndex + 1} of {words.length}</p>
        </div>
        
        <div className="space-y-4">
        <div className="grid grid-cols-5 gap-3">
            {allLetters.map((letter, i) => (
            <button
              key={i}
                onClick={() => handleLetterClick(letter)}
                disabled={selectedLetters.length >= currentWord.letters.length}
                className="aspect-square bg-white rounded-xl flex items-center justify-center text-2xl font-bold hover:shadow-xl transition-all hover:scale-110 border border-gray-200 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {letter}
            </button>
          ))}
        </div>
          <button
            onClick={clearSelection}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={startGame}
          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl py-4 font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          New Game
        </button>
      </div>
    </div>
  );
};

const CatchTheStarsGame = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [stars, setStars] = useState([]);
  const [highScore, setHighScore] = useState(0);
  
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    generateStars();
    
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          alert(`Time's up! Your score: ${score}`);
          if (score > highScore) {
            setHighScore(score);
            alert('🎉 New high score!');
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };
  
  const generateStars = () => {
    const interval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(interval);
        return;
      }
      const newStar = {
        id: Date.now() + Math.random(),
        x: Math.random() * 80,
        y: Math.random() * 80,
        speed: Math.random() * 0.02 + 0.01
      };
      setStars(prev => [...prev, newStar]);
    }, 1000);
  };
  
  const catchStar = (id) => {
    setScore(score + 10);
    setStars(prev => prev.filter(s => s.id !== id));
  };
  
  React.useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const moveStars = setInterval(() => {
        setStars(prev => prev.map(star => ({
          ...star,
          y: (star.y + 50) % 100
        })));
      }, 100);
      return () => clearInterval(moveStars);
    }
  }, [isPlaying, timeLeft]);
  
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
          <p className="text-xl text-gray-600 mb-4">Catch as many stars as you can in 30 seconds!</p>
          <p className="text-lg text-amber-600 font-semibold mb-8">High Score: {highScore}</p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 relative h-96 overflow-hidden shadow-xl border border-amber-100">
          <div className="absolute top-4 right-4 bg-white px-6 py-3 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-amber-600">⏱️ {timeLeft}s</div>
          </div>
          {stars.map((star) => (
            <button
              key={star.id}
              onClick={() => catchStar(star.id)}
              className="absolute text-6xl animate-bounce cursor-pointer hover:scale-125 transition-transform"
              style={{ 
                left: `${star.x}%`, 
                top: `${star.y}%`
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
  const [routines, setRoutines] = useState([
    { id: 1, time: '8:00 AM', activity: 'Wake Up', icon: '🌅', done: false, color: 'from-orange-400 to-yellow-400' },
    { id: 2, time: '8:30 AM', activity: 'Breakfast', icon: '🍳', done: false, color: 'from-green-400 to-teal-400' },
    { id: 3, time: '9:00 AM', activity: 'Brush Teeth', icon: '🪥', done: false, color: 'from-blue-400 to-cyan-400' },
    { id: 4, time: '10:00 AM', activity: 'Play Time', icon: '🎮', done: false, color: 'from-purple-400 to-pink-400' },
    { id: 5, time: '12:00 PM', activity: 'Lunch', icon: '🍱', done: false, color: 'from-red-400 to-orange-400' },
  ]);
  
  const toggleTask = (id) => {
    setRoutines(routines.map(r => r.id === id ? { ...r, done: !r.done } : r));
    
    // Save to localStorage
    localStorage.setItem('dailyRoutine', JSON.stringify(routines));
  };
  
  const completedCount = routines.filter(r => r.done).length;
  const completionRate = Math.round((completedCount / routines.length) * 100);
  
  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('dailyRoutine');
    if (saved) {
      setRoutines(JSON.parse(saved));
    }
  }, []);
  
  React.useEffect(() => {
    localStorage.setItem('dailyRoutine', JSON.stringify(routines));
  }, [routines]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Daily Routine</h2>
        <p className="text-gray-600 mt-1">Stay on track with your schedule</p>
      </div>
      
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 shadow-xl border border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Today's Progress</h3>
          <div className="text-2xl font-bold text-emerald-600">{completionRate}%</div>
        </div>
        <div className="h-4 bg-white rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{completedCount} of {routines.length} tasks completed</p>
      </div>
      
      <div className="space-y-4">
        {routines.map((routine) => (
          <div
            key={routine.id}
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
            <button 
              onClick={() => toggleTask(routine.id)}
              className={`w-12 h-12 rounded-full ${routine.done ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white shadow-lg transition-all hover:scale-110`}
            >
              {routine.done && <CheckCircle className="w-6 h-6" />}
            </button>
          </div>
        ))}
      </div>
      
      {completionRate === 100 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🎉</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Congratulations!</h3>
              <p className="text-gray-600">You've completed all tasks for today!</p>
            </div>
          </div>
        </div>
      )}
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If the Botpress script is already loaded, just (re)init the embedded chat
    if (window.botpressWebchat) {
      window.botpressWebchat.init({
        botId: "5a9ab3ec-b9a1-4fb6-a34f-05b7648b7101",
        clientId: "124b12c2-53ef-4974-9e97-2d445c8184a3",
        hostUrl: "https://cdn.botpress.cloud/webchat/v3.3",
        messagingUrl: "https://messaging.botpress.cloud",
        lazy: true,
        hideWidget: true,
        layout: "embedded",
        containerWidth: "100%",
        stylesheet: "https://cdn.botpress.cloud/webchat/v3.3/themes/default.css",
        selector: "#ai-chat-container",
      });
      setIsLoaded(true);
      return;
    }

    // Otherwise, load the Botpress script once
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    script.async = true;

    script.onload = () => {
      if (!window.botpressWebchat) return;

      window.botpressWebchat.init({
        botId: "5a9ab3ec-b9a1-4fb6-a34f-05b7648b7101",
        clientId: "124b12c2-53ef-4974-9e97-2d445c8184a3",
        hostUrl: "https://cdn.botpress.cloud/webchat/v3.3",
        messagingUrl: "https://messaging.botpress.cloud",
        lazy: true,
        hideWidget: true,
        layout: "embedded",
        containerWidth: "100%",
        stylesheet: "https://cdn.botpress.cloud/webchat/v3.3/themes/default.css",
        selector: "#ai-chat-container",
      });

      setIsLoaded(true);
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">AI Companion</h2>
        <p className="text-gray-600 mt-1">
          24/7 intelligent guidance and personalized support
        </p>
      </div>

      {/* Embedded Botpress webchat */}
      <div
        id="ai-chat-container"
        style={{
          width: "100%",
          height: "600px",
          background: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(15,23,42,0.15)",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      />

      {!isLoaded && (
        <p className="text-sm text-gray-500">Loading AI Companion…</p>
      )}
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
// AIVideoCoach is now imported from separate component

// ============================================
// MAIN APP COMPONENT
// ============================================
const BrightPathApp = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [activeFeature, setActiveFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveSection('home');
    setActiveFeature(null);
  };
  
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
            <button 
              onClick={() => {
                const consultation = FeatureRegistry.getAll('support').find(f => f.id === 'video-consultation');
                if (consultation) {
                  setActiveFeature(consultation);
                }
              }}
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-opacity-30 transition-all border-2 border-white border-opacity-40 flex items-center gap-2"
            >
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
  
  // Show auth page if not logged in
  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLogin} />;
  }
  
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
              <div className="hidden md:flex items-center gap-3">
                <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
                  <User className="w-4 h-4" />
                  {currentUser?.name || 'Account'}
              </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white px-4 py-2 rounded-xl font-semibold transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
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