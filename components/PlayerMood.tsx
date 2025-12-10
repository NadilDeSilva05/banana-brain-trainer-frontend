"use client";

interface PlayerMoodProps {
  mood: string;
  size?: 'sm' | 'md' | 'lg';
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  excited: '🤩',
  focused: '🧠',
  confident: '😎',
  determined: '💪',
  surprised: '😲',
  thinking: '🤔',
  celebrating: '🎉',
  default: '😐',
};

export default function PlayerMood({ mood, size = 'md' }: PlayerMoodProps) {
  const emoji = moodEmojis[mood] || moodEmojis.default;
  
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`${sizeClasses[size]} transition-all duration-300 animate-pulse`}>
      {emoji}
    </div>
  );
}

