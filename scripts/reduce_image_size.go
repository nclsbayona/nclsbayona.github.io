package main

import (
	"bytes"
	"flag"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"log"
	"os"
	"path/filepath"
	"strings"
)

// reduce_image_size.go
// Small CLI tool to traverse the `content/` directory and reduce image weight
// Usage: go run reduce_image_size.go -dir=content -maxWidth=1600 -quality=80

func main() {
	dir := flag.String("dir", "content", "directory to scan for images")
	maxWidth := flag.Int("maxWidth", 1600, "maximum width; images wider than this will be resized")
	quality := flag.Int("quality", 80, "jpeg quality (1-100)")
	dryRun := flag.Bool("dry-run", false, "do not overwrite files; just report savings")
	verbose := flag.Bool("verbose", false, "verbose output")
	flag.Parse()

	if *quality < 1 || *quality > 100 {
		log.Fatal("-quality must be between 1 and 100")
	}

	var totalOrig, totalNew int64

	err := filepath.Walk(*dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		lower := strings.ToLower(path)
		if !(strings.HasSuffix(lower, ".jpg") || strings.HasSuffix(lower, ".jpeg") || strings.HasSuffix(lower, ".png") || strings.HasSuffix(lower, ".gif")) {
			return nil
		}

		if *verbose {
			fmt.Println("Processing:", path)
		}

		origSize := info.Size()
		newData, err := processImage(path, *maxWidth, *quality)
		if err != nil {
			// processImage returns an error when there's no reduction; skip silently
			if *verbose {
				fmt.Fprintf(os.Stderr, "skipping %s: %v\n", path, err)
			}
			return nil
		}

		newSize := int64(len(newData))

		saved := origSize - newSize
		if saved <= 0 {
			if *verbose {
				fmt.Printf("No savings for %s (orig=%d new=%d)\n", path, origSize, newSize)
			}
			return nil
		}

		totalOrig += origSize
		totalNew += newSize

		if *dryRun {
			fmt.Printf("Would shrink: %s -> %d bytes (saved %d)\n", path, newSize, saved)
			return nil
		}

		// write to temp file then replace
		tmp, err := os.CreateTemp(filepath.Dir(path), "reimg-")
		if err != nil {
			return err
		}
		tmpName := tmp.Name()
		if _, err := tmp.Write(newData); err != nil {
			tmp.Close()
			os.Remove(tmpName)
			return err
		}
		tmp.Close()

		if err := os.Rename(tmpName, path); err != nil {
			os.Remove(tmpName)
			return err
		}

		fmt.Printf("Shrunk: %s -> %d bytes (saved %d)\n", path, newSize, saved)
		return nil
	})

	if err != nil {
		log.Fatalf("walk error: %v", err)
	}

	if totalOrig > 0 {
		fmt.Printf("Total: orig=%d new=%d saved=%d\n", totalOrig, totalNew, totalOrig-totalNew)
	}
}

func processImage(path string, maxWidth int, quality int) ([]byte, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	img, format, err := image.Decode(f)
	if err != nil {
		return nil, err
	}

	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	var dst image.Image = img

	if width > maxWidth {
		// simple nearest-neighbor resize without external libs
		ratio := float64(maxWidth) / float64(width)
		newW := maxWidth
		newH := int(float64(height) * ratio)
		dst = resizeNearest(img, newW, newH)
	}

	buf := &bytes.Buffer{}
	switch format {
	case "jpeg":
		opts := &jpeg.Options{Quality: quality}
		if err := jpeg.Encode(buf, dst, opts); err != nil {
			return nil, err
		}
	case "png":
		enc := png.Encoder{CompressionLevel: png.BestCompression}
		if err := enc.Encode(buf, dst); err != nil {
			return nil, err
		}
	case "gif":
		// re-encode GIF without resizing frames support (best-effort)
		if err := gif.Encode(buf, dst, nil); err != nil {
			return nil, err
		}
	default:
		// fallback to jpeg encoding
		if err := jpeg.Encode(buf, dst, &jpeg.Options{Quality: quality}); err != nil {
			return nil, err
		}
	}

	// Avoid growing files
	origInfo, err := os.Stat(path)
	if err == nil && int64(buf.Len()) >= origInfo.Size() && origInfo.Size() > 0 {
		return nil, fmt.Errorf("no reduction")
	}

	return buf.Bytes(), nil
}

// resizeNearest performs a basic nearest-neighbor resize to new dimensions.
func resizeNearest(src image.Image, newW, newH int) image.Image {
	dst := image.NewRGBA(image.Rect(0, 0, newW, newH))
	srcBounds := src.Bounds()
	srcW := srcBounds.Dx()
	srcH := srcBounds.Dy()
	for y := 0; y < newH; y++ {
		for x := 0; x < newW; x++ {
			sx := int(float64(x) * float64(srcW) / float64(newW))
			sy := int(float64(y) * float64(srcH) / float64(newH))
			if sx >= srcW {
				sx = srcW - 1
			}
			if sy >= srcH {
				sy = srcH - 1
			}
			c := src.At(srcBounds.Min.X+sx, srcBounds.Min.Y+sy)
			dst.Set(x, y, c)
		}
	}
	return dst
}
