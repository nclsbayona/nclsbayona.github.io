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
   - Outputs quote, author, and image directly to `GITHUB_OUTPUT`

2. **Direct Output**: The Go script writes outputs directly to GitHub Actions:
   - No intermediate file creation
   - Values immediately available as action outputs
   - Clean, efficient data flow

3. **Output Availability**: Values are accessible as:
   - Action outputs (via `steps.<id>.outputs.<name>`)
   - Can be used immediately in subsequent steps

## Quote Sources

- **ZenQuotes API**: Daily inspirational quotes
- **Stoic Tekloon API**: Stoic philosophy quotes
- **Favorite Quotes**: Curated fallback collection

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
      
      - name: Create quote page
        run: |
          mkdir -p content/page/quote
          cat > content/page/quote/_index.md << EOF
          ---
          title: "Today's quote"
          slug: "quote"
          layout: "quote"
          
          quote:
            image: "${{ steps.quote.outputs.image }}"
            author: "${{ steps.quote.outputs.author }}"
            text: "${{ steps.quote.outputs.quote }}"
          
          menu:
              main:
                  weight: 6
                  params: 
                      icon: quote
          ---
          EOF
      
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

The action does not set environment variables. All outputs are available via the action outputs mechanism:
- `steps.<id>.outputs.quote`
- `steps.<id>.outputs.author`
- `steps.<id>.outputs.image`

## Notes

- The action returns outputs directly from the Go script
- No intermediate files are created for output extraction
- The script uses a Go module for better dependency management
- You can use the outputs to create your own frontmatter format
- Quote selection has a 70% chance of fetching new, 30% chance of using favorites
- Author images are fetched from Wikimedia Commons with a default fallback
- The script includes retry logic and multiple quote sources for reliability

## License

This action is part of the nclsbayona.github.io repository. See the repository LICENSE for details.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for guidelines.
