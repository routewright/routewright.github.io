---
paths:
  - "content/**/*.md"
  - "layouts/**/*.html"
  - "*.md"
---

# Voice and copy rules

All site copy is written for one reader: a senior network engineer who runs BGP
for a living, has a Cisco or Juniper background, and distrusts marketing. Write
like a person who operates networks, not like a content generator. If a line
reads like a SaaS landing page or a chatbot, it is wrong. They will only adopt
this project if it talks to them as a peer.

## Hard bans

- **No em-dashes (—) and no en-dashes (–) as punctuation.** Recast the sentence.
  Use a period for a hard break, a comma for an aside, parentheses for an
  afterthought, a colon to introduce a list. Two short sentences beat one joined
  by a dash. (Hyphens in compound words like `top-of-rack` are fine.)
- **No exclamation points. No emoji.**
- **No filler vocabulary:** powerful, seamless, robust, leverage, elevate,
  supercharge, unlock, harness, empower, streamline, effortless, intuitive,
  cutting-edge, state-of-the-art, best-in-class, world-class, next-generation,
  revolutionary, game-changer, realm, landscape, journey, tapestry, testament,
  beacon, delve, embark, foster, navigate (figurative), simply, just (as filler).
- **No AI sentence frames:** "It's not just X, it's Y." "Whether you're X or Y."
  "In today's world." "More than just." "At its core." "When it comes to." "Say
  goodbye to." "Look no further." "The power of." "Imagine a world where." "We've
  got you covered."
- **No hedging:** "designed to," "aims to," "helps you," "allows you to," "makes
  it easy to." State what the software does, in present tense.
- **No rule-of-three for rhythm** ("fast, reliable, and scalable"). A list is
  there to be accurate, not to sound good.

## How it should read

- Lead with the technical fact. The reader came for substance.
- Short, declarative, present tense, active voice. One idea per sentence.
- Use the precise term: BGP, the kernel FIB, ECMP, BFD, the RIB, nftables, IPVS,
  next-hop, RFC 5549. Never "the technology," "the platform," "the solution."
- Show, do not claim. A `show route` dump or an `nft` ruleset earns more trust
  than any adjective. Prefer evidence over assertion.
- Be honest about status. "Early," and "M0a is done, the rest is in progress,"
  read as credibility to this audience. Do not oversell scope.
- Dry confidence, not enthusiasm. State the decision and the reason. Skip the pitch.

## Quick test

Read the line aloud. If it sounds like an engineer explaining their network to a
peer, keep it. If it sounds like it is selling something, or was written to fill
space, cut it or rewrite it.

## Before and after

- Bad: "Routewright is a powerful, next-generation CNI that seamlessly empowers
  teams to effortlessly manage Kubernetes networking — at any scale."
- Good: "Routewright is a Kubernetes CNI built on standard Linux. It speaks BGP
  to the fabric and routes pods with the kernel FIB. No overlay, no eBPF."

- Bad: "When it comes to debugging, Routewright has you covered — say goodbye to
  black boxes."
- Good: "When something breaks, the path is in `ip route` and `nft list ruleset`.
  You debug it with tools you already trust."

<!-- This rule is portable. Drop it into any Routewright repo's .claude/rules/
     (adjusting `paths`) to hold the same voice across the site and the docs. -->
