import React, { useState } from 'react';
import { Student } from '../types';
import { DuckAvatar } from './DuckAvatar';
import { createStudent, SAMPLE_CLASSES, getRandomDuckProps } from '../utils/constants';
import { 
  UserPlus, 
  Trash2, 
  RotateCcw, 
  Users, 
  FileText, 
  CheckCircle2, 
  UserX, 
  Shuffle, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (name: string) => void;
  onBulkAddStudents: (names: string[]) => void;
  onRemoveStudent: (id: string) => void;
  onToggleEliminate: (id: string) => void;
  onRestoreAllEliminated: () => void;
  onClearAll: () => void;
  onRandomizeColors: () => void;
  onLoadSampleClass: (sample: { name: string; students: string[] }) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onAddStudent,
  onBulkAddStudents,
  onRemoveStudent,
  onToggleEliminate,
  onRestoreAllEliminated,
  onClearAll,
  onRandomizeColors,
  onLoadSampleClass,
}) => {
  const [singleName, setSingleName] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'eliminated'>('active');

  const activeStudents = students.filter((s) => !s.isEliminated);
  const eliminatedStudents = students.filter((s) => s.isEliminated);

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) return;
    onAddStudent(singleName.trim());
    setSingleName('');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    const names = bulkText
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length > 0) {
      onBulkAddStudents(names);
      setBulkText('');
      setIsBulkOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-amber-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-5 py-4 text-amber-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center text-xl shadow-sm">
            👥
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight leading-tight font-heading">
              Danh Sách Học Sinh
            </h2>
            <p className="text-xs font-semibold text-amber-900/80">
              Tổng: {students.length} • Đang đua: {activeStudents.length} • Đã gọi: {eliminatedStudents.length}
            </p>
          </div>
        </div>

        {/* Quick Sample Classes */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Mẫu:
          </span>
          {SAMPLE_CLASSES.slice(0, 3).map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onLoadSampleClass(sample)}
              className="text-[11px] font-bold px-2 py-1 bg-white/90 hover:bg-white text-amber-900 rounded-lg shadow-xs hover:shadow transition border border-amber-300"
              title={`Nạp danh sách: ${sample.name}`}
            >
              {sample.name.split(' ')[0]} {sample.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Single Add Input */}
        <form onSubmit={handleSingleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nhập tên học sinh (VD: Nguyễn Minh Anh)..."
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium transition"
            />
          </div>
          <button
            type="submit"
            disabled={!singleName.trim()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm</span>
          </button>
          <button
            type="button"
            onClick={() => setIsBulkOpen(!isBulkOpen)}
            className="px-3 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-sm rounded-xl border border-sky-300 transition flex items-center space-x-1"
            title="Dán nhanh danh sách từ Excel/Word"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Nhập Nhiều</span>
          </button>
        </form>

        {/* Bulk Import Collapsible Panel */}
        {isBulkOpen && (
          <form onSubmit={handleBulkSubmit} className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                Dán danh sách học sinh (Mỗi dòng một tên hoặc ngăn cách bằng dấu phẩy):
              </label>
              <button
                type="button"
                onClick={() => setIsBulkOpen(false)}
                className="text-xs text-sky-600 hover:text-sky-900 font-bold"
              >
                Đóng
              </button>
            </div>
            <textarea
              rows={4}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Nguyễn Văn A&#10;Trần Thị B&#10;Lê Văn C&#10;Phạm Thị D"
              className="w-full p-2.5 text-xs font-mono rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-sky-700">
                Tự động tạo vịt màu sắc & nón ngộ nghĩnh cho từng em!
              </span>
              <button
                type="submit"
                disabled={!bulkText.trim()}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow transition"
              >
                Nạp danh sách vào lớp
              </button>
            </div>
          </form>
        )}

        {/* Navigation Tabs (Đang Đua vs Đã Loại) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1.5 transition ${
                activeTab === 'active'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>🦆 Sẵn Sàng Đua</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/15 text-[10px]">
                {activeStudents.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('eliminated')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1.5 transition ${
                activeTab === 'eliminated'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>🎯 Đã Gọi / Đã Loại</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/15 text-[10px]">
                {eliminatedStudents.length}
              </span>
            </button>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5">
            <button
              id="randomize-colors-btn"
              type="button"
              onClick={onRandomizeColors}
              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
              title="Đổi ngẫu nhiên màu vịt & nón"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              id="clear-all-students-btn"
              type="button"
              onClick={onClearAll}
              disabled={students.length === 0}
              className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 disabled:pointer-events-none rounded-lg border border-rose-200 transition flex items-center space-x-1"
              title="Xoá toàn bộ danh sách học sinh"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xoá hết</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Active Students List */}
        {activeTab === 'active' && (
          <div className="space-y-2">
            {activeStudents.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">Chưa có học sinh nào trong danh sách đua</p>
                <p className="text-xs text-slate-400 mt-1">
                  Hãy thêm học sinh bên trên hoặc khôi phục các bạn đã gọi.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                {activeStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition group"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <DuckAvatar
                        color={student.color}
                        accessory={student.accessory}
                        size={32}
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {student.name}
                        </p>
                        {student.winsCount > 0 && (
                          <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full">
                            🏆 Đã thắng {student.winsCount} lần
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => onToggleEliminate(student.id)}
                        className="px-2 py-1 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-md transition"
                        title="Loại tên học sinh này khỏi vòng đua tiếp theo"
                      >
                        Loại
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveStudent(student.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition"
                        title="Xoá học sinh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Eliminated Students List */}
        {activeTab === 'eliminated' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800">
                Các bạn đã được gọi lên bảng / nhận thưởng:
              </span>
              {eliminatedStudents.length > 0 && (
                <button
                  type="button"
                  onClick={onRestoreAllEliminated}
                  className="flex items-center space-x-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục tất cả</span>
                </button>
              )}
            </div>

            {eliminatedStudents.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <CheckCircle2 className="w-7 h-7 mx-auto mb-1 opacity-40 text-emerald-500" />
                <p className="text-xs font-medium">Chưa có học sinh nào bị loại</p>
                <p className="text-[11px] text-slate-400">
                  Khi đua vịt xong, học sinh về đích có thể được tự động hoặc thủ công chuyển vào đây.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {eliminatedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-rose-200 bg-rose-50/50 opacity-80 hover:opacity-100 transition"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div className="grayscale opacity-75">
                        <DuckAvatar
                          color={student.color}
                          accessory={student.accessory}
                          size={28}
                        />
                      </div>
                      <span className="text-xs font-semibold line-through text-slate-600 truncate">
                        {student.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleEliminate(student.id)}
                      className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition flex items-center space-x-1"
                      title="Đưa bạn này trở lại đường đua"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Gọi lại</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
