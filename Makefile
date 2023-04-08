up:
	docker-compose up --build

up-prod:
	docker-compose -f docker-compose.prod.yml up -d

down:
	docker-compose down

migrate-dev:
	docker-compose exec backend npx prisma migrate dev

migrate-prod:
	docker-compose exec backend npx prisma migrate deploy
