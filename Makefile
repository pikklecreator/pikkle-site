# Démarrage global du projet

.PHONY: all backend frontend start

all: start

backend:
	cd backend && python3 server.py

frontend:
	cd frontend && npm start

start:
	@echo "Lancer le backend : make backend &"
	@echo "Lancer le frontend : make frontend &"
