import React from 'react';
import { RaceStatus } from '../types';
import { DURATION_PRESETS } from '../utils/constants';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Clock, 
  CheckSquare, 
  Square,
  Sparkles,
  Zap
} from 'lucide-react';

interface RaceControlsProps {
  status: RaceStatus;
  durationSeconds: number;
  autoEliminateWinner: boolean;
  soundEnabled: boolean;
  isFullscreen: boolean;
  activeStudentCount: number;
  onStartRace: () => void;
  onPauseRace: () => void;
  onResumeRace: () => void;
  onResetRace: () => void;
  onChangeDuration: (sec: number) => void;
  onToggleAutoEliminate: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
}

export const RaceControls: React.FC<RaceControlsProps> = ({
  status,
  durationSeconds,
  autoEliminateWinner,
  soundEnabled,
  isFullscreen,
  activeStudentCount,
  onStartRace,
  onPauseRace,
  onResumeRace,
  onResetRace,
  onChangeDuration,
  onToggleAutoEliminate,
  onToggleSound,
  onToggleFullscreen,
}) => {
  const isRacing = status === 'racing';
  const isCountdown = status === 'countdown';
  const isBusy = isRacing || isCountdown;
  const canStart = activeStudentCount >= 1 && !isBusy;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-amber-200 p-4 space-y-4">
      {/* Top Row: Duration Selection & Settings */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        
        {/* Duration Configuration (CHỌN THỜI GIAN BAO NHIÊU GIÂY) */}
        <div className="w-full lg:w-auto space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Thời Gian Đua: <span className="text-amber-600 font-extrabold text-sm">{durationSeconds} giây</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {DURATION_PRESETS.map((sec) => (
              <button
                key={sec}
                type="button"
                disabled={isBusy}
                onClick={() => onChangeDuration(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition disabled:opacity-40 ${
                  durationSeconds === sec
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {sec}s
              </button>
            ))}

            {/* Custom duration slider / stepper */}
            <div className="flex items-center gap-1 ml-2 bg-slate-100 px-2 py-1 rounded-lg">
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                disabled={isBusy}
                value={durationSeconds}
                onChange={(e) => onChangeDuration(Number(e.target.value))}
                className="w-20 accent-amber-500 cursor-pointer disabled:cursor-not-allowed"
                title="Kéo chọn thời gian"
              />
            </div>
          </div>
        </div>

        {/* Option: Auto Eliminate Called Student & Utility Toggles */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* LOẠI TÊN HỌC SINH ĐÃ GỌI TOGGLE */}
          <button
            type="button"
            onClick={onToggleAutoEliminate}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
              autoEliminateWinner
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Tự động loại học sinh vừa thắng khỏi danh sách các vòng sau"
          >
            {autoEliminateWinner ? (
              <CheckSquare className="w-4 h-4 text-rose-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Tự động loại người thắng</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh (tiếng còi & vịt quạc)'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Chiếu toàn màn hình (Smartboard / TV)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Big Main Action Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>
            {isRacing
              ? 'Đang diễn ra cuộc đua vịt kịch tính...'
              : isCountdown
              ? 'Đang đếm ngược xuất phát...'
              : activeStudentCount > 0
              ? `Sẵn sàng cho ${activeStudentCount} chú vịt tranh tài!`
              : 'Hãy thêm học sinh để bắt đầu đua'}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Reset button */}
          <button
            type="button"
            onClick={onResetRace}
            disabled={isCountdown}
            className="flex-1 sm:flex-none px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 text-slate-700 font-bold text-sm rounded-xl transition flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Xếp Lại Vị Trí</span>
          </button>

          {/* Start / Pause / Resume Button */}
          {status === 'paused' ? (
            <button
              type="button"
              onClick={onResumeRace}
              className="flex-1 sm:flex-none px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-xl shadow-lg transition flex items-center justify-center space-x-2 animate-pulse"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>TIẾP TỤC ĐUA</span>
            </button>
          ) : !isRacing ? (
            <button
              type="button"
              disabled={!canStart}
              onClick={onStartRace}
              className="flex-1 sm:flex-none px-7 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-black text-base rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>BẮT ĐẦU ĐUA VỊT!</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPauseRace}
              className="flex-1 sm:flex-none px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <Pause className="w-5 h-5" />
              <span>TẠM DỪNG ĐUA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
