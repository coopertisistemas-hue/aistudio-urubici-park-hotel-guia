
import { useEffect } from 'react';

interface RecepcionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: 'ri-phone-line',
    text: 'Pegue o telefone do quarto',
  },
  {
    icon: 'ri-keyboard-box-line',
    text: 'Disque 9',
  },
  {
    icon: 'ri-headphone-line',
    text: 'Aguarde atendimento da recepção',
  },
];

const RecepcionModal = ({ isOpen, onClose }: RecepcionModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-md mx-auto bg-white/15 backdrop-blur-xl border border-white/30 rounded-t-3xl shadow-2xl px-6 pt-6 pb-10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-white/40 rounded-full mx-auto mb-6" />

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <i className="ri-phone-fill text-white text-2xl" />
        </div>

        {/* Title */}
        <h2 className="text-white font-bold text-xl text-center mb-1 drop-shadow-md">
          Chamar a Recepção
        </h2>
        <p className="text-white/70 text-xs text-center mb-6">
          Atendimento via ramal interno.
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white/10 rounded-2xl px-4 py-3 border border-white/20"
            >
              {/* Step number */}
              <div className="w-7 h-7 rounded-full bg-amber-500/80 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">{index + 1}</span>
              </div>
              {/* Icon */}
              <div className="w-9 h-9 flex items-center justify-center shrink-0">
                <i className={`${step.icon} text-white/90 text-xl`} />
              </div>
              {/* Text */}
              <p className="text-white font-medium text-sm leading-snug">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold text-sm rounded-2xl py-3 transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          Fechar
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RecepcionModal;
