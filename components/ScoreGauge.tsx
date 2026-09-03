"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

export default function ScoreGauge({
  score,
  maxScore,
  colorFrom,
  colorTo,
}: {
  score: number;
  maxScore: number;
  colorFrom: string;
  colorTo: string;
}) {
  const data = [{ name: "score", value: score, fill: colorFrom }];

  return (
    <div className="relative w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="72%"
          outerRadius="100%"
          barSize={16}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, maxScore]}
            angleAxisId={0}
            tick={false}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>
          </defs>
          <RadialBar
            background={{ fill: "rgba(255,255,255,0.06)" }}
            dataKey="value"
            cornerRadius={999}
            fill="url(#gaugeGradient)"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-display text-4xl font-bold text-white">
          {score}
        </span>
        <span className="text-xs text-white/40 font-mono">/ {maxScore} PTS</span>
      </div>
    </div>
  );
}
