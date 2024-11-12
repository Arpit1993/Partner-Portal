import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { LANGUAGES } from 'i18n/config';
import { MenuItem } from '@mui/material';
import Select from 'core-components/Select';
import i18next from 'i18next';
import { ReactComponent as USFlag } from 'assets/us.svg';
import { ReactComponent as ChinaFlag } from 'assets/zh.svg';

const getLocaleDisplayName = (locale: string, displayLocale?: string) => {
  const displayName = new Intl.DisplayNames([displayLocale || locale], {
    type: 'language'
  }).of(locale)!;
  return displayName.charAt(0).toLocaleUpperCase() + displayName.slice(1);
};

export default function LanguageSelector({
  narrow = false
}: {
  narrow?: boolean;
}) {
  const { i18n } = useTranslation();
  const flagsArray = {
    en: <USFlag />,
    'zh-Hans': <ChinaFlag />
  };
  const localesAndNames = useMemo(() => {
    return LANGUAGES.map((locale) => ({
      locale,
      name: getLocaleDisplayName(locale),
      icon: flagsArray[locale as keyof typeof flagsArray]
    }));
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const languageChanged = useCallback(async (locale: any) => {
    i18next.changeLanguage(locale);
  }, []);

  const { resolvedLanguage: currentLanguage } = i18n;
  // console.log('Current language:', currentLanguage);

  return (
    <Select
      labelId="langSelectorLabel"
      sx={{
        width: '100%',
        background: '#f0f4f4',
        '& .MuiSelect-select': {
          padding: '8px 32px 8px 8px',
          '& svg': { marginRight: '8px' }
        }
      }}
      id="langSelector"
      value={currentLanguage}
      onChange={(event) => languageChanged(event.target.value as string)}
    >
      {localesAndNames.map(({ locale, name, icon }) => (
        <MenuItem
          key={locale}
          value={locale}
          sx={{ '& svg': { marginRight: '8px' } }}
          disabled={locale === 'zh-Hans'}
        >
          {icon}
          {narrow ? '' : name}
        </MenuItem>
      ))}
    </Select>
  );
}
