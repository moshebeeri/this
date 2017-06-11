FROM neo4j/neo4j:latest


ADD *.jar /let/lib/neo4j/plugins/


EXPOSE 7474 7473

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["neo4j"]
