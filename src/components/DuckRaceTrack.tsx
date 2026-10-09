import React, { useEffect, useRef, useState, useMemo } from 'react';
import { DuckRacer, RaceStatus, Student } from '../types';
import { DuckAvatar } from './DuckAvatar';
import { soundEffects } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Volume2, VolumeX, Sparkles, RefreshCw, Flag, Award } from 'lucide-react';

interface DuckRaceTrackProps {
  students: Student[];
  status: RaceStatus;
  durationSeconds: number;
  soundEnabled: boolean;
  onRaceFinish: (winnerRacer: DuckRacer) => void;
  onReset: () => void;
}

export const DuckRaceTrack: React.FC<DuckRaceTrackProps> = ({
  students,
  status,
  durationSeconds,
  soundEnabled,
  onRaceFinish,
  onReset,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [racers, setRacers] = useState<DuckRacer[]>([]);
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Keep racers in ref for animation frame loop
  const racersRef = useRef<DuckRacer[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const statusRef = useRef<RaceStatus>(status);
  const winnerDeclaredRef = useRef<boolean>(false);

  // Initialize racers from active students
  useEffect(() => {
    const activeStudents = students.filter((s) => !s.isEliminated);
    const count = activeStudents.length;

    setRacers((prevRacers) => {
      // If we are currently racing or finished, preserve existing racer positions
      // so ducks don't snap backwards or reset to 0 when winner winCount updates!
      const currentMap = new Map(prevRacers.map((r) => [r.studentId, r]));

      const updatedRacers: DuckRacer[] = activeStudents.map((s, index) => {
        const laneY = count <= 1 ? 50 : 12 + (index / Math.max(1, count - 1)) * 76;
        const existing = currentMap.get(s.id);

        if (existing && (statusRef.current === 'racing' || statusRef.current === 'finished')) {
          return {
            ...existing,
            name: s.name,
            color: s.color,
            accessory: s.accessory,
            laneY: laneY,
          };
        }

        return {
          id: 'racer_' + s.id,
          studentId: s.id,
          name: s.name,
          color: s.color,
          accessory: s.accessory,
          xProgress: 0,
          laneY: laneY,
          currentSpeed: 1.0,
          burstTimer: 0,
          slowTimer: 0,
          quackTimer: Math.random() * 5 + 2,
          bobbingOffset: (index * 0.3) % 2,
          hasFinished: false,
        };
      });

      racersRef.current = updatedRacers;
      return updatedRacers;
    });

    if (statusRef.current === 'idle') {
      setElapsedTime(0);
      winnerDeclaredRef.current = false;
    }
  }, [students]);

  // Keep statusRef synchronized and handle state changes
  useEffect(() => {
    statusRef.current = status;

    if (status === 'idle') {
      winnerDeclaredRef.current = false;
      setElapsedTime(0);
      setRacers((prev) =>
        prev.map((racer) => ({
          ...racer,
          xProgress: 0,
          currentSpeed: 1.0,
          burstTimer: 0,
          slowTimer: 0,
          hasFinished: false,
        }))
      );
      racersRef.current = racersRef.current.map((racer) => ({
        ...racer,
        xProgress: 0,
        currentSpeed: 1.0,
        burstTimer: 0,
        slowTimer: 0,
        hasFinished: false,
      }));
    }
  }, [status]);

  // Countdown handler when status shifts to 'countdown'
  useEffect(() => {
    if (status === 'countdown') {
      winnerDeclaredRef.current = false;
      setElapsedTime(0);

      // Cleanly reset all active ducks to starting line (xProgress = 0)
      setRacers((prev) =>
        prev.map((racer) => ({
          ...racer,
          xProgress: 0,
          currentSpeed: 1.0,
          burstTimer: 0,
          slowTimer: 0,
          hasFinished: false,
        }))
      );
      racersRef.current = racersRef.current.map((racer) => ({
        ...racer,
        xProgress: 0,
        currentSpeed: 1.0,
        burstTimer: 0,
        slowTimer: 0,
        hasFinished: false,
      }));

      setCountdownNum(3);
      if (soundEnabled) soundEffects.countdownBeep(false);

      const t1 = setTimeout(() => {
        setCountdownNum(2);
        if (soundEnabled) soundEffects.countdownBeep(false);
      }, 900);

      const t2 = setTimeout(() => {
        setCountdownNum(1);
        if (soundEnabled) soundEffects.countdownBeep(false);
      }, 1800);

      const t3 = setTimeout(() => {
        setCountdownNum(0); // "XUẤT PHÁT!"
        if (soundEnabled) {
          soundEffects.countdownBeep(true);
          soundEffects.startHorn();
        }
      }, 2700);

      const t4 = setTimeout(() => {
        setCountdownNum(null);
      }, 3400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      setCountdownNum(null);
    }
  }, [status, soundEnabled]);

  // Main Race Physics Animation Engine
  useEffect(() => {
    if (status !== 'racing') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    startTimeRef.current = performance.now() - elapsedTime * 1000;
    let lastTime = performance.now();
    let nextQuackTime = performance.now() + Math.random() * 2000 + 1500;

    const totalDurationMs = durationSeconds * 1000;

    const loop = (currentTime: number) => {
      // Delta time capped at 0.1s to avoid huge jumps on frame hiccups
      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const elapsed = Math.max(0, currentTime - (startTimeRef.current || currentTime));
      const currentSeconds = Math.min(durationSeconds, elapsed / 1000);
      setElapsedTime(currentSeconds);

      // Base target progress across the race duration (0 -> 1)
      const overallPacing = Math.min(1, elapsed / totalDurationMs);

      // Occasional fun duck quack sound during race
      if (soundEnabled && currentTime > nextQuackTime && !winnerDeclaredRef.current) {
        soundEffects.quack(0.9 + Math.random() * 0.4);
        nextQuackTime = currentTime + Math.random() * 3000 + 2000;
      }

      let winner: DuckRacer | null = null;

      const updated = racersRef.current.map((racer) => {
        if (racer.hasFinished) return racer;

        // Manage burst speed boost timers
        let burst = Math.max(0, racer.burstTimer - dt);
        let slow = Math.max(0, racer.slowTimer - dt);

        // Random chance to trigger a sprint burst (adds dramatic excitement)
        if (burst <= 0 && Math.random() < 0.03) {
          burst = Math.random() * 1.5 + 0.8;
          if (soundEnabled && Math.random() < 0.25) {
            soundEffects.speedBoost();
          }
        }

        // Small chance of brief water drag
        if (slow <= 0 && burst <= 0 && Math.random() < 0.015) {
          slow = Math.random() * 0.9 + 0.4;
        }

        // Base forward speed multiplier
        let speedMultiplier = 1.0;
        if (burst > 0) speedMultiplier += 0.5 + Math.random() * 0.35;
        if (slow > 0) speedMultiplier -= 0.25;

        // Dynamic exciting race pacing:
        // Ducks that are ahead ease slightly forward; ducks behind get an adrenaline surge.
        // Importantly, speed is ALWAYS strictly positive so ducks NEVER move backwards!
        const avgProgress = overallPacing * 100;
        if (racer.xProgress > avgProgress + 15 && overallPacing < 0.8) {
          speedMultiplier *= 0.7; // ease forward, but NEVER backwards
        } else if (racer.xProgress < avgProgress - 12) {
          speedMultiplier *= 1.35; // catch up forward
        }

        // Ensure current speed is always strictly positive forward movement
        const currentSpeed = Math.max(0.35, speedMultiplier);

        // Forward step in progress (0 -> 100)
        const forwardStep = (100 / durationSeconds) * currentSpeed * dt;

        // newX is STRICTLY NON-DECREASING: Vịt chỉ tiến lên vạch đích, không bao giờ đi lùi!
        let newX = Math.max(racer.xProgress, racer.xProgress + forwardStep);

        // When a duck reaches 100% (finish line)
        if (newX >= 100) {
          newX = 100;
          if (!winnerDeclaredRef.current && !winner) {
            winner = { ...racer, xProgress: 100, hasFinished: true };
          }
        }

        return {
          ...racer,
          xProgress: newX,
          currentSpeed,
          burstTimer: burst,
          slowTimer: slow,
          hasFinished: newX >= 100,
        };
      });

      racersRef.current = updated;
      setRacers([...updated]);

      // Check if a winner has crossed the finish line!
      if (winner && !winnerDeclaredRef.current) {
        winnerDeclaredRef.current = true;
        
        // Ensure winner and final state are persisted on track
        const finalRacers = updated.map((r) =>
          r.id === winner?.id ? { ...r, xProgress: 100, hasFinished: true } : r
        );
        racersRef.current = finalRacers;
        setRacers(finalRacers);

        // Trigger victory celebration fanfare
        if (soundEnabled) {
          soundEffects.victoryFanfare();
          setTimeout(() => soundEffects.quack(1.2), 300);
        }

        // Fire colorful confetti celebration
        try {
          confetti({
            particleCount: 130,
            spread: 95,
            origin: { y: 0.5, x: 0.85 },
            colors: ['#FACC15', '#FB923C', '#38BDF8', '#4ADE80', '#F43F5E', '#A855F7'],
          });
        } catch {
          // Ignore if canvas-confetti fails
        }

        onRaceFinish(winner);
        return;
      }

      if (statusRef.current === 'racing') {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, durationSeconds, soundEnabled, onRaceFinish, elapsedTime]);

  // Live top 3 racers for dynamic leaderboard overlay
  const topRacers = useMemo(() => {
    return [...racers]
      .sort((a, b) => b.xProgress - a.xProgress)
      .slice(0, 3);
  }, [racers]);

  const activeCount = students.filter((s) => !s.isEliminated).length;

  return (
    <div
      ref={containerRef}
      id="duck-race-arena"
      className="relative w-full rounded-2xl overflow-hidden shadow-xl border-4 border-amber-300 bg-sky-400 select-none"
      style={{ minHeight: Math.max(480, Math.min(800, activeCount * 44 + 140)) }}
    >
      {/* Top Riverbank / Lush Grass */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-emerald-600 border-b-4 border-emerald-700 flex items-center px-4 justify-between z-10 shadow-sm">
        <div className="flex items-center space-x-2 text-emerald-100 font-bold text-xs tracking-wider uppercase">
          <span className="text-base">🌿</span>
          <span className="hidden sm:inline">BỜ SÔNG CỔ VŨ • LỚP HỌC SÔI ĐỘNG</span>
          <span className="sm:hidden">LUCKY WHEELS</span>
        </div>
        <div className="flex items-center space-x-4 text-white text-xs font-semibold">
          <div className="flex items-center space-x-1 bg-emerald-800/80 px-2.5 py-1 rounded-full border border-emerald-500">
            <span>⏱️</span>
            <span>
              {status === 'racing'
                ? `${Math.max(0, durationSeconds - elapsedTime).toFixed(1)}s`
                : `${durationSeconds}s`}
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-emerald-800/80 px-2.5 py-1 rounded-full border border-emerald-500">
            <span>🦆</span>
            <span>{activeCount} Chú Vịt</span>
          </div>
        </div>
      </div>

      {/* Main River Racecourse Water */}
      <div className="absolute top-10 bottom-10 left-0 right-0 overflow-hidden river-water-pattern">
        {/* Animated Water Currents & Wave Highlights */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" width="120" height="30" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 15 Q 30 5 60 15 T 120 15"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                />
                <path
                  d="M 10 25 Q 40 18 70 25 T 130 25"
                  fill="none"
                  stroke="#E0F2FE"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>

        {/* Floating Water Lilies for River Ambiance */}
        <div className="absolute top-[18%] left-[15%] text-2xl opacity-80 pointer-events-none animate-pulse">🪷</div>
        <div className="absolute top-[65%] left-[42%] text-xl opacity-70 pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>🪷</div>
        <div className="absolute top-[35%] left-[72%] text-2xl opacity-75 pointer-events-none animate-pulse">🪷</div>

        {/* Start Line (Rope & Float Buoys) */}
        <div className="absolute top-0 bottom-0 left-[6%] w-2 bg-amber-400 border-r-2 border-amber-600 flex flex-col justify-around items-center z-10 shadow">
          <div className="bg-amber-500 text-amber-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow rotate-90 origin-left whitespace-nowrap">
            XUẤT PHÁT
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm -ml-1"></div>
          ))}
        </div>

        {/* Finish Line (Checkered Banner & Arch) */}
        <div className="absolute top-0 bottom-0 right-[6%] w-8 z-10 flex flex-col justify-between items-center shadow-lg">
          {/* Checkered Finish Line Pattern */}
          <div
            className="w-6 h-full border-2 border-slate-900 shadow-md"
            style={{
              backgroundImage: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)`,
              backgroundSize: '16px 16px',
            }}
          />
          {/* Finish Arch Badge */}
          <div className="absolute -top-3 bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center space-x-1 animate-pulse">
            <Flag className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>VẠCH ĐÍCH</span>
          </div>
        </div>

        {/* Ducks on the Water */}
        <div className="relative w-full h-full">
          {racers.map((racer) => {
            // Horizontal position mapping from 7% (vạch xuất phát) to 93% (vạch đích cờ caro)
            const leftPercent = 7 + (racer.xProgress / 100) * 86;
            const isBursting = racer.burstTimer > 0;

            return (
              <div
                key={racer.id}
                className="absolute transition-transform duration-75 ease-out pointer-events-none"
                style={{
                  left: `${leftPercent}%`,
                  top: `${racer.laneY}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: Math.round(racer.laneY) + 5,
                }}
              >
                {/* Vịt nằm lên trên tên học sinh (Duck sits on top of student name) */}
                <div className="flex flex-col items-center">
                  {/* Con vịt ở phía TRÊN */}
                  <div className="relative z-10 -mb-1.5 filter drop-shadow-md">
                    <DuckAvatar
                      color={racer.color}
                      accessory={racer.accessory}
                      size={52}
                      isSwimming={status === 'racing'}
                      isWinner={racer.hasFinished}
                      direction="right"
                    />

                    {/* Water Wake / Bubble Spray Behind Duck when moving */}
                    {status === 'racing' && (
                      <div className="absolute -left-3 bottom-1 flex space-x-0.5 opacity-70">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/80 animate-ping"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                      </div>
                    )}
                  </div>

                  {/* Bảng tên học sinh ở phía DƯỚI (chú vịt nằm lên bảng tên) */}
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black whitespace-nowrap shadow-md border flex items-center space-x-1 transition-all relative z-0 ${
                      racer.hasFinished
                        ? 'bg-amber-400 text-amber-950 border-amber-300 scale-105 ring-2 ring-amber-300'
                        : isBursting
                        ? 'bg-amber-400 text-amber-950 border-white scale-110 ring-2 ring-amber-300 animate-pulse'
                        : 'bg-white/95 text-slate-900 border-slate-200'
                    }`}
                  >
                    {racer.hasFinished ? (
                      <span className="text-[11px]">🏆</span>
                    ) : isBursting ? (
                      <span className="text-[10px]">⚡</span>
                    ) : null}
                    <span>{racer.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Riverbank / Lush Grass with spectator flowers */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-emerald-600 border-t-4 border-emerald-700 flex items-center px-4 justify-between z-10 shadow-sm">
        <div className="flex items-center space-x-3 text-xs text-emerald-100 font-semibold">
          <span>🌻 🌷 🌼</span>
          <span className="hidden md:inline">Đua vịt chọn tên công bằng, minh bạch và tràn ngập tiếng cười!</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white font-bold bg-emerald-800/80 px-3 py-1 rounded-full border border-emerald-500">
            LUCKY WHEELS VIỆT NAM
          </span>
        </div>
      </div>

      {/* Dynamic Top 3 Live Leaderboard (HUD in corner during race) */}
      {status === 'racing' && topRacers.length > 0 && (
        <div className="absolute top-12 left-4 z-20 bg-slate-900/85 backdrop-blur-md text-white p-3 rounded-xl border-2 border-amber-400 shadow-xl max-w-[200px] animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-black uppercase tracking-wider mb-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>DẪN ĐẦU TỐC ĐỘ</span>
          </div>
          <div className="space-y-1">
            {topRacers.map((racer, idx) => (
              <div key={racer.id} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-700/50 last:border-0">
                <div className="flex items-center space-x-1.5 truncate">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950 font-bold'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : 'bg-amber-700 text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-semibold truncate">{racer.name}</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono ml-2">
                  {Math.round(racer.xProgress)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Countdown 3-2-1 Overlay */}
      {countdownNum !== null && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-center animate-in zoom-in duration-200">
            {countdownNum > 0 ? (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-white shadow-2xl flex items-center justify-center text-slate-900 font-black text-6xl md:text-8xl drop-shadow">
                {countdownNum}
              </div>
            ) : (
              <div className="px-8 py-4 rounded-3xl bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 border-4 border-white shadow-2xl text-white font-black text-4xl md:text-6xl tracking-wider animate-pulse">
                XUẤT PHÁT! 🏁
              </div>
            )}
            <p className="mt-4 text-white text-lg font-bold drop-shadow">
              {countdownNum > 0 ? 'Chuẩn bị...' : 'Các chú vịt tăng tốc!'}
            </p>
          </div>
        </div>
      )}

      {/* Empty State when no active students */}
      {activeCount === 0 && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-sky-900/60 backdrop-blur-sm text-white p-6">
          <div className="text-6xl mb-3">🐣</div>
          <h3 className="text-2xl font-black mb-2 font-heading">Chưa có chú vịt nào sẵn sàng!</h3>
          <p className="text-sky-100 text-sm max-w-md text-center mb-4">
            Tất cả học sinh đã được gọi hoặc danh sách đang trống. Vui lòng thêm học sinh hoặc khôi phục danh sách đã loại để tiếp tục đua vịt.
          </p>
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl shadow-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Khôi Phục Toàn Bộ Danh Sách</span>
          </button>
        </div>
      )}
    </div>
  );
};
