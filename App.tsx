import React, { useState, useCallback } from 'react';
import { translateText } from './services/geminiService';
import { LANGUAGES } from './constants';
import { Language } from './types';
import LanguageSelector from './components/LanguageSelector';
import ResultDisplay from './components/ResultDisplay';
import { TranslateIcon } from './components/icons/TranslateIcon';
import { LoadingSpinner } from './components/LoadingSpinner';
import YouTubeSEO from './components/YouTubeSEO';

type Tab = 'translate' | 'seo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('translate');

  // Translator State
  const [inputText, setInputText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<Language>(LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const result = await translateText(inputText, targetLanguage.name);
      setTranslatedText(result);
    } catch (err) {
      setError('Failed to translate text. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, targetLanguage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
            Gemini AI Suite
          </h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-8">
            <button
              onClick={() => setActiveTab('translate')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'translate'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              Text Translator
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                activeTab === 'seo'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              YouTube SEO
            </button>
          </div>
        </header>

        <main>
          {activeTab === 'translate' ? (
            <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
              {/* Input Section */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to translate..."
                    className="w-full flex-grow bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none min-h-[200px] sm:min-h-[300px]"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <LanguageSelector
                    selectedLanguage={targetLanguage}
                    onSelectLanguage={setTargetLanguage}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleTranslate}
                    disabled={isLoading || !inputText.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Translating...
                      </>
                    ) : (
                      <>
                        <TranslateIcon />
                        Translate
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output Section */}
              <div className="flex-1">
                <ResultDisplay
                  text={translatedText}
                  isLoading={isLoading}
                  error={error}
                  targetLanguageName={targetLanguage.name}
                />
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <YouTubeSEO />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;