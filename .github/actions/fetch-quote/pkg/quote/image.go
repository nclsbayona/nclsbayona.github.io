package quote

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

type wikimediaResult struct {
	Query struct {
		Pages map[string]struct {
			ImageInfo []struct {
				ThumbURL string `json:"thumburl"`
			} `json:"imageinfo"`
		} `json:"pages"`
	} `json:"query"`
}

func GetImageURL(author string) string {
	defaultImageURL := "https://static.vecteezy.com/system/resources/previews/000/566/866/original/vector-person-icon.jpg"

	searchURL := fmt.Sprintf(
		"https://commons.wikimedia.org/w/api.php?action=query&format=json&uselang=en&generator=search&gsrsearch=filetype%%3Abitmap%%7Cdrawing+-fileres%%3A0+fileres%%3A%%3C500+%s&gsrlimit=1&gsroffset=0&gsrinfo=totalhits%%7Csuggestion&gsrprop=size%%7Cwordcount%%7Ctimestamp%%7Csnippet&prop=info%%7Cimageinfo%%7Centityterms&inprop=url&gsrnamespace=6&iiprop=url%%7Csize%%7Cmime&iiurlheight=180&wbetterms=label",
		url.QueryEscape(strings.ToLower(author)),
	)

	fmt.Printf("[GetImageURL] Using '%s' as API URL\n", searchURL)
	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		fmt.Println("[GetImageURL] Error creating request:", err, ". Using default image.")
		return defaultImageURL
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("[GetImageURL] Error fetching Wikimedia image:", err, ". Using default image.")
		return defaultImageURL
	}
	defer resp.Body.Close()

	var result wikimediaResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		fmt.Println("[GetImageURL] Error decoding Wikimedia JSON:", err, ". Using default image.")
		return defaultImageURL
	}

	for _, page := range result.Query.Pages {
		if len(page.ImageInfo) > 0 {
			fmt.Printf("[GetImageURL] Found image URL: %s\n", page.ImageInfo[0].ThumbURL)
			return page.ImageInfo[0].ThumbURL
		}
	}

	fmt.Println("[GetImageURL] No pages found in Wikimedia response. Using default image.")
	return defaultImageURL
}
