const SmokeFreeNotice = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="text-lg">🚭</span>
        <div>
          <p className="text-white font-semibold text-xs">
            Ambiente 100% livre de fumo
          </p>
          <p className="text-white/60 text-xs mt-0.5 leading-snug">
            Para o conforto e bem-estar de todos os hóspedes, não é permitido fumar nas áreas internas do hotel e nas acomodações.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmokeFreeNotice;
