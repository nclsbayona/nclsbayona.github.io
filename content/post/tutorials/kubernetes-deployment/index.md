---
title: Talos OS deployment
draft: true
description: This is a blog post regarding deployment of Talos.
slug: kubernetes-talos
date: 2025-12-23 08:00:00+0000
lastmod: 2025-12-23 23:00:00+0000
image: cover.webp
links:
- title: Talos' repository on Github
  description: Talos' Github repository.
  website: https://github.com/siderolabs/talos
  image: https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png
categories:
- tutorials
- cybersecurity
- kubernetes
tags:
- devops
- devsecops
weight: 1 # You can add weight to some posts to override the default sorting (date descending)
---

## Deployment of Talos OS

Now I know that for deploying Kubernetes clusters, there are many options available, there's applications like [kind](https://kind.sigs.k8s.io/), [microk8s](https://microk8s.io/), [minikube](https://minikube.sigs.k8s.io/), [k3s](https://k3s.io/), [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/), and managed services like [EKS](https://aws.amazon.com/eks/), [GKE](https://cloud.google.com/kubernetes-engine), and [AKS](https://azure.microsoft.com/en-us/services/kubernetes-service/) that make it easy to get started.

I've had experience with most of these tools, but there's always a problem: You have to either pay for maintenance (That's like the idea of managed-services) or maintain things yourself (Like with applications, services and that kind of stuff), so as I wanted to experiment I didn't really care about maintaining things for myself, but I wanted it to be simple. Now, the applications that I mentioned before intended to run Kubernetes are well that: _applications_ and I don't want to use the [OSI model](https://en.wikipedia.org/wiki/OSI_model) here, but you have to maintain more things if you run an application, these are designed to run on top of an operating system that is meant to run one or more applications. This was a problem to me because well I didn't want to do all that maintenance work instead of dedicating that time to Kubernetes, so after some research I found out there was an option named **Talos OS** that was exactly what I was looking for, an OS meant to just run Kubernetes.

Now, you might be wondering:
> Aren't there other OSes that can run Kubernetes?
Yes, there are. For example there's [RancherOS](https://rancher.com/docs/os/v1.x/en/), [Flatcar Linux](https://www.flatcar-linux.org/) and [Fedora CoreOS](https://www.redhat.com/en/technologies/cloud-computing/openshift/what-was-coreos). But I chose **Talos OS** mainly because of it's meant to only run Kubernetes and it also has other features that I found great for solving my problem. I'm not saying that the other OSes are bad, but for my use case Talos was probably the best fit.

Should I spend time explaining what Talos OS is? Maybe a little bit.

So, to make it simple: Let's say that Talos OS is a minimal and immutable operating system designed specifically for running Kubernetes clusters. It is designed to provide an efficient platform for deploying and managing Kubernetes clusters/workloads. Some of its key features include:

- **Minimalism**: Talos OS is stripped down to the essentials needed to run Kubernetes, reducing the attack surface and resource consumption.

- **Immutability**: The OS is designed to be immutable, meaning that it cannot be modified after deployment. This helps ensure consistency and reliability across cluster nodes.

- **API-Driven**: Talos OS is managed entirely through an API, allowing for automated and programmatic control over the operating system and Kubernetes cluster.

Now, you might be wondering _ok this is great but please define what do you mean by _essentials_?_ Look no further, I've got an answer for you. When I say "essentials", I mean that Talos OS includes only the components necessary to run Kubernetes, such as the container runtime, networking stack, and basic system utilities. It does not include unnecessary packages or services that are not required for Kubernetes operation like package managers. When I did my experiment counting the number of files inside the `/bin` directory gave me a total of 38 files, which is pretty minimal compared to other operating systems. Now you might be thinking _Ok, you mentioned there's no packages that aren't needed to run Kubernetes and I think that means there's no shell, so, how in the blue blazes did you count the number of files inside `/bin`?_ Good question, I did that by actually counting the files that a Talos VM had on its disk: I mounted the disk image on another Linux machine (That had the neccessary tools) and counted the files from there since Talos OS doesn't have a shell.

Great, so now that we know what Talos OS is, let's proceed to the [deployment steps](https://talos.dev/docs). You should know there's a lot of ways to deploy Talos OS, you can use bare-metal servers, containers, virtual machines, cloud providers ... . For this tutorial, I'll be using virtual machines with [QEMU](https://www.qemu.org/) and [KVM](https://linux-kvm.org/page/Main_Page) as the hypervisor. Why? Because it's free and open-source, and I can run it on my Linux machine without any problem. Why not containers then? I did try that but I really think that using VMs is a better approach for this tutorial since it gives you a more realistic experience of running Talos OS on actual hardware. Plus, it allows you to experiment with different configurations and settings that might not be possible in a containerized environment.

Ok, enough talking. Let's get our hands dirty and deploy Talos OS!
1. Download Talos OS ISO image from the [image factory website](https://factory.talos.dev/): Here you select the hardware where you want to deploy Talos OS, in our case we will select `Bare-metal` as the hardware target. choose the latest available version (As of writing this tutorial, the latest version is `v1.12.0`), then select the architecture of the target machine (Most likely `amd64` for x86_64 machines). Finally, click on the `Download` button to download the ISO image.
![Talos OS Image Factory 1](./images/image-01.png)
![Talos OS Image Factory 2](./images/image-02.png)
![Talos OS Image Factory 3](./images/image-03.png)