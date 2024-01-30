"use server";

async function getArticle(keyword: string) {
  return fetch("http://elastic:9200/articles/_search", {
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
    .then((result) => result.hits.hits)
    .catch((err) => console.log(err));
}

async function postArticle(articleName: string, title: string, data: string) {
  fetch(`http://elastic:9200/articles/_doc/${articleName}?pipeline=files`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa("elastic:mrc201"),
    },
    body: JSON.stringify({
      title: title,
      data: data.split("base64,")[1],
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));
}

export { getArticle, postArticle };
