---
title: Kubernetes Introduction
description: This is a blog post about Kubernetes in an introductory level
slug: kubernetes-intro
date: 2025-01-27 18:00:00+0000
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
weight: 1       # You can add weight to some posts to override the default sorting (date descending)
---

## Kubernetes introduction

Alright, prepare your snacks and your best suits as we're about to dive headfirst into the elegant, beautiful, wonderful, wacky world of Kubernetes. If you've heard people whispering, arguing, shouting or writing about Kubernetes and thought, "Sounds complicated, I'll just stick to deploying my app on a [potato](https://www.bbspot.com/News/2008/12/linux-on-a-potato.html)" or "Maybe Kubernetes is just one of those trends that fade away pretty quickly so I shouldn't bother in understanding it" or you told to yourself "I want to know what Kubernetes is" then fear not! I'm here to break it down for you, with plenty of humor (because Kubernetes can be stressful enough as it is) and enough links to make [Wikipedia](https://wikipedia.org) feel proud.

### What is Kubernetes?

So as described on its webpage:
> *[Kubernetes](https://kubernetes.io/docs/concepts/overview), also known as **K8S**, is an open source system for automating deployment, scaling, and management of containerized applications.*

Some of the many cool things about Kubernetes are:

* Kubernetes is production ready.
* Kubernetes is backed by a really great community of both Individuals and Enterprises.
* Kubernetes is constantly evolving to include new features and make some adjustments to features it already introduced.
* Kubernetes (Or at least the [documentation](https://docs.kubernetes.io)) is easy to understand once you've spent enough time trying to understand it.
* And many more (I [really](https://www.ibm.com/think/insights/kubernetes-benefits) [mean](https://ostridelabs.com/kubernetes-advantages-and-disadvantages/) [it](https://kodekloud.com/blog/benefits-of-kubernetes/), also know there are disadvantagees [too](https://medium.com/swlh/advantages-and-disadvantages-of-kubernetes-the-business-perspective-5bb81e4eb4cb)).

### Understanding Kubernetes

#### Overview

Well, understanding Kubernetes, now that's a funny title to begin with because Kubernetes has so many things and so many variables that saying you understand it (Completely) is such a simplistic view just like saying you "completely understand" the ocean, sure, you can learn about currents, tides, and marine life, but the ocean is so vast, constantly changing, and full of surprises. Kubernetes is similar. It's a complex ecosystem with a lot of moving parts, and it's constantly evolving.

Saying you "completely understand" Kubernetes is like saying you "completely understand" the ocean.  Sure, you can learn about currents, tides, and marine life, but the ocean is vast, constantly changing, and full of surprises. Kubernetes is similar.  It's a complex ecosystem with a lot of moving parts, and it's constantly evolving.

What you can do is gain a solid understanding of the core concepts and how they fit together.  You can become proficient in using the tools and techniques necessary to deploy and manage applications on Kubernetes.  And you can develop the skills to troubleshoot and debug issues as they arise (and they will arise!).

So, while "completely understanding Kubernetes" might be an unrealistic goal, striving for a deep and practical understanding is definitely achievable. It's a journey of continuous learning, and that's part of what makes Kubernetes so interesting (and sometimes frustrating!).

#### Story

Alright, let's explain Kubernetes with a nautical analogy, because who doesn't love a good seafaring tale?

Imagine a vast ocean, representing the complex world of software deployment. You have many different applications (Your cargo) that need to be shipped to various destinations (Your users).

##### Before Kubernetes (The Wild West of Shipping)

In the old days, each ship (application) had its own captain (developer) and crew.  They were responsible for everything: loading the cargo (dependencies), navigating the seas (deployment), and ensuring the ship reached its destination (application availability).  This was fine for a few ships, but as the fleet grew (your application scaled), things became chaotic.  Captains argued over docking space (server resources), storms (failures) could sink entire ships, and coordinating repairs was a nightmare.

##### Enter Kubernetes (The Grand Fleet Admiral)

Kubernetes is like the Grand Fleet Admiral, overseeing all the ships and captains.  It doesn't build the ships themselves, but it manages them, ensuring everything runs smoothly.

* Ships (Pods): Each ship is a "pod," carrying one or more containers (cargo). Think of a pod as a standardized shipping container that can hold different types of goods (application components).

* Captains (Controllers): Kubernetes has different "captains" (controllers) for various tasks:

  * Deployment Captain: This captain ensures the right number of ships (pods) are deployed and that they have the necessary supplies (resources). They also manage upgrades and rollbacks, like changing the ship's sails or repairing damage.

  * Service Captain: This captain manages the routes and communication between ships (services). They create "sea lanes" (network connections) so other ships or ports (users) can easily find and interact with the cargo (application).
  
  * ReplicaSet Captain: This captain makes sure there are always enough ships (pods) in the fleet, ready to replace any that are lost at sea (failures).

* Ports (Nodes): The ports are the physical or virtual locations where the ships dock (nodes). Kubernetes ensures ships are distributed evenly across ports to avoid overcrowding (resource allocation).

* The Fleet (Cluster): All the ships, captains, and ports together form the Grand Fleet (cluster), managed by the Grand Fleet Admiral (Kubernetes).

###### What the Grand Fleet Admiral (Kubernetes) Does

1. **Orchestrates**: Kubernetes coordinates all the ships (pods), ensuring they work together harmoniously.
2. **Scales**: If more cargo needs to be shipped (increased traffic), Kubernetes can order more ships (pods) to be built and deployed.
3. **Heals**: If a ship encounters a storm (failure), Kubernetes can automatically send a replacement ship (pod) to take its place.
4. **Updates**: Kubernetes can manage updates to the ships (applications) without disrupting the entire fleet. It can gradually replace old ships with new ones, ensuring a smooth transition.

***In short***: Kubernetes takes the chaos out of managing a large fleet of ships (applications).  It provides a framework for deploying, scaling, and managing your applications, so you can focus on developing great software instead of worrying about the logistics of shipping it.  Now, who's ready for some grog?

So, in simpler terms, Kubernetes is a system for automating deployment, scaling, and management of containerized applications.  "Containerized" means your application and all its dependencies are packaged together in a neat little container (think Docker). This makes your application portable and consistent across different environments.
