package quote

import (
	"encoding/json"
)

type Quote struct {
	Text   string
	Author string
	Image  string
}

func (q *Quote) UnmarshalJSON(data []byte) error {
	var obj map[string]json.RawMessage
	if err := json.Unmarshal(data, &obj); err != nil {
		return err
	}

	extract := func(keys []string) string {
		var s string
		for _, k := range keys {
			if v, ok := obj[k]; ok {
				if err := json.Unmarshal(v, &s); err == nil && s != "" {
					return s
				}
			}
		}
		return ""
	}

	if t := extract([]string{"q", "quote", "text", "body"}); t != "" {
		q.Text = t
	}
	if a := extract([]string{"a", "author"}); a != "" {
		q.Author = a
	}
	if i := extract([]string{"i", "image", "img", "image_url", "imageUrl", "url"}); i != "" {
		q.Image = i
	}

	if v, ok := obj["data"]; ok {
		var d map[string]json.RawMessage
		if err := json.Unmarshal(v, &d); err == nil {
			for _, k := range []string{"author"} {
				if rv, ok := d[k]; ok {
					var s string
					if err := json.Unmarshal(rv, &s); err == nil && s != "" {
						q.Author = s
						break
					}
				}
			}
			for _, k := range []string{"quote", "text", "body"} {
				if rv, ok := d[k]; ok {
					var s string
					if err := json.Unmarshal(rv, &s); err == nil && s != "" {
						q.Text = s
						break
					}
				}
			}
		}
	}

	return nil
}
