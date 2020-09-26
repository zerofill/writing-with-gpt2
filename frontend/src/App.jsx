import React, { useCallback, useRef, useState } from "react"
import ReactQuill from "react-quill"
import axios from "axios"
import "quill-mention"
import "quill-mention/dist/quill.mention.css"
import "./App.css"

const App = () => {
  const [value, setValue] = useState("")
  const reactQuillRef = useRef()

  const handleLoadingMentionEvent = useCallback(() => {
    return "Loading..."
  }, [])

  const handleFetchMentionEvent = useCallback(
    async (searchTerm, renderItem) => {
      const editorContents = reactQuillRef.current.getEditor().getText()
      // TODO: API error handling
      const response = await axios.post("http://localhost:8000/api/suggest", {
        text: editorContents,
      })
      const suggestions = response["data"]

      if (searchTerm.length === 0) {
        renderItem(suggestions, searchTerm)
      } else {
        const matches = []
        for (let i = 0; i < suggestions.length; i++)
          if (
            ~suggestions[i].value
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase())
          )
            matches.push(suggestions[i])
        renderItem(matches, searchTerm)
      }
    },
    []
  )

  const toolbarConfig = [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ]

  const mentionConfig = {
    allowedChars: /^[A-Za-z\s]*$/,
    mentionDenotationChars: ["@"],
    renderLoading: handleLoadingMentionEvent,
    source: handleFetchMentionEvent,
  }

  const modules = {
    toolbar: toolbarConfig,
    mention: mentionConfig,
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "mention",
  ]

  return (
    <div>
      <h1>Write with Transformer demo</h1>
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        placeholder="Enter something..."
        modules={modules}
        formats={formats}
        value={value}
        onChange={setValue}
      />
    </div>
  )
}

export default App
