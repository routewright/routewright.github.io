---
title: "The road from a routing daemon to a CNI."
kicker: "Roadmap"
lede: "Milestones are sequenced so each one is independently provable. Dates are intentionally omitted — status reflects what is merged and tested, not what is promised."
description: "Routewright roadmap — from the per-node BGP host daemon to pod networking, services, NetworkPolicy and beyond. Standard Linux only, no eBPF."
milestones:
  - id: "M0a"
    title: "Host BGP daemon"
    state: done
    body: "The node's network identity, before Kubernetes exists. A standalone per-node daemon, proven end-to-end against real top-of-rack switches across IPv4, IPv6 and dual-stack."
    items:
      - "Embedded GoBGP v4 — the sole BGP speaker on the node, numbered peers, MD5 auth."
      - "BFD with BGP-driven ECMP failover and multipath FIB programming."
      - "Management-IP advertisement, readiness signal, kubelet --node-ip drop-in."
      - "Graceful-shutdown drain via RFC 8326."
  - id: "M0b"
    title: "Breadth"
    state: active
    body: "Round out the host daemon for the topologies real fabrics run."
    items:
      - "Unnumbered peering and RFC 5549 (IPv4 over an IPv6 link-local session)."
      - "Per-family session modes and full-table route import."
      - "Host-network defend, a status CLI, and Prometheus metrics."
  - id: "M1"
    title: "Pod networking"
    state: planned
    body: "The controller, agent and CNI plugin — pods routed across nodes with no overlay."
    items:
      - "Cluster IPAM: static per-node CIDRs and dynamic block allocation."
      - "veth into the pod netns; per-node pod CIDR advertised via the host daemon."
      - "Exit criterion: a pod reaches a pod across nodes, routed, dual-stack."
  - id: "M2"
    title: "Services"
    state: planned
    body: "Replace kube-proxy entirely with IPVS and nftables."
    items:
      - "IPVS for ClusterIP, NodePort and LoadBalancer."
      - "nftables for masquerade, mark and hairpin."
      - "Advertisement scopes: service CIDR, LB-pool-only, or full pod-native."
  - id: "M3"
    title: "NetworkPolicy"
    state: planned
    body: "Kubernetes NetworkPolicy compiled to nftables sets and rules you can read."
  - id: "M4+"
    title: "Gateway API & beyond"
    state: planned
    body: "Ingress and Gateway API fronted by the LB IPs; optional service mesh — still no eBPF."
---

Routewright is built one provable layer at a time. The host daemon comes first
because the node's reachability is the foundation everything else stands on — get
that wrong and no amount of cluster networking saves you. Each milestone below is
designed to be demonstrated on its own, against real hardware behavior, before the
next one begins.
