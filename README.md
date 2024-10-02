# json-to-golang

You can try [here](https://zh1gr.github.io/json-to-golang/)

Convert JSON to GoLang struct.

<table>
<tr>
<th> Action </th>
<th> From </th>
<th> To </th>
</tr>
<tr>
<td>Convert</td>
<td>

```json
{
    "one": "two",
    "second": [
        "uno",
        "dos"
    ],
    "third": {
        "bir": 1,
        "eki": "second",
        "ush": true
    }
}
```

</td>
<td>

```go
type Root struct {
	One string `json:"one"`
	Second []string `json:"second"`
	Third Third `json:"third"`
}

type Third struct {
	Bir int `json:"bir"`
	Eki string `json:"eki"`
	Ush bool `json:"ush"`
}
```

</td>
</tr>
</table>