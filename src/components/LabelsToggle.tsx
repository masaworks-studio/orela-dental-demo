"use client";

import { useEffect, useState } from "react";

/** Whether to show the portfolio notes (pricing tier labels, sample of the data sent). When hidden, it looks the same as a real clinic site */
export function LabelsToggle() {
  const [on, setOn] = useState(true);
  useEffect(() => setOn(document.documentElement.dataset.labels !== "off"), []);
  const toggle = (value: boolean) => {
    document.documentElement.dataset.labels = value ? "on" : "off";
    setOn(value);
    try {
      localStorage.setItem("orela-labels", value ? "on" : "off");
    } catch {
      /* It still switches even if saving fails */
    }
  };
  return (
    <label className="demobar-group demobar-check">
      <input type="checkbox" checked={on} onChange={(e) => toggle(e.target.checked)} />
      <span>Portfolio notes</span>
    </label>
  );
}
