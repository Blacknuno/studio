
'use client';

import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, type Language } from '@/contexts/language-context';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; labelKey: string; flag: string }[] = [
    { code: 'en', labelKey: 'english', flag: '🇬🇧' }, // Using UK flag for English generally
    { code: 'fa', labelKey: 'persian', flag: '🇮🇷' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>
              {lang.flag} {t(lang.labelKey)}
            </span>
            {language === lang.code && <Check className="h-4 w-4 text-primary ms-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
