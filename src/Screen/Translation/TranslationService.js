// utils/translationService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../Translation/Translations';

let currentLang = 'pt'; // fallback default

export const loadLanguage = async () => {
  const savedLang = await AsyncStorage.getItem('app_language');
  console.log('saved lang',savedLang);
  currentLang = savedLang || 'en';
};

export const setLanguage = async (lang) => {
  console.log('langa code ',lang);
  currentLang = lang;
    console.log('set langa code ',currentLang);
  await AsyncStorage.setItem('app_language', lang,);
};

export const translate = (key) => {
  return translations[currentLang]?.[key] || key;
};

export const getCurrentLanguage = () => currentLang;




// import { setLanguage } from '../../utils/translationService';

// const handleLangChange = async (langCode) => {
//   await setLanguage(langCode);
//   Alert.alert('Language changed! Restart app to apply.'); // or force reload
// };