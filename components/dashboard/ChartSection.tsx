"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { useRequest } from "@/hooks/useHooks";
import { referralService } from "@/services/referral";
import { Loading } from "../ui/Loading";

type ChartMetric = "invited" | "transactions" | "volume";

const metricConfigs = {
  invited: {
    name: "Invited Users",
    color: "#0ea5e9",
    formatter: (value: number) => `${value} users`,
  },
  transactions: {
    name: "Transactions",
    color: "#8b5cf6",
    formatter: (value: number) => `${value} txs`,
  },
  volume: {
    name: "Volume",
    color: "#f59e0b",
    formatter: (value: number) => `${value} SOL`,
  },
};

export function ChartSection() {
  const [type, setType] = useState<ChartMetric>("invited");
  const { data, loading } = useRequest(() => referralService.queryTrend(type), {
    refreshDeps: [type],
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Trend Analysis</h2>
        <div className="flex gap-2">
          {(Object.keys(metricConfigs) as ChartMetric[]).map((key) => (
            <button
              key={key}
              onClick={() => setType(key)}
              className={`px-3 py-1.5 text-sm max-sm:text-xs rounded-md transition-colors ${
                type === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {metricConfigs[key].name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        {loading ? (
          <Loading />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="value"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => metricConfigs[type].formatter(value)}
                {...(type !== "volume" && {
                  allowDecimals: false,
                  domain: [0, "auto"],
                })}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {payload[0].payload.date}
                        </span>
                        <span className="text-muted-foreground">
                          {metricConfigs[type].name}:
                        </span>
                        <span className="font-medium">
                          {metricConfigs[type].formatter(
                            payload[0].value as number
                          )}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="value"
                fill={metricConfigs[type].color}
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
