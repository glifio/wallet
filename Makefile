all:
	@echo deploying version: $(VERSION)
	docker pull openworklabs/filecoin-web-wallet:$(VERSION)
	-docker stop filecoin-web-wallet
	-docker rm filecoin-web-wallet
	docker run -d --name filecoin-web-wallet -p 80:3000 openworklabs/filecoin-web-wallet:$(VERSION)
