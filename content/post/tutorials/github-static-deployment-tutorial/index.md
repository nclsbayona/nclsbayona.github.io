---
title: Deployment of static webpage with Github
description: This is a blog post regarding deployment of a static site using Github
slug: github-static-deployment-tutorial
date: 2025-01-29 08:00:00+0000
lastmod: 2025-02-17 23:00:00+0000
image: cover.webp
links:
- title: Github
  description: Github is a Git server managed by Microsoft.
  website: https://github.com
  image: https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png
categories:
- tutorials
tags:
- introductory
- devops
weight: 1 # You can add weight to some posts to override the default sorting (date descending)
---

## Deployment of static webpage with Github

### Introduction

Buckle up, buttercup, as here we can see an explanation on GitHub deployments! You want a blog post, eh? Well, you've come to the right place! Have you got a requirement to deploy a site and you just don't know what you can do? You read that GitHub allows you to host webpages for free and want to see if you can use this option (I understand Gitlab too but I just haven't worked a lot on Gitlab yet) ? Did you find some cool webpage being hosted on GitHub (Like this one ...) and you want to understand what kind of magic is involved in the process of deploying that page to actually see something online? Do you want to learn something new? Did you find this post and said "Maybe I should read it"? Are you just waiting for me to begin? Don't you say a word I've got you covered.

### Actually deploying

So, you've crafted the next killer website with spinning unicorns, auto-playing midi files, and enough Comic Sans to make your eyes bleed (or just a simple website or you're begining with it but say to yourself "How am I actually going to deploy this?"). GitHub's got you covered, my friend! Several ways, in fact. It's like choosing a superpower: Do you want laser vision, super strength, or the ability to understand JavaScript? (Okay, maybe not that last one). Also, the URL is a bit... well, let's just say "yourusername.github.io". Not exactly "[invalid URL removed]" or "myprettyawesomewebsite.com", but hey, it's free! (I know you can use your own custom domain _I don't think [https://yourusername.github.io](https://nclsbayona.github.io) is really that bad_ but let's just skip it for now).

#### Option 1: GitHub Pages classic deployment - The "Set It and Forget It"

Think of this GitHub Pages deployment way as the "Easy Bake-Oven" of deployments Github offers. It's simple, it's convenient, and it's perfect for static sites (think HTML, CSS, and optionally some JavaScript). This option is great if you want just a way of deploying your files and forgetting about the rest (You can update the files you show and probably that will be something you'll do often). This assumes you have a Jekyll-powered site (If you don't know what [Jekyll](https://jekyllrb.com/) is, you can read the [docs](https://jekyllrb.com/docs) if you want (Or let's just say it's a tool to generate static sites (Just one of many, each one with its pros and cons))) and really there's just no way of changing that behaviour so yeah you could use [Markdown](https://www.markdownguide.org/) and have [Jekyll](https://jekyllrb.com/) do that static site generation for you but really there's not a lot of customization options here, you're locked-in to what GitHub provides.

- **Pros**
  - Free.
  - Ridiculously easy to set up (seriously, even I can do it).
  - Directly integrated with your GitHub repo.

- **Cons**
  - Limited to static sites, so if your site needs a server-side language like Python or PHP, you're out of luck.

#### Option 2: GitHub Actions powered deployment - The "Automate All the Things" Option

GitHub Actions here are like giving your deployment process a shot of adrenaline. Using Github Actions lets you automate pretty much everything, from building your site to deploying it to... well, whatever you want! Really, imagination is your limit here (Skills too but I wanted it to sound like an utopia).

- **Pros**
  - Incredibly flexible.
  - You can deploy to any hosting provider you can dream of (I know I stated that this will only be for GitHub since its free but I believe in giving a wide-range of options and not trying to bias decisions so I always like to think of alternatives too).
  - You can even make it automatically tweet about your deployment (Because I do care).
  - Free for public repos!

- **Cons**
  - Steeper learning curve. You'll need to learn a bit of [YAML](https://yaml.org) (it's not as scary as it sounds, I promise). It's like learning a new language, but for robots (Ok no, just kidding...).

However, keep in mind that if you mess up your files, your deployment might accidentally launch a rocket to the moon. (Just kidding... or not?).

#### Option 3: Third-Party Deployment Services - The "I'm Too Busy for This" Option

Services like Netlify, Vercel, and Heroku can connect directly to your GitHub repo and handle all the deployment magic for you. It's like hiring a deployment butler.

- **Pros**
  - Super convenient.
  - Often offer extra features like continuous deployment, automatic scaling, header manipulation and caching.
  - They basically do all the heavy lifting while you sip margaritas on the beach (Metaphorically, of course. Unless you're actually on a beach. In that case, cheers!).

- **Cons**
  - Can be more expensive than the other options, especially for larger sites or high traffic.
  - You're relying on a third-party service, which means if they go down, your site goes down with them. It's like trusting your cat to guard your pizza (I'm not saying GitHub won't go down but I think you understand what I'm trying to say).

#### Which Option is Right for You?

- Static site? Simple deployment? GitHub Pages is your jam.
- Dynamic site? Complex deployment needs? Enjoy tinkering? GitHub Actions might be your go-to.
- Want (Probably) the easiest deployment experience and don't mind paying a bit? Third-party services are your friend here.

### Conclusion

So there you have it! A whirlwind tour of GitHub deployments. Now go and deploy your site, make me proud! And remember, if you get stuck, just blame JavaScript. It's always JavaScript (Just kidding... mostly). Now, if you'll excuse me, I have a commit message to write... something about a "minor bug fix" that actually rewrote the entire application. Classic GitHub humor! Until the next time.
