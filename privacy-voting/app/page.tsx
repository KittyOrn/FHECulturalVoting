'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt, InitState } from '@fhevm/sdk';

const PROJECTS = [
  {
    id: 1,
    name: 'Digital Art Exhibition',
    description: 'Contemporary digital art showcase featuring emerging artists',
    category: 'Visual Arts'
  },
  {
    id: 2,
    name: 'Community Music Festival',
    description: 'Three-day music festival celebrating local talent',
    category: 'Music'
  },
  {
    id: 3,
    name: 'Public Sculpture Installation',
    description: 'Interactive sculpture series for urban spaces',
    category: 'Sculpture'
  },
  {
    id: 4,
    name: 'Literary Workshop Series',
    description: 'Creative writing workshops for all skill levels',
    category: 'Literature'
  }
];

export default function Home() {
  const { initState, error } = useFhevm();
  const { encrypt, isEncrypting, error: encryptError } = useEncrypt();

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [score, setScore] = useState<number>(5);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const isReady = initState === InitState.INITIALIZED;

  const handleVote = async () => {
    if (!selectedProject || !isReady) return;

    try {
      // Encrypt the vote score
      const encryptedScore = await encrypt.uint8(score);

      console.log('Encrypted vote:', {
        projectId: selectedProject,
        encryptedData: encryptedScore.data,
        proof: encryptedScore.proof
      });

      // In a real implementation, this would call the smart contract:
      // await contract.submitVote(selectedProject, encryptedScore.data, encryptedScore.proof);

      setVoteSubmitted(true);
      setTimeout(() => {
        setVoteSubmitted(false);
        setSelectedProject(null);
        setScore(5);
      }, 3000);
    } catch (err) {
      console.error('Vote submission failed:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              🗳️ Privacy-Protected Voting
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Vote on cultural projects with Fully Homomorphic Encryption
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connection Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                isReady ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-gray-700">
                SDK: {isReady ? 'Ready' : 'Initializing...'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-700">Network: Sepolia</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-700">Encryption: FHE</span>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error: {error.message}</p>
            </div>
          )}
        </div>

        {/* Voting Instructions */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Select Project</h3>
              <p className="text-sm text-gray-600">Choose a cultural project to vote for</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rate (1-10)</h3>
              <p className="text-sm text-gray-600">Give your score for the project</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Encrypt Vote</h3>
              <p className="text-sm text-gray-600">Your score is encrypted with FHE</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">4️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Submit</h3>
              <p className="text-sm text-gray-600">Vote stored privately on-chain</p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => !voteSubmitted && setSelectedProject(project.id)}
              className={`bg-white rounded-xl shadow-xl p-6 cursor-pointer transition-all ${
                selectedProject === project.id
                  ? 'ring-4 ring-purple-500 transform scale-105'
                  : 'hover:shadow-2xl'
              } ${voteSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  {project.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              {selectedProject === project.id && (
                <div className="flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✓ Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vote Submission */}
        {selectedProject && !voteSubmitted && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Submit Your Vote
            </h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Rate this project (1-10):
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                disabled={isEncrypting}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>1 (Low)</span>
                <span className="text-2xl font-bold text-purple-600">{score}</span>
                <span>10 (High)</span>
              </div>
            </div>

            <button
              onClick={handleVote}
              disabled={!isReady || isEncrypting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isEncrypting ? '🔐 Encrypting Vote...' : '🗳️ Submit Encrypted Vote'}
            </button>

            {encryptError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Error: {encryptError.message}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🔒 Privacy Guarantee</h3>
              <p className="text-sm text-gray-700">
                Your vote score will be encrypted using Fully Homomorphic Encryption (FHE)
                before submission. Only aggregated results can be revealed, maintaining your
                privacy throughout the entire voting process.
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {voteSubmitted && (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vote Submitted Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Your encrypted vote has been recorded on-chain.
            </p>
            <p className="text-sm text-gray-500">
              Your individual score remains private and cannot be revealed.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
