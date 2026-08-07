"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "../context/WalletContext";
import { useTheme } from "../context/ThemeContext";
import { 
  Activity, Wallet, LogOut, Loader2, Sun, Moon, 
  ChevronDown, Copy, Check, ExternalLink, Network, Info
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { publicKey, balance, isConnected, isConnecting, connectWallet, disconnect, network } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Dropdown states
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [oracleHovered, setOracleHovered] = useState(false);

  const walletRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (walletRef.current && !walletRef.current.contains(e.target as Node)) {
        setWalletDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Ledger", href: "/history" },
    { label: "Rewards", href: "/rewards" },
    { label: "Analytics", href: "/analytics" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Docs", href: "/docs" }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-550/10 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <Activity className="h-5 w-5 animate-pulse group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-slate-900 dark:text-slate-50 uppercase">
                NEURO<span className="text-blue-600 dark:text-blue-400">SYNC</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest -mt-1">
                Protocol v1
              </span>
            </div>
          </Link>

          {/* AI Oracle Status Badge */}
          <div 
            className="relative hidden sm:block"
            onMouseEnter={() => setOracleHovered(true)}
            onMouseLeave={() => setOracleHovered(false)}
          >
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 cursor-help select-none">
              <span className="h-2 w-2 rounded-full bg-emerald-550 dark:bg-emerald-450 animate-ping absolute" />
              <span className="h-2 w-2 rounded-full bg-emerald-550 dark:bg-emerald-450 relative" />
              <span>Oracle Online</span>
            </span>

            {/* Oracle Details Popover */}
            {oracleHovered && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Classifier Node</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-semibold text-slate-850 dark:text-slate-200">Random Forest v2.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-semibold text-slate-850 dark:text-slate-200">94.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="font-semibold text-slate-850 dark:text-slate-200">~126 ms</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1.5">
          {navLinks.map((link) => {
            const isActive = link.href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-205 ${
                  isActive 
                    ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Wallet Connection, Theme Switcher & Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm cursor-pointer"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="h-4.5 w-4.5" />
            ) : (
              <Sun className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Web3 Controls */}
          {isConnected && publicKey ? (
            <div className="flex items-center space-x-2">
              
              {/* Network Pill */}
              <div className={`hidden md:flex items-center space-x-1.5 rounded-xl border px-3.5 py-2 text-[10px] font-black uppercase tracking-wider ${
                network === "TESTNET"
                  ? "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-blue-600 dark:text-blue-400"
                  : "border-amber-250 dark:border-amber-900 bg-amber-50 dark:bg-amber-955/30 text-amber-600 dark:text-amber-400"
              }`}>
                <Network className="h-3.5 w-3.5" />
                <span>{network === "TESTNET" ? "Testnet" : `⚠️ ${network || "Standalone"} Mode`}</span>
              </div>

              {/* Wallet Dropdown & Details */}
              <div className="relative" ref={walletRef}>
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center space-x-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 p-2 pl-3.5 shadow-sm text-sm font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                >
                  <span className="hidden sm:inline font-mono">
                    {formatAddress(publicKey)}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${walletDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-850 mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connected Wallet</p>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 font-mono break-all">{publicKey}</p>
                    </div>

                    <div className="px-3 py-2 flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Stellar Balance</span>
                      <span className="font-extrabold text-slate-850 dark:text-slate-100">
                        {balance !== null ? `${parseFloat(balance).toLocaleString()} XLM` : "Loading..."}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={handleCopy}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        <span>Copy Address</span>
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        <span>View on Explorer</span>
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </a>

                      <button
                        onClick={() => {
                          setWalletDropdownOpen(false);
                          disconnect();
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-850 mt-1 pt-2"
                      >
                        <span>Disconnect</span>
                        <LogOut className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="group relative flex items-center space-x-2 overflow-hidden rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>

      {/* Mobile navigation links drawer/bar for screen widths below desktop */}
      <div className="lg:hidden border-t border-slate-150 dark:border-slate-850 px-6 py-2.5 flex items-center justify-between overflow-x-auto space-x-4">
        {navLinks.map((link) => {
          const isActive = link.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap py-1 ${
                isActive 
                  ? "text-blue-650 dark:text-blue-400 border-b-2 border-blue-500" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-850"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
