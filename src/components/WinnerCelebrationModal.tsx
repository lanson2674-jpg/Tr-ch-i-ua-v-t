import React from 'react';
import { DuckRacer, WinnerRecord } from '../types';
import { DuckAvatar } from './DuckAvatar';
import { Trophy, Award, CheckCircle2, UserX, Play, RotateCcw, X, Sparkles } from 'lucide-react';

interface WinnerCelebrationModalProps {
  winner: DuckRacer | null;
  isOpen: boolean;
  autoEliminated: boolean;
  isManuallyEliminated: boolean;
  history: WinnerRecord[];
  onClose: () => void;
  onNextRace: () => void;
  onToggleEliminateWinner: () => void;
}

export const WinnerCelebrationModal: React.FC<WinnerCelebrationModalProps> = ({
  winner,
  isOpen,
  autoEliminated,
  isManuallyEliminated,
  history,
  onClose,
  onNextRace,
  onToggleEliminateWinner,
}) => {
  if (!isOpen || !winner) return null;

  const isEliminated = autoEliminated || isManuallyEliminated;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden text-center animate-in zoom-in-95 duration-250">
        
        {/* Top Gold Ribbon Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-4 px-6 text-amber-950 flex items-center justify-between border-b-2 border-amber-300">
          <div className="flex items-center space-x-2 text-sm font-black tracking-wide">
            <Trophy className="w-5 h-5 text-amber-900 fill-amber-900" />
            <span>KẾT QUẢ ĐUA VỊT • VỀ ĐÍCH ĐẦU TIÊN!</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-900 hover:bg-black/10 transition"
            title="Đóng bảng kết quả"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-5">
          {/* Giant Winning Duck & Laurels */}
          <div className="relative inline-block my-2">
            <div className="absolute inset-0 bg-amber-200 rounded-full blur-xl opacity-60 animate-pulse"></div>
            
            {/* Crown / Sparkle decoration */}
            <div className="relative flex flex-col items-center">
              <div className="text-3xl mb-1 animate-bounce">👑</div>
              <DuckAvatar
                color={winner.color}
                accessory={winner.accessory}
                size={110}
                isWinner={true}
              />
            </div>
          </div>

          {/* Student Winner Name */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              🎉 CHÚC MỪNG CHIẾN THẮNG 🎉
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading mt-2">
              {winner.name}
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Đã xuất sắc vượt qua các đối thủ để chạm vạch đích!
            </p>
          </div>

          {/* Elimination Status Box (CHỨC NĂNG LOẠI TÊN HỌC SINH ĐÃ GỌI) */}
          <div className={`p-4 rounded-2xl border text-sm font-semibold flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isEliminated 
              ? 'bg-rose-50 border-rose-200 text-rose-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <div className="flex items-center space-x-2 text-left">
              {isEliminated ? (
                <UserX className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <div>
                <p className="font-bold text-xs md:text-sm">
                  {isEliminated ? 'Đã loại khỏi lượt đua tiếp theo' : 'Vẫn giữ trong danh sách đua'}
                </p>
                <p className="text-[11px] opacity-80">
                  {isEliminated 
                    ? 'Bạn này sẽ không xuất hiện ở các vòng đua tới để nhường lượt cho bạn khác.'
                    : 'Bạn này vẫn có thể tiếp tục đua ở các vòng tiếp theo.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleEliminateWinner}
              className={`px-3 py-2 rounded-xl text-xs font-black shadow-xs transition shrink-0 ${
                isEliminated
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {isEliminated ? 'Khôi phục lại em này' : 'Loại em này ra'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onNextRace}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 fill-amber-950" />
              <span>ĐUA VÒNG TIẾP THEO</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition"
            >
              Xem lại đường đua
            </button>
          </div>

          {/* Recent Winners History in Session */}
          {history.length > 1 && (
            <div className="border-t border-slate-200 pt-4 text-left">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Lịch sử các vòng đua gần đây:</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                {history.slice(-5).reverse().map((record) => (
                  <span
                    key={record.id}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    <span>🦆</span>
                    <span>{record.studentName}</span>
                    {record.eliminated && (
                      <span className="text-[10px] text-rose-600 font-bold">(đã loại)</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
