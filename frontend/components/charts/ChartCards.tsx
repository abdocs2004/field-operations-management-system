"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";

const COLORS = ["#254a70", "#4d7cab", "#7fa3c8", "#b0c7df", "#0f2033", "#325f8c"];

function ChartShell({
  title,
  subtitle,
  children,
  isEmpty,
  height = 280,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isEmpty?: boolean;
  height?: number;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      {isEmpty ? (
        <EmptyState icon={BarChart3} title="لا توجد بيانات كافية لعرض الرسم البياني" />
      ) : (
        <div style={{ width: "100%", height }}>{children}</div>
      )}
    </Card>
  );
}

export function OperationsTrendChart({
  data,
  title = "حركة العمليات",
  subtitle,
}: {
  data: { date: string; count: number }[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <ChartShell title={title} subtitle={subtitle} isEmpty={data.length === 0}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip contentStyle={{ direction: "rtl", fontFamily: "inherit", borderRadius: 8 }} />
          <Line type="monotone" dataKey="count" name="عدد العمليات" stroke="#254a70" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function RevenueTrendChart({
  data,
  title = "حركة القيمة المالية",
  subtitle,
}: {
  data: { date: string; total: number }[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <ChartShell title={title} subtitle={subtitle} isEmpty={data.length === 0}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ direction: "rtl", fontFamily: "inherit", borderRadius: 8 }}
            formatter={(value: number) => [`${value.toLocaleString("en-US")} ريال`, "القيمة"]}
          />
          <Line type="monotone" dataKey="total" name="القيمة (ريال)" stroke="#4d7cab" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ServiceDistributionChart({
  data,
}: {
  data: { serviceName: string; count: number }[];
}) {
  return (
    <ChartShell title="العمليات حسب نوع الخدمة" isEmpty={data.length === 0}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis dataKey="serviceName" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip contentStyle={{ direction: "rtl", fontFamily: "inherit", borderRadius: 8 }} />
          <Bar dataKey="count" name="عدد العمليات" fill="#325f8c" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function StatusDistributionChart({
  data,
}: {
  data: { status: string; count: number; label: string }[];
}) {
  return (
    <ChartShell title="توزيع العمليات حسب الحالة" isEmpty={data.length === 0} height={260}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ direction: "rtl", fontFamily: "inherit", borderRadius: 8 }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
