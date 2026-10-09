import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmClearModalProps {
  isOpen: boolean;
  studentCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmClearModal: React.FC<ConfirmClearModalProps> = ({
  isOpen,
  studentCount,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="confirm-clear-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div 
        id="confirm-clear-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-rose-200 overflow-hidden text-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Xác nhận xoá toàn bộ danh sách</span>
          </div>
          <button
            id="close-confirm-clear-modal-btn"
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-2xl">
            <Trash2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">
              Xoá tất cả {studentCount} học sinh?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Thao tác này sẽ dọn sạch toàn bộ danh sách học sinh hiện tại. Thầy/Cô có thể nhập lại danh sách mới hoặc chọn một lớp mẫu bất kỳ lúc nào.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              id="cancel-clear-all-btn"
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition"
            >
              Hủy bỏ
            </button>
            <button
              id="confirm-clear-all-btn"
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xoá hết</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
