import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    console.log('User language:', userLang);
    const isItalian = userLang.includes('it');

    const intervalId = setInterval(() => {
      const googleTranslateElement = document.querySelector('.goog-te-combo');

      if (googleTranslateElement) {
        clearInterval(intervalId);
        googleTranslateElement.value = 'it';
        googleTranslateElement.dispatchEvent(new Event('change'));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return null;
};

export default GoogleTranslate;
