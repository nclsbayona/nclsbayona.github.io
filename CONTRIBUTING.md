# Contributing to nclsbayona.github.io

Thank you for your interest in contributing to this blog! This document provides guidelines for contributing content and improvements.

## Table of Contents

- [Getting Started](#getting-started)
- [Content Guidelines](#content-guidelines)
- [Development Workflow](#development-workflow)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)

## Getting Started

Before contributing, please:

1. Read the [DEVELOPMENT.md](DEVELOPMENT.md) guide for local setup
2. Familiarize yourself with the blog's focus areas:
   - Software development best practices
   - DevOps and DevSecOps methodologies
   - Cloud-native technologies
   - Security practices
   - Modern development workflows

## Content Guidelines

### Blog Post Structure

All blog posts should be placed in `/content/post/<category>/` with the following structure:

```
content/post/<category>/<post-name>/
├── index.md          # Main content with frontmatter
└── images/           # Post-specific images (optional)
```

### Required Frontmatter

Every blog post must include the following frontmatter:

```yaml
---
title: "Your Post Title"
description: "Brief description (150-200 characters)"
date: YYYY-MM-DD
slug: post-slug
categories:
  - Category Name
tags:
  - tag1
  - tag2
image: cover.jpg  # Optional cover image
---
```

### Writing Style

- **Tone**: Professional yet approachable
- **Technical depth**: Include practical examples and code snippets
- **Target audience**: Developers, DevOps engineers, and technical practitioners
- **Length**: 800-2000 words for comprehensive coverage
- **Structure**: Use clear headings, bullet points, and code blocks
- **Visuals**: Include diagrams, tables, and examples where helpful

### Content Quality Standards

1. **Accuracy**: Ensure all technical information is correct and up-to-date
2. **Examples**: Provide working code examples and real-world applications
3. **References**: Link to official documentation and reputable sources
4. **Clarity**: Write clear, concise explanations suitable for the target audience
5. **SEO**: Use descriptive titles, meta descriptions, and relevant keywords

## Development Workflow

### Local Development

```bash
# Start Hugo development server
hugo server -D

# Access at http://localhost:1313
```

### Testing Changes

Before submitting:

1. Build the site locally: `hugo --minify`
2. Check for broken links
3. Validate frontmatter completeness
4. Test responsiveness on different screen sizes
5. Review in both light and dark modes

## Commit Conventions

This repository follows [Conventional Commits](https://www.conventionalcommits.org/) specification for automated versioning via semantic-release.

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature or blog post
- **fix**: Bug fix or content correction
- **docs**: Documentation changes
- **style**: Formatting, missing semi-colons, etc. (no code change)
- **refactor**: Code restructuring without behavior change
- **perf**: Performance improvements
- **test**: Adding tests
- **chore**: Maintenance tasks, dependency updates
- **ci**: CI/CD workflow changes

### Examples

```bash
feat(post): add kubernetes security best practices guide

docs(readme): update setup instructions for Hugo 0.120+

fix(workflow): pin Hugo version to prevent build failures

chore(deps): update hugo-theme-stack to v3.34.1
```

## Pull Request Process

### Before Submitting

1. ✅ Ensure your branch is up-to-date with `main`
2. ✅ Run local builds successfully
3. ✅ Follow commit conventions
4. ✅ Update documentation if needed
5. ✅ Test on multiple browsers if making layout changes

### PR Guidelines

1. **Title**: Use conventional commit format
2. **Description**: Clearly explain:
   - What changed and why
   - Any breaking changes
   - Testing performed
   - Screenshots for UI changes
3. **Size**: Keep PRs focused and reasonably sized
4. **Review**: Address feedback promptly

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New blog post
- [ ] Content update
- [ ] Bug fix
- [ ] Documentation
- [ ] CI/CD improvement

## Checklist
- [ ] Follows content guidelines
- [ ] Tested locally with `hugo server`
- [ ] Conventional commit format used
- [ ] Documentation updated if needed
- [ ] Screenshots included for UI changes
```

## Automated Workflows

This repository uses GitHub Actions for:

- **Deploy**: Automatic deployment to GitHub Pages on merge to `main`
- **Security**: Regular security scans with Gitleaks, Trivy, and ZAP
- **Theme Updates**: Daily automated theme dependency updates
- **Quote Updates**: Daily quote of the day refresh
- **Semantic Release**: Automated versioning and changelog generation

See [.github/README.md](.github/README.md) for detailed workflow documentation.

## Questions?

- Open an issue for questions or suggestions
- Check existing issues before creating new ones
- Be respectful and constructive in all interactions

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a positive community
- Report unacceptable behavior

Thank you for contributing! 🚀
