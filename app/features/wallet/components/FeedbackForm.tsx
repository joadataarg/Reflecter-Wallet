import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface FeedbackFormProps {
    onComplete: () => void;
    onClose: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState(1);
    const [score, setScore] = useState<number | null>(null);
    const [qrRating, setQrRating] = useState<number | null>(null);
    const [helpsSave, setHelpsSave] = useState<string | null>(null);
    const [mainUsage, setMainUsage] = useState<string | null>(null);

    const handleNext = () => setStep(prev => prev + 1);

    return (
        <div className="flex-1 flex flex-col pt-4">
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`w-8 h-1 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
                    ))}
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{step}/5</span>
            </div>

            <div className="flex-1 space-y-6">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">¿Qué tan probable es que recomiendes Reflecter Wallet a un amigo?</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setScore(n)}
                                    className={`py-3 rounded-xl border font-black transition-all ${score === n ? 'bg-white border-white text-black scale-105 shadow-lg' : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30'}`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={score === null}
                            onClick={handleNext}
                            className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all shadow-xl shadow-blue-600/20"
                        >
                            Siguiente
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">Comparte tu opinión (Opcional)</h3>
                        <textarea
                            placeholder="¿Qué te gustaría ver en la próxima actualización?"
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-white transition-colors focus:outline-none resize-none"
                        />
                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/20"
                        >
                            Siguiente
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">¿Has usado el pago por QR? ¿Qué tan fácil fue?</h3>
                        <div className="flex justify-center gap-4">
                            {[1, 2, 3, 4, 5].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setQrRating(n)}
                                    className="transition-all hover:scale-110"
                                >
                                    <Star
                                        size={32}
                                        className={qrRating && n <= qrRating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'}
                                    />
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={qrRating === null}
                            onClick={handleNext}
                            className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">¿Reflecter Wallet te ayuda a ahorrar o ganar dinero de forma única?</h3>
                        <div className="space-y-3">
                            {['Sí', 'No', 'Tal vez'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setHelpsSave(opt)}
                                    className={`w-full p-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${helpsSave === opt ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={helpsSave === null}
                            onClick={handleNext}
                            className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">¿Cuál es tu principal uso de la wallet?</h3>
                        <div className="space-y-3">
                            {['Pagos diarios', 'Cashback', 'Referidos', 'Ahorro'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setMainUsage(opt)}
                                    className={`w-full p-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${mainUsage === opt ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-white'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={mainUsage === null}
                            onClick={onComplete}
                            className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all shadow-xl shadow-emerald-600/20"
                        >
                            Finalizar y Ganar Puntos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
