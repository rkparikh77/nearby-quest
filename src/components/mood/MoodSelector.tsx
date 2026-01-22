import { useMood } from '../../context/MoodContext';
import { getAllMoods } from '../../utils/moodConfig';
import MoodCard from './MoodCard';

export default function MoodSelector() {
  const { setMood } = useMood();
  const moods = getAllMoods();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Title Section */}
      <div className="text-center mb-8 sm:mb-12 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
          <span className="neon-text-purple">What's your</span>{' '}
          <span className="neon-text-pink">vibe</span>
          <span className="neon-text-purple">?</span>
        </h2>
        <p className="text-text-secondary text-lg max-w-md mx-auto">
          Select your mood and we'll find the perfect spots nearby
        </p>
      </div>

      {/* Mood Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl w-full">
        {moods.map((mood, index) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            onClick={() => setMood(mood.id)}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}
