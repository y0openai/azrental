import { HOW_IT_WORKS } from '@/constants/landing';

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-3xl md:text-[2.5rem] font-bold text-[#154FB3] mb-12">
          어떻게 시작하나요?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.number}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#F5F7FA] to-[#EEF2FF] hover:-translate-y-1 transition-transform"
            >
              <div className="w-[60px] h-[60px] mx-auto mb-6 rounded-full bg-[#2B6BE6] text-white flex items-center justify-center text-3xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-[#154FB3] mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
