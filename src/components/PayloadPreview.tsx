import { maskPhone, type BookingPayload } from "@/lib/clinic/booking-payload";

/**
 * For the portfolio: the data the clinic's booking system or CRM would receive "if the booking were sent". Nothing is actually sent.
 * Hidden when "Portfolio notes" is turned off in the demo bar.
 */
export function PayloadPreview({ payload }: { payload: BookingPayload }) {
  const shown = { ...payload, patient: { ...payload.patient, phone: maskPhone(payload.patient.phone) } };
  return (
    <details className="devview" open>
      <summary>
        <span className="demobar-tag">Portfolio view</span> What would be sent to the clinic&apos;s booking system and CRM
      </summary>
      <p>Nothing was sent. In a real project this goes to the clinic&apos;s own booking system by webhook, and then to the CRM.</p>
      <ul>
        <li>
          <b>idempotencyKey</b>: if the same request arrives twice, it is booked once.
        </li>
        <li>
          <b>matchBy: phone</b>: the patient is looked up by phone number, so one person has one record.
        </li>
        <li>
          <b>stopFollowUps</b>: once booked, missed-call texts and waitlist offers stop.
        </li>
        <li>
          <b>containsHealthData: false</b>: no symptoms or health details are collected or sent.
        </li>
      </ul>
      <pre>{JSON.stringify(shown, null, 2)}</pre>
    </details>
  );
}
