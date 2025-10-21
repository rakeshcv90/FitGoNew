// utils/translationService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../Translation/Translations';

let currentLang = 'en'; // fallback default

export const loadLanguage = async () => {
  const savedLang = await AsyncStorage.getItem('app_language');

  currentLang = savedLang || 'en';
};

export const setLanguage = async (lang) => {
 
  currentLang = lang;
 
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