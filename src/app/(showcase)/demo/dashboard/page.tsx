import { DashboardDemo } from "@/components/demos/DashboardDemo";

export const metadata = { title: "Front-desk dashboard" };

export default function Dashboard() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Front-desk dashboard</h1>
        <p>What the automation did this month, in numbers a practice manager can check.</p>
      </div>
      <DashboardDemo />
    </div>
  );
}
