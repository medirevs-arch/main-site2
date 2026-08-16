import { StatusChip } from "medirevs-v2";

/**
 * The three product statuses in src/lib/site.ts. "Beta" and "Early access"
 * count as live, so their dot takes the signal green and pulses; anything
 * else sits on the mist grey.
 */
export const Statuses = () => (
  <div className="flex flex-wrap items-center gap-3">
    <StatusChip status="Beta" />
    <StatusChip status="In development" />
    <StatusChip status="Early access" />
  </div>
);

/** `dark` swaps the hairline and label colours for dark bands. */
export const OnDark = () => (
  <div className="flex flex-wrap items-center gap-3 bg-lab p-10">
    <StatusChip dark status="Beta" />
    <StatusChip dark status="In development" />
    <StatusChip dark status="Early access" />
  </div>
);
