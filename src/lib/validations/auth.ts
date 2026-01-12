import { z } from 'zod';
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '@/types/auth';

// 이메일 검증 스키마
export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .email('유효한 이메일 형식이 아닙니다.');

// 비밀번호 검증 스키마
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`)
  .max(PASSWORD_MAX_LENGTH, `비밀번호는 ${PASSWORD_MAX_LENGTH}자 이하여야 합니다.`)
  .regex(/[A-Za-z]/, '비밀번호에 영문자가 포함되어야 합니다.')
  .regex(/[0-9]/, '비밀번호에 숫자가 포함되어야 합니다.')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, '비밀번호에 특수문자가 포함되어야 합니다.');

// 전화번호 검증 스키마
export const phoneSchema = z
  .string()
  .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '유효한 전화번호 형식이 아닙니다.')
  .optional()
  .or(z.literal(''));

// 로그인 폼 스키마
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// 회원가입 폼 스키마
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    displayName: z
      .string()
      .min(2, '이름은 2자 이상이어야 합니다.')
      .max(20, '이름은 20자 이하여야 합니다.')
      .optional()
      .or(z.literal('')),
    phone: phoneSchema,
    agreements: z.object({
      terms: z.boolean().refine((val) => val === true, {
        message: '서비스 이용약관에 동의해주세요.',
      }),
      privacy: z.boolean().refine((val) => val === true, {
        message: '개인정보 처리방침에 동의해주세요.',
      }),
      marketing: z.boolean(),
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

// 인증 코드 스키마
export const verificationCodeSchema = z
  .string()
  .length(6, '인증 코드는 6자리입니다.')
  .regex(/^[0-9]+$/, '인증 코드는 숫자만 입력 가능합니다.');

// 비밀번호 재설정 요청 스키마
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// 비밀번호 재설정 스키마
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

// 타입 추출
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type VerificationCodeInput = z.infer<typeof verificationCodeSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// 비밀번호 강도 체크
export function getPasswordStrength(password: string): {
  score: number;
  label: '약함' | '보통' | '강함' | '매우 강함';
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 2) {
    return { score, label: '약함', color: '#DC3545' };
  } else if (score <= 4) {
    return { score, label: '보통', color: '#FFC107' };
  } else if (score <= 5) {
    return { score, label: '강함', color: '#28A745' };
  }
  return { score, label: '매우 강함', color: '#198754' };
}
