import { UNCLE_PROFILES } from '@/constants/landing';

export default function UncleProfilesSection() {
  return (
    <section className="py-20 px-8 bg-gradient-to-br from-[#F5F7FA] to-[#EEF2FF]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-3xl md:text-[2.5rem] font-bold text-[#154FB3] mb-12">
          실제로 활동 중인 아조씨들
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {UNCLE_PROFILES.map((profile, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all"
            >
              {/* Profile Image/Emoji */}
              <div className="h-32 bg-gradient-to-br from-[#7BA8F0] to-[#2B6BE6] flex items-center justify-center">
                <span className="text-6xl">{profile.emoji}</span>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-600">{profile.career}</p>
                  <div className="text-sm text-amber-500 mt-1">
                    {'⭐'.repeat(Math.floor(profile.rating))} {profile.rating}/5.0 ({profile.reviewCount}건)
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-[#154FB3]">
                    {profile.pricePerHour.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">원/시간</span>
                </div>

                {/* Quote */}
                <p className="text-gray-700 italic mb-4 text-sm leading-relaxed">
                  &ldquo;{profile.quote}&rdquo;
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-[#EEF2FF] text-[#2B6BE6] text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Target Audience */}
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">추천 대상</p>
                  <ul className="space-y-1">
                    {profile.targetAudience.map((target, targetIndex) => (
                      <li key={targetIndex} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-[#2B6BE6]">•</span>
                        {target}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
