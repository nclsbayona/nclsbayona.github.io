---
title: Kubernetes Introduction
description: This is a blog post about Kubernetes in an introductory level
slug: kubernetes-intro
date: 2025-01-28 18:00:00+0000
lastmod: 2025-01-29 10:00:00+0000
image: https://github.com/kubernetes/kubernetes/raw/master/logo/logo.png
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
* And many more (I [re](https://www.techquintal.com/advantages-and-disadvantages-of-kubernetes/)[al](https://www.theknowledgeacademy.com/blog/benefits-of-kubernetes/)[ly](https://www.ibm.com/think/insights/kubernetes-benefits) [me](https://medium.com/@gunashree.v/top-advantages-and-disadvantages-of-kubernetes-552d259029a2)[an](https://ostridelabs.com/kubernetes-advantages-and-disadvantages/) [it](https://kodekloud.com/blog/benefits-of-kubernetes/), also know there are disadvantages [too](https://medium.com/swlh/advantages-and-disadvantages-of-kubernetes-the-business-perspective-5bb81e4eb4cb)).

### Understanding Kubernetes

#### Overview

Well, understanding Kubernetes, now that's a funny title to begin with because Kubernetes has so many things and so many variables that saying you understand it (Completely) is such a simplistic view just like saying you "completely understand" the ocean, sure, you can learn about currents, tides, and marine life, but the ocean is so vast, constantly changing, and full of surprises. Kubernetes is similar. It's a complex ecosystem with a lot of moving parts, and it's constantly evolving.

What you can do is gain a solid understanding of the core concepts and how they fit together. You can become proficient in using the tools and techniques necessary to deploy and manage applications on Kubernetes. And you can develop the skills to troubleshoot and debug issues as they arise (and they will arise!).

So, while "completely understanding Kubernetes" might be an unrealistic goal, striving for a deep and practical understanding is definitely achievable. It's a journey of continuous learning, and that's part of what makes Kubernetes so interesting (and sometimes frustrating!).

#### Story

Alright, let's explain Kubernetes with a nautical analogy, because who doesn't love a good seafaring tale?

Imagine a vast ocean, representing the complex world of software deployment. You have many different applications (Your cargo) that need to be shipped to various destinations (Your users).

##### Before Kubernetes (The Wild West of Shipping)

In the old days, each ship (application) had its own captain (developer) and crew. They were responsible for everything: loading the cargo (dependencies), navigating the seas (deployment), and ensuring the ship reached its destination (application availability). This was fine for a few ships, but as the fleet grew (your application scaled), things became chaotic. Captains argued over docking space (server resources), storms (failures) could sink entire ships, and coordinating repairs was a nightmare.

##### Enter Kubernetes (The Grand Fleet Admiral)

Kubernetes is like the Grand Fleet Admiral, overseeing all the ships and captains. It doesn't build the ships themselves, but it manages them, ensuring everything runs smoothly.

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

***In short***: Kubernetes takes the chaos out of managing a large fleet of ships (applications). It provides a framework for deploying, scaling, and managing your applications, so you can focus on developing great software instead of worrying about the logistics of shipping it. Now, who's ready for some grog?

##### Simpler

So, in simpler terms, Kubernetes is a system for automating deployment, scaling, and management of containerized applications. "Containerized" means your application and all its dependencies are packaged together in a neat little container (think Docker). This makes your application portable and consistent across different environments.

#### Concepts

##### **Namespaces (Different Fleets within the Grand Navy)**

Imagine the Grand Fleet isn't just one entity, but several smaller fleets operating under the same Admiral. These smaller fleets are like "namespaces" in Kubernetes. They allow you to logically separate different groups of ships (applications) within the same cluster. For example, you might have a "fishing fleet" (for your data processing applications) and a "trading fleet" (for your web applications), each managed separately but still under the overall command of Kubernetes.

##### **ConfigMaps and Secrets (Treasure Maps and Secret Cargo)**

Every ship needs a treasure map (ConfigMap) to know where to go and what resources to use. ConfigMaps store configuration data for your applications, like environment variables or settings. Some ships also carry secret cargo (Secrets) like valuable jewels or sensitive information. Secrets store sensitive data, like passwords or API keys, securely. Kubernetes manages these maps and cargo, ensuring they are available only to the authorized ships (pods).

##### **Volumes (Cargo Holds)**

Each ship has a cargo hold (Volume) where it stores its goods. Volumes are persistent storage for your applications. They can be attached to pods, allowing them to store and access data that survives even if the ship sinks (the pod is restarted). Think of it like a special, reinforced cargo hold that can be transferred to a new ship if the old one is lost.

##### **Ingress (Harbor Master)**

When ships arrive at a port (users access your application), they need a harbor master (Ingress) to guide them to the right dock (service). Ingress manages external access to your services, providing features like load balancing, SSL termination, and routing. It's like the traffic controller of the harbor, ensuring smooth and efficient flow of ships (traffic).

##### **Helm (Shipyard)**

Building and maintaining a fleet is complex. Helm is like a shipyard that provides pre-fabricated ships (charts) that you can easily customize and deploy. Charts define a set of Kubernetes resources, making it easier to package and manage complex applications. It's like having standardized ship designs that you can adapt to your specific needs.

##### **Custom Resource Definitions (CRDs) and Operators - The Naval Architects**

Sometimes, you need to build entirely new types of ships for specialized missions. CRDs allow you to define custom resources that extend the Kubernetes API. Operators are like naval architects who use CRDs to create and manage these custom resources. They automate complex tasks related to specific applications, providing a higher level of automation and management.

##### **Horizontal Pod Autoscaler (HPA) - The Tide Gauge**

Imagine the harbor master (Ingress) notices a huge surge of ships arriving (increased traffic). The HPA is like a tide gauge that monitors the water level (resource utilization) and automatically adjusts the number of docks (pods) as needed. If the tide is high (high CPU or memory usage), the HPA orders more docks to be built. If the tide is low (low resource usage), it reduces the number of docks to save resources. This ensures your harbor (application) can handle fluctuating traffic without getting overwhelmed.

##### **Vertical Pod Autoscaler (VPA) - The Shipwright**

Sometimes, just adding more ships isn't enough. Some ships might need bigger cargo holds (more resources) to carry their load. The VPA is like a shipwright who analyzes the ships and recommends adjustments to their size (resource requests and limits). It can suggest increasing the ship's capacity (CPU and memory) if it's consistently running low on resources. Unlike the HPA, which adds or removes entire ships, the VPA focuses on optimizing the individual ships themselves.

##### **DaemonSets - The Lighthouse Keepers**

Every harbor needs a lighthouse keeper to ensure safe navigation. DaemonSets are like lighthouse keepers that run a single pod on every node (port) in your cluster. They are typically used for tasks like log collection, monitoring, or security agents. They ensure that these essential services are always running on every node, just like a lighthouse constantly watches over the harbor.

##### **StatefulSets - The Specialized Cargo Ships**

Some ships carry specialized cargo that requires careful handling and tracking, like fragile goods or live animals. StatefulSets are designed for applications that require persistent storage and stable network identities, like databases. Each ship in a StatefulSet has a unique name and its own persistent storage, ensuring that data is not lost if the ship is replaced. They are like specialized cargo ships that are essential for certain types of applications.

##### **Jobs and CronJobs - The Delivery Fleets**

Sometimes, you need to send a fleet of ships on a one-time mission, like delivering supplies to a distant island. Jobs represent one-time tasks that run to completion. CronJobs are like scheduled delivery fleets that run at specific intervals, like delivering mail every morning. They are useful for tasks like batch processing or scheduled backups.

#### Conclusion

This analogy helps to visualize how different Kubernetes components work together to manage your applications. It's a complex system, but by understanding the core concepts and how they relate to each other, you can become a skilled "Grand Fleet Admiral" of your own Kubernetes cluster.

### More information and tips

* If you want to get started easily, try one of the [tutorials](https://kubernetes.io/docs/tutorials/) available on Kubernetes' documentation. If you don't want to install Kubernetes, you can use ["Play With Kubernetes"](https://labs.play-with-k8s.com/) a free web interactive playground provided by [Docker](https://docker.io).
* Probably you might want to check GitOps and how to include those principles in Kubernetes.
* Stay tuned for new content ...
