import { MissedCallDemo } from "@/components/demos/MissedCallDemo";

export const metadata = { title: "Missed-call follow-up" };

export default function MissedCall() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Missed-call follow-up</h1>
        <p>Calls that nobody can answer turn into bookings instead of lost patients.</p>
      </div>
      <MissedCallDemo />
    </div>
  );
}
