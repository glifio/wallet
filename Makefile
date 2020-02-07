build:
	docker build -t openworklabs/filecoin-web-wallet:0.1.0 .

push:
	docker push openworklabs/filecoin-web-wallet:0.1.0

create-api:
	kubectl apply -f api.yaml

create-ingress:
	kubectl apply -f ingress.yaml

create-secret:
	kubectl create secret generic chainwatch-secret --from-env-file=.env

deploy: create-secret create-api create-ingress
