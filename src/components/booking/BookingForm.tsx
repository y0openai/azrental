'use client';

import { useState } from 'react';
import { useBookingForm, getAvailableDateRange } from '@/hooks/useBookingForm';
import { formatPrice } from '@/services/bookingService';
import type { UncleDetail, ServiceType, LocationType } from '@/types/booking';
import {
  SERVICE_LABELS,
  SERVICE_ICONS,
  LOCATION_LABELS,
  LOCATION_ICONS,
  TIME_SLOTS,
  BOOKING_MIN_DURATION,
  BOOKING_MAX_DURATION,
  CUSTOMER_NOTE_MAX_LENGTH,
} from '@/types/booking';

// ============================================
// Props
// ============================================
interface BookingFormProps {
  uncle: UncleDetail;
  onSuccess?: (bookingId: string) => void;
  onCancel?: () => void;
}

// ============================================
// BookingForm Component
// ============================================
export function BookingForm({ uncle, onSuccess, onCancel }: BookingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const {
    formState,
    errors,
    isSubmitting,
    estimatedPrice,
    isValid,
    toggleService,
    setRequestedDate,
    setRequestedTime,
    setDuration,
    setLocationType,
    setLocationAddress,
    setPreferredArea,
    setCustomerNote,
    submit,
  } = useBookingForm({
    uncleId: uncle.uid,
    hourlyRate: uncle.hourlyRate,
    onSuccess,
    onError: error => console.error(error),
  });

  const { minDate, maxDate } = getAvailableDateRange();

  // 다음 단계로
  const handleNext = () => {
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  };

  // 이전 단계로
  const handlePrev = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
  };

  // 제출
  const handleSubmit = async () => {
    const success = await submit();
    if (success) {
      // onSuccess가 호출됨
    }
  };

  // 단계별 유효성
  const isStep1Valid = formState.services.length > 0;
  const isStep2Valid =
    formState.requestedDate !== null &&
    formState.requestedTime !== '' &&
    formState.duration >= BOOKING_MIN_DURATION;
  const isStep3Valid =
    formState.preferredArea.trim() !== '' &&
    (formState.locationType !== 'customer_location' ||
      formState.locationAddress.trim() !== '');

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 단계 표시 */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">예약하기</h2>
          <span className="text-sm text-gray-500">{step}/3 단계</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                s <= step ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: 서비스 선택 */}
      {step === 1 && (
        <div className="p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            어떤 서비스를 원하시나요?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(SERVICE_LABELS) as ServiceType[]).map(service => {
              const isSelected = formState.services.includes(service);
              return (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`p-3 text-left rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg mr-2">{SERVICE_ICONS[service]}</span>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? 'text-primary-700' : 'text-gray-700'
                    }`}
                  >
                    {SERVICE_LABELS[service]}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.services && (
            <p className="mt-2 text-sm text-red-500">{errors.services}</p>
          )}
        </div>
      )}

      {/* Step 2: 날짜/시간 선택 */}
      {step === 2 && (
        <div className="p-6 space-y-6">
          {/* 날짜 선택 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              희망 날짜
            </label>
            <input
              type="date"
              min={minDate.toISOString().split('T')[0]}
              max={maxDate.toISOString().split('T')[0]}
              value={
                formState.requestedDate
                  ? formState.requestedDate.toISOString().split('T')[0]
                  : ''
              }
              onChange={e => {
                const date = e.target.value ? new Date(e.target.value) : null;
                setRequestedDate(date);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.requestedDate && (
              <p className="mt-1 text-sm text-red-500">{errors.requestedDate}</p>
            )}
          </div>

          {/* 시간 선택 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              희망 시간
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {TIME_SLOTS.map(time => (
                <button
                  key={time}
                  onClick={() => setRequestedTime(time)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    formState.requestedTime === time
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {errors.requestedTime && (
              <p className="mt-1 text-sm text-red-500">{errors.requestedTime}</p>
            )}
          </div>

          {/* 이용 시간 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              이용 시간
            </label>
            <div className="flex gap-2">
              {Array.from(
                { length: BOOKING_MAX_DURATION - BOOKING_MIN_DURATION + 1 },
                (_, i) => i + BOOKING_MIN_DURATION
              ).map(hours => (
                <button
                  key={hours}
                  onClick={() => setDuration(hours)}
                  className={`flex-1 py-3 text-center rounded-lg border-2 transition-all ${
                    formState.duration === hours
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-lg font-semibold">{hours}</span>
                  <span className="text-sm">시간</span>
                </button>
              ))}
            </div>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: 장소 및 상세 정보 */}
      {step === 3 && (
        <div className="p-6 space-y-6">
          {/* 장소 유형 */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              만남 장소
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(LOCATION_LABELS) as LocationType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setLocationType(type)}
                  className={`p-3 text-left rounded-lg border-2 transition-all ${
                    formState.locationType === type
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg mr-2">{LOCATION_ICONS[type]}</span>
                  <span
                    className={`text-sm font-medium ${
                      formState.locationType === type
                        ? 'text-primary-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {LOCATION_LABELS[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 고객 지정 장소인 경우 주소 입력 */}
          {formState.locationType === 'customer_location' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 주소
              </label>
              <input
                type="text"
                value={formState.locationAddress}
                onChange={e => setLocationAddress(e.target.value)}
                placeholder="정확한 주소를 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.locationAddress && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.locationAddress}
                </p>
              )}
            </div>
          )}

          {/* 선호 지역 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선호 지역 (시/구)
            </label>
            <input
              type="text"
              value={formState.preferredArea}
              onChange={e => setPreferredArea(e.target.value)}
              placeholder="예: 서울시 강남구"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.preferredArea && (
              <p className="mt-1 text-sm text-red-500">{errors.preferredArea}</p>
            )}
          </div>

          {/* 요청사항 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              요청사항 (선택)
            </label>
            <textarea
              value={formState.customerNote}
              onChange={e => setCustomerNote(e.target.value)}
              placeholder="아조씨에게 전달하고 싶은 내용을 작성해주세요"
              maxLength={CUSTOMER_NOTE_MAX_LENGTH}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.customerNote && (
                <p className="text-sm text-red-500">{errors.customerNote}</p>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {formState.customerNote.length}/{CUSTOMER_NOTE_MAX_LENGTH}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {errors.general && (
        <div className="px-6">
          <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
            {errors.general}
          </p>
        </div>
      )}

      {/* 예상 금액 */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">예상 금액</span>
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(estimatedPrice)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {uncle.hourlyRate.toLocaleString()}원 × {formState.duration}시간
        </p>
      </div>

      {/* 버튼 */}
      <div className="p-6 border-t border-gray-100 flex gap-3">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            이전
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)
            }
            className="flex-1 py-3 text-white bg-primary-500 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            다음
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isStep3Valid || isSubmitting}
            className="flex-1 py-3 text-white bg-primary-500 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                요청 중...
              </span>
            ) : (
              '예약 요청'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
