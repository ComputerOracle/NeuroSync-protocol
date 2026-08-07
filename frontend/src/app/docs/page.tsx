"use client";

import React, { useState } from "react";
import { 
  BookOpen, ExternalLink, Brain, Activity, Sparkles, 
  ShieldCheck, Layers, Cpu, Copy, Check, FileText
} from "lucide-react";

interface ResearchPaper {
  id: string;
  category: string;
  categoryDesc: string;
  badge: string;
  journal: string;
  year: number;
  title: string;
  authors: string;
  doiLink: string;
  pmcLink?: string;
  mechanism: string;
  neurosyncProtocol: string;
  ruleTrigger: string;
  color: string;
}

const researchPapers: ResearchPaper[] = [
  {
    id: "glymphatic",
    category: "Glymphatic System & Brain Waste Clearance",
    categoryDesc: "Slow-wave delta sleep dynamics facilitating interstitial convective cerebrospinal fluid (CSF) flow.",
    badge: "Science • 2013",
    journal: "Science",
    year: 2013,
    title: "Sleep Drives Metabolite Clearance from the Adult Brain",
    authors: "Lulu Xie, Kang Kang, Qiwu Xu, Michael J. Chen, Yonghong Liao, Meenakshisundaram Thiyagarajan, John O'Donnell, Daniel J. Christensen, Charles Nicholson, Jeffrey J. Iliff, Takahiro Takano, Rashid Deane, Maiken Nedergaard",
    doiLink: "https://doi.org/10.1126/science.1241224",
    pmcLink: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3880190/",
    mechanism: "Demonstrates a 60% increase in brain interstitial space during deep slow-wave sleep, which dramatically increases convective exchange of cerebrospinal fluid (CSF) with interstitial fluid (ISF). This facilitates rapid clearing of neurotoxic metabolic waste, including amyloid-beta proteins and lactate.",
    neurosyncProtocol: "Powers the Deep Sleep < 15% alert. Triggers the thermal shifting protocol to lower core body temperature by 1.5°C prior to sleep onset, maximizing delta-wave duration.",
    ruleTrigger: "Deep Sleep % < 15%",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
  },
  {
    id: "adenosine",
    category: "Caffeine & Sleep Architecture",
    categoryDesc: "Purinergic signaling and competitive receptor antagonism governing sleep onset latency.",
    badge: "Sleep Medicine Reviews • 2017",
    journal: "Sleep Medicine Reviews",
    year: 2017,
    title: "Coffee, Caffeine, and Sleep: A Systematic Review",
    authors: "Ifeoluwa Clark, Hans-Peter Landolt",
    doiLink: "https://doi.org/10.1016/j.smrv.2016.01.006",
    mechanism: "Systematically analyzes competitive binding at central adenosine A1 and A2A receptors, highlighting caffeine's 5.7-hour average CYP1A2 metabolic half-life. Prolonged receptor occupancy inhibits homeostatic sleep drive (somnogens) and significantly elevates sleep onset latency.",
    neurosyncProtocol: "Powers the Sleep Latency > 25m alert. Enforces a personalized 10-hour caffeine clearance window prior to target sleep time to allow baseline adenosine accumulation.",
    ruleTrigger: "Sleep Latency > 25 mins",
    color: "from-purple-500/10 to-violet-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400"
  },
  {
    id: "autonomic",
    category: "Heart Rate Variability & Sleep Quality",
    categoryDesc: "Nocturnal autonomic nervous system modulation and parasympathetic vagal recovery.",
    badge: "Sleep Medicine Clinics • 2012",
    journal: "Sleep Medicine Clinics",
    year: 2012,
    title: "Heart Rate Variability, Sleep and Sleep Disorders",
    authors: "Phyllis K. Stein, Yachuan Pu",
    doiLink: "https://doi.org/10.1016/j.jsmc.2012.03.003",
    pmcLink: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3562891/",
    mechanism: "Establishes that high nocturnal parasympathetic activity (measured via HRV rMSSD) directly correlates with anabolic tissue repair and central nervous system recovery. Elevated nocturnal resting heart rate signals sympathetic dominance and chronic physiological stress.",
    neurosyncProtocol: "Powers the Elevated RHR / Low HRV alert. Triggers the pre-bed cyclic sighing protocol (two deep nasal inhales followed by one slow oral exhalation for 5 minutes) to activate vagal nerve firing.",
    ruleTrigger: "Resting HR > 65 BPM OR HRV < 55 ms",
    color: "from-rose-500/10 to-pink-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
  },
  {
    id: "rem-consolidation",
    category: "Memory Consolidation & REM Sleep",
    categoryDesc: "Rapid eye movement theta oscillations powering neural plasticity and affective regulation.",
    badge: "Neuron • 2004",
    journal: "Neuron",
    year: 2004,
    title: "Sleep-Dependent Learning and Memory Consolidation",
    authors: "Matthew P. Walker, Robert Stickgold",
    doiLink: "https://doi.org/10.1016/j.neuron.2004.08.031",
    mechanism: "Identifies REM sleep theta-wave (4-8 Hz) synchronization as the critical driver for affective neuro-processing, emotional recalibration, and procedural memory consolidation in the neocortex.",
    neurosyncProtocol: "Powers the REM Sleep < 20% alert. Recommends elimination of late-evening alcohol/sedatives and enforces evening blue-light attenuation to protect REM sleep architecture.",
    ruleTrigger: "REM Sleep % < 20%",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
  }
];

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const coreContractId = process.env.NEXT_PUBLIC_CONTRACT_ID || "CDJ47A6P6PWCG7ZQYO3BNEQ6FLFOTSRRENEH2V5TVXDBEET7YBL4JNWG";
  const distributorContractId = process.env.NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ID || "CC42VJLNLOCRSJHX3VXSVR3KOZG2YGFNT6TUEF2DV6TXYS6FGYMESQ3V";
  const tokenContractId = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ID || "CCBJ36QQMCTII5O3NLCUMEU2O3T2WZAM6ZYUNT4WOHGGMOS2R7JSAHDT";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background glow grids */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[140px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-10 relative z-10">
        
        {/* 1. Header & Vision */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8 space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Peer-Reviewed Science Library</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Neuroscience Research & Literature Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
            Explore the peer-reviewed clinical studies and neurobiological mechanisms behind NeuroSync&apos;s ML telemetry scoring and daily recovery protocols.
          </p>
        </div>

        {/* 2. Research Categories & Paper Cards */}
        <div className="space-y-10">
          {researchPapers.map((paper, idx) => (
            <section key={paper.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-black">
                      0{idx + 1}
                    </span>
                    <span>{paper.category}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    {paper.categoryDesc}
                  </p>
                </div>
              </div>

              {/* UI Component Paper Card */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-6 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${paper.color} blur-3xl pointer-events-none rounded-full`} />

                {/* Badge & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {paper.badge}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Clinical Research Reference</span>
                  </span>
                </div>

                {/* Section 1: Title & Authors */}
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 leading-snug">
                    &ldquo;{paper.title}&rdquo;
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Authors:</strong> {paper.authors}
                  </p>
                </div>

                {/* Section 2: Core Neurobiological Mechanism */}
                <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-1">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Core Neurobiological Mechanism</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed pt-1">
                    {paper.mechanism}
                  </p>
                </div>

                {/* Section 3: Applied NeuroSync Protocol */}
                <div className="rounded-2xl border border-blue-200/60 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20 p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Applied NeuroSync Protocol</span>
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                      Rule: {paper.ruleTrigger}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                    {paper.neurosyncProtocol}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={paper.doiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer group"
                  >
                    <span>Read Research Paper (DOI)</span>
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  {paper.pmcLink && (
                    <a
                      href={paper.pmcLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer group"
                    >
                      <span>Free Full Text (PMC)</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* 4. Technical Protocol Reference Footer */}
        <section className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Protocol & On-Chain Reference
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified smart contract artifacts and cryptographic classification engine parameters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {/* Core Contract */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Core Telemetry Contract</span>
                <button
                  onClick={() => copyToClipboard(coreContractId, "core")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Copy Address"
                >
                  {copiedId === "core" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-bold truncate">{coreContractId}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/contract/${coreContractId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
              >
                <span>Stellar Expert Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Reward Distributor */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Reward Distributor</span>
                <button
                  onClick={() => copyToClipboard(distributorContractId, "dist")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Copy Address"
                >
                  {copiedId === "dist" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-bold truncate">{distributorContractId}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/contract/${distributorContractId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
              >
                <span>Stellar Expert Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Token Contract */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">$NSYNC Token Contract</span>
                <button
                  onClick={() => copyToClipboard(tokenContractId, "token")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Copy Address"
                >
                  {copiedId === "token" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-bold truncate">{tokenContractId}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/contract/${tokenContractId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
              >
                <span>Stellar Expert Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* ML Classifier Model */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">ML Classifier Pipeline</span>
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-bold">Random Forest v2.3</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Scikit-Learn • Ed25519 Signed Inferences
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NeuroSync Protocol. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="/docs" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors font-bold text-blue-600 dark:text-blue-400">Documentation & Science</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
