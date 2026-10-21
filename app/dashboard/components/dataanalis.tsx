"use client";

import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export const FinancialChart: React.FC = () => {
  return (
    <div className="rounded-2xl border border-brand-cream-accent bg-white p-5 sm:p-6 shadow-sm">
      {/* Header Card: Judul, Keterangan, dan Tombol Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-brand-text">Trend Omset &amp; Analisis Keuangan</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
              <TrendingUp size={11} /> Naik
            </span>
          </div>
          <p className="mt-0.5 text-xs text-brand-muted">
            Grafik perbandingan pendapatan Kedai Kopi &amp; Tiket Event (Status: Untung / Naik)
          </p>
        </div>

        {/* Tombol Filter Kanan Atas */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-[#FDFBF7] p-1 border border-brand-cream-accent">
            <button className="flex items-center gap-1.5 rounded-full bg-[#6B1D2F] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#581625] cursor-pointer">
              <Calendar size={13} />
              <span>Bulan Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indikator Angka Ringkas & Legend */}
      <div className="mt-5 mb-6 flex flex-col gap-4 border-b border-brand-cream-accent/60 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Total Omset */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Total Omset</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-brand-text">Rp 45.850.000</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-100">
                <TrendingUp size={12} />
                +14.2% Untung
              </span>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-brand-cream-accent sm:block" />

          {/* Laba Bersih */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">Laba Bersih</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-[#6B1D2F]">Rp 17.650.000</span>
              <span className="inline-flex items-center rounded-full bg-[#FDFBF7] px-2.5 py-0.5 text-[11px] font-bold text-[#6B1D2F] border border-amber-300">
                Margin 38.5%
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

      {/* Visual Grafik Garis/Area (Line Chart) Responsive */}
      <div className="relative w-full overflow-x-auto pb-2">
        <div className="min-w-sm lg:min-w-full">
          <svg viewBox="0 0 840 230" className="w-full h-56 select-none overflow-visible">
            <defs>
              {/* Gradient Maroon Kedai Kopi */}
              <linearGradient id="maroonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.0" />
              </linearGradient>
              {/* Gradient Gold Tiket Event */}
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Sumbu Y Horizontal Grid Lines & Skala Rupiah (0 - 50M) */}
            {[
              { val: 'Rp 50M', y: 20 },
              { val: 'Rp 40M', y: 53 },
              { val: 'Rp 30M', y: 86 },
              { val: 'Rp 20M', y: 119 },
              { val: 'Rp 10M', y: 152 },
              { val: 'Rp 0', y: 185 },
            ].map((tick) => (
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
            <path
              d="M 80,126 C 135,115 150,106 200,106 C 260,106 270,112 325,112 C 385,112 400,83 450,83 C 510,83 525,93 575,93 C 635,93 650,56 700,56 C 760,56 770,34 810,34 L 810,185 L 80,185 Z"
              fill="url(#maroonGradient)"
            />

            {/* Area Gradien Tiket Event Budaya */}
            <path
              d="M 80,165 C 135,155 150,149 200,149 C 260,149 270,132 325,132 C 385,132 400,139 450,139 C 510,139 525,109 575,109 C 635,109 650,116 700,116 C 760,116 770,89 810,89 L 810,185 L 80,185 Z"
              fill="url(#goldGradient)"
            />

            {/* Garis Tren Tiket Event Budaya (Gold #D4AF37) */}
            <path
              d="M 80,165 C 135,155 150,149 200,149 C 260,149 270,132 325,132 C 385,132 400,139 450,139 C 510,139 525,109 575,109 C 635,109 650,116 700,116 C 760,116 770,89 810,89"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Garis Tren Omset Kedai Kopi (Maroon #6B1D2F) */}
            <path
              d="M 80,126 C 135,115 150,106 200,106 C 260,106 270,112 325,112 C 385,112 400,83 450,83 C 510,83 525,93 575,93 C 635,93 650,56 700,56 C 760,56 770,34 810,34"
              fill="none"
              stroke="#6B1D2F"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Points Kedai Kopi (#6B1D2F) */}
            {[
              { x: 80, y: 126 },
              { x: 200, y: 106 },
              { x: 325, y: 112 },
              { x: 450, y: 83 },
              { x: 575, y: 93 },
              { x: 700, y: 56 },
              { x: 810, y: 34 },
            ].map((pt, idx) => (
              <circle
                key={`kedai-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={idx === 6 ? 5 : 3.5}
                fill="#6B1D2F"
                stroke="#FFFFFF"
                strokeWidth={idx === 6 ? 2.5 : 2}
              />
            ))}

            {/* Data Points Tiket Event (#D4AF37) */}
            {[
              { x: 80, y: 165 },
              { x: 200, y: 149 },
              { x: 325, y: 132 },
              { x: 450, y: 139 },
              { x: 575, y: 109 },
              { x: 700, y: 116 },
              { x: 810, y: 89 },
            ].map((pt, idx) => (
              <circle
                key={`event-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={idx === 6 ? 5 : 3.5}
                fill="#D4AF37"
                stroke="#FFFFFF"
                strokeWidth={idx === 6 ? 2.5 : 2}
              />
            ))}

            {/* Sumbu X (1 Oct - 30 Oct) */}
            {[
              { date: '1 Oct', x: 80 },
              { date: '5 Oct', x: 200 },
              { date: '10 Oct', x: 325 },
              { date: '15 Oct', x: 450 },
              { date: '20 Oct', x: 575 },
              { date: '25 Oct', x: 700 },
              { date: '30 Oct', x: 810 },
            ].map((item) => (
              <text
                key={item.date}
                x={item.x}
                y={208}
                textAnchor="middle"
                className="fill-brand-muted text-[11px] font-medium"
              >
                {item.date}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
