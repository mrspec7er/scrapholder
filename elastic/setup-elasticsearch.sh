#!/bin/bash

# Define Elasticsearch index creation
curl -XPUT -u elastic:mrc201 "http://elastic:9200/article-v1"

# Define Elasticsearch alias creation
curl -XPOST -u elastic:mrc201 "http://elastic:9200/_aliases" -H 'Content-Type: application/json' -d '{
	"actions": [
		{
			"add": {
				"index": "article-v1",
				"alias": "articles"
			}
		}
	]
}'

# Define Elasticsearch ingest pipeline creation
curl -XPUT "http://elastic:9200/_ingest/pipeline/files" -H 'Content-Type: application/json' -d '{
  "description" : "Article for learning stock analysis",
  "processors" : [
    {
      "attachment" : {
        "field" : "data",
        "indexed_chars" : -1
      }
    }
  ]
}'