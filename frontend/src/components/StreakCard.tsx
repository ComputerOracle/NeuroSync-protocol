"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { fetchStreak } from "../utils/stellar";
import { Flame, Calendar, RefreshCw, AlertCircle, Wallet, Loader2 } from "lucide-react";

interface StreakData {
  count: number;
  lastTimestamp: number;
}

export const StreakCard: React.FC = () => {
  const { publicKey, isConnected, isConnecting, connectWallet } = useWallet();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadStreakData = async () => {
    if (!publicKey) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStreak(publicKey);
      if (data) {
        setStreak({
          count: data.count,
          lastTimestamp: data.last_timestamp,
        });
      } else {
        setStreak({ count: 0, lastTimestamp: 0 });
      }
    } catch (err) {
      console.error("Failed to load streak:", err);
      setError("Failed to fetch on-chain streak data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && publicKey) {
      loadStreakData();
    } else {
      setStreak(null);
    }
  }, [isConnected, publicKey]);

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "Never";
    const timestampMs = timestamp < 100000000000 ? timestamp * 1000 : timestamp;
    return new Date(timestampMs).toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isConnected) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-sm flex flex-col items-center justify-center transition-colors duration-300">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Connect Your Wallet</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">
          Please connect your Freighter wallet to view your active sleep streak and cryptographic telemetry proof.
        </p>
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
    );
  }

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-8 space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 skeleton rounded-md bg-slate-100 dark:bg-slate-800" />
          <div className="h-6 w-6 skeleton rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="flex items-center space-x-6">
          <div className="h-20 w-20 skeleton rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-2 flex-1">
            <div className="h-8 w-24 skeleton rounded-md bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-40 skeleton rounded-md bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl p-8 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold text-sm">RPC Node Query Error</span>
          </div>
          <button
            onClick={loadStreakData}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 animate-spin" />
          </button>
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">{error}</p>
        <button
          onClick={loadStreakData}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-semibold shadow-sm cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const rawStreak = streak?.count || 0;
  const lastSync = streak?.lastTimestamp || 0;
  
  // 48-hour streak reset check: if elapsed time > 48 hours (172,800 sec), streak is reset to 0
  const isStreakExpired = lastSync > 0 && (Date.now() > (lastSync * 1000 + 48 * 60 * 60 * 1000));
  const activeStreak = isStreakExpired ? 0 : rawStreak;

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-8 space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden transition-colors duration-300">
      {/* Background glow orb */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          On-Chain Habit State
        </h3>
        <button
          onClick={loadStreakData}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-all hover:scale-105 cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Streak value area */}
      <div className="flex items-center space-x-6 relative z-10">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm">
          <Flame className="h-12 w-12 animate-pulse text-blue-600 dark:text-blue-400" />
          {activeStreak > 0 && (
            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
              {activeStreak}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {activeStreak}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">days</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {activeStreak === 0
              ? "No active streak. Submit a sleep proof."
              : "Verifiable cryptographic habit loop active"}
          </p>
        </div>
      </div>

      {/* Sync Timestamp */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last Sync</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {formatDate(lastSync)}
          </p>
        </div>
      </div>
    </div>
  );
};
