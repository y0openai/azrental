import { FINAL_CTA } from '@/constants/landing';

export default function FinalCTASection() {
  return (
    <section className="py-20 px-8 bg-gradient-to-br from-[#0C3E7C] to-[#154FB3] text-white text-center">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-3xl md:text-[2.5rem] font-bold mb-6 leading-tight">
          {FINAL_CTA.title}
        </h2>
        <p className="text-lg text-white/95 mb-8 leading-relaxed whitespace-pre-line">
          {FINAL_CTA.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={FINAL_CTA.ctaPrimary.href}
            className="inline-flex items-center justify-center px-12 py-4 bg-white text-[#154FB3] font-semibold text-lg rounded-lg hover:bg-gray-100 transition-all hover:-translate-y-0.5 shadow-lg"
          >
            {FINAL_CTA.ctaPrimary.label}
          </a>
          <a
            href={FINAL_CTA.ctaSecondary.href}
            className="inline-flex items-center justify-center px-12 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-lg hover:bg-white/10 transition-all hover:-translate-y-0.5"
          >
            {FINAL_CTA.ctaSecondary.label}
          </a>
        </div>

        <p className="mt-8 text-sm text-white/80">
          궁금한 게 있어?{' '}
          <a
            href={FINAL_CTA.faqLink}
            className="text-white underline hover:text-white/90"
          >
            자주 묻는 거들
          </a>
          을 봐봐.
        </p>
      </div>
    </section>
  );
}
