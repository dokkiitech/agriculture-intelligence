import { motion } from "motion/react";
import { Sprout, Sparkles, CloudRain } from "lucide-react";

interface VeggieCharacterProps {
  streakDays: number;
  lastRecordDate?: string;
}

export function VeggieCharacter({ streakDays, lastRecordDate }: VeggieCharacterProps) {
  const isHappy = streakDays > 0;
  
  // Check if last record was today
  const today = new Date().toDateString();
  const lastRecord = lastRecordDate ? new Date(lastRecordDate).toDateString() : null;
  const recordedToday = lastRecord === today;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{
          y: isHappy ? [0, -10, 0] : 0,
          rotate: isHappy ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isHappy ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Veggie Character Body */}
        <svg width="120" height="160" viewBox="0 0 120 160" className="drop-shadow-lg">
          {/* Leaf/Stem */}
          <motion.path
            d="M 60 10 Q 50 5, 45 15 Q 40 25, 50 30 L 60 40"
            fill={isHappy ? "#22c55e" : "#84cc16"}
            stroke={isHappy ? "#16a34a" : "#65a30d"}
            strokeWidth="2"
            animate={{
              d: isHappy
                ? [
                    "M 60 10 Q 50 5, 45 15 Q 40 25, 50 30 L 60 40",
                    "M 60 10 Q 55 3, 48 12 Q 42 22, 52 28 L 60 40",
                    "M 60 10 Q 50 5, 45 15 Q 40 25, 50 30 L 60 40",
                  ]
                : "M 60 10 Q 50 5, 45 15 Q 40 25, 50 30 L 60 40",
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Main Body (Tomato/Vegetable) */}
          <ellipse
            cx="60"
            cy="90"
            rx="45"
            ry="50"
            fill={isHappy ? "#ef4444" : "#dc2626"}
            stroke="#b91c1c"
            strokeWidth="2"
          />
          
          {/* Shine effect */}
          <ellipse
            cx="45"
            cy="75"
            rx="12"
            ry="18"
            fill="white"
            opacity={isHappy ? "0.4" : "0.2"}
          />
          
          {/* Eyes */}
          {isHappy ? (
            <>
              {/* Happy eyes (^_^) */}
              <motion.path
                d="M 40 85 Q 45 90, 50 85"
                fill="none"
                stroke="#1f2937"
                strokeWidth="3"
                strokeLinecap="round"
                animate={{ scaleX: [1, 0.8, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.path
                d="M 70 85 Q 75 90, 80 85"
                fill="none"
                stroke="#1f2937"
                strokeWidth="3"
                strokeLinecap="round"
                animate={{ scaleX: [1, 0.8, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </>
          ) : (
            <>
              {/* Sad eyes (;_;) */}
              <circle cx="45" cy="85" r="3" fill="#1f2937" />
              <circle cx="75" cy="85" r="3" fill="#1f2937" />
              <path d="M 42 82 L 38 78" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              <path d="M 48 82 L 52 78" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              <path d="M 72 82 L 68 78" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              <path d="M 78 82 L 82 78" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
          
          {/* Mouth */}
          {isHappy ? (
            <motion.path
              d="M 45 100 Q 60 110, 75 100"
              fill="none"
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ d: ["M 45 100 Q 60 110, 75 100", "M 45 100 Q 60 112, 75 100"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ) : (
            <path
              d="M 45 105 Q 60 98, 75 105"
              fill="none"
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          
          {/* Arms */}
          <motion.path
            d="M 20 90 Q 15 95, 20 100"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{
              d: isHappy
                ? ["M 20 90 Q 15 95, 20 100", "M 20 90 Q 15 85, 18 80", "M 20 90 Q 15 95, 20 100"]
                : "M 20 90 Q 15 95, 20 100",
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M 100 90 Q 105 95, 100 100"
            fill="none"
            stroke="#b91c1c"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{
              d: isHappy
                ? ["M 100 90 Q 105 95, 100 100", "M 100 90 Q 105 85, 102 80", "M 100 90 Q 105 95, 100 100"]
                : "M 100 90 Q 105 95, 100 100",
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>

        {/* Sparkles when happy */}
        {isHappy && (
          <>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="size-6 text-yellow-400 fill-yellow-400" />
            </motion.div>
            <motion.div
              className="absolute top-4 -left-4"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            >
              <Sparkles className="size-5 text-yellow-300 fill-yellow-300" />
            </motion.div>
          </>
        )}

        {/* Rain cloud when sad */}
        {!isHappy && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CloudRain className="size-8 text-gray-400" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
