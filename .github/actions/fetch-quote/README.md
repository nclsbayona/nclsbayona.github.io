# Fetch Quote of the Day Action

A reusable GitHub Action that fetches an inspirational quote with author information and an author image from various quote APIs.

## Features

- Fetches quotes from multiple sources (ZenQuotes, Stoic quotes)
- Automatically retrieves author images from Wikimedia Commons
- Falls back to curated favorite quotes if API calls fail
- Returns structured outputs for easy integration

## Usage

### Basic Example

```yaml
name: Get Daily Quote
on:
  workflow_dispatch:

jobs:
  fetch-quote:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
      
      - name: Fetch quote
        id: quote
        uses: ./.github/actions/fetch-quote
      
      - name: Display quote
        run: |
          echo "Quote: ${{ steps.quote.outputs.quote }}"
          echo "Author: ${{ steps.quote.outputs.author }}"
          echo "Image: ${{ steps.quote.outputs.image }}"
```

### Using Outputs in Subsequent Steps

```yaml
jobs:
  use-quote:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
      
      - name: Fetch quote
        id: daily-quote
        uses: ./.github/actions/fetch-quote
      
      - name: Create issue with quote
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Quote of the Day',
              body: `> ${context.outputs.quote}\n\n— ${context.outputs.author}\n\n![Author](${context.outputs.image})`
            })
        env:
          quote: ${{ steps.daily-quote.outputs.quote }}
          author: ${{ steps.daily-quote.outputs.author }}
          image: ${{ steps.daily-quote.outputs.image }}
```

### Using in Another Repository

To use this action from another repository, reference it with the full path:

```yaml
- name: Fetch quote
  id: quote
  uses: nclsbayona/nclsbayona.github.io/.github/actions/fetch-quote@main
```

## Outputs

| Output | Description | Example |
|--------|-------------|---------|
| `quote` | The inspirational quote text | "What we think, we become." |
| `author` | The author of the quote | "Buddha" |
| `image` | URL of the author's image | "https://upload.wikimedia.org/..." |

## How It Works

1. **Script Execution**: Runs the `get_quote.go` script which:
   - Randomly selects between different quote APIs
   - Fetches a quote with 70% probability, otherwise uses a favorite
   - Retrieves author images from Wikimedia Commons
   - Falls back to curated quotes if API fails

2. **Output Extraction**: Parses the generated markdown file to extract:
   - Quote text
   - Author name
   - Image URL

3. **Output Setting**: Makes values available as:
   - Action outputs (accessible via `steps.<id>.outputs.<name>`)
   - Environment variables (`QUOTE`, `AUTHOR`, `IMAGE`)

## Quote Sources

- **ZenQuotes API**: Daily inspirational quotes
- **Stoic Tekloon API**: Stoic philosophy quotes
- **Favorite Quotes**: Curated fallback collection

## Requirements

- **Go**: Version 1.25 or later (automatically installed by the action)
- **Repository checkout**: Must checkout the repository before using this action

## Error Handling

The action includes robust error handling:
- If API calls fail, uses curated favorite quotes
- If author image not found, uses default placeholder
- If quote generation fails, exits with error code

## Advanced Example: Update Content and Deploy

```yaml
name: Daily Quote Update
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC

jobs:
  update-quote:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          persist-credentials: true
      
      - name: Fetch new quote
        id: quote
        uses: ./.github/actions/fetch-quote
      
      - name: Commit changes
        run: |
          git config user.name 'github-actions[bot]'
          git config user.email 'github-actions[bot]@users.noreply.github.com'
          git add content/page/quote
          git diff --quiet && git diff --staged --quiet || \
            git commit -m "chore: update quote of the day"
          git push
      
      - name: Create summary
        run: |
          echo "## 📅 Quote of the Day Updated" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "> ${{ steps.quote.outputs.quote }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "**— ${{ steps.quote.outputs.author }}**" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "![Author](${{ steps.quote.outputs.image }})" >> $GITHUB_STEP_SUMMARY
```

## Environment Variables Set

The action also sets these environment variables for use in subsequent steps:

- `QUOTE`: The quote text
- `AUTHOR`: The author name
- `IMAGE`: The image URL

## Notes

- The action creates/updates `content/page/quote/_index.md` in your repository
- Quote selection has a 70% chance of fetching new, 30% chance of using favorites
- Author images are fetched from Wikimedia Commons with a default fallback
- The script includes retry logic and multiple quote sources for reliability

## License

This action is part of the nclsbayona.github.io repository. See the repository LICENSE for details.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for guidelines.
