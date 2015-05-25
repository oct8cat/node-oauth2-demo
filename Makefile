sources = clients.js index.js oauth2.js test/test.js util.js
test = test

jshint = node_modules/.bin/jshint
mocha = node_modules/.bin/mocha

all: lint $(test)

lint: $(sources)
	$(jshint) $?

$(test):
	$(mocha) -R spec --recursive $@

.PHONY: all lint $(test)
