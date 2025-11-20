import React, { useState } from 'react';
import { generateYoutubeSeo, YoutubeSeoResult } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-md hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
      title="Copy"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
};

const YouTubeSEO: React.FC = () => {
  const [title, setTitle] = useState('');
  const [result, setResult] = useState<YoutubeSeoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateYoutubeSeo(title);
      setResult(data);
    } catch (err) {
      setError('Failed to generate SEO content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <p className="text-gray-400 mt-2">Optimize your video reach with AI-generated metadata.</p>
      </header>

      {/* Input Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">Video Title</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., How to make authentic Pho at home"
            className="flex-grow bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !title.trim()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? <LoadingSpinner /> : 'Generate'}
          </button>
        </div>
        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
      </div>

      {/* Results Section */}
      {result && (
        <div className="grid grid-cols-1 gap-6">
          
          {/* Hashtags */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-200">Hashtags</h3>
              <CopyButton text={result.hashtags.join(' ')} />
            </div>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((tag, index) => (
                <span key={index} className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-900/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-200">Description</h3>
              <CopyButton text={result.description} />
            </div>
            <div className="bg-[#1f2937] border border-gray-600 p-5 rounded-lg text-gray-200 whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
              {result.description}
            </div>
          </div>

          {/* Keywords/Tags */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-200">Keywords (Tags)</h3>
              <CopyButton text={result.keywords.join(', ')} />
            </div>
            <div className="bg-gray-700 p-4 rounded-md text-gray-300 font-mono text-sm border border-gray-600/50">
              {result.keywords.join(', ')}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default YouTubeSEO;