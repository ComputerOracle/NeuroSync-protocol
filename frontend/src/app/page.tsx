"use client";

import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { StreakCard } from "../components/StreakCard";
import { SubmitProofModal } from "../components/SubmitProofModal";
import { useWallet } from "../context/WalletContext";
import { 
  Activity, ShieldCheck, Database, Info, 
  Binary, ExternalLink, MoonStar, Wallet, Loader2 
} from "lucide-react";
import * as motion from "framer-motion/client";

export default function Home() {
  const { publicKey, isConnected, isConnecting, connectWallet, disconnect } = useWallet();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background glow grids */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[140px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-12 relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left md:flex md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-12"
        >
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
              Verifiable Sleep Science <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Cryptographic Habit Loops
              </span>
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-md leading-relaxed">
              NeuroSync bridges pre-trained machine learning classifiers with Soroban smart contracts. 
              Upload biometric sleep telemetry, generate signed Oracle sleep proofs, and maintain decentralized health streaks on the Stellar blockchain.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex flex-wrap gap-4 justify-center md:justify-end items-center">
            {isConnected && publicKey ? (
              <div className="flex items-center space-x-2">
                <span className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 px-5 py-3 text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-sm">
                  {formatAddress(publicKey)}
                </span>
                <button
                  onClick={disconnect}
                  className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-455 transition-colors shadow-sm cursor-pointer"
                  title="Disconnect Wallet"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center space-x-2 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 text-sm font-semibold text-white transition-colors shadow-sm cursor-pointer"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
            <a
              href="https://stellar.expert/explorer/testnet/tx/ee0f5fdf442bf3f9779a5191d5be9790f52cb4526c9524dadd896100f54f470e"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              <span>Verify Contract</span>
              <ExternalLink className="h-4 w-4 text-slate-450 dark:text-slate-500" />
            </a>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Streaks and Submission */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              key={`streak-${refreshTrigger}`}
            >
              <StreakCard />
            </motion.div>

            {/* Action Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel rounded-3xl p-8 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
            >
              <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
              
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <MoonStar className="h-5 w-5 text-indigo-650 dark:text-indigo-400" />
                    <span>Upload Daily Sleep Log</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg">
                    Process metrics like duration, stress indicators, steps, and heart rates. The Oracle computes your sleep quality and signs a hash mapping to your stellar identity.
                  </p>
                </div>
              </div>

              {isConnected ? (
                <SubmitProofModal onSuccess={triggerRefresh} />
              ) : (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 text-center text-slate-500 dark:text-slate-400 text-sm shadow-sm flex flex-col items-center justify-center gap-4">
                  <p>Connect your Freighter wallet to start writing sleep verification proofs.</p>
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm cursor-pointer"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4" />
                        <span>Connect Wallet</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Info & Network Metrics */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel rounded-3xl p-6 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <h3 className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Network Status & Parameters
              </h3>
              
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Binary className="h-4 w-4" />
                    <span>Stellar Chain</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">TESTNET</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Database className="h-4 w-4" />
                    <span>Active Oracle</span>
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">ACTIVE</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Identity Provider</span>
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">Freighter Wallet</span>
                </div>
              </div>
            </motion.div>

            {/* DeSci Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-sm"
            >
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>How it works</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start space-x-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 text-[10px]">1</span>
                  <span><strong>Predict</strong>: Mock sleep parameters are processed by a scikit-learn classifier backend.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 text-[10px]">2</span>
                  <span><strong>Sign</strong>: The FastAPI backend generates a deterministic JSON payload and signs it using Ed25519.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 text-[10px]">3</span>
                  <span><strong>Verify</strong>: The Soroban smart contract validates the signature matches the Oracle's key and updates streak states.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NeuroSync Protocol. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="/docs" className="hover:text-slate-700 dark:hover:text-slate-350 transition-colors">Documentation</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
