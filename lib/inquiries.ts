import { supabaseServer } from './supabase-server';

/* ======================
   타입 정의
====================== */

export interface PersonalInquiry {
  type: 'personal';
  name: string;
  phone: string;
  gift_type: string;
  budget: string;
  quantity: string;
  message?: string;
  privacy_consent?: boolean;
  privacy_consent_at?: string;  
}

export interface BusinessInquiry {
  type: 'business';
  name: string;
  phone: string;
  email?: string;
  company_name: string;
  purpose: string;
  quantity: string;
  budget_per_unit: string;
  delivery_type: string;
  desired_date?: string | null;
  message?: string;
  privacy_consent?: boolean;
  privacy_consent_at?: string;  
}

export type Inquiry = PersonalInquiry | BusinessInquiry;

/* ======================
   DB 저장 함수
====================== */

export async function saveInquiry(inquiry: Inquiry) {
  const { data, error } = await supabaseServer
    .from('inquiries')
    .insert(inquiry)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return data;
}
