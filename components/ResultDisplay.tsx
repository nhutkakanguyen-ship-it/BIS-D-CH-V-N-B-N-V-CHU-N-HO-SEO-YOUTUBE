import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  text: string;
  isLoading: boolean;
  error: string | null;
  targetLanguageName: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ text, isLoading, error, targetLanguageName }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
    }
  };

  const handleDownload = () => {
    if (text) {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'translation.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Translating...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-center text-red-400">
          <p>{error}</p>
        </div>
      );
    }
    if (text) {
      return <p className="text-gray-200 whitespace-pre-wrap">{text}</p>;
    }
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Translation will appear here.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col min-h-[258px] sm:min-h-[358px]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-300">{targetLanguageName}</h2>
        {text && !error && !isLoading && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Download as .txt"
            >
              <DownloadIcon />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Copy to clipboard"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        )}
      </div>
      <div className="flex-grow bg-gray-800 p-2 rounded-md overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultDisplay;