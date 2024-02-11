---
title: "Leaky Vessels"
date: 2024-02-11T13:14:26-05:00
draft: false
author: nclsbayona
tags:
  - Containers
  - Cyber Security
  - DevSecOps
  - DevOps
image: https://www.bleepstatic.com/content/hl-images/2023/08/04/package-container.jpg
description: In this blog post we talk about Leaky Vessels Vulnerabilities recently discovered by Snyk.
toc:
---

# Leaky Vessels vulnerabilities
=============================

### Definition (What is Leaky Vessels?)

Leaky Vessels is the name given to a set of vulnerabilities discovered and reported by Snyk on 2023 but publically-listed on January 31, 2024. This set of vulnerabilities allow an attacker to escape a containerized environment and is made-uo of four vulnerabilities that target different parts of the docker architecture. ![](https://i.stack.imgur.com/lAtSR.png) 


### Importance (Why is knowing about Leaky Vessels important?)

Knowing about Leaky Vessels vulnerabilities is important because Containers are a technology used frequently on the Industry and getting to know threats you might face allow you to prepare better than someone that is just unaware of what can actually happen.

  
### Explanation of each vulnerability (Names taken from [leaky-vessels-dynamic-detector](https://github.com/snyk/leaky-vessels-dynamic-detector))

1.  #### runc process.cwd & Leaked fds Container Breakout \[CVE-2024-21626\]
    
    Manipulation of a newly spawned process' current working directory (process.cwd). This uses a file descriptor (https://www.golinuxcloud.com/linux-file-descriptors/) leak that allows an attacker to have a working directory in the host filesystem namespace (An fd is open on the current working directory so it can be used to escape a containerized environment. [Watch Video Here!](https://youtu.be/YuWvmQ9WIhw)  
    
2.  #### Buildkit Mount Cache Race: Build-time Race Condition Container Breakout \[CVE-2024-23651\]
    
    Buildkit offers cache volumes using the RUN --mount=type=cache directive in a Dockerfile, which allows for the mounting of a persistent directory at a controlled location during Docker image build. This functionality is intended to help improve the performance of tooling, such as package managers, by keeping the persistent cache between builds. (https://snyk.io/blog/cve-2024-23651-docker-buildkit-mount-cache-race/) The RUN command supports a specialized cache, which you can use when you need a more fine-grained cache between runs. For example, when installing packages, you don't always need to fetch all of your packages from the internet each time. You only need the ones that have changed. To solve this problem, you can use RUN --mount type=cache. For example, for your Debian-based image you might use the following: RUN \\ --mount=type=cache,target=/var/cache/apt \\ apt-get update && apt-get install -y git Using the explicit cache with the --mount flag keeps the contents of the target directory preserved between builds. When this layer needs to be rebuilt, then it'll use the apt cache in /var/cache/apt. Basically there's a delay between the checking of the existance of the directory and the syscall to mount it, so it's possible to modify the directory to be a symlink and game over.  
    
3.  #### Buildkit GRPC SecurityMode Privilege Check \[CVE-2024-23653\]
    
    This occurs because the GRPC API used by buildkit to schedule container creation from an image has a security flaw since it does not strictly check for authorization to create privileged containers.  
    
4.  #### Buildkit Build-time Container Teardown Arbitrary Delete \[CVE-2024-23652\]
    
    This attack allows an attacker to delete files from the host OS by deleting contents in a symbolic link directory mounted.

  
### Mitigations (What can I do?)

First of all, constant analysis plays a pivotal role in fortifying cybersecurity by uncovering vulnerabilities, preventing exploitation, prioritizing assets, promoting security awareness, and addressing root causes. That's the reason for using software like [eBPF](https://ebpf.io)

*   Use [other container runtime](https://docs.docker.com/engine/alternative-runtimes/) (Maybe try [crun](https://github.com/containers/crun) or [youki](https://github.com/containers/youki)). Also, you can try [Podman](https://podman.io) ![Podman VS Docker](https://github.com/nclsbayona/leaky-vessels/blob/master/podman-vs-docker.png?raw=true)
*   Use official Docker builds
*   Update constantly
