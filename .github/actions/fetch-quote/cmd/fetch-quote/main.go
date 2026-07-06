package main

import (
	"fmt"
	"os"

	"github.com/nclsbayona/nclsbayona.github.io/.github/actions/fetch-quote/pkg/quote"
)

func main() {
	var (
	  selected quote.Quote
	  source string
	)

	if quote.ShouldFetch() {
		fmt.Println("[fetch-quote] Attempting to fetch a new quote...")
		var err error
		selected, source, err = quote.FetchNewQuote()
		if err != nil {
			fmt.Println("[fetch-quote] Falling back to favorite quote due to error:", err)
			selected = quote.GetFavoriteQuote()
			source = "favorite"
		}
	} else {
		fmt.Println("[fetch-quote] Using a favorite quote.")
		selected = quote.GetFavoriteQuote()
		source = "favorite"
	}

	if err := quote.OutputToGitHub(selected, source); err != nil {
		fmt.Fprintf(os.Stderr, "[fetch-quote] Error outputting to GitHub: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("[fetch-quote] Quote successfully output:\n")
	fmt.Printf("  Quote: %s\n", selected.Text)
	fmt.Printf("  Author: %s\n", selected.Author)
	fmt.Printf("  Image: %s\n", selected.Image)
	fmt.Printf("  Source: %s\n", source)
}
