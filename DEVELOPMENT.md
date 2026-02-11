# Development Guide

This guide helps you set up and work with the nclsbayona.github.io blog locally.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Hugo Extended** (v0.115.0 or later)
  - Download: https://gohugo.io/installation/
  - Verify: `hugo version`
  
- **Go** (v1.25 or later)
  - Download: https://go.dev/doc/install
  - Verify: `go version`
  
- **Git**
  - Verify: `git --version`

### Optional Tools

- **Docker** (for devcontainer usage)
- **VS Code** (recommended editor with Hugo extensions)

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/nclsbayona/nclsbayona.github.io.git
cd nclsbayona.github.io
```

### 2. Initialize Hugo Modules

```bash
# Download theme and dependencies
hugo mod get -u
hugo mod tidy
```

### 3. Start Development Server

```bash
# Start server with drafts enabled
hugo server -D

# Or with live reload and navigation
hugo server -D --navigateToChanged
```

The site will be available at `http://localhost:1313`

## Development Environment

### Option 1: Local Installation

Follow the [Prerequisites](#prerequisites) section above.

### Option 2: Dev Container (Docker)

This repository includes a `.devcontainer` configuration:

1. Open in VS Code
2. Click "Reopen in Container" when prompted
3. Container will set up automatically with Hugo and Go

### Option 3: GitHub Codespaces

1. Click "Code" → "Codespaces" → "Create codespace"
2. Wait for environment setup
3. Run `hugo server -D` in terminal

## Project Structure

```
nclsbayona.github.io/
├── .github/              # GitHub Actions workflows and configuration
│   ├── workflows/        # CI/CD workflow definitions
│   └── instructions/     # Development instructions for agents
├── assets/               # Source assets (processed by Hugo)
│   ├── icons/           # SVG icons
│   ├── scss/            # Custom styles
│   └── scripts/         # Build-time scripts
├── config/               # Hugo configuration
│   └── _default/        # Default configuration files
│       ├── config.toml  # Main Hugo config
│       ├── params.toml  # Theme parameters
│       ├── menu.toml    # Navigation menus
│       └── ...          # Other config files
├── content/              # Site content
│   ├── post/            # Blog posts by category
│   │   ├── kubernetes/
│   │   ├── fundamentals/
│   │   └── ...
│   ├── page/            # Static pages
│   │   ├── about/
│   │   ├── archives/
│   │   └── quote/
│   └── categories/      # Category definitions
├── layouts/              # Custom layout overrides
│   └── partials/        # Partial templates
├── scripts/              # Utility scripts (Go, Shell, etc.)
├── go.mod                # Go module dependencies
├── CHANGELOG.md          # Auto-generated changelog
├── CONTRIBUTING.md       # Contribution guidelines
└── README.md             # Repository overview
```

### Configuration Files

See [config/README.md](config/README.md) for detailed configuration documentation.

## Common Tasks

### Create New Blog Post

```bash
# Create new post in a category
hugo new content/post/<category>/<post-name>/index.md

# Example: Create Kubernetes security post
hugo new content/post/kubernetes/k8s-security-guide/index.md
```

Edit the generated file and update the frontmatter:

```yaml
---
title: "Your Post Title"
description: "Brief description"
date: 2024-01-15
slug: k8s-security-guide
categories:
  - Kubernetes
tags:
  - security
  - best-practices
draft: false
---
```

### Add Images to Post

Place images in the same directory as your post:

```
content/post/kubernetes/k8s-security-guide/
├── index.md
└── security-diagram.png
```

Reference in markdown:

```markdown
![Security Diagram](security-diagram.png)
```

### Create New Page

```bash
hugo new content/page/<page-name>/_index.md
```

### Preview Drafts

```bash
# Include draft posts
hugo server -D

# Build drafts for testing
hugo --buildDrafts
```

### Build for Production

```bash
# Clean build
rm -rf public/

# Build with minification
hugo --minify

# Output in ./public/
```

### Update Theme

```bash
# Update to latest theme version
hugo mod get -u github.com/CaiJimmy/hugo-theme-stack/v3

# Update all dependencies
hugo mod get -u ./...
hugo mod tidy

# Clean module cache if needed
hugo mod clean
```

### Run Quote Script

```bash
cd scripts/
go run get_quote.go
```

### Test Workflows Locally

```bash
# Install act (GitHub Actions local runner)
# See: https://github.com/nektos/act

# Run deploy workflow
act -W .github/workflows/deploy.yml
```

## Troubleshooting

### Hugo Module Issues

```bash
# Clear module cache
hugo mod clean

# Reinitialize modules
hugo mod get -u
hugo mod tidy
```

### Port Already in Use

```bash
# Use different port
hugo server -D --port 1314

# Or find and kill process using 1313
lsof -ti:1313 | xargs kill -9
```

### Theme Not Loading

```bash
# Verify module is downloaded
hugo mod graph

# Re-download theme
hugo mod get -u github.com/CaiJimmy/hugo-theme-stack/v3
```

### Build Errors

```bash
# Verbose build output
hugo --verbose --debug

# Check Hugo version
hugo version

# Ensure Hugo Extended is installed
hugo version | grep extended
```

### Images Not Processing

Ensure you're using **Hugo Extended** (not standard Hugo). The extended version includes image processing libraries.

```bash
# Verify extended version
hugo version | grep extended
```

### Development Server Not Refreshing

```bash
# Clear Hugo cache
hugo mod clean

# Restart server with polling
hugo server -D --poll 500ms
```

## Environment Variables

The following environment variables can be used:

- `HUGO_ENVIRONMENT`: Set to `production` for production builds
- `HUGO_VERSION`: Override Hugo version (used in CI)

Example:

```bash
HUGO_ENVIRONMENT=production hugo --minify
```

## Testing Changes

### Before Committing

1. **Build locally**: `hugo --minify`
2. **Check for errors**: Review build output
3. **Test navigation**: Click through site locally
4. **Validate links**: Check internal and external links
5. **Review frontmatter**: Ensure all required fields present

### Automated Checks

GitHub Actions will automatically:
- Build the site
- Run security scans
- Check for broken links (periodically)
- Deploy to GitHub Pages (on merge)

## Resources

- **Hugo Documentation**: https://gohugo.io/documentation/
- **Stack Theme Docs**: https://stack.jimmycai.com/
- **Hugo Community**: https://discourse.gohugo.io/
- **Markdown Guide**: https://www.markdownguide.org/

## Getting Help

- Check [existing issues](https://github.com/nclsbayona/nclsbayona.github.io/issues)
- Review [Hugo documentation](https://gohugo.io/documentation/)
- Ask in [Hugo forums](https://discourse.gohugo.io/)

## Next Steps

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Check [.github/README.md](.github/README.md) for workflow documentation
- Review [config/README.md](config/README.md) for configuration options
