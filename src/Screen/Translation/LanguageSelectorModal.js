// components/LanguageSelectorModal.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { setLanguage, getCurrentLanguage } from '../Translation/TranslationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetAndNavigate } from '../../Component/Utilities/NavigationUtil';
import { CommonActions } from '@react-navigation/native';


const LanguageSelectorModal = ({ visible, onClose, dispatch }) => {
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    const fetchLang = async () => {
      const lang = await getCurrentLanguage();
      setSelectedLang(lang);
    };
    fetchLang();
  }, []);

  const languages = [
    { label: 'English', code: 'en' },
    { label: 'Português', code: 'pt' },
  ];

//   const handleChange = async (code) => {
//     setSelectedLang(code);
//     await setLanguage(code);
//     onClose(); // or Alert.alert('Restart required');
//   };

const handleChange = async (code) => {
  try {
    console.log('set lang code ',code);
    setSelectedLang(code);            
    await setLanguage(code);           
    setTimeout(() => {
        resetAndNavigate('SplaceScreen');

    }, 1000);
    onClose();
  } catch (error) {
    console.log('Language change failed:', error);
  }
};

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Language</Text>
          {languages.map(({ label, code }) => (
            <TouchableOpacity
              key={code}
              onPress={() => handleChange(code)}
              style={styles.option}
            >
              <Text style={styles.text}>{label}</Text>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: code === selectedLang ? 'red' : 'gray',
                  },
                ]}
              >
                {code === selectedLang && <View style={styles.innerRadio} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRadio: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
  },
});

export default LanguageSelectorModal;
