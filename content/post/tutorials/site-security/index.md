---
title: Deployment of secure webpages
description: This is a blog post regarding deployment of a secure webpages.
slug: deployment-secure-webpages
date: 2025-03-31 08:00:00+0000
lastmod: 2025-04-03 23:00:00+0000
image: cover.webp
links:
- title: Github
  description: Github is a Git server managed by Microsoft.
  website: https://github.com
  image: https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png

- title: Jamstack Community Survey
  description: Annual report covering modern web development practices including SSG, ISR, and security trends.
  website: https://jamstack.org/survey/

- title: Next.js Documentation on ISR
  description: Official Next.js guide on Incremental Static Regeneration, including real-world examples and use cases.
  website: https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration

- title: OWASP Cheat Sheet Series
  description: Security best practices for web applications, covering authentication, input validation, CSP, and more.
  website: https://cheatsheetseries.owasp.org/
  image: https://owasp.org/assets/images/logo.png

- title: Snyk Vulnerability Scanner
  description: Automatically finds and fixes vulnerabilities in your open source dependencies and containers.
  website: https://snyk.io/
  image: https://cyberscoop.com/wp-content/uploads/sites/3/2018/03/snyk.png

categories:
- tutorials
- cybersecurity
tags:
- introductory
- devsecops
weight: 1 # You can add weight to some posts to override the default sorting (date descending)
---

## Deployment of secure webpages

> “The safest server is the one that doesn’t exist.”

There are two sides to the coin. You can generate the content on the client (known as Client-side rendering, or CSR), or generate the content ahead of time and send it to the client (commonly Server-side rendering, SSR, or Static Site Generation, SSG). Each approach has trade-offs in security, performance, and complexity.

Security is not absolute. Tools alone won’t save you if the mindset is wrong. Even with the “most secure” framework, misconfiguration can lead to vulnerabilities. Conversely, with simple tools and a security-first mindset, you can build very secure systems.

You might think Rendering everything on the server is safest because no backend endpoints are exposed to users. While SSR does hide direct database or CMS access, it’s not foolproof. Misconfigured middleware or logic flaws can still lead to security issues. Ultimately, security posture matters more than the tools used.

This blog isn’t about showing React tricks. Tools are just tools—but for security, SSR does hold advantages over CSR. I won’t claim there’s one perfect answer. Many sites need dynamic content—whether for authenticated users, CMS-backed content, or real-time updates.

This blog isn’t about showing React tricks. Tools are just tools, but innevitably for security, SSR does hold advantages over CSR. I won’t claim there’s one perfect answer. Many sites need dynamic content—whether for authenticated users, CMS-backed content, or real-time updates.

- Building a static site with Hugo (*SSG*)
- Adding on-demand content rendering (Incremental Static Regeneration (*ISR*))
- Safely handling dynamic content with backend APIs (serverless functions, etc.)
- Diagrams, examples, best practices, and tips to make your website safer at every step

---

### Option 1: Static Site Generation (SSG)

#### What is SSG?

**Static Site Generation** means your website is prebuilt at compile time into a collection of static files (HTML, CSS, and JavaScript files). There’s **no ordinary backend involved when users visit your site**, just a server sending the files to users. In essence, you do the work upfront so users get content blazingly fast and with minimal risk of server-side vulnerabilities.

**Popular tools**:

- [**Hugo**](https://gohugo.io/) (Go-based, blazing fast)
- [**Jekyll**](https://jekyllrb.com/) (Ruby, popular for Github Pages)
- [**Gatsby**](https://www.gatsbyjs.com/) (React-based. Loads of plugins)
- [**Next.js**](https://nextjs.org/) with `getStaticProps`. React/Node, can mix SSG and dynamic as needed

#### How SSG works

When you run a build command (```hugo```, ```next build```, etc.):

1. Content is fetched or read (Markdown files, JSON data, or CMS content via API.)
2. Templates are compiled with data (Layout files are applied to the content.)
3. Static HTML, CSS, JS are generated (Complete pages ready to serve.)
4. Files are rendered (Ready to deploy)

```goat
 +---------------+
+    Templates    +
 +---------------+             .----------------------------.              
 +---------------+             |                            |             +----------------+
+     Content     + ---------> |   Static Site Generation   | ---------> +   Static files   +
 +---------------+             |                            |             +----------------+
 +---------------+             '----------------------------' 
+  Configuration  +                                                                ^
 +---------------+                                                                 |
                                                                                   |
                                                                                   |
                                                                                   |
                                                                                
                                                                              .--------.
                                                    .--------.               /        /|
                                                    |        |              +--------+ |
                                                    |  User  |              |        | |
                                                    +--------+ -----------> | Server | |
                                                   /// ____ \\\             |        |/
                                                  '------------'            '--------'
```

#### Benefits of SSG

| Feature | Why It Matters |
| ------- | -------------- |
| No runtime logic | No backend = reduced risk of SQLi, RCE, CSRF, etc. |
| Immutable builds | Easy to test, version, and roll back |
| Simple architecture | No need to manage complex servers or scale infrastructure manually |

##### Pros of SSG

1. ***Very secure by default***: With no server-side processing on each request, there’s no database or server code exposed to attacks like SQL injection or RCE. Many common web vulnerabilities become non-issues (you can’t SQL inject a site with no SQL database!). XSS risk is minimized since pages are pre-built and don’t accept user input by default.
2. ***Blazing fast***: Content is ready to go, making it trivial to achieve great performance. Static files served from a CDN have low latency. (Google’s data shows users are 24% less likely to abandon fast sites that meet Core Web Vitals thresholds.)
3. ***Scalable***: If site goes viral, a static file can be cached and served to millions of users easily. CDNs handle traffic and even mitigate DDoS by serving cached content globally.
4. ***Predictable & testable***: Because each deploy is an immutable snapshot, you won’t get surprise failures at 2 AM. What passed your tests is exactly what users get. It’s easy to version control and roll back static builds.

##### Cons of SSG

1. ***Content updates require rebuilds***: Any change (new blog post, text edit) means re-running the static generator and redeploying. This could be automated with webhooks or CI/CD, but it’s not instantaneous.
2. ***Not ideal for user-specific or real-time data***: If you need to show a logged-in user’s data or live stock prices, pure static won’t cut it. By the time you build, data might be outdated for some use cases.

##### Use cases for SSG

###### Uses of SSG

- **Mostly-static sites**: If your content doesn’t depend on who’s viewing it, SSG is a great fit. For example, marketing sites, documentation, blogs, portfolios, brochures, etc.
- **SEO-focused content**: Pre-rendered pages are crawler-friendly. No need for search bots to execute JavaScript.
- **Sites with infrequent updates**: If content updates daily or less, rebuild+deploy is easy to manage (and can even be automated). Many teams accept a few minutes of build time for the benefits of static.

###### Ideal SSG uses

- Blogs.
- Marketing pages.
- Documentation.
- Portfolio sites.

#### Example (SSG)

**Step 1**: Install Hugo (This tutorial is not specific to any OS, but since probably you'll use Linux for storing your content. I'll use linux commands here, just note that the [documentation](https://gohugo.io/installation) has other installation methods)

```bash
apt install -y hugo
```

**Step 2**: Create your site

```bash
hugo new site my-secure-blog
cd my-secure-blog
```

**Step 3**: Add a theme (There are many methods to use a theme created by the community, you can check the theme's documentation for help. I'll use an example with [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) because that's a popular choice)

```bash
git init
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke themes/ananke
echo 'theme = "ananke"' >> config.toml
```

**Step 4**: Create a post

```bash
hugo new posts/hello-world.md
```

Edit the file:

```md
---
title: "Hello World"
date: 2025-03-29
draft: false
---

This is my first Hugo post. Completely static. Super fast. Very safe.
```

**Step 5**: Build and serve locally

```bash
hugo serve
```

Hugo will generate static files and serve them on a local web server for preview. You can open the site in your browser and see your content.

**Deployment**: Run ```hugo``` (without serve) to build the final static files into the ```public/``` directory. Deploy those files to a static hosting service or CDN (such as GitHub Pages, Netlify, Vercel, AWS S3 + CloudFront, etc.). Because it’s static, hosting can be as simple as uploading files to an object storage bucket with web hosting enabled.

#### Hardening a static site

- Use HTTPS for your hosting (most static hosts offer free HTTPS). This prevents man-in-the-middle attacks on your content.
- Implement a Content Security Policy (CSP) header to restrict where scripts/styles can load from (e.g., only your domain and trusted CDNs). Static sites can often have very strict CSP since all content origins are known in advance.
- Enable Subresource Integrity (SRI) for any external scripts – this ensures the script hasn’t been tampered with.
- If your static site still needs to handle form submissions (e.g. a contact form), use a secure third-party form service or a serverless function endpoint rather than exposing your own server.

### Option 2: On-Demand Rendering (Incremental Static Regeneration)

#### What is On-Demand Rendering?

On-Demand Rendering is a hybrid approach between static and dynamic rendering, sometimes called Incremental Static Regeneration (ISR) (a term popularized by Next.js), following this approach content is initially rendered statically, but can be regenerated on request, either after a time interval or when triggered manually. This gives you the best of both worlds: you serve static pages for speed and safety, but you can update content without a full site rebuild.

**Popular tools**:

- **Next.js**: Supports ISR via the ```revalidate``` parameter in ```getStaticProps```.
- **Astro**: Can do partial hydration and incremental builds.
- **SvelteKit (Via hooks + cache)**: You can implement on-demand rendering patterns.

#### How ISR works

Imagine you built a static site at 12:00 PM. At 1:00 PM, new content is added to your CMS. With pure SSG, users won’t see it until you rebuild and deploy again. With ISR, the first user who requests the page after 1:00 PM triggers a regeneration (either in the background or blocking that request briefly). The updated page is then cached and served to subsequent users – combining freshness with caching.

```goat
 +---------------+
+    Templates    +
 +---------------+             .----------------------------.              
 +---------------+             |   Static Site Generation   |             +----------------+
+     Content     + ---------> |                            | ---------> +   Static files   +
 +---------------+             |  (Incremental build mode)  |             +----------------+
 +---------------+             '----------------------------'                      ^
+  Configuration  +              ^                         ^                      /         
 +---------------+              /                       No  \                    /  Yes
                               /                             \        +         /
                              /                               \       /\       /
                             /                                 \     /  \     /
                            /                                   \   /    \   /
                           /                                     \ /      \ /
                          /                                       /        \             
o-o-o-o-o-o-o-o-o-o-o-o-o-o                                      /          \
o                         o                                     +   Cached   +
o  Trigger content build  o                                      \          /            
o  ---------------------  o                                       \        /             
o-o-o-o-o-o-o-o-o-o-o-o-o-o                                        \      /
                                                                    \    /
                                                                     \  /
                                                                      \/
                                                                       +
                                                                      ^    
                                                                      | 
                                                                      |
                                                             .-----------------.
                                  .--------.                /                 /|
                                  |        |               +-----------------+ |
                                  |  User  |               |                 | |
                                  +--------+ ------------> |      Server     | |
                                 /// ____ \\\              |                 |/
                                '------------'             '-----------------'
```

#### Benefits of ISR

##### Pros of On-Demand Rendering

1. ***Fast (cached) responses***: Users still mostly get static content, so performance remains great.
2. ***Content freshness without full redeploys***: You can update parts of the site (e.g., a blog post, product info) without rebuilding everything. This can be automated via CMS webhooks or on a timer.
3. ***Flexible triggers***: Regeneration can be time-based (e.g., revalidate every 60 seconds), or event-based (e.g., an admin hits a refresh button or a webhook calls an API). This flexibility lets you balance load and freshness.

##### Cons of On-Demand Rendering

1. ***Slightly more complex architecture***
2. ***Regeneration latency on first uncached request***

##### Use cases of On-Demand Rendering

- News sites
- Product catalogs
- Frequently updated content from CMS

#### Example: Next.js with ISR

```js
export async function getStaticPaths() {
  const posts = await fetch('https://cms.io/api/posts').then(res => res.json());
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const post = await fetch(`https://cms.io/api/posts/${params.slug}`).then(res => res.json());

  return {
    props: { post },
    revalidate: 60
  };
}
```

##### Webhook-triggered rebuild*

```curl -X POST "https://yourdomain.com/api/revalidate?secret=secure_token&slug=your-post"```

```js
export default async function handler(req, res) {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await res.revalidate(`/posts/${req.query.slug}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to revalidate' });
  }
}
```

### Option 3: Dynamic Rendering (APIs + Serverless)

#### What is Dynamic Rendering?

In this model, content is rendered at request time. This gives full flexibility: personalization, real-time data, authenticated dashboards, etc.

#### How it works

```goat
 +---------------+                           
+     Content     +            .----------------------------.           
 +---------------+             |     Dynamic component      | 
                    ---------> |    (Acts as middleware)    |            
 +---------------+             |     (Acts as gateway)      |
+  Configuration  +            '----------------------------'        
 +---------------+                          |               
                                            |               ^
                                            v                \
                                     +--------------+         \            
                                    +  Static files  +         \       
                                     +--------------+           \      
                                                       .-----------------.
                            .--------.                /                 /|
                            |        |               +-----------------+ |
                            |  User  |               |                 | |
                            +--------+ ------------> |      Server     | |
                           /// ____ \\\              |                 |/
                          '------------'             '-----------------'
```

#### Benefits of dynamic rendering

##### Pros of dynamic rendering

1. Full control over logic and rendering
2. Real-time data + personalization

##### Cons of dynamic rendering

1. Bigger attack surface
2. Slower performance if not cached

##### Use cases of dynamic rendering

- Dashboards
- Authenticated content
- Search

#### Example: Authenticated API

```js
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const profile = await getProfileFromDB(user.id);
    res.status(200).json(profile);
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}
```

### Bonus: Using Databases or Headless CMS with SSG

One common misconception about Static Site Generators is that they only work with local Markdown files. In reality, SSGs can pull data from external sources like databases or headless CMS platforms at build time and still produce a fully static site. This means you can:

- Store content in tools like Contentful, Sanity, DatoCMS, Strapi, or even a SQL/NoSQL database
- Fetch that content using API calls or database queries during the build process
- Render everything as static HTML before deployment

#### Benefits of using external content storing/management systems with SSG

- You keep the security and performance advantages of static hosting
- You can use rich editing interfaces and collaborative workflows
- You separate content management from rendering

#### Example: Hugo with External JSON API

In Hugo, you can pull data from an external API using getJSON:

```go
{{ $data := getJSON "https://api.example.com/posts" }}
{{ range $data }}
  <h2>{{ .title }}</h2>
  <p>{{ .summary }}</p>
{{ end }}
```

### Final tips

#### Protecting against Cross-site Scripting (XSS)

Whenever injecting external or dynamic content into HTML or JS contexts, ensure proper encoding:

- Use frameworks that handle escaping automatically (React, Angular, Vue).
- Consider libraries like [DOMPurify](https://github.com/cure53/DOMPurify) for explicit sanitization.

#### Secure Dependency Management

Regularly audit dependencies to prevent vulnerabilities from outdated packages:

- Use tools like [Snyk](https://snyk.io/) or GitHub's [Dependabot](https://github.com/dependabot) to automate security checks and updates.

#### Logging & Monitoring

Regularly monitor logs and alerts for suspicious activity to detect potential security issues early:

- Use monitoring and alerting services like [New Relic](https://newrelic.com/), [Datadog](https://www.datadoghq.com/), or open-source solutions like [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/).

### Conclusion: Choosing the Right Approach for Security and Scalability

Web architecture today is about making smart trade-offs between key aspects such as performance, flexibility, and security.

#### When to Use Each Approach

| Scenario | Best Fit |
|----------|----------|
| Pure content, rarely changes | SSG (e.g., Hugo) |
| CMS-backed site, updated regularly | On-Demand Rendering |
| User-specific or real-time content | Dynamic + API |

#### Security Strategy Checklist

| Layer | What to Apply |
| ----- | ------------- |
| Authentication | OAuth2, JWT, signed cookies |
| Input Validation | zod, Joi, schema validators |
| Content Security Policy | Helmet.js, headers, meta tags |
| Rate Limiting | API Gateway throttles, express-rate-limit |
| Secrets Management | Vault, AWS/GCP Secret Manager, .env |

#### TL;DR: Static First. Secure Always

- If it doesn’t need to be dynamic, make it static.
- If it needs to be dynamic, make it secure.
- If it needs to be fresh, balance static with regeneration.
