import { SERVICES } from '@/constants/landing';

export default function ServicesSection() {
  return (
    <section className="py-20 px-8 bg-gradient-to-br from-[#F5F7FA] to-[#EEF2FF]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-3xl md:text-[2.5rem] font-bold text-[#154FB3] mb-4">
          아조씨와 함께 할 수 있는 일들
        </h2>
        <p className="text-center text-gray-600 text-base md:text-lg mb-12 max-w-[600px] mx-auto">
          조언쟁이? 아니에요. 그냥... 당신의 일상에 함께 있고 싶은 아저씨들이에요.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl text-center shadow-sm border-2 border-transparent hover:border-[#2B6BE6] hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-700 text-base mt-12 font-medium">
          ✨ 이 정도면 충분하지 않나요? 다른 것도 있으면 얘기해 봐요. 뭐든 함께할 수 있어요.
        </p>
      </div>
    </section>
  );
}
