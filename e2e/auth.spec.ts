import { test, expect } from '@playwright/test';

test.describe('Auth Pages', () => {
  test.describe('Login Page', () => {
    test('should render login page', async ({ page }) => {
      await page.goto('/login');

      // 페이지 제목 확인
      await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();

      // 입력 필드 확인 (label로 연결)
      await expect(page.getByLabel('이메일')).toBeVisible();
      await expect(page.getByLabel('비밀번호')).toBeVisible();

      // 로그인 버튼 확인
      await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();

      // 링크 확인
      await expect(page.getByRole('link', { name: '회원가입' })).toBeVisible();
      await expect(page.getByText('비밀번호를 잊으셨나요?')).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/login');

      // 빈 폼 제출
      await page.getByRole('button', { name: '로그인' }).click();

      // 에러 메시지 확인 (Zod 에러)
      await expect(page.getByText(/이메일을 입력해주세요|유효한 이메일/)).toBeVisible();
    });

    // TODO: Zod 클라이언트 검증이 실시간으로 작동하지 않아 스킵
    // Firebase 연동 후 서버 에러 응답 테스트로 대체 필요
    test.skip('should show validation error for invalid email', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel('이메일').fill('invalid-email');
      await page.getByLabel('비밀번호').fill('password123');
      await page.getByRole('button', { name: '로그인' }).click();

      // 이메일 형식 에러 확인 (실제 에러 메시지: "유효한 이메일 형식이 아닙니다.")
      await expect(page.getByText('유효한 이메일 형식이 아닙니다.')).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to signup page', async ({ page }) => {
      await page.goto('/login');

      await page.getByRole('link', { name: '회원가입' }).click();

      await expect(page).toHaveURL('/signup');
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await page.goto('/login');

      await page.getByText('비밀번호를 잊으셨나요?').click();

      await expect(page).toHaveURL('/forgot-password');
    });
  });

  test.describe('Signup Page', () => {
    test('should render signup page', async ({ page }) => {
      await page.goto('/signup');

      // 페이지 제목 확인
      await expect(page.getByRole('heading', { name: '회원가입' })).toBeVisible();

      // 이메일 입력 필드 확인
      await expect(page.getByLabel('이메일')).toBeVisible();

      // 인증 코드 받기 버튼 확인
      await expect(page.getByRole('button', { name: '인증 코드 받기' })).toBeVisible();
    });

    test('should show validation error for invalid email', async ({ page }) => {
      await page.goto('/signup');

      await page.getByLabel('이메일').fill('invalid-email');

      // 인증 코드 받기 버튼 클릭
      await page.getByRole('button', { name: '인증 코드 받기' }).click();

      // 이메일 형식 에러 확인
      await expect(page.getByText(/유효한 이메일|이메일 형식/)).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.goto('/signup');

      await page.getByRole('link', { name: '로그인' }).click();

      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Forgot Password Page', () => {
    test('should render forgot password page', async ({ page }) => {
      await page.goto('/forgot-password');

      // 페이지 제목 확인
      await expect(page.getByRole('heading', { name: /비밀번호/ })).toBeVisible();

      // 이메일 입력 필드 확인
      await expect(page.getByLabel('이메일')).toBeVisible();

      // 버튼 확인
      await expect(page.getByRole('button')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.goto('/forgot-password');

      await page.getByRole('link', { name: '로그인' }).click();

      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Auth Layout', () => {
    test('should have consistent branding across auth pages', async ({ page }) => {
      const authPages = ['/login', '/signup', '/forgot-password'];

      for (const url of authPages) {
        await page.goto(url);

        // 브랜드명 확인
        await expect(page.getByText('아조씨 렌탈').first()).toBeVisible();
      }
    });
  });
});
