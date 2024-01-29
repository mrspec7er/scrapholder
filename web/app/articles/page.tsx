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
            "attachment.content": "WhicH",
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setArticles(result.hits.hits);
      })
      .catch((err) => console.log(err));
  }, []);

  function downloadPDF(pdf: string) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    return linkSource;
  }

  return (
    <div>
      <p>Articles</p>
      {articles?.map((a, n) => (
        <div>
          <a download={a._source.title} href={downloadPDF(a._source.data)}>
            {a._source.title}
          </a>
        </div>
      ))}
    </div>
  );
};

export default Articles;
