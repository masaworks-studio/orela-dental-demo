"use client";

import { useEffect, useState } from "react";
import { toLocal } from "@/lib/clinic/hours";
import type { LocalTime } from "@/lib/clinic/types";

/**
 * The clinic's local time. When rendering on the server the time is unknown, so it returns null
 * and calculates it after the page shows in the browser (to avoid a mismatch). Updates every 30 seconds.
 */
export function useClinicNow(timeZone: string): LocalTime | null {
  const [now, setNow] = useState<LocalTime | null>(null);
  useEffect(() => {
    const update = () => setNow(toLocal(new Date(), timeZone));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return now;
}
