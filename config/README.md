# Configuration Documentation

This directory contains Hugo configuration files that control the site's behavior, appearance, and features.

## Configuration Structure

Hugo uses a modular configuration approach with separate files for different concerns:

```
config/_default/
├── config.toml       # Main Hugo configuration
├── params.toml       # Theme parameters and features
├── menu.toml         # Navigation menus
├── markup.toml       # Markdown rendering configuration
├── module.toml       # Hugo module dependencies
├── permalinks.toml   # URL structure rules
├── related.toml      # Related content algorithm
└── _languages.toml   # Multilingual settings (inactive)
```

## Configuration Files

### config.toml - Main Configuration

**Purpose**: Core Hugo settings

**Key Settings**:
- `baseurl`: Site URL (https://nclsbayona.github.io)
- `languageCode`: Primary language (en-us)
- `title`: Site title displayed in browser
- `defaultContentLanguage`: Default content language
- `pagination.pagerSize`: Posts per page (5)
- `enableEmoji`: Enable emoji support (true)
- `buildFuture`: Build future-dated posts (true)

**Important**:
- ⚠️ `disqusShortname` is set to placeholder - not used (comments use utterances)
- ⚠️ `enableRobotsTXT` is commented out - should be enabled for SEO
- ⚠️ `buildFuture = true` means draft posts dated in future will be published

**Recommended Changes**:
```toml
# Enable for SEO
enableRobotsTXT = true

# Remove if not using Disqus
# disqusShortname = "not-my-real-disqus-shortname"

# Consider setting to false in production
buildFuture = false
```

---

### params.toml - Theme Parameters

**Purpose**: Configure Stack theme features and appearance

**Key Sections**:

#### Site Branding
- `mainSections`: Main content sections (e.g., "post")
- `featuredImageField`: Field for featured images
- `rssFullContent`: Include full content in RSS (false)

#### Footer
- `since`: Site start year
- `customText`: Custom footer text (supports HTML)

#### Sidebar
- Widgets: Archives, search, categories, tag-cloud
- Widget order and configuration

#### Comments
- System: utterances (GitHub-based comments)
- Repository: nclsbayona/nclsbayona.github.io
- Theme: preferred-color-scheme

#### Article Settings
- Math typesetting: Disabled
- Table of contents: Enabled
- Code copy button: Enabled
- Reading time: Enabled

#### Image Processing
- Quality: 75%
- Anchor: Smart (automatic cropping)

**Notes**:
- Disqus configuration present but not used
- Sitemap generation commented out
- Opengraph settings configured for social sharing

---

### menu.toml - Navigation Menus

**Purpose**: Define site navigation structure

**Main Menu Items**:
1. Home (/)
2. About (/about/)
3. Archives (/archives/)
4. Quote of the day (/quote/)

**Configuration**:
```toml
[[main]]
identifier = "home"
name = "Home"
url = "/"
weight = -100          # Negative = appears first
pre = "home"           # Icon name

[[main]]
identifier = "about"
name = "About"
url = "/about/"
weight = -90
```

**Adding New Menu Items**:
1. Add new `[[main]]` block
2. Set unique identifier
3. Set weight (lower = earlier in menu)
4. Optionally add icon with `pre`

---

### markup.toml - Markdown Configuration

**Purpose**: Control how Markdown is rendered to HTML

**Key Settings**:

#### Table of Contents
- `startLevel`: TOC starts at H2 (level 2)
- `endLevel`: TOC ends at H3 (level 3)
- `ordered`: Use ordered lists (false)

#### Goldmark (Markdown Parser)
- Extensions: Footnotes, typographer
- Renderer: Allow unsafe HTML (for flexibility)

#### Highlight (Code Syntax)
- Style: Not set (uses theme default)
- Line numbers: Available
- Code fences: Enabled

**Security Note**:
`unsafe = true` allows raw HTML in Markdown. Only enable if you trust content authors.

---

### module.toml - Hugo Modules

**Purpose**: Manage Hugo module dependencies (theme)

**Current Modules**:
- Stack theme: `github.com/CaiJimmy/hugo-theme-stack/v3`

**Module Configuration**:
```toml
[[imports]]
path = "github.com/CaiJimmy/hugo-theme-stack/v3"
```

**Updating Theme**:
```bash
# Update to latest version
hugo mod get -u github.com/CaiJimmy/hugo-theme-stack/v3

# Update all modules
hugo mod get -u ./...
hugo mod tidy
```

---

### permalinks.toml - URL Structure

**Purpose**: Define URL patterns for different content types

**Current Structure**:
- Posts: `/p/:slug/`
- Pages: `/:slug/`

**Pattern Variables**:
- `:slug`: URL-friendly version of title
- `:title`: Post title
- `:year`, `:month`, `:day`: Date components
- `:section`: Content section

**Example**:
```toml
[post]
pattern = "/p/:slug/"

# Post: "content/post/kubernetes/intro/index.md"
# URL:  https://nclsbayona.github.io/p/intro/
```

---

### related.toml - Related Content

**Purpose**: Configure "Related Posts" algorithm

**Algorithm**:
- Includes recent posts
- Matches on tags
- Matches on keywords

**Weighting**:
- `date`: 10 (recent posts weighted highly)
- `keywords`: 20 (keyword matches most important)
- `tags`: 80 (tag matches very important)

**Thresholds**:
- `threshold`: 0 (show all related posts)
- `toLower`: false (case-sensitive matching)

---

### _languages.toml - Multilingual (Inactive)

**Purpose**: Multilingual site configuration

**Status**: Disabled (filename starts with `_`)

**To Enable**:
1. Rename to `languages.toml` (remove `_` prefix)
2. Configure languages
3. Add translated content in `content/<lang>/`

**Example Structure**:
```toml
[en]
languageName = "English"
weight = 1

[es]
languageName = "Español"
weight = 2
```

---

## Environment-Specific Configuration

### Development vs Production

Hugo automatically loads different configs based on environment:

**Development** (default):
```bash
hugo server
# Uses: config/_default/*.toml
```

**Production**:
```bash
HUGO_ENVIRONMENT=production hugo
# Uses: config/_default/*.toml + config/production/*.toml (if exists)
```

**Creating Production Overrides**:
```bash
mkdir -p config/production/
echo 'baseurl = "https://nclsbayona.github.io"' > config/production/config.toml
```

---

## Configuration Best Practices

### 1. Version Control
✅ Commit all config files  
✅ Document non-obvious settings  
❌ Don't commit secrets or API keys

### 2. Comments
Add comments for:
- Non-obvious settings
- Disabled features (explain why)
- Temporary workarounds

### 3. Organization
- Keep related settings together
- Use descriptive section headers
- Maintain consistent formatting

### 4. Validation
Test configuration changes:
```bash
# Check for errors
hugo --quiet

# Build test
hugo --minify
```

---

## Common Configuration Tasks

### Change Site Title
Edit `config/_default/config.toml`:
```toml
title = "New Site Title"
```

### Add Menu Item
Edit `config/_default/menu.toml`:
```toml
[[main]]
identifier = "projects"
name = "Projects"
url = "/projects/"
weight = -80
```

### Enable RSS Full Content
Edit `config/_default/params.toml`:
```toml
rssFullContent = true
```

### Change Posts Per Page
Edit `config/_default/config.toml`:
```toml
[pagination]
pagerSize = 10
```

### Enable Robots.txt
Edit `config/_default/config.toml`:
```toml
enableRobotsTXT = true
```

---

## Troubleshooting

### Config Not Taking Effect
1. Restart Hugo server: `Ctrl+C` then `hugo server`
2. Clear cache: `hugo mod clean`
3. Check for syntax errors: `hugo config`

### Module Issues
```bash
# Verify modules
hugo mod verify

# Download missing modules
hugo mod get

# Clean and rebuild
hugo mod clean && hugo mod get
```

### Theme Not Loading
1. Check `module.toml` has correct import path
2. Run `hugo mod get -u`
3. Verify `go.mod` in root directory

---

## Additional Resources

- [Hugo Configuration](https://gohugo.io/getting-started/configuration/)
- [Stack Theme Documentation](https://stack.jimmycai.com/config/)
- [Hugo Modules](https://gohugo.io/hugo-modules/)
- [Permalink Patterns](https://gohugo.io/content-management/urls/)

## Questions?

See [DEVELOPMENT.md](../DEVELOPMENT.md) for development setup or [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.
