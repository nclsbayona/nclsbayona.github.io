# GitHub Workflows Documentation

This directory contains GitHub Actions workflows that automate building, testing, deployment, and maintenance of the blog.

## Workflow Architecture

### Dependency Graph

```
┌─────────────────────────────────────────────────────────┐
│                     main Branch                         │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────────┐
    │            │            │                  │
    ▼            ▼            ▼                  ▼
┌─────────┐  ┌─────────┐  ┌──────────┐    ┌──────────┐
│ deploy  │  │ fetch-  │  │  update- │    │semantic- │
│  .yml   │◄─┤  quote  │  │  theme   │    │ release  │
│         │  │  .yml   │  │   .yml   │    │   .yml   │
└────┬────┘  └─────────┘  └──────────┘    └──────────┘
     │
     ▼
┌─────────────┐
│GitHub Pages │
└─────────────┘
```

### Workflow Matrix

| Workflow | Trigger | Purpose | Dependencies | Frequency |
|----------|---------|---------|--------------|-----------|
| **deploy.yml** | Push to main, Manual, Called by others | Build and deploy site to GitHub Pages | None | On content change |
| **fetch-quote.yml** | Daily 02:00 UTC, Manual | Update daily quote and redeploy | Calls deploy.yml | Daily |
| **update-theme.yml** | Daily 05:00 UTC, Manual | Update Hugo theme to latest | None | Daily |
| **semantic-release.yml** | Push to main | Generate changelog and version tags | None | On commit |
| **security-test.yml** | Manual | Run security scans (Gitleaks, Trivy, ZAP) | None | Manual |
| **page-analysis.yml** | Manual | Run Lighthouse and performance tests | None | Manual |
| **automatic-merge.yml** | Dependabot PR | Auto-merge dependency updates | None | On Dependabot PR |
| **delete-old-runs.yml** | Daily | Clean up old workflow runs | None | Daily |
| **create-webpage-gif.yml** | Manual | Generate demo GIF of website | None | Manual |

## Workflow Details

### Core Workflows

#### deploy.yml - Site Deployment
**Purpose**: Build Hugo site and deploy to GitHub Pages

**Triggers**:
- Push to `main` branch (on content/config/layout changes)
- Manual dispatch
- Called by other workflows (e.g., fetch-quote.yml)

**Key Steps**:
1. Checkout repository
2. Setup Go and download dependencies
3. Setup Hugo (extended version)
4. Build site with `hugo --minify`
5. Upload artifact for deployment
6. Deploy to GitHub Pages

**Configuration**:
- Hugo Version: Check workflow for current version
- Go Version: ^1.25.0
- Permissions: `contents: read`, `pages: write`, `id-token: write`

**Notes**:
- Uses concurrency control to prevent simultaneous deploys
- Caches Go modules for faster builds
- Displays quote content in job summary

---

#### fetch-quote.yml - Daily Quote Update
**Purpose**: Fetch new quote and update site daily

**Triggers**:
- Scheduled: Daily at 02:00 UTC
- Push to `main` (when quote script changes)
- Manual dispatch

**Key Steps**:
1. Checkout repository
2. Setup Go and download dependencies
3. Run `scripts/get_quote.go` to fetch new quote
4. Commit changes if quote updated
5. Call `deploy.yml` to redeploy site

**Configuration**:
- Go Version: ^1.25.0
- Commit message: `chore: 📅 Update quote for {date}` (with emoji)

**Notes**:
- Only commits if quote actually changed
- Uses workflow_call to trigger deployment
- Tight coupling with deploy.yml

---

#### semantic-release.yml - Automated Versioning
**Purpose**: Generate changelog and version tags automatically

**Triggers**:
- Push to `main` branch

**Key Steps**:
1. Checkout with full history
2. Setup Node.js
3. Run semantic-release

**Configuration**:
- Uses `.releaserc` configuration
- Follows Conventional Commits specification
- Generates CHANGELOG.md automatically

**Notes**:
- Requires conventional commit messages
- Creates Git tags for releases
- Updates CHANGELOG.md file

---

### Maintenance Workflows

#### update-theme.yml - Theme Updates
**Purpose**: Keep Hugo theme up-to-date

**Triggers**:
- Scheduled: Daily at 05:00 UTC
- Manual dispatch

**Key Steps**:
1. Checkout repository
2. Setup Go
3. Run `hugo mod get -u` to update theme
4. Create PR with changes

**Notes**:
- Automatically updates to latest theme version
- Creates PR for review (doesn't auto-merge)

---

#### automatic-merge.yml - Dependabot Auto-merge
**Purpose**: Automatically merge safe Dependabot PRs

**Triggers**:
- Pull request events from Dependabot

**Key Steps**:
1. Check if PR is from Dependabot
2. Validate update type (minor/patch)
3. Auto-approve and merge if safe

**Configuration**:
- Only auto-merges minor and patch updates
- Skips major version bumps (requires manual review)

**Notes**:
- Reduces manual maintenance overhead
- Security and major updates still require manual review

---

### Quality & Security Workflows

#### security-test.yml - Security Scanning
**Purpose**: Scan for vulnerabilities and security issues

**Triggers**:
- Manual dispatch

**Tools Used**:
1. **Gitleaks**: Scan for secrets in code
2. **Trivy**: Scan for vulnerabilities in dependencies
3. **ZAP**: Web application security testing
4. **zizmor**: GitHub Actions security linter

**Notes**:
- Run manually before releases
- Results available in Security tab
- Some tools may have version inconsistencies

---

#### page-analysis.yml - Performance Testing
**Purpose**: Analyze site performance and accessibility

**Triggers**:
- Manual dispatch

**Tools Used**:
1. **Lighthouse**: Performance, accessibility, SEO scores
2. **Sitespeed.io**: Performance metrics (commented out)
3. **Link Checker**: Find broken links (commented out)

**Notes**:
- Some jobs are commented out (document why)
- Lighthouse uses @master (should be pinned)
- Useful for pre-deployment checks

---

#### delete-old-runs.yml - Cleanup
**Purpose**: Remove old workflow run logs

**Triggers**:
- Scheduled: Daily

**Notes**:
- Keeps repository clean
- Reduces storage usage

---

#### create-webpage-gif.yml - Demo GIF
**Purpose**: Generate animated GIF demo of website

**Triggers**:
- Manual dispatch

**Notes**:
- Creates demo.gif for README
- Useful for visual documentation

---

## Environment Variables & Secrets

### Required Secrets

| Secret | Purpose | Used By |
|--------|---------|---------|
| `GITHUB_TOKEN` | GitHub API access | All workflows |
| `GH_TOKEN` | Semantic release | semantic-release.yml |

### Configuration Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| Hugo Version | See deploy.yml | Hugo version for builds |
| Go Version | 1.17.0 - 1.25.0 | Go runtime version |
| Base URL | https://nclsbayona.github.io | Site URL |

## Best Practices

### When Adding New Workflows

1. **Document purpose** in this README
2. **Use explicit versions** for actions (avoid @latest, @master)
3. **Set minimal permissions** via `permissions:` key
4. **Add concurrency control** if workflow modifies state
5. **Include failure handling** and notifications
6. **Test locally** with [act](https://github.com/nektos/act) when possible

### Version Pinning

- ✅ **Good**: `actions/checkout@v6`, `actions/setup-go@v6`
- ⚠️ **Risky**: `some-action@master`, `some-action@latest`
- ❌ **Bad**: `some-action@main` (can break unexpectedly)

### Permissions

Always use minimal required permissions:

```yaml
permissions:
  contents: read        # Read repository contents
  pages: write          # Write to GitHub Pages
  id-token: write       # OIDC token for deployments
```

### Concurrency

Prevent race conditions:

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false  # Don't cancel running deploys
```

## Common Tasks

### Trigger Manual Workflow

1. Go to Actions tab
2. Select workflow from left sidebar
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Debug Workflow Failures

1. Check workflow run logs in Actions tab
2. Review job summaries and artifacts
3. Test workflow locally with `act` if possible
4. Check for recent changes in dependencies

### Update Workflow Dependencies

```bash
# Update action versions in workflows
# Example: Update actions/checkout from v5 to v6
find .github/workflows -name "*.yml" -exec sed -i 's/actions\/checkout@v5/actions\/checkout@v6/g' {} +

# Review changes before committing
git diff .github/workflows/
```

## Troubleshooting

### Common Issues

#### Deployment Failures
- **Check Hugo version**: Ensure Hugo extended is used
- **Verify Go modules**: Run `hugo mod verify`
- **Check permissions**: Ensure workflow has `pages: write`

#### Quote Update Failures
- **API rate limits**: Quote API may be rate-limited
- **Network issues**: Temporary API outages
- **Script errors**: Check `assets/scripts/get_quote.go`

#### Theme Update Failures
- **Breaking changes**: Theme updates may have breaking changes
- **Module dependencies**: Check `go.mod` conflicts

## Workflow Health

### Monitoring

Check workflow status at:
- GitHub Actions tab
- README badges

### Maintenance Schedule

- **Weekly**: Review failed workflows
- **Monthly**: Update action versions
- **Quarterly**: Audit permissions and security
- **Yearly**: Review workflow architecture

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Hugo Deploy Documentation](https://gohugo.io/hosting-and-deployment/)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

## Questions?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.
