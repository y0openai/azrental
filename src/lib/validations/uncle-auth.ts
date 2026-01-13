import { z } from 'zod';
import {
  UNCLE_MIN_AGE,
  MIN_BIO_LENGTH,
  HOURLY_RATE_MIN,
  HOURLY_RATE_MAX,
  MAX_PROFILE_IMAGES,
} from '@/types/uncle';
import { emailSchema, passwordSchema, phoneSchema } from './auth';

// Step 1: 기본 정보 스키마
export const basicInfoSchema = z.object({
  displayName: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(20, '이름은 20자 이하여야 합니다.'),
  age: z
    .number()
    .min(UNCLE_MIN_AGE, `만 ${UNCLE_MIN_AGE}세 이상만 신청 가능합니다.`)
    .max(100, '올바른 나이를 입력해주세요.'),
  bio: z
    .string()
    .min(MIN_BIO_LENGTH, `자기소개는 ${MIN_BIO_LENGTH}자 이상 작성해주세요.`)
    .max(1000, '자기소개는 1000자 이하여야 합니다.'),
  profileImages: z
    .array(z.string().url('유효하지 않은 이미지 URL입니다.'))
    .min(1, '프로필 사진을 1장 이상 업로드해주세요.')
    .max(MAX_PROFILE_IMAGES, `프로필 사진은 최대 ${MAX_PROFILE_IMAGES}장까지 가능합니다.`),
  mainImageIndex: z
    .number()
    .min(0)
    .max(MAX_PROFILE_IMAGES - 1),
});

// Step 2: 전문성 스키마
export const expertiseSchema = z.object({
  expertise: z
    .array(z.string())
    .min(1, '최소 1개의 전문성을 선택해주세요.')
    .max(10, '최대 10개까지 선택 가능합니다.'),
});

// Step 3: 요금 스키마
export const pricingSchema = z.object({
  hourlyRate: z
    .number()
    .min(HOURLY_RATE_MIN, `최소 요금은 ${HOURLY_RATE_MIN.toLocaleString()}원입니다.`)
    .max(HOURLY_RATE_MAX, `최대 요금은 ${HOURLY_RATE_MAX.toLocaleString()}원입니다.`),
  shortIntro: z
    .string()
    .min(10, '짧은 소개를 10자 이상 작성해주세요.')
    .max(100, '짧은 소개는 100자 이내로 작성해주세요.'),
});

// 시간대 스키마
const timeSlotSchema = z.object({
  morning: z.boolean(),
  afternoon: z.boolean(),
  evening: z.boolean(),
});

// Step 4: 일정 스키마
export const availabilitySchema = z.object({
  availability: z
    .object({
      mon: timeSlotSchema,
      tue: timeSlotSchema,
      wed: timeSlotSchema,
      thu: timeSlotSchema,
      fri: timeSlotSchema,
      sat: timeSlotSchema,
      sun: timeSlotSchema,
    })
    .refine(
      (data) =>
        Object.values(data).some(
          (day) => day.morning || day.afternoon || day.evening
        ),
      { message: '최소 1개의 가용 시간을 선택해주세요.' }
    ),
});

// 주민등록번호 스키마
export const ssnSchema = z
  .string()
  .length(13, '주민등록번호 13자리를 입력해주세요.')
  .regex(/^\d+$/, '숫자만 입력해주세요.');

// 아조씨용 전화번호 스키마 (필수)
export const unclePhoneSchema = z
  .string()
  .regex(/^010-?\d{4}-?\d{4}$/, '올바른 전화번호 형식이 아닙니다. (010-XXXX-XXXX)');

// 아조씨용 비밀번호 스키마 (대문자 필수)
export const unclePasswordSchema = z
  .string()
  .min(8, '비밀번호는 8자 이상이어야 합니다.')
  .max(50, '비밀번호는 50자 이하여야 합니다.')
  .regex(/[A-Z]/, '대문자를 1개 이상 포함해야 합니다.')
  .regex(/[0-9]/, '숫자를 1개 이상 포함해야 합니다.');

// Step 5: 신원 확인 스키마
export const verificationSchema = z
  .object({
    ssn: ssnSchema,
    phone: unclePhoneSchema,
    email: emailSchema,
    password: unclePasswordSchema,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    idCardImageUrl: z.string().url('신분증을 업로드해주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

// Step 6: 동의 스키마
export const agreementSchema = z.object({
  agreedTerms: z.literal(true, { message: '이용약관에 동의해주세요.' }),
  agreedPrivacy: z.literal(true, { message: '개인정보처리방침에 동의해주세요.' }),
  agreedCodeOfConduct: z.literal(true, { message: '아조씨 행동규칙에 동의해주세요.' }),
});

// 전체 회원가입 스키마
export const uncleSignupSchema = basicInfoSchema
  .merge(expertiseSchema)
  .merge(pricingSchema)
  .merge(availabilitySchema)
  .merge(verificationSchema)
  .merge(agreementSchema);

// 아조씨 로그인 스키마
export const uncleLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
  rememberMe: z.boolean().optional().default(false),
});

// 비밀번호 재설정 요청 스키마
export const uncleForgotPasswordSchema = z.object({
  email: emailSchema,
});

// 타입 추출
export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type ExpertiseInput = z.infer<typeof expertiseSchema>;
export type PricingInput = z.infer<typeof pricingSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type VerificationInput = z.infer<typeof verificationSchema>;
export type AgreementInput = z.infer<typeof agreementSchema>;
export type UncleSignupInput = z.infer<typeof uncleSignupSchema>;
export type UncleLoginInput = z.infer<typeof uncleLoginSchema>;
export type UncleForgotPasswordInput = z.infer<typeof uncleForgotPasswordSchema>;

// 각 단계별 스키마 배열 (인덱스 0 = Step 1)
export const stepSchemas = [
  basicInfoSchema,
  expertiseSchema,
  pricingSchema,
  availabilitySchema,
  verificationSchema,
  agreementSchema,
];

// 단계별 유효성 검사 함수
export function validateStep(step: number, data: unknown): { success: boolean; errors?: string[] } {
  const schema = stepSchemas[step - 1];
  if (!schema) {
    return { success: false, errors: ['유효하지 않은 단계입니다.'] };
  }

  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true };
  }

  const errors = result.error.issues.map((e) => e.message);
  return { success: false, errors };
}
