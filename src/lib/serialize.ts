/**
 * Recursively convert Prisma values into plain, serializable data so they can
 * safely cross the Server -> Client Component boundary.
 *
 * Prisma returns DECIMAL columns as `Prisma.Decimal` instances. Those are class
 * instances, so when Next.js serializes props for a Client Component the methods
 * (e.g. `.toNumber()`) are stripped — calling them in the browser throws
 * "toNumber is not a function". Converting to a plain `number` on the server
 * (where the Decimal is still a real Decimal) avoids that entirely.
 *
 * Dates are left as-is (Next.js serializes them correctly).
 */
export function toPlain<T>(value: T): T {
  if (value === null || value === undefined) return value;

  // Prisma.Decimal (and anything Decimal-like) -> number
  if (
    typeof value === "object" &&
    typeof (value as { toNumber?: unknown }).toNumber === "function"
  ) {
    return (value as unknown as { toNumber: () => number }).toNumber() as unknown as T;
  }

  if (value instanceof Date) return value;

  if (Array.isArray(value)) {
    return value.map((item) => toPlain(item)) as unknown as T;
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      out[key] = toPlain((value as Record<string, unknown>)[key]);
    }
    return out as T;
  }

  return value;
}
