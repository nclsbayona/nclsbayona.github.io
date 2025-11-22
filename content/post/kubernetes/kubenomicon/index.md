---
title: Kubenomicon
description: In this blog post we talk about the Kubenomicon, a version of the Necronomicon but for Kubernetes
slug: kubenomicon
date: 2025-01-31 13:14:26+0000
lastmod: 2025-01-31 20:00:00+0000
image: https://kubenomicon.com/images/kubenomicon_cropped.png
links:
- title: Kubenomicon
  description: Kubenomicon is a Kubernetes version of the Necronomicon
  website: https://kubenomicon.com/Kubenomicon.html
  image: https://kubenomicon.com/images/kubenomicon_cropped.png 
- title: Microsoft's Kubernetes Threat Matrix
  description: Microsoft developed a Threat Matrix for Kubernetes that serves as an outline for different attacks to Kubernetes
  website: http://aka.ms/KubernetesThreatMatrix
  image: https://www.microsoft.com/en-us/security/blog/wp-content/uploads/2022/12/Featured-image-1536x1024.jpg
- title: RedGuard's Kubernetes Threat Matrix
  description: RedGuard developed a Threat Matrix for Kubernetes that serves as an outline for different attacks to Kubernetes
  website: https://kubernetes-threat-matrix.redguard.ch/
- title: Kubernetes Hacktricks
  description: Cloud hacktricks for Kubernetes
  website: https://cloud.hacktricks.wiki/en/pentesting-cloud/kubernetes-security/index.html
- title: DarkReading on Microsoft's threat matrix
  website: https://www.darkreading.com/threat-intelligence/microsoft-s-kubernetes-threat-matrix-here-s-what-s-missing
- title: OWASP Threat and Safeguard Matrix
  website: https://owasp.org/www-project-threat-and-safeguard-matrix/
categories:
- cybersecurity
- kubernetes
tags:
- devsecops
weight: 1 # You can add weight to some posts to override the default sorting (date descending)
---

## Kubenomicon

The [Kubenomicon](https://kubenomicon.com) is a community-driven project where Kubernetes offensive security techniques and how to defend against them can easily be documented. This project is inspired in [the Kubernetes Threat Matrix by Microsoft](https://microsoft.github.io/Threat-Matrix-for-Kubernetes/). In this post we'll try to go through an analysis on the Threat Matrix itself and hopefully get to a point where contributions can be made so that documentation grows.

First of all we have to mention that in order to "predict" the way an attack will go, he have to understand the threats that could impact the attack surface we expose. Also, it's important to prioritize the different threats based on both the probability of them ocurring and the value lost by this threat being succesfully exploited say for example we might prefer to prioritize securing a business-critical asset that might have some threats almost unlikely to be exploited than some non-relevant asset (Or a rabbit-hole we set up) with a lot of threats related.

Now, Kubenomicon gives us a great ["Threat Matrix"](https://kubenomicon.com/Kubenomicon.html#the-kubenomicon-threat-matrix) with different tactics and techniques attackers can use to hack our cluster, but I think that given these information (Based on the exposed assets and their significance) its important to plan specific steps to mitigate these potential threats and harden our Kubernetes environment. This should include a multi-layered approach addressing various attack vectors. We need to consider not only the technical aspects, but also the operational and procedural elements involved in maintaining a secure cluster.

### Useful links

https://dev.to/kubefeeds/top-kubernetes-rss-feeds-that-you-must-follow-11c
https://kubernetes.io/docs/reference/issues-security/official-cve-feed/
https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html
https://github.com/cyberark/kubeletctl
https://medium.com/beyond-devsecops/a-pragmatic-look-at-the-kubernetes-threat-matrix-d58504e926b5