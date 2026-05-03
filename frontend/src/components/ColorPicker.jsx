import React, { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';

// Convert HSL to Hex
const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

// Parse hex to HSL
const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// Generate gradient colors
const generateGradientColors = () => {
    const colors = [];
    for (let i = 0; i <= 360; i += 15) {
        colors.push(`hsl(${i}, 85%, 55%)`);
    }
    return colors;
};

// Generate saturation/lightness variations as hex
const generateVariations = (hue) => {
    const variations = [];
    for (let l = 95; l >= 20; l -= 8) {
        for (let s = 30; s <= 100; s += 35) {
            variations.push(hslToHex(hue, s, l));
        }
    }
    return variations;
};

export default function ColorPicker({ color, onChange, onClose }) {
    // Initialize state ONCE from props, don't sync after
    const [hue, setHue] = useState(() => hexToHsl(color || '#10b981').h);
    const [saturation, setSaturation] = useState(() => hexToHsl(color || '#10b981').s);
    const [lightness, setLightness] = useState(() => hexToHsl(color || '#10b981').l);
    const pickerRef = useRef(null);
    const boxRef = useRef(null);

    const currentColor = hslToHex(hue, saturation, lightness);
    const gradientColors = generateGradientColors();
    const variations = generateVariations(hue);

    // Sync with external color when it changes (e.g., reopening picker)
    useEffect(() => {
        const newHsl = hexToHsl(color || '#10b981');
        setHue(newHsl.h);
        setSaturation(newHsl.s);
        setLightness(newHsl.l);
    }, [color]);

    // Only handle click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                onClose?.();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleBoxClick = (e) => {
        if (!boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        setSaturation(Math.round(x * 100));
        setLightness(Math.round((1 - y) * 100));
    };

    const handleHueClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        setHue(Math.round(x * 360));
    };

    const handleShadeClick = (shadeColor) => {
        const hsl = hexToHsl(shadeColor);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
    };

    const handleConfirm = () => {
        onChange(currentColor);
    };

    return (
        <div ref={pickerRef} 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-72 animate-in fade-in zoom-in-95 duration-200">
            {/* Current Color Preview */}
            <div className="flex items-center gap-3 mb-4">
                <div 
                    className="w-12 h-12 rounded-xl shadow-inner border border-gray-100"
                    style={{ backgroundColor: currentColor }}
                />
                <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Selected</p>
                    <p className="text-sm font-mono font-bold text-gray-700 uppercase">{currentColor}</p>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleConfirm();
                    }}
                    className="p-2 bg-[#106E4E] text-white rounded-xl hover:bg-emerald-800 transition-colors"
                >
                    <Check size={18} />
                </button>
            </div>

            {/* Hue Slider - Gradient Bar */}
            <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Hue</p>
                <div className="h-6 rounded-lg relative cursor-pointer overflow-hidden"
                    style={{ 
                        background: `linear-gradient(to right, ${gradientColors.join(', ')})` 
                    }}
                    onClick={handleHueClick}
                >
                    <div 
                        className="absolute top-0 bottom-0 w-4 bg-white border-2 border-gray-300 rounded shadow-md transform -translate-x-1/2"
                        style={{ left: `${(hue / 360) * 100}%` }}
                    />
                </div>
            </div>

            {/* Saturation/Lightness Box */}
            <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Saturation & Lightness</p>
                <div 
                    ref={boxRef}
                    className="h-32 rounded-xl cursor-pointer relative overflow-hidden border border-gray-100"
                    style={{
                        background: `
                            linear-gradient(to top, #000, transparent),
                            linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
                        `
                    }}
                    onClick={handleBoxClick}
                >
                    <div 
                        className="absolute w-5 h-5 bg-white border-2 border-gray-400 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ 
                            left: `${saturation}%`, 
                            top: `${100 - lightness}%` 
                        }}
                    />
                </div>
            </div>

            {/* Color Variations Grid */}
            <div className="mb-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Shades</p>
                <div className="grid grid-cols-8 gap-1">
                    {variations.slice(0, 24).map((c, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShadeClick(c);
                            }}
                            className="w-6 h-6 rounded-md hover:scale-110 transition-transform border border-gray-100"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}
