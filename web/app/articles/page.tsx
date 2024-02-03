"use client";

import { useState } from "react";
import { getArticle, postArticle } from "./service";

const Articles = () => {
  const [articles, setArticles] = useState<
    Array<{
      _source: {
        title: string;
        attachment: { content: string };
        data: string;
      };
    }>
  >();
  const [articleEntries, setArticleEntries] = useState<File>();
  const [titleEntries, setTitleEntries] = useState("");
  const [keyword, setKeyword] = useState("");

  async function search(keyword: string) {
    setArticles(await getArticle(keyword));
  }

  function downloadPDF(pdf: string) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    return linkSource;
  }

  function handleUploadFile(files: FileList | null) {
    if (files) {
      setArticleEntries(files[0]);
    }
  }

  function handleSubmit() {
    if (articleEntries) {
      var reader = new FileReader();
      reader.readAsDataURL(articleEntries);
      reader.onload = function () {
        postArticle(articleEntries.name, titleEntries, reader.result as string);
        setTitleEntries("");
      };
      reader.onerror = function (error) {
        throw new Error("Error: " + error);
      };
    }
  }

  return (
    <div>
      <div>
        <input onChange={(e) => handleUploadFile(e.target.files)} type="file" />
        <input
          value={titleEntries}
          placeholder="Input Title"
          onChange={(e) => setTitleEntries(e.target.value)}
          type="text"
        />
        <button type="button" onClick={() => handleSubmit()}>
          Submit
        </button>
      </div>
      <div className="pt-10">
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" ? search(keyword) : null;
          }}
        />
        <button onClick={() => search(keyword)}>Submit</button>
        {articles?.map((a, n) => (
          <div key={n}>
            <a download={a._source.title} href={downloadPDF(a._source.data)}>
              {a._source.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
