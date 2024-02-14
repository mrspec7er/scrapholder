"use client";

import { useState } from "react";
import { getArticle, postArticle } from "./service";
import UploadArticleModal from "@/components/upload-article";

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
    setKeyword("");
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
      <UploadArticleModal
        handleSubmit={handleSubmit}
        handleUploadFile={handleUploadFile}
        setTitleEntries={setTitleEntries}
        titleEntries={titleEntries}
      />
      <div className="pt-10">
        <input
          type="search"
          placeholder="Search"
          value={keyword}
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
