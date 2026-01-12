// Customer 인터페이스 - 고객 데이터 타입 정의
export interface Customer {
  uid: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  provider: 'email' | 'kakao' | 'naver';
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerCreateInput {
  email: string;
  password: string;
  displayName?: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

export interface CustomerUpdateInput {
  displayName?: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  agreements?: {
    terms?: boolean;
    privacy?: boolean;
    marketing?: boolean;
  };
}
