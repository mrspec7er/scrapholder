FROM docker.elastic.co/elasticsearch/elasticsearch:8.12.0

ENV discovery.type=single-node
ENV ELASTIC_PASSWORD=mrc201
ENV xpack.security.http.ssl.enabled=false
ENV xpack.security.transport.ssl.enabled=false
ENV http.cors.allow-origin=http://localhost:3000
ENV http.cors.enabled=true
ENV http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
ENV http.cors.allow-credentials=true

EXPOSE 9200
EXPOSE 9300

CMD ["elasticsearch"]