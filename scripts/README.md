# Utility Scripts Documentation

This directory contains utility scripts for maintaining and building the blog.

## Scripts Overview

| Script | Language | Purpose | Usage |
|--------|----------|---------|-------|
| `get_quote.go` | Go | Fetch daily inspirational quote | Run manually or via GitHub Actions |
| `reduce_image_size.go` | Go | Optimize images for web | Run before committing new images |

## Script Details

### get_quote.go - Daily Quote Fetcher

**Purpose**: Fetches an inspirational quote from an external API and updates the quote page content.

**Usage**:
```bash
cd scripts/
go run get_quote.go
```

**What It Does**:
1. Fetches a random quote from a quote API
2. Updates `/content/page/quote/_index.md` with new content
3. Formats the quote with proper markdown
4. Preserves frontmatter configuration

**GitHub Actions Integration**:
- Runs daily at 02:00 UTC via `fetch-quote.yml` workflow
- Automatically commits changes if quote updated
- Triggers site redeployment

**Configuration**:
- API endpoint: (check script for current API)
- Output file: `content/page/quote/_index.md`
- Timeout: 30 seconds

**Dependencies**:
- Go 1.17 or later
- Internet connection to quote API

**Error Handling**:
- Gracefully handles API failures
- Falls back to previous quote if fetch fails
- Logs errors to stderr

---

### reduce_image_size.go - Image Optimizer

**Purpose**: Compresses and optimizes images for web delivery while maintaining quality.

**Usage**:
```bash
cd scripts/
go run reduce_image_size.go [input_path] [output_path]
```

**Examples**:
```bash
# Optimize single image
go run reduce_image_size.go ../assets/images/photo.jpg ../assets/images/photo-optimized.jpg

# Process directory (if supported)
go run reduce_image_size.go ../content/post/my-post/ ../content/post/my-post/
```

**What It Does**:
1. Reads image file(s)
2. Compresses using optimal settings
3. Maintains aspect ratio
4. Outputs optimized version

**Best Practices**:
- Run before committing new images
- Target: < 200KB per image
- Keep original images in backup location
- Test image quality after optimization

**Supported Formats**:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- (Check script for additional formats)

**Dependencies**:
- Go 1.17 or later
- Image processing libraries (check script imports)

---

## Development Guidelines

### Adding New Scripts

When adding new utility scripts:

1. **Choose appropriate language**:
   - Go: For performance-critical tasks
   - Shell: For simple automation
   - Python: For complex data processing (add to dependencies)

2. **Follow naming convention**:
   - Descriptive name: `verb_noun.ext` (e.g., `update_theme.sh`)
   - Use underscores, not hyphens
   - Include file extension

3. **Document in this README**:
   - Add to scripts overview table
   - Create detailed section
   - Include usage examples

4. **Include comments**:
   - Purpose at top of file
   - Complex logic explained
   - Dependencies listed

5. **Error handling**:
   - Validate inputs
   - Graceful error messages
   - Appropriate exit codes

6. **Testing**:
   - Test locally before committing
   - Include test cases if applicable
   - Document expected behavior

### Script Template (Go)

```go
// Purpose: Brief description of what this script does
// Usage: go run script_name.go [args]
// Dependencies: List any required packages or tools

package main

import (
    "fmt"
    "os"
)

func main() {
    // Validate inputs
    if len(os.Args) < 2 {
        fmt.Fprintf(os.Stderr, "Usage: %s [arguments]\n", os.Args[0])
        os.Exit(1)
    }

    // Main logic
    if err := run(); err != nil {
        fmt.Fprintf(os.Stderr, "Error: %v\n", err)
        os.Exit(1)
    }
}

func run() error {
    // Implementation
    return nil
}
```

### Script Template (Shell)

```bash
#!/usr/bin/env bash
# Purpose: Brief description of what this script does
# Usage: ./script_name.sh [args]
# Dependencies: List any required tools

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
usage() {
    cat <<EOF
Usage: $0 [OPTIONS]

OPTIONS:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose output

DESCRIPTION:
    Detailed description of what the script does.

EXAMPLES:
    $0 --verbose
EOF
}

main() {
    # Implementation
    echo "Script execution started"
}

# Execute main function
main "$@"
```

---

## Common Tasks

### Run Quote Update Locally

```bash
cd /home/runner/work/nclsbayona.github.io/nclsbayona.github.io/scripts
go run get_quote.go

# Verify changes
git diff ../content/page/quote/_index.md
```

### Optimize All Images in a Post

```bash
cd scripts/

# Optimize each image
for img in ../content/post/my-post/*.jpg; do
    go run reduce_image_size.go "$img" "${img%.jpg}-optimized.jpg"
done

# Replace originals with optimized versions
```

### Test Script Before Committing

```bash
# Run script with test data
go run script_name.go --test

# Check for errors
echo $?  # Should be 0 for success

# Review output
cat test_output.txt
```

---

## Troubleshooting

### Go Scripts Won't Run

**Issue**: `go: command not found`

**Solution**:
```bash
# Install Go
# See: https://go.dev/doc/install

# Verify installation
go version
```

**Issue**: Missing dependencies

**Solution**:
```bash
# Install dependencies
go mod download

# Or initialize module
cd scripts/
go mod init scripts
go mod tidy
```

### Quote Script Fails

**Issue**: API returns error or timeout

**Solution**:
- Check internet connection
- Verify API is operational
- Check rate limits
- Review script logs

**Issue**: File permissions

**Solution**:
```bash
# Fix permissions
chmod +x scripts/*.go
```

### Image Optimizer Issues

**Issue**: Images too large after optimization

**Solution**:
- Adjust compression quality in script
- Try different image format (JPEG vs PNG)
- Manual optimization with external tools

**Issue**: Image quality degraded

**Solution**:
- Increase quality setting
- Keep originals as backup
- Use lossless compression for important images

---

## Integration with Workflows

### Scripts in GitHub Actions

Scripts are used in workflows:

**fetch-quote.yml**:
```yaml
- name: Run quote script
  run: cd scripts && go run get_quote.go
```

**Future workflows** can similarly integrate scripts:
```yaml
- name: Optimize images
  run: |
    cd scripts
    go run reduce_image_size.go ../assets/images/ ../assets/images/
```

---

## Performance Considerations

### Quote Script
- **Runtime**: ~2-5 seconds (API dependent)
- **Network**: Requires external API access
- **Frequency**: Daily (not performance-critical)

### Image Optimizer
- **Runtime**: Varies by image size/count
- **Memory**: Depends on image resolution
- **Recommendation**: Run locally before commit

---

## Security Considerations

### Input Validation
- Always validate file paths
- Sanitize external API responses
- Check file permissions

### API Keys
- Never hardcode API keys
- Use environment variables
- Document required secrets

### File Operations
- Validate file exists before reading
- Check write permissions
- Handle symbolic links safely

---

## Maintenance

### Regular Tasks
- **Monthly**: Review script performance
- **Quarterly**: Update dependencies
- **Yearly**: Audit for improvements

### Dependency Updates

```bash
# Update Go dependencies
go get -u ./...
go mod tidy

# Test after updates
go test ./...
```

---

## Migration Note

**Scripts were moved from `/assets/scripts/` to `/scripts/`** to improve repository organization:

- **Old location**: `assets/scripts/` (build-time assets)
- **New location**: `scripts/` (utility scripts)
- **Reason**: Scripts are build tools, not static assets

**Workflows updated**:
- ✅ `fetch-quote.yml` updated to use `scripts/get_quote.go`
- ✅ Documentation updated
- ⚠️ Check any local tooling that referenced old location

---

## Additional Resources

- [Go Documentation](https://go.dev/doc/)
- [Hugo Documentation](https://gohugo.io/documentation/)
- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)

## Questions?

See [CONTRIBUTING.md](../CONTRIBUTING.md) or [DEVELOPMENT.md](../DEVELOPMENT.md) for more information.
