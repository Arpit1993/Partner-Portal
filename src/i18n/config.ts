/* eslint-disable no-useless-computed-key */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

export const LANGUAGES = ['en', 'zh-Hans'];

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string) => import(`./locales/${language}.json`)
    )
  )
  .init({
    debug: true,
    fallbackLng: {
      zh: ['zh-Hans'],
      ['zh-CN']: ['zh-Hans'],
      ['zh-HK']: ['zh-Hans'],
      ['zh-TW']: ['zh-Hans'],
      default: ['en']
    }
  });
