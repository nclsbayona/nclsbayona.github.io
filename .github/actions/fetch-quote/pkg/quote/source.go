package quote

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

var randomGenerator *rand.Rand

func init() {
	randomGenerator = rand.New(rand.NewSource(time.Now().UnixNano()))
}

func shouldFetch() bool {
	random := randomGenerator.Intn(100) + 1
	fmt.Printf("[shouldFetch] Random number: %d\n", random)
	return random < 70
}

func ShouldFetch() bool {
	return shouldFetch()
}

func FetchNewQuote() (Quote, error) {
	random := randomGenerator.Intn(100) + 1
	if random < 50 {
		fmt.Println("[FetchNewQuote] Fetch Zenquotes quote.")
		return fetchNewZenquotesQuote()
	}
	fmt.Println("[FetchNewQuote] Fetch Stoic quote.")
	return fetchNewStoicQuote()
}

func fetchNewZenquotesQuote() (Quote, error) {
	random := randomGenerator.Intn(100) + 1
	url := "https://zenquotes.io/api/today"
	if random >= 50 {
		fmt.Println("[fetchNewZenquotesQuote] Fetch Zenquotes quote from random section.")
		url = "https://zenquotes.io/api/random"
	} else {
		fmt.Println("[fetchNewZenquotesQuote] Fetch Zenquotes quote from daily section.")
	}

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("[fetchNewZenquotesQuote] Error fetching quote:", err)
		return GetFavoriteQuote(), err
	}
	defer resp.Body.Close()

	var quotes []Quote
	if err := json.NewDecoder(resp.Body).Decode(&quotes); err != nil {
		fmt.Println("[fetchNewZenquotesQuote] Error decoding JSON:", err)
		return GetFavoriteQuote(), err
	}
	if len(quotes) == 0 {
		fmt.Println("[fetchNewZenquotesQuote] No quotes found.")
		return Quote{}, nil
	}

	q := quotes[0]
	validateQuote(&q)
	return q, nil
}

func fetchNewStoicQuote() (Quote, error) {
	resp, err := http.Get("https://stoic.tekloon.net/stoic-quote")
	if err != nil {
		fmt.Println("[fetchNewStoicQuote] Error fetching quote:", err)
		return GetFavoriteQuote(), err
	}
	defer resp.Body.Close()

	var q Quote
	if err := json.NewDecoder(resp.Body).Decode(&q); err != nil {
		fmt.Println("[fetchNewStoicQuote] Error decoding JSON:", err)
		return GetFavoriteQuote(), err
	}

	validateQuote(&q)
	return q, nil
}

func validateQuote(q *Quote) {
	if q == nil || q.Text == "" {
		replacement := GetFavoriteQuote()
		*q = replacement
	} else if q.Author == "" {
		q.Author = "Unknown"
	}
	if q.Image == "" {
		fmt.Printf("[validateQuote] No image URL found in the quote. Searching for an image of '%s' ...\n", q.Author)
		q.Image = GetImageURL(q.Author)
	}
	fmt.Println("[validateQuote] Validated Quote:", q.Text, "by", q.Author, "\nImage URL:", q.Image)
}

func GetFavoriteQuote() Quote {
	favorites := []Quote{
		{Text: "What we think, we become.", Author: "Buddha", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Gautama_Buddha_11.jpg/960px-Gautama_Buddha_11.jpg"},
		{Text: "He who has a why to live can bear almost any how", Author: "Friedrich Nietzsche", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/960px-Nietzsche187a.jpg"},
		{Text: "The only way to do great work is to love what you do.", Author: "Steve Jobs", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Stevejobs.jpg/960px-Stevejobs.jpg"},
		{Text: "In the middle of every difficulty lies opportunity.", Author: "Albert Einstein", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/960px-Albert_Einstein_Head.jpg"},
		{Text: "You just can't beat the person who never gives up.", Author: "Babe Ruth", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Babe_Ruth_cropped.jpg/960px-Babe_Ruth_cropped.jpg"},
		{Text: "Believe that you can and you're halfway there.", Author: "Theodore Roosevelt", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Theodore_Roosevelt_by_the_Pach_Bros.jpg/960px-Theodore_Roosevelt_by_the_Pach_Bros.jpg"},
  {Text: "Don't be afraid to give up the good to go for the great.", Author: "John D. Rockefeller", Image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Portrait_of_J._D._Rockefeller.jpg"},
		{Text: "Happiness is not something ready made. It comes from your own actions.", Author: "Dalai Lama", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Dalailama1_20121014_4639.jpg/960px-Dalailama1_20121014_4639.jpg"},
		{Text: "Believe that you can and you're halfway there.", Author: "Theodore Roosevelt", Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Theodore_Roosevelt_by_the_Pach_Bros.jpg/960px-Theodore_Roosevelt_by_the_Pach_Bros.jpg"},
	}
	randIndex := randomGenerator.Intn(len(favorites))
	q := favorites[randIndex]
	fmt.Printf("[GetFavoriteQuote] Using quote: %s by %s and image %s\n\n", q.Text, q.Author, q.Image)
	return q
}
