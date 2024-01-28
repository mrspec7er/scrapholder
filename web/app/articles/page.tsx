"use client";

import { useEffect, useState } from "react";

const Articles = () => {
  const [articles, setArticles] =
    useState<
      Array<{ _source: { title: string; attachment: { content: string } } }>
    >();
  useEffect(() => {
    fetch("http://localhost:9200/articles/_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("elastic:mrc201"),
      },
      body: JSON.stringify({
        _source: ["title", "attachment"],
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

  return (
    <div>
      <p>Articles</p>
      {articles?.map((a, n) => (
        <div>
          <p>{a._source.title}</p>
          <p>{a._source.attachment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Articles;
