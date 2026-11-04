import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { 
    Zap, Brain, Shield, Crosshair, 
    Stethoscope, Activity, ArrowRight, Download 
} from 'lucide-react';

const CountUp = ({ to, duration = 2, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (prefersReducedMotion) {
            setCount(to);
            return;
        }

        let startTime = null;
        let animationFrame;
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
                    
                    // easeOutQuart
                    const easeProgress = 1 - Math.pow(1 - progress, 4);
                    
                    setCount(Math.floor(easeProgress * to));
                    
                    if (progress < 1) {
                        animationFrame = window.requestAnimationFrame(step);
                    }
                };
                animationFrame = window.requestAnimationFrame(step);
                observer.disconnect();
            }
        });

        if (nodeRef.current) {
            observer.observe(nodeRef.current);
        }

        return () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            observer.disconnect();
        };
    }, [to, duration, prefersReducedMotion]);

    return (
        <span ref={nodeRef}>
            {count}{suffix}
        </span>
    );
};

export default function Home({ onInstall, canInstall }) {
    const { scrollY } = useScroll();
    const prefersReducedMotion = useReducedMotion();
    
    // Parallax effect for the hero text
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroY = useTransform(scrollY, [0, 300], [0, prefersReducedMotion ? 0 : -40]);

    const badges = [
        "⚡ 100% On-Device & Offline AI",
        "🎯 Fitzpatrick V/VI Bias Calibrated",
        "🩺 3-Step Guided Rural Triage",
        "🗺️ Real-Time Outbreak Surveillance",
        "🗣️ 7 Indian Languages (Bhashini TTS)",
        "🏥 NHA HFR & Fast2SMS Directives",
        "🔒 Zero Cloud Uploads by Default"
    ];

    const features = [
        {
            icon: <Stethoscope size={28} className="text-teal-400" />,
            title: "Guided Rural Triage Workflow",
            description: "A tailored 3-step operator flow (Patient Details, 7-Question Clinical History, Guided Camera Scan) designed specifically for frontline ASHA / rural health workers."
        },
        {
            icon: <Crosshair size={28} className="text-teal-400" />,
            title: "Fitzpatrick V & VI Melanin Calibration",
            description: "Surmounts fair-skin bias in clinical AI with specialized sub-epidermal microvascular and melanin-adjusted pipelines optimized for Indian skin tones."
        },
        {
            icon: <Zap size={28} className="text-teal-400" />,
            title: "100% Offline Diagnostic Intelligence",
            description: "On-device feature matching and inference runs entirely in your browser with zero internet required. Never blocked by spotty rural network connectivity."
        },
        {
            icon: <Shield size={28} className="text-teal-400" />,
            title: "Real-Time Outbreak Surveillance",
            description: "Anonymized epidemiological cluster detection flags contagious spikes (e.g. Scabies, Tinea) across rural village corridors within a 72-hour sliding window."
        },
        {
            icon: <Brain size={28} className="text-teal-400" />,
            title: "Multilingual Bhashini Voice Guidance",
            description: "Supports 7 Indian languages (Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, English) with voice text-to-speech guidance for low-literacy environments."
        },
        {
            icon: <Activity size={28} className="text-teal-400" />,
            title: "NHA HFR & Fast2SMS Directives",
            description: "Automatically resolves nearest Primary Health Centres from the National Health Facility Registry and generates actionable referral slips with SMS dispatch."
        }
    ];

    return (
        <div className="relative min-h-screen w-full font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Global Fixed Video Background */}
            <div className="fixed inset-0 z-0 bg-black">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-100"
                    src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
                />
                {/* Very light overlay just to keep white text readable, but leaves video 100% visible */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            </div>

            {/* Custom Marquee CSS */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-marquee {
                        animation: none;
                        transform: none;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                }
            `}} />

            {/* 1. HERO SECTION */}
            <header className="relative z-10 min-h-screen flex flex-col justify-center border-b border-white/5 w-full">
                {/* Ambient glow behind hero */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                {/* Top Nav (Minimal -> Full) */}
                <nav className="absolute top-0 left-0 w-full px-8 py-8 flex justify-between items-center z-20">
                    {/* Left Logo */}
                    <div className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-[spin_10s_linear_infinite]">
                            <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12" stroke="url(#luma-logo-grad)" strokeWidth="3" strokeLinecap="round"/>
                            <circle cx="21" cy="12" r="1.5" fill="#F472B6" />
                            <defs>
                                <linearGradient id="luma-logo-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#34D399" />
                                    <stop offset="1" stopColor="#F472B6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="text-2xl font-bold tracking-tight text-white flex items-baseline">
                            Luma<span className="text-pink-500">.</span>
                        </span>
                    </div>

                    {/* Center Nav */}
                    <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#A6ADBB]">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
                        <a href="#security" className="hover:text-white transition-colors">Security</a>
                    </div>

                    {/* Right Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#" className="text-sm font-semibold text-[#A6ADBB] hover:text-white transition-colors">Sign In</a>
                        <Link to="/skin" className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </nav>

                <motion.div 
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="relative z-10 mx-auto w-full px-6 lg:px-12 pt-20 text-center flex flex-col items-center justify-center"
                >
                    {/* Launch Pill */}
                    <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-bold tracking-widest uppercase">
                        <Zap size={14} /> LUMA 2.0 IS LIVE
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FA] leading-[1.2] mb-8 text-center w-full max-w-4xl">
                        Clinical dermatology and skincare AI — <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-pink-500">
                            that works completely offline.
                        </span>
                    </h1>
                    
                    <p className="mx-auto w-full px-4 text-lg md:text-xl font-medium leading-relaxed text-[#C7CCD6] mb-12 text-center max-w-3xl">
                        Luma runs real diagnostic AI entirely on your device — zero-install friction, instant camera access, built for the 600 million+ people in rural India without easy access to a dermatologist.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                        <Link 
                            to="/triage"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-teal-400 text-lg font-bold text-slate-950 transition-all hover:bg-teal-300 hover:scale-[1.02] shadow-[0_0_35px_-5px_rgba(45,212,191,0.6)]"
                            style={{ padding: '1rem 2.2rem', minHeight: '3.5rem' }}
                        >
                            <Stethoscope size={22} />
                            Start Clinical Triage
                            <ArrowRight size={18} />
                        </Link>
                        <Link 
                            to="/map"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-red-500/20 border border-red-500/40 text-lg font-bold text-red-200 transition-all hover:bg-red-500/30 hover:scale-[1.02] backdrop-blur-md"
                            style={{ padding: '1rem 2rem', minHeight: '3.5rem' }}
                        >
                            <span className="size-2.5 rounded-full bg-red-400 animate-ping mr-1" />
                            Outbreak Map
                        </Link>
                        <Link 
                            to="/skin"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#10141D] border border-white/10 text-lg font-bold text-white transition-all hover:bg-[#1A202C] hover:scale-[1.02] backdrop-blur-md"
                            style={{ padding: '1rem 2rem', minHeight: '3.5rem' }}
                        >
                            Skin Scan
                        </Link>
                    </div>
                </motion.div>
            </header>

            {/* 2. TRUST / POSITIONING BANNER */}
            <section 
                className="relative z-10 w-full border-b border-white/5 overflow-hidden flex flex-col items-center justify-center bg-black/20 backdrop-blur-md"
                style={{ padding: '4rem 0' }}
            >
                <span 
                    className="text-base font-bold tracking-widest text-[#A6ADBB] uppercase px-6 text-center w-full"
                    style={{ marginBottom: '3rem' }}
                >
                    Built for Real-World Conditions
                </span>
                
                <div className="w-full overflow-hidden flex flex-col items-center relative" aria-hidden="true">
                    {/* Shadow edges for smooth fade */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#0B0F1A] to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#0B0F1A] to-transparent z-10" />
                    
                    <div className="flex w-max animate-marquee gap-12 px-4 justify-center items-center">
                        {[...badges, ...badges].map((badge, idx) => (
                            <span 
                                key={idx} 
                                className="flex-none rounded-full bg-white/5 border border-white/10 text-xl font-semibold text-[#F5F7FA] whitespace-nowrap flex items-center justify-center"
                                style={{ padding: '1rem 2.5rem', minHeight: '3.5rem' }}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURE GRID */}
            <section 
                id="features"
                className="relative z-10 w-full flex flex-col items-center justify-center"
                style={{ padding: '6rem 0' }}
            >
                <div className="w-full max-w-7xl px-6 lg:px-12 flex flex-col items-center justify-center">
                    <div className="mb-16 md:mb-24 text-center w-full flex flex-col items-center justify-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#F5F7FA] mb-6 text-center w-full">
                            Built for Real-World <br className="hidden md:block"/>Healthcare Access
                        </h2>
                        <p className="text-xl text-[#A6ADBB] leading-relaxed text-center w-full px-4 max-w-3xl">
                            Everything Luma does is designed to work without reliable internet, on devices people actually own.
                        </p>
                    </div>

                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 w-full justify-center">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: prefersReducedMotion ? 0 : idx * 0.1,
                                    ease: "easeOut"
                                }}
                                className="flex flex-col items-center justify-center text-center rounded-3xl border border-white/5 bg-white/[0.02] p-10 hover:bg-white/[0.04] transition-colors backdrop-blur-sm"
                            >
                                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 shadow-[0_0_15px_-3px_rgba(20,184,166,0.2)]">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-[#F5F7FA] text-center w-full">
                                    {feature.title}
                                </h3>
                                <p className="text-[#A6ADBB] leading-relaxed flex-grow text-center w-full">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. STATS / PROOF SECTION */}
            <section 
                className="relative z-10 w-full bg-black/20 border-t border-white/5 flex flex-col items-center justify-center"
                style={{ padding: '6rem 0' }}
            >
                <div className="w-full max-w-7xl px-6 lg:px-12 text-center flex flex-col items-center justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#F5F7FA] mb-20 w-full text-center leading-[1.2]">
                        Built to survive real conditions, <br className="hidden md:block"/>not just a demo.
                    </h2>
                    
                    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/5 w-full justify-center">
                        <div className="flex flex-col items-center justify-center pt-8 sm:pt-0">
                            <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-pink-500 mb-4 tracking-tight text-center">
                                <CountUp to={0} />
                            </span>
                            <span className="text-base font-medium text-[#A6ADBB] w-full max-w-[200px] text-center leading-relaxed">Cloud uploads required to use core features</span>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 sm:pt-0">
                            <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-pink-500 mb-4 tracking-tight text-center">
                                <CountUp to={7} />
                            </span>
                            <span className="text-base font-medium text-[#A6ADBB] w-full max-w-[200px] text-center leading-relaxed">Languages supported (Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, English)</span>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 sm:pt-0">
                            <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-pink-500 mb-4 tracking-tight text-center">
                                <CountUp to={12} />
                            </span>
                            <span className="text-base font-medium text-[#A6ADBB] w-full max-w-[200px] text-center leading-relaxed">Clinical conditions diagnosed (Scabies, Eczema, Vitiligo, Tinea & HAM10000)</span>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-8 sm:pt-0">
                            <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-pink-500 mb-4 tracking-tight text-center">
                                <CountUp to={100} suffix="%" />
                            </span>
                            <span className="text-base font-medium text-[#A6ADBB] w-full max-w-[200px] text-center leading-relaxed">Of core scanning features usable with zero connectivity</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. WORKFLOW SECTION */}
            <section 
                id="workflow"
                className="relative z-10 w-full bg-[#0B0F1A]/80 border-t border-white/5 flex flex-col items-center justify-center backdrop-blur-md"
                style={{ padding: '6rem 0' }}
            >
                <div className="w-full max-w-7xl px-6 lg:px-12 flex flex-col items-center justify-center">
                    <div className="mb-16 md:mb-24 text-center w-full flex flex-col items-center justify-center">
                        <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-4">How It Works</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#F5F7FA] mb-6 text-center w-full">
                            Seamless Diagnostics <br className="hidden md:block"/>in Seconds
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-4 w-full relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500/0 via-teal-500/20 to-pink-500/0 -translate-y-1/2" />
                        
                        {[
                            { step: "01", title: "Open App", desc: "Instantly ready, even without an internet connection." },
                            { step: "02", title: "Capture", desc: "Guided camera flow ensures the perfect photo." },
                            { step: "03", title: "Analyze", desc: "On-device AI processes the image in milliseconds." },
                            { step: "04", title: "Review", desc: "Get detailed, explainable results immediately." }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center p-6 bg-[#10141D] rounded-2xl border border-white/5 shadow-xl">
                                <div className="size-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-2xl font-bold text-teal-400 mb-6 shadow-[0_0_20px_-5px_rgba(20,184,166,0.3)]">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-[#A6ADBB] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. SECURITY SECTION */}
            <section 
                id="security"
                className="relative z-10 w-full flex flex-col items-center justify-center border-t border-white/5"
                style={{ padding: '8rem 0' }}
            >
                <div className="w-full max-w-7xl px-6 lg:px-12 flex flex-row items-center justify-between gap-8 lg:gap-16">
                    <div className="w-1/2 text-left flex flex-col items-start">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold tracking-widest uppercase mb-6">
                            <Shield size={14} /> Zero Trust Architecture
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-[#F5F7FA] mb-6 leading-tight">
                            Your health data <br className="hidden lg:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">never leaves your hands.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-[#A6ADBB] leading-relaxed mb-8">
                            We engineered Luma from the ground up to process everything locally. No servers. No cloud databases. Absolute privacy.
                        </p>
                        <ul className="flex flex-col gap-4 text-[#C7CCD6] font-medium text-base md:text-lg text-left">
                            <li className="flex items-center gap-3"><Zap className="text-teal-400" size={20} /> On-Device Neural Networks</li>
                            <li className="flex items-center gap-3"><Shield className="text-teal-400" size={20} /> HIPAA-Ready by Default</li>
                            <li className="flex items-center gap-3"><Crosshair className="text-teal-400" size={20} /> Ephemeral Processing</li>
                        </ul>
                    </div>
                    
                    <div className="w-1/2 flex justify-center">
                        <div className="relative size-48 md:size-64 rounded-full border border-white/10 flex items-center justify-center">
                            <div className="absolute inset-0 bg-teal-500/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                            <div className="relative size-32 md:size-48 rounded-full border border-teal-500/20 bg-[#0B0F1A] flex items-center justify-center shadow-[0_0_50px_-10px_rgba(20,184,166,0.3)]">
                                <Shield size={48} className="text-teal-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. CLOSING CTA */}
            <section 
                className="relative z-10 w-full overflow-hidden border-t border-white/5 flex flex-col items-center justify-center"
                style={{ padding: '8rem 0' }}
            >
                <div className="absolute inset-0 z-0 flex justify-center items-center">
                    <div className="w-[80vw] h-[80vh] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
                </div>
                
                <div className="relative z-10 w-full max-w-4xl px-6 lg:px-12 text-center flex flex-col items-center justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#F5F7FA] mb-6 text-center leading-[1.1] w-full">
                        Built for the people current healthcare AI leaves out.
                    </h2>
                    <p className="text-lg md:text-xl text-[#A6ADBB] mb-12 w-full px-4 leading-relaxed text-center">
                        Try Luma instantly in your browser — no install required, though we recommend adding it to your home screen for full offline use.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                        <Link 
                            to="/skin"
                            className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-full bg-pink-400 text-lg font-bold text-white transition-all hover:bg-pink-300 hover:scale-[1.02] shadow-[0_0_30px_-5px_rgba(244,114,182,0.5)]"
                            style={{ padding: '1rem 2.5rem', minHeight: '3.5rem' }}
                        >
                            Try Luma Free
                            <ArrowRight size={20} />
                        </Link>
                        
                        {canInstall && (
                            <button 
                                onClick={onInstall}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-full bg-white/5 border border-white/10 text-lg font-medium text-[#F5F7FA] transition-all hover:bg-white/10 hover:border-white/20 backdrop-blur-md"
                                style={{ padding: '1rem 2.5rem', minHeight: '3.5rem' }}
                            >
                                <Download size={20} className="text-[#A6ADBB]" />
                                Install for Offline Use
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* 6. FOOTER */}
            <footer className="relative z-10 w-full border-t border-white/5 bg-[#0B0F1A] py-12 text-center px-6">
                <p className="text-base font-medium text-[#A6ADBB]">
                    © 2026 Luma. Not a substitute for professional medical advice.
                </p>
            </footer>
        </div>
    );
}
