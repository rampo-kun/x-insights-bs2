"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { PillarScores } from "@/lib/types";

export default function PillarRadar({ pillars }: { pillars: PillarScores }) {
  const data = [
    { pillar: "Sales Tracking", value: pillars.salesTracking },
    { pillar: "Inventory Health", value: pillars.inventoryHealth },
    { pillar: "Retention", value: pillars.customerRetention },
    { pillar: "Digital Readiness", value: pillars.digitalReadiness },
    { pillar: "AI Adoption", value: pillars.aiAdoption },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis
            dataKey="pillar"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            name="Pillar Score"
            dataKey="value"
            stroke="#22D3EE"
            fill="#7C5CFF"
            fillOpacity={0.45}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
