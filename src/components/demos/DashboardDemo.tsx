"use client";

import { useEffect, useState } from "react";
import { toLocal } from "@/lib/clinic/hours";
import { periodMetrics, totals, type DayMetrics } from "@/lib/clinic/metrics";

/** Front desk dashboard. Figures are calculated from made-up data (src/lib/clinic/metrics.ts, tested) */
export function DashboardDemo() {
  const [days, setDays] = useState(30);
  const [list, setList] = useState<DayMetrics[] | null>(null);
  useEffect(() => {
    const today = toLocal(new Date(), "America/Chicago").date;
    setList(periodMetrics("orela-hou", today, days));
  }, [days]);

  if (!list) return <div className="card" style={{ minHeight: 300 }} />;
  const t = totals(list);
  const max = Math.max(...list.map((d) => d.calls), 1);
  const kpis: [string, string][] = [
    ["Calls", String(t.calls)],
    ["Missed calls", String(t.missedCalls)],
    ["Recovered by text", `${t.recovered} (${Math.round(t.recoveryRate * 100)}%)`],
    ["Bookings", String(t.bookings)],
    ["Handed to a person", String(t.handoffs)],
    ["Waitlist slots filled", String(t.waitlistFilled)],
    ["Emergency patients", String(t.emergencyPatients)],
    ["Avg emergency wait", t.emergencyAvgWait === null ? "—" : `${t.emergencyAvgWait} min`],
  ];

  return (
    <div>
      <div className="seg" role="group" aria-label="Period" style={{ marginBottom: 16 }}>
        {[7, 30].map((d) => (
          <a
            key={d}
            href="#"
            aria-current={d === days ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setDays(d);
            }}
          >
            Last {d} days
          </a>
        ))}
      </div>
      <div className="kpis">
        {kpis.map(([label, value]) => (
          <div key={label} className="kpi">
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <section className="block">
        <h2>Calls per day</h2>
        <div className="bars" role="img" aria-label={`Calls per day over the last ${days} days. Sundays are closed.`}>
          {list.map((d) => (
            <div key={d.date} title={`${d.date}: ${d.calls} calls, ${d.missedCalls} missed`} style={{ height: `${(d.calls / max) * 100}%` }} />
          ))}
        </div>
        <p className="small">Fictional data for the Houston demo clinic, generated per day so totals always match the breakdown.</p>
      </section>
    </div>
  );
}
