---
title: "From a host BGP daemon to a full CNI."
kicker: "Roadmap"
lede: "Versions are sequenced by dependency, not by date. Each one is independently provable, and status reflects what is merged and tested, not what is promised."
description: "The Routewright version roadmap, from the host BGP daemon through pod networking, BGP breadth, services, and GA. Standard Linux only, no eBPF, no overlay."
milestones:
  - id: "v0.1"
    title: "Host BGP daemon"
    state: done
    body: "The node's network identity over BGP, before Kubernetes exists. A standalone per-node daemon, the sole BGP speaker on the box."
    items:
      - "Embedded GoBGP, the only speaker on the node. eBGP numbered and unnumbered, IPv4-over-IPv6 with RFC 5549."
      - "BFD (300ms x3) with BGP-driven ECMP failover, near one-second convergence, multipath FIB."
      - "Management-IP advertisement with covering-aggregate suppression, communities, Add-Path."
      - "Graceful-shutdown drain (RFC 8326), SIGHUP additive reload, TCP-MD5 auth."
      - "Readiness signal, kubelet --node-ip drop-in, host-network defend, status CLI, Prometheus metrics."
    exit: "A node brings up its management IP over BGP, ECMP-routed, with sub-second BFD failover, dual-stack."
    proof: "make e2e-host against real gobgpd top-of-rack switches: dual-stack 18/18, unnumbered 3/3."
  - id: "v0.2"
    title: "Pod networking"
    state: active
    body: "Routed, overlay-free pods, driven by the cluster. The dataplane is done and proven across nodes. In-cluster integration wiring is in progress."
    items:
      - "Routed pod dataplane: veth with /32 and /128 host routes, host-owned link-local gateways. No proxy_arp, no overlay."
      - "Own dual-stack IPAM, host-local and file-locked. Per-node block carried as a Node annotation, never Node.Spec.PodCIDRs."
      - "routewright-controller, leader-elected: IPPool and NodeBlock reconcilers."
      - "routewright-agent announces the node block to the host and writes CNI config."
      - "Cluster-scoped CRDs: BGPPeer, BGPAdvertisement, IPPool."
    exit: "A pod reaches a pod across nodes, routed, no overlay, dual-stack."
    proof: "make e2e-pod across two nodes and a transit route-reflector: dual-stack 15/15. In-cluster integration test pending."
  - id: "v0.3"
    title: "BGP breadth and gRPC"
    state: planned
    body: "Become a first-class BGP citizen in real fabrics, with policy-controlled advertisement, on the gRPC control plane the rest of the roadmap rides on."
    items:
      - "Peering: eBGP passive, iBGP, Route Reflector server and client, eBGP multihop, dynamic neighbors, per-peer Graceful Restart."
      - "Policy: route-maps, prefix and import/export filters, large communities, MED and local-pref, traffic engineering via communities."
      - "ECMP max-path limits and unequal-cost, source-address send validation."
      - "gRPC control plane, migrating the v0.2 HTTP/JSON stopgap."
  - id: "v0.4"
    title: "Safety, auth, and inspectability"
    state: planned
    body: "No silent route leaks, every decision explainable, peers authenticated and access-controlled."
    items:
      - "Prefix allowlists, max-prefix per peer, ASN and router-ID mismatch, MTU mismatch, and service-CIDR overlap detection."
      - "Peer ACLs and TTL security (GTSM) on top of TCP-MD5."
      - "rwctl: why this route, where it came from, denied imports and exports, session and link health."
  - id: "v0.5"
    title: "Services, replacing kube-proxy"
    state: planned
    body: "Full kube-proxy replacement. Service and load-balancer VIPs reachable from the fabric, deterministically owned."
    items:
      - "IPVS for ClusterIP, NodePort, and LoadBalancer. nftables for masquerade, mark, hairpin, and NodePort."
      - "LB and endpoint VIP advertisement with BGPAdvertisement scopes. Anycast over ECMP."
      - "Deterministic VIP ownership, predictable withdrawal, no zombie VIPs, split-brain detection."
      - "Reachability probing gates advertisement. kubectl drain triggers graceful withdrawal."
  - id: "v1.0"
    title: "General availability"
    state: planned
    body: "The first stable, production-supported release: routed pods and services, BGP breadth, safety, and rwctl, hardened and documented."
    items:
      - "Full IPv4 and IPv6 parity audit across every shipped capability."
      - "Upgrade and rollback story: gRPC proto compatibility and CRD conversion."
  - id: "v1.1"
    title: "IPAM deepening"
    state: planned
    body: "Routewright owns all address allocation."
    items:
      - "Remove pod-CIDR from kubelet entirely."
      - "Route summarization and aggregation helpers, optional 100.64.0.0/10 non-global space, egress gateway selection."
  - id: "v1.2"
    title: "VRF integration"
    state: planned
    body: "Multi-tenant routing isolation."
    items:
      - "VRF over BGP with per-VRF FIB and routing tables, route leaking governed by policy, VRF-scoped pod and service routing and IPAM."
  - id: "v1.3"
    title: "Topology and discovery"
    state: planned
    body: "The network and the cluster understand each other. Think Ceph CRUSH maps, for routing."
    items:
      - "LLDP and CDP, peer metadata and custom TLVs exported to the network team."
      - "Failure-domain detection, topology-aware routing and VIP ownership."
  - id: "v1.4"
    title: "Gateway API and L4"
    state: planned
    body: "L4 ingress fronted by the load-balancer VIPs."
    items:
      - "Gateway API dataplane (TCP and UDP), IPVS-backed, LB-VIP-fronted. Optional service mesh, still no eBPF."
  - id: "v1.5"
    title: "NetworkPolicy"
    state: planned
    body: "Kubernetes NetworkPolicy without eBPF. Independent of the BGP and services line, so it can move earlier if prioritized."
    items:
      - "NetworkPolicy compiled to nftables sets and rules you can read."
---

Routewright is built one provable layer at a time. The host daemon comes first
because the node's reachability is the foundation everything else stands on. Get
that wrong and no amount of cluster networking saves you. Each version below is
demonstrated on its own, against real hardware behavior, before the next one
begins.

Ordering follows dependencies, not dates. The path to 1.0 runs from the host
daemon through pod networking, BGP breadth, safety, and services. The 1.x line
deepens IPAM, adds VRF, topology discovery, Gateway API, and NetworkPolicy.
