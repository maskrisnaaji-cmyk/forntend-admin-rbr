"use client";

import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Calendar, ChevronDown } from 'lucide-react';

export interface ChartDataPoint {
  label: string;
  kedaiOmset: number;
  eventOmset: number;
  totalOmset: number;
}

export type RangeOption = '7d' | 'month' | 'year';

interface FinancialChartProps {
  chartData?: ChartDataPoint[];
  totalChartOmset?: number;
  totalChartOmsetFormatted?: string;
  selectedRange?: RangeOption;
  onRangeChange?: (range: RangeOption) => void;
  loading?: boolean;
}

const RANGE_LABELS: Record<RangeOption, string> = {
  '7d': '7 Hari Terakhir',
  'month': 'Bulan Ini',
  'year': 'Tahun Ini',
};

const SVG_X_MIN = 80;
const SVG_X_MAX = 810;
const SVG_Y_MIN = 20;   // Skala tertinggi
const SVG_Y_MAX = 185;  // Garis dasar (Rp 0)
const SVG_WIDTH = 840;
const SVG_HEIGHT = 230;

function toSvgY(value: number, maxValue: number): number {
  if (maxValue <= 0) return SVG_Y_MAX;
  const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  return SVG_Y_MAX - ratio * (SVG_Y_MAX - SVG_Y_MIN);
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const cpX = (prev.x + cur.x) / 2;
    d += ` C ${cpX},${prev.y} ${cpX},${cur.y} ${cur.x},${cur.y}`;
  }
  return d;
}

function buildAreaPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  const linePath = buildSmoothPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x},${SVG_Y_MAX} L ${first.x},${SVG_Y_MAX} Z`;
}

function formatRupiahShort(value: number): string {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.0', '')}M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1).replace('.0', '')}Jt`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}Rb`;
  return `Rp ${value}`;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
  chartData = [],
  totalChartOmsetFormatted = 'Rp 0',
  selectedRange = 'month',
  onRangeChange,
  loading = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Hitung nilai maksimum untuk normalisasi sumbu Y
  const maxKedai = Math.max(...chartData.map((d) => d.kedaiOmset || 0), 0);
  const maxEvent = Math.max(...chartData.map((d) => d.eventOmset || 0), 0);
  const rawMax = Math.max(maxKedai, maxEvent);
  // Default minimal max agar grafik tetap terlihat proporsional bila data 0
  const maxVal = rawMax > 0 ? rawMax * 1.15 : 100000;

  const n = chartData.length;
  const xPositions: number[] = chartData.map((_, i) => {
    if (n <= 1) return (SVG_X_MIN + SVG_X_MAX) / 2;
    return SVG_X_MIN + (i / (n - 1)) * (SVG_X_MAX - SVG_X_MIN);
  });

  const kedaiPoints = chartData.map((d, i) => ({
    x: xPositions[i],
    y: toSvgY(d.kedaiOmset, maxVal),
  }));

  const eventPoints = chartData.map((d, i) => ({
    x: xPositions[i],
    y: toSvgY(d.eventOmset, maxVal),
  }));

  // Skala sumbu Y (5 gridlines)
  const yTicks = [
    { val: formatRupiahShort(maxVal), y: SVG_Y_MIN },
    { val: formatRupiahShort(maxVal * 0.75), y: SVG_Y_MIN + (SVG_Y_MAX - SVG_Y_MIN) * 0.25 },
    { val: formatRupiahShort(maxVal * 0.5), y: SVG_Y_MIN + (SVG_Y_MAX - SVG_Y_MIN) * 0.5 },
    { val: formatRupiahShort(maxVal * 0.25), y: SVG_Y_MIN + (SVG_Y_MAX - SVG_Y_MIN) * 0.75 },
    { val: 'Rp 0', y: SVG_Y_MAX },
  ];

  return (
    <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-sm">
      {/* Header Card: Judul, Status & Dropdown Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-brand-text">Trend Omset &amp; Analisis Keuangan</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
              <TrendingUp size={11} /> Real-time
            </span>
          </div>
          <p className="mt-0.5 text-xs text-brand-muted">
            Grafik perbandingan pendapatan Kedai Kopi &amp; Tiket Event
          </p>
        </div>

        {/* Dropdown Filter Kanan Atas */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          <div className="inline-flex rounded-full bg-[#FDFBF7] p-1 border border-brand-cream-accent">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-full bg-[#6B1D2F] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#581625] cursor-pointer"
            >
              <Calendar size={13} />
              <span>{RANGE_LABELS[selectedRange]}</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Menu Dropdown Bersih (NO backdrop-blur, NO dark overlay) */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-stone-200 bg-white shadow-xl overflow-hidden py-1">
              {(Object.entries(RANGE_LABELS) as [RangeOption, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onRangeChange?.(key);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-colors hover:bg-[#FDFBF7] cursor-pointer ${
                    selectedRange === key
                      ? 'text-[#6B1D2F] font-bold bg-[#FDFBF7]'
                      : 'text-brand-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Indikator Angka Ringkas & Legend */}
      <div className="mt-5 mb-6 flex flex-col gap-4 border-b border-brand-cream-accent/60 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Total Omset */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Total Omset</span>
            <div className="mt-1 flex items-center gap-2">
              {loading ? (
                <div className="animate-pulse h-7 w-36 rounded bg-brand-cream-accent" />
              ) : (
                <span className="text-xl sm:text-2xl font-extrabold text-brand-text">
                  {totalChartOmsetFormatted}
                </span>
              )}
            </div>
          </div>

          <div className="hidden h-10 w-px bg-brand-cream-accent sm:block" />

          {/* Periode Terpilih */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Periode Terpilih</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#FDFBF7] px-2.5 py-0.5 text-[11px] font-bold text-[#6B1D2F] border border-amber-300">
                {RANGE_LABELS[selectedRange]}
              </span>
            </div>
          </div>
        </div>

        {/* Legend Grafik */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#6B1D2F] shadow-sm" />
            <span className="font-semibold text-brand-text">Omset Kedai Kopi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#D4AF37] shadow-sm" />
            <span className="font-semibold text-brand-text">Tiket Event Budaya</span>
          </div>
        </div>
      </div>

      {/* Visual Grafik Garis/Area SVG Responsive */}
      <div className="relative w-full overflow-x-auto pb-2">
        <div className="min-w-sm lg:min-w-full">
          {loading ? (
            <div className="animate-pulse flex items-end gap-2 h-56 w-full p-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-brand-cream-accent"
                  style={{ height: `${20 + ((i * 15) % 65)}%` }}
                />
              ))}
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-56 text-xs text-brand-muted">
              Tidak ada data transaksi untuk rentang waktu ini.
            </div>
          ) : (
            <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-56 select-none overflow-visible">
              <defs>
                {/* Gradient Maroon Kedai Kopi */}
                <linearGradient id="maroonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.0" />
                </linearGradient>
                {/* Gradient Gold Tiket Event */}
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Sumbu Y Horizontal Grid Lines & Ticks */}
              {yTicks.map((tick) => (
                <g key={tick.val}>
                  <line
                    x1="65"
                    y1={tick.y}
                    x2="820"
                    y2={tick.y}
                    stroke="#E8DFD5"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x="55"
                    y={tick.y + 4}
                    textAnchor="end"
                    className="fill-brand-muted text-[11px] font-medium"
                  >
                    {tick.val}
                  </text>
                </g>
              ))}

              {/* Area Gradien Kedai Kopi */}
              {kedaiPoints.length > 0 && (
                <path d={buildAreaPath(kedaiPoints)} fill="url(#maroonGradient)" />
              )}

              {/* Area Gradien Tiket Event Budaya */}
              {eventPoints.length > 0 && (
                <path d={buildAreaPath(eventPoints)} fill="url(#goldGradient)" />
              )}

              {/* Garis Tren Tiket Event Budaya (Gold #D4AF37) */}
              {eventPoints.length > 0 && (
                <path
                  d={buildSmoothPath(eventPoints)}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Garis Tren Omset Kedai Kopi (Maroon #6B1D2F) */}
              {kedaiPoints.length > 0 && (
                <path
                  d={buildSmoothPath(kedaiPoints)}
                  fill="none"
                  stroke="#6B1D2F"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Data Points Kedai Kopi (#6B1D2F) */}
              {kedaiPoints.map((pt, idx) => (
                <circle
                  key={`kedai-${idx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={idx === kedaiPoints.length - 1 ? 5 : 3.5}
                  fill="#6B1D2F"
                  stroke="#FFFFFF"
                  strokeWidth={idx === kedaiPoints.length - 1 ? 2.5 : 2}
                />
              ))}

              {/* Data Points Tiket Event (#D4AF37) */}
              {eventPoints.map((pt, idx) => (
                <circle
                  key={`event-${idx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={idx === eventPoints.length - 1 ? 5 : 3.5}
                  fill="#D4AF37"
                  stroke="#FFFFFF"
                  strokeWidth={idx === eventPoints.length - 1 ? 2.5 : 2}
                />
              ))}

              {/* Sumbu X Label */}
              {chartData.map((item, idx) => (
                <text
                  key={`label-${idx}`}
                  x={xPositions[idx]}
                  y={208}
                  textAnchor="middle"
                  className="fill-brand-muted text-[11px] font-medium"
                >
                  {item.label}
                </text>
              ))}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
