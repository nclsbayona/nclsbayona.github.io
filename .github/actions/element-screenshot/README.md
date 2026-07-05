# Element Screenshot Action

A reusable GitHub Action that takes a screenshot of a statically rendered page element found by its HTML `id`.

## Inputs

- `page_url` (required): Full URL of the page to capture.
- `element_id` (required): HTML element ID to screenshot.
- `output_dir` (optional): Directory where the screenshot will be saved. Default: `results`.
- `screenshot_name` (optional): Name of the screenshot file. Default: `screenshot.png`.
- `timeout` (optional): Navigation timeout in milliseconds. Default: `30000`.

## Outputs

- `screenshot_png`: Path to the generated screenshot PNG file.

## Usage

```yaml
jobs:
  screenshot:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v7

      - name: Screenshot page element
        id: element_screenshot
        uses: ./.github/actions/element-screenshot
        with:
          page_url: 'https://example.com'
          element_id: 'hero'
          output_dir: 'artifacts'
          screenshot_name: 'hero.png'

      - name: Upload screenshot
        uses: actions/upload-artifact@v7
        with:
          name: element-screenshot
          path: ${{ steps.element_screenshot.outputs.screenshot_png }}
```

## Notes

- The action requires a browser-capable image runtime and uses Playwright.
- The page should be static or already fully rendered when fetched; dynamic client-side rendering is not guaranteed to work.
- It will fail if the specified `element_id` is not present on the page.
- Use the output path to upload or attach the screenshot in later workflow steps.
