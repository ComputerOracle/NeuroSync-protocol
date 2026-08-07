"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import { 
  History, Calendar, BrainCircuit, ExternalLink, 
  Search, ShieldCheck, Database, Award, ArrowUpDown, Trash2
} from "lucide-react";
import * as motion from "framer-motion/client";

interface SubmissionRecord {
  timestamp: number;
  sleepScore: number;
  interpretation: string;
  txHash: string;
  sleepDuration: number;
  stressLevel: number;
  physicalActivity: number;
  steps: number;
  heartRate: number;
  signature?: string;
}

export default function HistoryPage() {
  const { publicKey, isConnected } = useWallet();
  const [history, setHistory] = useState<SubmissionRecord[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    if (isConnected && publicKey) {
      try {
        const stored = localStorage.getItem(`history_${publicKey}`);
        if (stored) {
          const parsed = JSON.parse(stored) as SubmissionRecord[];
          setHistory(parsed);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error("Error reading history from localStorage:", err);
      }
    } else {
      setHistory([]);
    }
  }, [isConnected, publicKey]);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your local submission log? This will not affect your on-chain records.")) {
      try {
        if (publicKey) {
          localStorage.removeItem(`history_${publicKey}`);
          setHistory([]);
        }
      } catch (err) {
        console.error("Error clearing history:", err);
      }
    }
  };

  const filteredHistory = history
    .filter(item => {
      const timestampMs = item.timestamp < 100000000000 ? item.timestamp * 1000 : item.timestamp;
      const dateStr = new Date(timestampMs).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
      const matchesSearch = 
        item.interpretation.toLowerCase().includes(search.toLowerCase()) ||
        item.txHash.toLowerCase().includes(search.toLowerCase()) ||
        dateStr.includes(search);
      
      if (activeFilter === "All") return matchesSearch;
      return matchesSearch && item.interpretation === activeFilter;
    })
    .sort((a, b) => {
      return sortOrder === "desc" 
        ? b.timestamp - a.timestamp 
        : a.timestamp - b.timestamp;
    });

  const categories = ["All", ...Array.from(new Set(history.map(h => h.interpretation)))];

  const formatTx = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-6)}`;
  const formatDate = (ts: number) => {
    if (!ts || ts === 0) return "N/A";
    const tsMs = ts < 100000000000 ? ts * 1000 : ts;
    return new Date(tsMs).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }) + " " + new Date(tsMs).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const avgScore = history.length 
    ? (history.reduce((acc, curr) => acc + curr.sleepScore, 0) / history.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background glow grids */}
      <div className="absolute top-0 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 h-[600px] w-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[140px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-8 relative z-10">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center space-x-3">
              <History className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span>Submission Ledger</span>
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-450 text-sm max-w-xl">
              Audit the cryptographic validation history of your biometric data proofs. All records here map directly to verified validator transactions on-chain.
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="self-start md:self-auto flex items-center space-x-2 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2.5 rounded-xl text-xs font-bold text-red-650 dark:text-red-400 transition-colors shadow-sm cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Local Logs</span>
            </button>
          )}
        </div>

        {!isConnected ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400 shadow-sm flex flex-col items-center justify-center gap-4">
            <Database className="h-12 w-12 text-slate-300 dark:text-slate-700 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-250">Wallet Not Connected</h3>
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-450">
              Please connect your Freighter browser wallet using the button in the navigation header to view your historical submission records.
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-16 text-center text-slate-500 dark:text-slate-400 shadow-sm flex flex-col items-center justify-center gap-4">
            <BrainCircuit className="h-16 w-16 text-blue-600 dark:text-blue-400 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Sleep Proofs Recorded</h3>
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-450">
              You haven't submitted any sleep telemetry logs from this wallet yet. Run a prediction and commit a signed proof on the Dashboard to build your cryptographic audit ledger!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Stat Summary Cards */}
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center space-x-4 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450 flex items-center justify-center border border-blue-200/50 dark:border-blue-900/50">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Verified Logs</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{history.length}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center space-x-4 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-655 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-900/50">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Average Sleep Quality</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{avgScore} <span className="text-xs font-semibold text-slate-400">/ 10</span></p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center space-x-4 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-900/50">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Verification Standard</p>
                  <p className="text-md font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 mt-1">
                    <ShieldCheck className="h-4 w-4" />
                    <span>ED25519-Soroban</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Filter and Table Panel */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              
              {/* Search and filter row */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by hash or classification..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                        activeFilter === cat 
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all flex items-center space-x-1 cursor-pointer"
                    title="Toggle Date Sorting"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase">Date</span>
                  </button>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto rounded-2xl border border-slate-150 dark:border-slate-850">
                <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-850 text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-xs font-bold tracking-wider uppercase">
                    <tr>
                      <th className="px-6 py-4">TIMESTAMP</th>
                      <th className="px-6 py-4">SCORE</th>
                      <th className="px-6 py-4">CLASSIFICATION</th>
                      <th className="px-6 py-4">DETAILS</th>
                      <th className="px-6 py-4">TRANSACTION HASH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {filteredHistory.map((item) => (
                      <tr 
                        key={item.txHash}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 text-slate-800 dark:text-slate-300 font-sans">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{formatDate(item.timestamp)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                          {item.sleepScore} <span className="text-[10px] text-slate-400">/ 10</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-sans font-semibold">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            item.sleepScore >= 7
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40"
                              : item.sleepScore >= 5
                                ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                                : "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-250 dark:border-red-900/40"
                          }`}>
                            {item.interpretation}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-sans text-[11px] text-slate-500 dark:text-slate-455 max-w-[200px] truncate">
                          {item.sleepDuration}h sleep | {item.stressLevel}/10 stress | {item.steps.toLocaleString()} steps
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-blue-600 dark:text-blue-400 font-semibold font-mono">
                          <a 
                            href={`https://stellar.expert/explorer/testnet/tx/${item.txHash}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 hover:underline"
                          >
                            <span>{formatTx(item.txHash)}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredHistory.length === 0 && (
                <div className="text-center py-10 text-slate-400 dark:text-slate-550 font-sans">
                  No records match your search criteria. Try a different query.
                </div>
              )}

            </div>
          </div>
        )}

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
