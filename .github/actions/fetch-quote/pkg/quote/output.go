package quote

import (
	"fmt"
	"os"
)

func OutputToGitHub(q Quote, s string) error {
	githubOutput := os.Getenv("GITHUB_OUTPUT")
	if githubOutput == "" {
		fmt.Printf("QUOTE=%s\n", q.Text)
		fmt.Printf("AUTHOR=%s\n", q.Author)
		fmt.Printf("IMAGE=%s\n", q.Image)
		fmt.Printf("SOURCE=%s\n", s)
		return nil
	}

	f, err := os.OpenFile(githubOutput, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return fmt.Errorf("error opening GITHUB_OUTPUT file: %v", err)
	}
	defer f.Close()

	if _, err := fmt.Fprintf(f, "quote=%s\n", q.Text); err != nil {
		return fmt.Errorf("error writing quote output: %v", err)
	}
	if _, err := fmt.Fprintf(f, "author=%s\n", q.Author); err != nil {
		return fmt.Errorf("error writing author output: %v", err)
	}
	if _, err := fmt.Fprintf(f, "image=%s\n", q.Image); err != nil {
		return fmt.Errorf("error writing image output: %v", err)
	}
	if _, err := fmt.Fprintf(f, "source=%s\n", s); err != nil {
		return fmt.Errorf("error writing source output: %v", err)
	}

	return nil
}
