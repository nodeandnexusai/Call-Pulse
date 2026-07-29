import { LeadScore } from "@prisma/client";

const HOT_KEYWORDS = [
  "urgent", "interested", "call me", "price", "cost", "when", "available",
  "asap", "now", "today", "immediately", "callback", "schedule", "meeting",
  "buy", "purchase", "how much", "what's the price",
];

const WARM_KEYWORDS = [
  "yes", "ok", "okay", "sure", "info", "details", "tell me more",
  "more info", "send", "please", "thanks", "thank you", "sounds good",
  "interested", "maybe", "possibly", "perhaps",
];

const COLD_KEYWORDS = [
  "no", "nope", "not interested", "stop", "unsubscribe", "remove",
  "don't contact", "do not contact", "wrong number", "not me",
  "leave me alone", "spam", "opt out",
];

/**
 * Scores an inbound lead reply as hot, warm, or cold
 * based on keyword matching.
 */
export function scoreLead(message: string): LeadScore {
  const lower = message.toLowerCase();

  for (const kw of COLD_KEYWORDS) {
    if (lower.includes(kw)) return LeadScore.cold;
  }
  for (const kw of HOT_KEYWORDS) {
    if (lower.includes(kw)) return LeadScore.hot;
  }
  for (const kw of WARM_KEYWORDS) {
    if (lower.includes(kw)) return LeadScore.warm;
  }

  // Default: warm (they replied — that's already a signal)
  return LeadScore.warm;
}
