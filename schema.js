// src/lib/schema.js
import { z } from 'zod';

export const reportSchema = z.object({
  serviceSupportMobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
  reportDate: z.string().min(1, "Required"),
  // ... rest of your schema
});

export const connectionItems = [
  "Network equipment was installed in a standard network rack",
  "Patch panels are labelled and organised for easy access",
  // ... all connection items
];

export const testItems = [
  "Speed test and latency checks performed",
  "Internet access was tested from multiple devices",
  // ... all test items
];
