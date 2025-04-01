import React from 'react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
];

// SVG data URL for the translate icon
const translateIconUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z'/%3E%3C/svg%3E";

const Translator = ({ currentMessage, onTranslate, activeLanguage }) => {
  return (
    <div className="translation-options">
      <div className="translation-header">
        <img src={translateIconUrl} alt="Translate" className="translation-icon" />
        <span className="translation-title">Select Language</span>
      </div>
      
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-button ${activeLanguage === lang.code ? 'active' : ''}`}
            onClick={() => onTranslate(currentMessage, lang.code)}
          >
            <span className="native-name">{lang.nativeName}</span>
            <span className="english-name">{lang.name}</span>
          </button>
        ))}
      </div>

      <div className="translation-note">
        AI-powered translations • Not 100% accurate
      </div>
    </div>
  );
};

export default Translator; 