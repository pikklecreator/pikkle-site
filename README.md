# 🛵 Pikkle Site – Plateforme de gestion pour les livreurs ("Pikklers")

**Pikkle** est une plateforme logistique de nouvelle génération qui met en relation :
- Les **entreprises** qui souhaitent faire livrer des produits,
- Les **particuliers** qui ont besoin de faire transporter des objets,
- Et les **livreurs indépendants** appelés **Pikklers**, qui réalisent les livraisons.

Ce dépôt correspond au **site web officiel destiné aux livreurs**, pour leur permettre de s'inscrire et de gérer leur activité sur Pikkle.

---

## 📦 À quoi sert ce site ?

Ce site sert principalement à :
- Permettre l’**inscription des livreurs Pikklers**
- Offrir un accès à leur **profil**, leur **statut**, et leurs **courses**
- Être le point de départ de leur **relation avec la plateforme**

Ce site est **connecté à deux applications mobiles** qui viendront compléter l'écosystème Pikkle :

### 📱 Les 2 applications Pikkle
1. **Application Clients**
   - Pour les particuliers qui souhaitent faire livrer des objets (meubles, électroménager, colis, etc.)
   - Suivi en temps réel de la livraison
   - Paiement sécurisé

2. **Application Entreprises**
   - Pour les professionnels qui veulent faire livrer leurs produits à leurs clients
   - Interface pour poster des courses à livrer
   - Statistiques et facturation

---

## ⚙️ Technologies utilisées

- **Frontend** : React (dans le dossier `frontend/`)
- **Backend** : Python (framework à préciser dans le README)
- **Tests** : Python Unittest ou PyTest (dans le dossier `tests/`)

---

## 🚀 Installation (en local)

```bash
# Cloner le repo
git clone https://github.com/pikklecreator/pikkle-site.git
cd pikkle-site

# Installer les dépendances frontend
cd frontend
yarn install
yarn start

# (optionnel) Lancer le backend si présent
cd ../backend
python app.py  # ou un autre point d'entrée
[ Commit new file ]

