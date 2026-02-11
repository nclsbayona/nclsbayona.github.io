# Content Structure Documentation

This document describes the content organization and structure for the nclsbayona.github.io blog.

## Directory Structure

```
content/
├── post/                  # Blog posts organized by category
│   ├── fundamentals/      # Fundamental concepts
│   ├── kubernetes/        # Kubernetes-related posts
│   ├── non-technical/     # Non-technical content
│   └── ...               # Other categories as needed
├── page/                  # Static pages
│   ├── about/            # About page
│   ├── archives/         # Post archive page
│   ├── quote/            # Daily quote page
│   └── search/           # Search page
└── categories/           # Category taxonomy definitions
    ├── containers/
    ├── cybersecurity/
    ├── kubernetes/
    ├── networking/
    ├── tutorials/
    └── ...
```

## Content Types

### Blog Posts (`content/post/`)

Blog posts are the primary content type, organized by topic category.

**Location Pattern**: `content/post/<category>/<post-slug>/index.md`

**Example**:
```
content/post/kubernetes/kubernetes-security/
├── index.md              # Post content
├── cover.jpg            # Featured image (optional)
└── images/              # Post-specific images
    ├── diagram1.png
    └── screenshot.jpg
```

**Required Frontmatter**:
```yaml
---
title: "Post Title (50-60 characters)"
description: "Brief description for SEO and social sharing (150-160 characters)"
date: 2024-02-11
slug: post-url-slug
categories:
  - Category Name      # Match folder structure
tags:
  - tag1              # 3-7 relevant tags
  - tag2
  - tag3
image: cover.jpg      # Optional featured image
draft: false          # Set to true for unpublished posts
---
```

### Static Pages (`content/page/`)

Static pages for special functionality or informational content.

**Location Pattern**: `content/page/<page-name>/_index.md`

**Current Pages**:
- **about**: Personal/professional information
- **archives**: Chronological post listing
- **quote**: Daily inspirational quote (auto-updated)
- **search**: Site-wide search interface

**Example Frontmatter**:
```yaml
---
title: "About"
description: "About this blog and its author"
menu:
  main:
    weight: -90
    params:
      icon: user
---
```

### Categories (`content/categories/`)

Category definitions with descriptions and metadata.

**Location Pattern**: `content/categories/<category-name>/_index.md`

**Example**:
```yaml
---
title: "Kubernetes"
description: "Posts about Kubernetes orchestration, deployment, and management"
image: kubernetes-banner.jpg  # Optional category image
---

Extended description of the category can go here in markdown.
```

**Current Categories**:
- **Kubernetes**: Container orchestration
- **Containers**: Container technology and Docker
- **Cybersecurity**: Security practices and tools
- **Networking**: Network concepts and protocols
- **Tutorials**: Step-by-step guides

## Frontmatter Reference

### Common Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Post/page title (50-60 chars for SEO) |
| `description` | string | ✅ | Brief summary (150-160 chars for SEO) |
| `date` | date | ✅ | Publication date (YYYY-MM-DD) |
| `slug` | string | ✅ | URL-friendly identifier |
| `categories` | list | ✅ | Post categories (1-2 recommended) |
| `tags` | list | ⚠️ | Relevant tags (3-7 recommended) |
| `image` | string | ⚠️ | Featured/cover image filename |
| `draft` | boolean | ⚠️ | Draft status (default: false) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `author` | string | Post author (defaults to site author) |
| `lastmod` | date | Last modified date |
| `keywords` | list | Additional SEO keywords |
| `weight` | number | Ordering weight (lower = higher priority) |
| `menu` | object | Menu configuration for pages |
| `comments` | boolean | Enable/disable comments (default: true) |
| `toc` | boolean | Enable/disable table of contents |
| `math` | boolean | Enable math typesetting |

### Advanced Fields

```yaml
# Custom styling
style:
  background: "#2a9d8f"
  color: "#fff"

# Related content override
related: ["post-1", "post-2"]

# Taxonomy overrides
taxonomies:
  - name: "series"
    value: "Kubernetes Deep Dive"

# Schema.org metadata
schema:
  type: "TechArticle"
  proficiencyLevel: "Intermediate"
```

## Content Guidelines

### Writing Style

- **Tone**: Professional yet approachable
- **Audience**: Developers, DevOps engineers, technical practitioners
- **Length**: 800-2000 words for comprehensive coverage
- **Structure**: Clear headings, bullet points, code examples

### Formatting Standards

#### Headings

Use semantic heading hierarchy:
```markdown
# Post Title (H1 - auto-generated from frontmatter)

## Main Section (H2)

### Subsection (H3)

#### Detail Section (H4)
```

#### Code Blocks

Always specify language for syntax highlighting:
```markdown
```go
package main

func main() {
    fmt.Println("Hello, World!")
}
``` (backticks)
```

Supported languages: `go`, `python`, `javascript`, `bash`, `yaml`, `dockerfile`, `json`, `toml`, etc.

#### Images

**Local Images** (preferred):
```markdown
![Alt text description](image.jpg)
```

**External Images** (when necessary):
```markdown
![Alt text](https://example.com/image.jpg)
```

**Image Optimization**:
- Use WebP or JPEG format
- Compress to < 200KB per image
- Provide descriptive alt text
- Use responsive images via Hugo's image processing

#### Links

**Internal Links**:
```markdown
[Related Post](/p/kubernetes-intro/)
```

**External Links**:
```markdown
[Hugo Documentation](https://gohugo.io/)
```

#### Lists

**Unordered**:
```markdown
- Item 1
- Item 2
  - Nested item
- Item 3
```

**Ordered**:
```markdown
1. First step
2. Second step
3. Third step
```

#### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

#### Callouts/Alerts

Use blockquotes for emphasis and callouts:
```markdown
> **Note:** This is an informational note.

> **Warning:** This is a warning message.

> **Tip:** This is a helpful tip.
```

Or use custom HTML if supported by your theme:
```html
<div class="alert alert-info">
This is an informational note.
</div>
```

### SEO Best Practices

1. **Title**: Include primary keyword, keep under 60 characters
2. **Description**: Compelling summary with keywords, 150-160 characters
3. **Slug**: Short, keyword-rich, hyphen-separated
4. **Headings**: Use H2-H4 with keywords naturally incorporated
5. **Images**: Descriptive filenames and alt text
6. **Internal Links**: Link to 2-3 related posts
7. **External Links**: Link to authoritative sources

### Content Checklist

Before publishing:

- [ ] Title is descriptive and includes primary keyword
- [ ] Description is compelling and within character limit
- [ ] Slug is SEO-friendly
- [ ] Appropriate category selected
- [ ] 3-7 relevant tags added
- [ ] Featured image added (if applicable)
- [ ] All code examples tested and working
- [ ] All links verified and working
- [ ] Images optimized and have alt text
- [ ] Grammar and spelling checked
- [ ] Heading hierarchy is logical
- [ ] Table of contents is helpful (if enabled)
- [ ] Draft status set to `false`

## Naming Conventions

### File Names

- Use lowercase
- Use hyphens for spaces
- Be descriptive but concise
- Match slug in frontmatter

**Good**:
- `kubernetes-security-best-practices`
- `docker-container-optimization`
- `ci-cd-pipeline-guide`

**Bad**:
- `my-post-1`
- `Blog_Post_Title`
- `kubernetes`

### Image Names

- Descriptive names
- Lowercase with hyphens
- Include context

**Good**:
- `kubernetes-architecture-diagram.png`
- `deployment-workflow.jpg`
- `security-checklist-table.png`

**Bad**:
- `image1.png`
- `Screenshot 2024-02-11.png`
- `IMG_0042.jpg`

### Category Names

- Title case
- Singular or plural consistently
- Match industry terminology

**Current Standard**: Lowercase folders, Title Case in frontmatter

## Content Categories

### Existing Categories

| Category | Description | Post Count |
|----------|-------------|------------|
| **Fundamentals** | Core concepts and basics | Multiple |
| **Kubernetes** | K8s orchestration and management | Multiple |
| **Containers** | Container technology (Docker, etc.) | Multiple |
| **Cybersecurity** | Security practices and tools | Multiple |
| **Networking** | Network concepts and protocols | Multiple |
| **Tutorials** | Step-by-step guides | Multiple |

### Adding New Categories

1. Create category folder: `content/categories/<category-name>/`
2. Create `_index.md` with frontmatter and description
3. Use category in post frontmatter
4. Update this documentation

## Tags

### Tag Guidelines

- **Quantity**: 3-7 tags per post
- **Specificity**: Balance general and specific tags
- **Consistency**: Reuse existing tags when possible
- **Format**: Lowercase, hyphenated multi-word tags

### Common Tags

- `kubernetes`, `docker`, `containers`
- `security`, `devops`, `devsecops`
- `best-practices`, `tutorials`, `architecture`
- `ci-cd`, `automation`, `infrastructure`
- `cloud-native`, `microservices`, `monitoring`

## URLs and Permalinks

URL structure is configured in `config/_default/permalinks.toml`:

```toml
[post]
pattern = "/p/:slug/"
```

**Example URLs**:
- Post: `https://nclsbayona.github.io/p/kubernetes-security/`
- Page: `https://nclsbayona.github.io/about/`
- Category: `https://nclsbayona.github.io/categories/kubernetes/`
- Tag: `https://nclsbayona.github.io/tags/security/`

## Creating New Content

### New Blog Post

```bash
# Create new post
hugo new content/post/<category>/<post-slug>/index.md

# Example
hugo new content/post/kubernetes/k8s-networking-guide/index.md
```

### New Category

```bash
# Create category definition
hugo new content/categories/<category-name>/_index.md

# Example
hugo new content/categories/monitoring/_index.md
```

### New Page

```bash
# Create static page
hugo new content/page/<page-name>/_index.md

# Example
hugo new content/page/contact/_index.md
```

## Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Development setup
- [.github/instructions/POLISHING.instructions.md](../.github/instructions/POLISHING.instructions.md) - Content quality standards

## Questions?

For questions about content structure or suggestions:
- Open an issue with the "documentation" or "content" label
- Review existing posts for examples
- Check Hugo documentation: https://gohugo.io/content-management/
