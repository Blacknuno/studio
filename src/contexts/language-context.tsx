
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fa';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  direction: Direction;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Mock translations - in a real app, this would come from i18n libraries and JSON files
// Basic structure, expand as needed
const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    ai_configurator: 'AI Configurator',
    user_management: 'User Management',
    node_plus: 'Node+',
    hosts: 'Hosts',
    server_nodes: 'Server Nodes',
    kernels: 'Kernels',
    panel_settings: 'Panel Settings',
    system_version_mock: 'System Version: 1.0.0 (Mock)',
    toggle_navigation_menu: 'Toggle navigation menu',
    protocol_pilot: 'ProtocolPilot',
    english: 'English',
    persian: 'Persian (فارسی)',
    // Login Page translations
    login_title: "ProtocolPilot Login",
    login_description: "Access your advanced protocol management panel.",
    login_default_creds_warning: "Default credentials are in use. Please change them in Panel Settings after login.",
    username_label: "Username",
    password_label: "Password",
    enter_username_placeholder: "Enter your username",
    enter_password_placeholder: "Enter your password",
    login_button: "Login",
    logging_in_button: "Logging in...",
    demo_credentials_note: "For demonstration: user `admin` or `{DEFAULT_USERNAME_FOR_SETUP}`, pass `password`.",
    login_successful: "Login Successful",
    welcome_back: "Welcome back!",
    initial_setup_required: "Initial Setup Required",
    please_change_credentials: "Please change your default username and password in Panel Settings.",
    login_failed: "Login Failed",
    invalid_credentials: "Invalid username or password.",
    // General UI
    save_settings: "Save Settings",
    cancel: "Cancel",
    add_new_user: "Add New User",
    edit_user: "Edit User",
  },
  fa: {
    dashboard: 'داشبورد',
    ai_configurator: 'پیکربندی با هوش مصنوعی',
    user_management: 'مدیریت کاربران',
    node_plus: 'Node+', // Consider a more descriptive Persian term if available
    hosts: 'میزبان‌ها',
    server_nodes: 'سرور نودها',
    kernels: 'هسته‌ها',
    panel_settings: 'تنظیمات پنل',
    system_version_mock: 'نسخه سیستم: ۱.۰.۰ (آزمایشی)',
    toggle_navigation_menu: 'تغییر منوی ناوبری',
    protocol_pilot: 'پروتکل پایلوت',
    english: 'English (انگلیسی)',
    persian: 'فارسی',
    // Login Page translations
    login_title: "ورود به پروتکل پایلوت",
    login_description: "به پنل مدیریت پیشرفته پروتکل خود دسترسی پیدا کنید.",
    login_default_creds_warning: "از اعتبارنامه‌های پیش‌فرض استفاده می‌شود. لطفاً پس از ورود به سیستم، آنها را در تنظیمات پنل تغییر دهید.",
    username_label: "نام کاربری",
    password_label: "رمز عبور",
    enter_username_placeholder: "نام کاربری خود را وارد کنید",
    enter_password_placeholder: "رمز عبور خود را وارد کنید",
    login_button: "ورود",
    logging_in_button: "در حال ورود...",
    demo_credentials_note: "برای نمایش: کاربر `admin` یا `{DEFAULT_USERNAME_FOR_SETUP}`، رمز `password`.",
    login_successful: "ورود موفقیت آمیز بود",
    welcome_back: "خوش آمدید!",
    initial_setup_required: "تنظیمات اولیه لازم است",
    please_change_credentials: "لطفاً نام کاربری و رمز عبور پیش‌فرض خود را در تنظیمات پنل تغییر دهید.",
    login_failed: "ورود ناموفق بود",
    invalid_credentials: "نام کاربری یا رمز عبور نامعتبر است.",
    // General UI
    save_settings: "ذخیره تنظیمات",
    cancel: "لغو",
    add_new_user: "افزودن کاربر جدید",
    edit_user: "ویرایش کاربر",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    const newDirection = language === 'fa' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = newDirection;
    }
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const translation = translations[language]?.[key] || fallback || key;
    // console.log(`Translating key: ${key}, lang: ${language}, result: ${translation}`); // For debugging
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, direction, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
