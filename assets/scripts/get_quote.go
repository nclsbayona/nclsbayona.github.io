package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// ZenQuotes API response structure
type quote struct {
	Text   string `json:"q"` // Quote text
	Author string `json:"a"` // Author
	Image  string `json:"i"` // Image URL
}

type result struct {
	Query struct {
		Pages map[string]struct {
			ImageInfo []struct {
				ThumbURL string `json:"thumburl"`
			} `json:"imageinfo"`
		} `json:"pages"`
	} `json:"query"`
}

func getImageURL(author string) string {
	defaultImageURL := "https://static.vecteezy.com/system/resources/previews/000/566/866/original/vector-person-icon.jpg"

	imageURL := fmt.Sprint("https://commons.wikimedia.org/w/api.php?action=query&format=json&uselang=en&generator=search&gsrsearch=filetype%3Abitmap%7Cdrawing%20-fileres%3A0%20fileres%3A%3C500%20", url.QueryEscape(strings.ToLower(author)), "&gsrlimit=1&gsroffset=0&gsrinfo=totalhits%7Csuggestion&gsrprop=size%7Cwordcount%7Ctimestamp%7Csnippet&prop=info%7Cimageinfo%7Centityterms&inprop=url&gsrnamespace=6&iiprop=url%7Csize%7Cmime&iiurlheight=180&wbetterms=label")

	fmt.Printf("[getImageURL] Using '%s' as API URL\n", imageURL)
	req, err := http.NewRequest("GET", imageURL, nil)
	if err != nil {
		fmt.Println("[getImageURL]Error creating request:", err, ". Using default image.")
		imageURL = defaultImageURL
	} else {
		req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			fmt.Println("[getImageURL]Error fetching Wikimedia image:", err, ". Using default image.")
			imageURL = defaultImageURL
		} else {
			defer resp.Body.Close()
			var result result
			if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
				fmt.Println("[getImageURL]Error decoding Wikimedia JSON:", err, ". Using default image.")
				return defaultImageURL
			}
			if len(result.Query.Pages) > 0 {
				for _, page := range result.Query.Pages {
					if len(page.ImageInfo) > 0 {
						imageURL = page.ImageInfo[0].ThumbURL
						fmt.Printf("[getImageURL] Found image URL: %s\n", imageURL)
						break
					}
				}
			} else {
				fmt.Println("[getImageURL] No pages found in Wikimedia response. Using default image.")
				imageURL = defaultImageURL
			}
		}
	}
	return imageURL
}

func fetchNewQuote() (quote, error) {
	// Fetch quote from ZenQuotes API
	resp, err := http.Get("https://zenquotes.io/api/today")
	if err != nil {
		fmt.Println("[fetchNewQuote] Error fetching quote:", err)
		return quote{}, err
	}
	defer resp.Body.Close()

	var quotes []quote
	if err := json.NewDecoder(resp.Body).Decode(&quotes); err != nil {
		fmt.Println("[fetchNewQuote] Error decoding JSON:", err)
		return quote{}, err
	}
	if len(quotes) == 0 {
		fmt.Println("[fetchNewQuote] No quotes found.")
		return quote{}, nil
	}
	quote := quotes[0]

	if quote.Image == "" {
		fmt.Printf("[fetchNewQuote] No image URL found in the quote. Searching for an image of '%s' ...\n", quote.Author)
		quote.Image = getImageURL(quote.Author)
	}
	fmt.Println("[fetchNewQuote] Fetched Quote:", quote.Text, "by", quote.Author, "\nImage URL:", quote.Image)
	return quote, nil
}

func getFavoriteQuote() quote {
	favorites := []quote{
		{Text: "What we think, we become.", Author: "Buddha", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Gautama_Buddha_11.jpg/640px-Gautama_Buddha_11.jpg"},
		{Text: "The only way to do great work is to love what you do.", Author: "Steve Jobs", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Stevejobs.jpg/640px-Stevejobs.jpg"},
		{Text: "In the middle of every difficulty lies opportunity.", Author: "Albert Einstein", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/640px-Albert_Einstein_Head.jpg"},
		{Text: "You just can't beat the person who never gives up.", Author: "Babe Ruth", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Babe_Ruth_cropped.jpg/640px-Babe_Ruth_cropped.jpg"},
		{Text: "Happiness is not something ready made. It comes from your own actions.", Author: "Dalai Lama", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Dalailama1_20121014_4639.jpg/640px-Dalailama1_20121014_4639.jpg"},
	}
	randIndex := randomGenerator.Intn(len(favorites))
	quote := favorites[randIndex]
	fmt.Printf("[getFavoriteQuote] Using quote: %s by %s and image %s", quote.Text, quote.Author, quote.Image)
	return quote
}

func writeQuoteToFile(quote quote, filePath string) error {
	// Prepare front matter for Hugo Markdown
	md := fmt.Sprintf(`---
title: "Today's quote"
slug: "quote"
layout: "quote"

quote:
  image: "%s"
  author: "%s"
  text: "%s"

menu:
    main:
        weight: 6
        params: 
            icon: quote
---
`, quote.Image, quote.Author, quote.Text)

	// Write to file
	if err := os.WriteFile(filePath, []byte(md), 0644); err != nil {
		return fmt.Errorf("error writing to %s: %v", filePath, err)
	}
	return nil
}

func shouldFetch() bool {
	random := (randomGenerator.Intn(100) + 1)
	fmt.Printf("[shouldFetch] Random number: %d\n", random)
	return random < 80 // 80% chance to fetch a new quote
}

var randomGenerator *rand.Rand

func init() {
	seed := time.Now().UnixNano()
	randomGenerator = rand.New(rand.NewSource(seed))
}

func main() {
	var quote quote
	const filePath = "./content/page/quote/_index.md"
	if shouldFetch() {
		fmt.Println("[get_quote.go] Attempting to fetch a new quote...")
		var err error
		quote, err = fetchNewQuote()
		if err != nil {
			fmt.Println("[get_quote.go] Falling back to favorite quote due to error:", err)
			quote = getFavoriteQuote()
		}
	} else {
		fmt.Println("[get_quote.go] Using a favorite quote.")
		quote = getFavoriteQuote()
	}

	if err := writeQuoteToFile(quote, filePath); err != nil {
		fmt.Println("[get_quote.go] Error writing quote to file:", err)
	} else {
		fmt.Printf("[get_quote.go] Quote successfully written to %s\n", filePath)
	}
}
