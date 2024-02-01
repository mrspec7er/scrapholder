FROM docker.elastic.co/elasticsearch/elasticsearch:8.12.0

ENV discovery.type=single-node
ENV ELASTIC_PASSWORD=mrc201
ENV xpack.security.http.ssl.enabled=false
ENV xpack.security.transport.ssl.enabled=false

COPY . .

EXPOSE 9200
EXPOSE 9300

CMD ["elasticsearch"]