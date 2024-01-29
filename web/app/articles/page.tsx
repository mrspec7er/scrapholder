"use client";

import { useEffect, useState } from "react";

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
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState(0);
  useEffect(() => {
    fetch("http://localhost:9200/articles/_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("elastic:mrc201"),
      },
      body: JSON.stringify({
        _source: ["title", "attachment", "data"],
        query: {
          match_phrase: {
            "attachment.content": keyword,
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setArticles(result.hits.hits);
      })
      .catch((err) => console.log(err));
  }, [search]);

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
    console.log("ENTRIES", articleEntries);
    if (articleEntries) {
      var reader = new FileReader();
      reader.readAsDataURL(articleEntries);
      reader.onload = function () {
        console.log((reader.result as string).split("base64,")[1]);

        fetch(
          `http://localhost:9200/articles/_doc/${"TESTINGS"}?pipeline=files`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + btoa("elastic:mrc201"),
            },
            body: JSON.stringify({
              title: "TESTINGS ARTICLE",
              data: (reader.result as string).split("base64,")[1],
            }),
          }
        )
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
          })
          .catch((err) => console.log(err));
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
        <button type="button" onClick={() => handleSubmit()}>
          Submit
        </button>
      </div>
      <div>
        <p>Articles</p>
        <input type="search" onChange={(e) => setKeyword(e.target.value)} />
        <button onClick={() => setSearch((v) => v + 1)}>Submit</button>
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
