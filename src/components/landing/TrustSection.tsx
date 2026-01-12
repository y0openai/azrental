import {
  TRUST_MECHANISMS,
  TRUST_STATS,
  REVIEWS,
  SAFETY_FEATURES,
} from '@/constants/landing';

export default function TrustSection() {
  return (
    <section className="py-20 px-8 bg-gradient-to-br from-[#E8EFFD] to-[#F0F4FF]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-3xl md:text-[2.5rem] font-bold text-[#154FB3] mb-12">
          왜 이 아저씨들을 믿을까?
        </h2>

        {/* Trust Mechanisms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {TRUST_MECHANISMS.map((mechanism, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm text-center"
            >
              <div className="text-4xl mb-4">{mechanism.icon}</div>
              <h3 className="text-lg font-semibold text-[#154FB3] mb-3">
                {mechanism.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {mechanism.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {TRUST_STATS.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-[#154FB3] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-12">
          <h3 className="text-center text-2xl font-semibold text-[#154FB3] mb-8">
            사람들은 뭐라고 할까?
          </h3>
          <div className="space-y-4">
            {REVIEWS.map((review, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7BA8F0] to-[#2B6BE6] flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="text-sm text-amber-500">
                      {'⭐'.repeat(Math.floor(review.rating))} {review.rating}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Highlight */}
        <div className="bg-white p-8 rounded-xl border-l-4 border-[#28A745]">
          <h3 className="font-semibold text-[#28A745] text-lg mb-4">
            🔒 물론, 안전이 첫 번째겠지
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            아조씨 렌탈은 순수한 상담, 조언, 동반, 공감 서비스입니다. 모든 이용자의 안전을 최우선으로 합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {SAFETY_FEATURES.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-[#28A745] font-bold text-lg">{feature.icon}</span>
                <div className="text-sm text-gray-700">
                  <strong>{feature.title}</strong>: {feature.description}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 text-sm text-gray-700">
            <strong>경계선 명시:</strong> 신체 접촉, 연애/성인 서비스는 엄격히 금지합니다.
            위반 시 즉시 활동 중단 및 환불 처리합니다.
          </div>
        </div>
      </div>
    </section>
  );
}
