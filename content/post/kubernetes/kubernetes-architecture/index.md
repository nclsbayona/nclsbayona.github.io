---
title: Kubernetes Architecture
description: This is a blog post about Kubernetes architecture
slug: kubernetes-architecture
date: 2025-02-03 15:00:00+0000
links:
- title: Kubernetes
  description: Kubernetes is an open-source container orchestration system.
  website: https://kubernetes.io
  image: https://github.com/kubernetes/kubernetes/raw/master/logo/logo.png
- title: CNCF
  description: Cloud Native Computing Foundation is part of the Linux Foundation
  website: https://www.cncf.io/
  image: https://www.cncf.io/wp-content/uploads/2023/04/cncf-main-site-logo.svg
categories:
- kubernetes
tags:
- introductory
- devops
weight: 1 # You can add weight to some posts to override the default sorting (date descending)
---

## Kubernetes architecture

While it might seem complex at first glance, the underlying architecture of Kubernetes is surprisingly elegant and in some way kind of beautiful. So, let's  try to break down this powerful container orchestration system architecture into digestible chunks, shall we?

### General architecture

First of all we have to understand that Kubernetes as a container orchestration system requires both an administration layer and a cluster for running the workloads. This way, Kubernetes separates its [core components](https://kubernetes.io/docs/concepts/overview/components/) into two mayor groups:

1. [Control Plane Components](https://kubernetes.io/docs/concepts/overview/components/#control-plane-components)
2. [Data Plane Components or Node Components](https://kubernetes.io/docs/concepts/overview/components/#node-components)

So, having these two groups separated allows for a better understanding of the required links and components that make up [Kubernetes](https://docs.kubernetes.io).![architecture](https://kubernetes.io/images/docs/kubernetes-cluster-architecture.svg)

Lets try to explain Kubernetes architecture using a fairly-easy to understand metaphor (Who doesn't like metaphors to explain technical concepts?). Imagine Kubernetes as a city. It has houses (Nodes), a town hall (Control plane), and residents provide services/products (This are out of scope for this post, maybe try checking out the [Kubernetes intro](/p/kubernetes-intro) post before).

#### Control plane

Lets start talking about the Control Plane components first:

- ***kube-apiserver***: The **kube-apiserver** is the entrypoint to interacting with the Kubernetes API, its the front-end for the Kubernetes control plane. Think of it as the recepcionist at town hall, every request targeting the town hall should go through the reception. This component is designed to scale horizontally (Deploy new instances) so its usual to have a load-balancer to access the **kube-apiserver** by distributing traffic between multiple different instances. 

- ***etcd***: To store data [**etcd**](https://etcd.io/) is used, this is a key-value distributed database that allows to store cluster's desired state so that nodes can get to the desired state. You can think of this as the city's webpage where they publish operations they must do.

- ***kube-scheduler***: This component is in charge of deciding where do containers (Applications or components) need to run, taking into account different topics like resource requirements and other constraints. Think of it as a job agency where given some constraints (Availability, skills, knowledge, etc.) it helps people (containers) find their way into a job.

- ***kube-controller-manager***:

- ***cloud-controller-manager***:

#### Node components

- ***Kubelet***:

- ***Container-runtime***:

- *Kube-proxy*:

### Conclusion

Understanding these core components is crucial for effectively using Kubernetes.  By thinking of Kubernetes as a city with interconnected parts, we can make this powerful system less intimidating and more accessible. Stay tuned for future posts where we dive deeper into specific aspects of Kubernetes!
