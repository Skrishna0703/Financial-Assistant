import React, { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', icon: '🌐' },
  { code: 'hi', name: 'हिंदी', icon: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', icon: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', icon: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', icon: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', icon: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', icon: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', icon: '🇮🇳' }
];

const LanguageSelector = ({ onLanguageSelect, currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelector = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (languageCode) => {
    onLanguageSelect(languageCode);
    setIsOpen(false);
  };

  return (
    <>
      <button className="language-toggle" onClick={toggleSelector}>
        {languages.find(lang => lang.code === currentLanguage)?.icon || '🌐'}
      </button>
      
      {isOpen && (
        <div className="language-selector">
          {languages.map((language) => (
            <button
              key={language.code}
              className={currentLanguage === language.code ? 'active' : ''}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <span className="language-icon">{language.icon}</span>
              {language.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default LanguageSelector; 