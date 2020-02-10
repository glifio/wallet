build:
	docker build -t openworklabs/filecoin-web-wallet:0.3.0 .

push:
	docker push openworklabs/filecoin-web-wallet:0.3.0

create-api:
	kubectl apply -f api.yaml

create-ingress:
	kubectl apply -f ingress.yaml

create-secret:
	kubectl create secret generic chainwatch-secret --from-env-file=.env

deploy: create-secret create-api create-ingress

enable:
	eval $(docker-machine env filecoin)

stop:
	docker stop wallet

remove:
	docker rm wallet

run:
	docker run -d -p 5001:5001 --env-file .env --name wallet openworklabs/filecoin-web-wallet:0.3.0
	  
release: enable build push stop remove run
