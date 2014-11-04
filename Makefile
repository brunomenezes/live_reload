NODE_BIN = ./node_modules/.bin
npm:
	npm install
bower:
	$(NODE_BIN)/bower install

server_dev:
	node bin/www

server_prod:
	NODE_ENV=production node bin/www

elasticsearch_setup:
	curl -O https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.3.4.tar.gz
	tar -zxvf elasticsearch-1.3.4.tar.gz
	./elasticsearch-1.3.4/bin/elasticsearch -d

run: elasticsearch_setup npm bower server_dev