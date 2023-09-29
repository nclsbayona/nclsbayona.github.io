package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
	"syscall"
	"time"
	"unicode"
)

type sQuote struct {
	Quote  string `json:"q"`
	Author string `json:"a"`
	// Image string `json:"i"` Too expensive :c
}

func capitalizeFirst(name string) string {
	var output []rune //create an output slice
	isWord := true
	for _, val := range name {
		if isWord && unicode.IsLetter(val) { //check if character is a letter convert the first character to upper case
			output = append(output, unicode.ToUpper(val))
			isWord = false
		} else if !unicode.IsLetter(val) {
			isWord = true
			output = append(output, val)
		} else {
			output = append(output, val)
		}
	}
	return string(output)
}

func addQuoteToFile(quote string, file_name string) {
	file_name = fmt.Sprintf("content/quotes/%s.md", file_name)
	var file *os.File
	file, err := os.OpenFile(file_name, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0666)
	for err != nil {
		file, err = os.OpenFile(file_name, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0666)
	}
	defer file.Close()
	// Assert that file is not being used by someone else, if it is in use, then wait for it to be available
	err = syscall.Flock(int(file.Fd()), syscall.LOCK_EX)
	for err != nil {
		if errors.Is(err, syscall.EAGAIN) {
			fmt.Println("File is locked ...")
			time.Sleep(2 * time.Second)
		}
		fmt.Printf("Trying to lock %s again\n", file_name)
		err = syscall.Flock(int(file.Fd()), syscall.LOCK_EX)
	}
	// When file is available, lock it and defer unlock
	defer syscall.Flock(int(file.Fd()), syscall.LOCK_UN)
	// Now we can write the file
	file.WriteString(fmt.Sprintf("\n\n## %s", quote))
	fmt.Printf("Wrote ' %s ' to ' %s '\n", quote, file_name)
}

func assertFileExists(file_name string) {
	file_name = fmt.Sprintf("content/quotes/%s.md", file_name)
	var err error

	if _, err = os.Stat("content"); errors.Is(err, os.ErrNotExist) {
		for err != nil {
			fmt.Printf("Failed to create directory content : %s\n", err)
			err = os.Mkdir("content", os.ModePerm)
		}
	}

	if _, err = os.Stat("content/quotes"); errors.Is(err, os.ErrNotExist) {
		for err != nil {
			fmt.Printf("Failed to create directory content/quotes : %s\n", err)
			err = os.Mkdir("content/quotes", os.ModePerm)
		}
	}

	_, err = os.Stat(file_name)
	if errors.Is(err, os.ErrNotExist) {
		var f *os.File
		f, err = os.Create(file_name)
		for err != nil {
			fmt.Printf("Failed to create file %s : %s\n", file_name, err)
			f, err = os.Create(file_name)
		}
		defer f.Close()
		file_name = strings.ReplaceAll(file_name, "content/quotes/", "")
		file_name = strings.ReplaceAll(file_name, ".md", "")
		author_name := capitalizeFirst(strings.ReplaceAll(file_name, "_", " "))
		description := fmt.Sprintf("Quotes by %s", author_name)
		times := time.Now()
		year := strconv.Itoa(times.Year())
		month := int(times.Month())
		day := strconv.Itoa(times.Day())
		var lines = []string{
			"---",
			fmt.Sprintf("title: %s", description),
			fmt.Sprintf("date: %s-%02d-%sT10:15:25-02:00", year, month, day),
			"draft: false",
			fmt.Sprintf("author: %s", author_name),
			fmt.Sprintf("description: %s", description),
			"tags:",
			"  - Quotes",
			fmt.Sprintf("  - %s", author_name),
			//fmt.Sprintf("image: %s", image),
			"---",
			" ",
			fmt.Sprintf("# Here you have some quotes by %s. Enjoy!", author_name),
		}
		for _, line := range lines {
			_, err := f.WriteString(line + "\n")
			if err != nil {
				fmt.Printf("Failed to write line %s in file %s : %s", line, file_name, err)
				for err != nil {
					fmt.Printf("Failed to remove file %s : %s\nRetrying...\n\n", file_name, err)
					err = os.Remove(fmt.Sprintf("content/quotes/%s.md", file_name))
				}
				fmt.Printf("Removed file %s ...", file_name)
				return
			}
		}

	}

}

func main() {

	resp, err := http.Get("https://zenquotes.io/api/quotes")
	if err != nil {
		fmt.Println("Failed to fetch quotes:", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read response body:", err)
		return
	}

	var quotes []sQuote
	err = json.Unmarshal(body, &quotes)
	if err != nil {
		fmt.Println("Failed to parse response body:", err)
		return
	}

	/* Print all quotes */
	for _, quote := range quotes {
		fmt.Println(quote.Quote, "  - ", quote.Author)
		fmt.Println()
		fmt.Println()
	}

	/* Add to file */
	for _, quote := range quotes {
		var file_name string
		file_name = strings.ToLower(quote.Author)
		file_name = strings.ReplaceAll(file_name, " ", "_")
		if file_name == "unknown" {
			file_name = "anonymous"
		}
		assertFileExists(file_name)
		go addQuoteToFile(quote.Quote, file_name)
	}

}
