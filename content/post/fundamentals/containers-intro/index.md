---
title: Containerization Introduction
description: In this blog post we talk about Containerization and its importance in today's world
slug: containers-intro
date: 2024-07-18 12:00:00+0000
lastmod: 2025-03-20 20:00:00+0000
image: cover.webp
categories:
- containers
tags:
- introductory
- devops
weight: 1 # You can add weight to some posts to override the default sorting (date descending)
---

## Containerization Introduction

Ever tried to group a bunch of people all with their responsabilities and activities? It's chaos. Now imagine trying to group a bunch of **applications** – each with its own dependencies, libraries, and quirks. Nightmare fuel, right?  That's where containerization comes in handy. It's like giving each application its own little apartment, complete with everything it needs to thrive. No more dependency conflicts, no more "it works on my machine" excuses. Just pure, unadulterated application bliss.

### Containerization vs. Virtualization (Think Apartments vs Entire Houses)

Let's clear something up: containerization is *not* virtualization, at least not the traditional definition of virtualization you might have. Think of virtualization as building entire houses for your apps. Sure, they're separate, and (At least in theory) completely isolated, but they're also bulky and resource-intensive. Containerization, on the other hand, is like building apartments. They do share the same foundation (the host OS), but they're isolated from each other (At least in theory the isolation is not so strong as in typical virtualization scenarios (Again, ***In theory***)). So which technology is the best? Really, it depends on the use case and the actual implementation of each technology you'll use.

### How Does This ~Magic~ Work?

Containerization relies on a few key ingredients:

1. **Container Images**: These are like the blueprints for your app's apartment. They contain everything the app needs to run, from the code itself to the system tools and libraries.

2. **Image definition file (You'll probably find it defined as Dockerfiles but Docker is a vendor so I would like to define it as neutral as possible)**: This is the instruction manual for building your container image. It's like having Lego instructions, but for apps.

3. **Container Engine**: This is the construction crew that builds, runs, and manages your containers. Think of it as the superintendent of your app apartment complex.

4. **Container Registry (Not really mandatory but common to find)**: This is where you store and share your container images. Think of it as an app where you can find different apartments available in your area.  

### Containerization Tech: A Rogues' Gallery of Tools

Now, at first I was hesitant to include this section because I didn't want to take my word as the only source of truth but I decided to include it because I understand that arround containerization there's a false belief that ```Docker = Containers``` and I want you to understand that's not true (At least not always). So let's see a brief declaration of tools used in the containerization world.

* **Docker:** It's actually a tool made up of other tools (Kind of like a monolith if you know what I mean) user-friendly, well-documented, and has a huge community. It's like one of those cool kids everyone wants to hang out with.

* **containerd:** One of the workhorses behind Docker. It's lightweight, fast, and OCI-compliant. It's a quiet professional that gets the job done.

* **Podman:** The rebel without a daemon. It's a drop-in replacement for Docker, especially on Linux, and offers rootless containers for added security. It's like the punk rock cousin of Docker.

* **rkt (Rocket):** The security-focused container runtime. It's simple, no central daemon, and works well with systemd. It's like the minimalist of the container world.

* **LXC (Linux Containers):** It's kind of the OG of containerization. It's OS-level virtualization and good for running multiple Linux distributions. It's like a wise old grandfather for containers.

### Conclusion

Choosing the right containerization technology depends on your needs. Need something simple, easy to use and you don't have much technical requirements? Docker can be your friend. Need something lightweight and you have some constraints? Check out containerd or rkt. Need rootless containers? Podman might be a good fit. And if you're dealing with a massive number of containers, well you could run them separately or could use an orchestrator like Nomad, Apache Mesos or Kubernetes to get things done.
