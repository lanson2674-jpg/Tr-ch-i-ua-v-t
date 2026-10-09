/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Student, RaceStatus, DuckRacer, WinnerRecord, RaceSettings } from './types';
import { 
  INITIAL_STUDENTS, 
  createStudent, 
  getRandomDuckProps 
} from './utils/constants';
import { DuckRaceTrack } from './components/DuckRaceTrack';
import { RaceControls } from './components/RaceControls';
import { StudentManager } from './components/StudentManager';
import { WinnerCelebrationModal } from './components/WinnerCelebrationModal';
import { ConfirmClearModal } from './components/ConfirmClearModal';
import { soundEffects } from './utils/audio';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  Trophy,
  Award,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const STORAGE_KEY_STUDENTS = 'lucky_wheels_students_v1';
const STORAGE_KEY_SETTINGS = 'lucky_wheels_settings_v1';
const STORAGE_KEY_HISTORY = 'lucky_wheels_history_v1';

export default function App() {
  // Load saved students or defaults
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_STUDENTS;
  });

  // Settings: duration, auto eliminate, sound
  const [durationSeconds, setDurationSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.durationSeconds) return parsed.durationSeconds;
      }
    } catch {
      // Ignore
    }
    return 15; // default 15s
  });

  const [autoEliminateWinner, setAutoEliminateWinner] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.autoEliminateWinner === 'boolean') return parsed.autoEliminateWinner;
      }
    } catch {
      // Ignore
    }
    return true; // Default to true as requested by classroom teachers!
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [raceStatus, setRaceStatus] = useState<RaceStatus>('idle');
  const [currentWinner, setCurrentWinner] = useState<DuckRacer | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState<boolean>(false);
  const [isWinnerAutoEliminated, setIsWinnerAutoEliminated] = useState<boolean>(false);
  const [isWinnerManuallyEliminated, setIsWinnerManuallyEliminated] = useState<boolean>(false);
  
  const [history, setHistory] = useState<WinnerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const raceContainerRef = useRef<HTMLDivElement>(null);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch {
      // Ignore
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({
        durationSeconds,
        autoEliminateWinner,
      }));
    } catch {
      // Ignore
    }
  }, [durationSeconds, autoEliminateWinner]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Student management actions
  const handleAddStudent = (name: string) => {
    const newStudent = createStudent(name);
    setStudents((prev) => [newStudent, ...prev]);
    if (soundEnabled) soundEffects.click();
  };

  const handleBulkAddStudents = (names: string[]) => {
    const newStudents = names.map(createStudent);
    setStudents((prev) => [...newStudents, ...prev]);
    if (soundEnabled) soundEffects.click();
  };

  const handleRemoveStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (soundEnabled) soundEffects.click();
  };

  const handleToggleEliminate = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isEliminated: !s.isEliminated } : s
      )
    );
    if (soundEnabled) soundEffects.click();
  };

  const handleRestoreAllEliminated = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, isEliminated: false }))
    );
    if (soundEnabled) soundEffects.click();
  };

  const handleClearAll = () => {
    if (students.length === 0) return;
    setIsConfirmClearOpen(true);
    if (soundEnabled) soundEffects.click();
  };

  const handleConfirmClearAll = () => {
    setStudents([]);
    setIsConfirmClearOpen(false);
    setCurrentWinner(null);
    setIsCelebrationOpen(false);
    setRaceStatus('idle');
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENTS);
    } catch {
      // Ignore
    }
    if (soundEnabled) soundEffects.click();
  };

  const handleCancelClearAll = () => {
    setIsConfirmClearOpen(false);
    if (soundEnabled) soundEffects.click();
  };

  const handleRandomizeColors = () => {
    setStudents((prev) =>
      prev.map((s) => {
        const { color, accessory } = getRandomDuckProps();
        return { ...s, color, accessory };
      })
    );
    if (soundEnabled) soundEffects.quack();
  };

  const handleLoadSampleClass = (sample: { name: string; students: string[] }) => {
    const sampleStudents = sample.students.map(createStudent);
    setStudents(sampleStudents);
    if (soundEnabled) soundEffects.quack();
  };

  // Race Control Handlers
  const handleStartRace = () => {
    const activeCount = students.filter((s) => !s.isEliminated).length;
    if (activeCount === 0) return;

    setCurrentWinner(null);
    setIsCelebrationOpen(false);
    setRaceStatus('countdown');

    // Countdown takes ~3 seconds before racing
    setTimeout(() => {
      setRaceStatus('racing');
    }, 3000);
  };

  const handlePauseRace = () => {
    setRaceStatus('paused');
  };

  const handleResumeRace = () => {
    setRaceStatus('racing');
  };

  const handleResetRace = () => {
    setRaceStatus('idle');
    setCurrentWinner(null);
    setIsCelebrationOpen(false);
    if (soundEnabled) soundEffects.click();
  };

  // Race Finished Callback (When a duck crosses finish line 100%)
  const handleRaceFinish = useCallback((winnerRacer: DuckRacer) => {
    setRaceStatus('finished');
    setCurrentWinner(winnerRacer);
    setIsCelebrationOpen(true);

    const willAutoEliminate = autoEliminateWinner;
    setIsWinnerAutoEliminated(willAutoEliminate);
    setIsWinnerManuallyEliminated(false);

    // Update students list: increment winner's win count and eliminate if auto-elimination is on
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === winnerRacer.studentId) {
          return {
            ...s,
            winsCount: s.winsCount + 1,
            isEliminated: willAutoEliminate ? true : s.isEliminated,
          };
        }
        return s;
      })
    );

    // Save record to history
    const record: WinnerRecord = {
      id: 'win_' + Date.now(),
      studentId: winnerRacer.studentId,
      studentName: winnerRacer.name,
      color: winnerRacer.color,
      accessory: winnerRacer.accessory,
      timestamp: Date.now(),
      eliminated: willAutoEliminate,
    };
    setHistory((prev) => [...prev, record]);
  }, [autoEliminateWinner]);

  // Toggle winner elimination status directly in modal
  const handleToggleWinnerElimination = () => {
    if (!currentWinner) return;
    const currentlyEliminated = isWinnerAutoEliminated || isWinnerManuallyEliminated;
    const newStatus = !currentlyEliminated;

    setIsWinnerAutoEliminated(false);
    setIsWinnerManuallyEliminated(newStatus);

    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentWinner.studentId
          ? { ...s, isEliminated: newStatus }
          : s
      )
    );

    // Update history record
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = { ...prev[prev.length - 1], eliminated: newStatus };
      return [...prev.slice(0, -1), last];
    });

    if (soundEnabled) soundEffects.click();
  };

  // Next Race from victory modal
  const handleNextRace = () => {
    setIsCelebrationOpen(false);
    handleResetRace();
    // Short delay to reset smoothly then trigger countdown
    setTimeout(() => {
      const activeCount = students.filter((s) => !s.isEliminated).length;
      if (activeCount > 0) {
        handleStartRace();
      }
    }, 300);
  };

  const activeCount = students.filter((s) => !s.isEliminated).length;
  const eliminatedCount = students.filter((s) => s.isEliminated).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-amber-100/60 pb-16 flex flex-col justify-between">
      {/* Top Application Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-amber-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-400 shadow-md flex items-center justify-center text-2xl select-none">
              🦆
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl md:text-2xl font-black text-amber-950 tracking-tight font-heading leading-tight">
                  LUCKY WHEELS
                </h1>
                <span className="text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                  Đua Vịt Lớp Học
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs md:text-sm font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300/80 inline-flex items-center gap-1 shadow-xs">
                  <span>👩‍🏫</span>
                  <span>GVCN: Chử Thị Ngọc Lan</span>
                </span>
                <p className="text-xs text-slate-500 hidden lg:block font-medium">
                  &bull; Vòng quay gọi tên học sinh ngẫu nhiên số 1 Việt Nam
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-amber-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1"
              title="Hướng dẫn sử dụng cho Thầy/Cô"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Hướng dẫn</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) soundEffects.click();
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition ${
                soundEnabled
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
              title={soundEnabled ? 'Âm thanh: ĐANG BẬT' : 'Âm thanh: ĐANG TẮT'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Classroom Guide for Teachers */}
        {showGuide && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-3 text-xs text-amber-950 animate-in slide-in-from-top duration-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="font-extrabold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Bí quyết tổ chức tiết học sôi nổi với Đua Vịt LUCKY WHEELS:
                </p>
                <p className="text-slate-700">
                  1. Dán danh sách học sinh từ Excel hoặc gõ tên &bull; 2. Chọn số giây đua (10s - 30s) &bull; 3. Bật "Tự động loại người thắng" để mỗi em đều có cơ hội lên bảng &bull; 4. Bấm "F11" hoặc nút Toàn màn hình để chiếu lên Smartboard/Tivi.
                </p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="self-end md:self-center text-xs text-amber-800 underline font-bold"
              >
                Đã hiểu, đóng lại
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full flex-1">
        
        {/* Top Controls Bar: Duration, Elimination, Start Button */}
        <section id="race-controls-section">
          <RaceControls
            status={raceStatus}
            durationSeconds={durationSeconds}
            autoEliminateWinner={autoEliminateWinner}
            soundEnabled={soundEnabled}
            isFullscreen={isFullscreen}
            activeStudentCount={activeCount}
            onStartRace={handleStartRace}
            onPauseRace={handlePauseRace}
            onResumeRace={handleResumeRace}
            onResetRace={handleResetRace}
            onChangeDuration={(sec) => {
              setDurationSeconds(sec);
              if (soundEnabled) soundEffects.click();
            }}
            onToggleAutoEliminate={() => {
              setAutoEliminateWinner(!autoEliminateWinner);
              if (soundEnabled) soundEffects.click();
            }}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onToggleFullscreen={toggleFullscreen}
          />
        </section>

        {/* The Duck Racecourse River Arena */}
        <section id="duck-racecourse-section" ref={raceContainerRef}>
          <DuckRaceTrack
            students={students}
            status={raceStatus}
            durationSeconds={durationSeconds}
            soundEnabled={soundEnabled}
            onRaceFinish={handleRaceFinish}
            onReset={handleRestoreAllEliminated}
          />
        </section>

        {/* Student List Management Panel (Add, Bulk Import, Eliminate/Restore) */}
        <section id="student-management-section">
          <StudentManager
            students={students}
            onAddStudent={handleAddStudent}
            onBulkAddStudents={handleBulkAddStudents}
            onRemoveStudent={handleRemoveStudent}
            onToggleEliminate={handleToggleEliminate}
            onRestoreAllEliminated={handleRestoreAllEliminated}
            onClearAll={handleClearAll}
            onRandomizeColors={handleRandomizeColors}
            onLoadSampleClass={handleLoadSampleClass}
          />
        </section>
      </main>

      {/* Winner Celebration Modal */}
      <WinnerCelebrationModal
        winner={currentWinner}
        isOpen={isCelebrationOpen}
        autoEliminated={isWinnerAutoEliminated}
        isManuallyEliminated={isWinnerManuallyEliminated}
        history={history}
        onClose={() => setIsCelebrationOpen(false)}
        onNextRace={handleNextRace}
        onToggleEliminateWinner={handleToggleWinnerElimination}
      />

      {/* Confirm Clear All Students Modal */}
      <ConfirmClearModal
        isOpen={isConfirmClearOpen}
        studentCount={students.length}
        onConfirm={handleConfirmClearAll}
        onCancel={handleCancelClearAll}
      />

      {/* Footer */}
      <footer className="border-t border-amber-200/80 mt-8 py-4 text-center text-xs text-slate-500 font-medium">
        <p>
          <span className="font-bold text-amber-700">LUCKY WHEELS</span> &bull; <span className="font-semibold text-slate-700">GVCN: Chử Thị Ngọc Lan</span> &bull; Ứng dụng giáo dục tạo không khí hào hứng trong lớp học Việt Nam
        </p>
      </footer>
    </div>
  );
}
