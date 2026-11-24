# Mini Projet [sprint 03]

Interface Angular du Mini Projet [sprint 03]. Elle gère la liste, l’ajout, la modification, la suppression et la recherche des laptops par nom ou type, via l’API Spring Boot et MySQL. La connexion utilise le token JWT du backend.

## Démarrage

1. Démarrer MySQL dans XAMPP.
2. Démarrer le backend `laptops-api` dans Spring Tools.
3. Dans ce dossier, exécuter `npm ci`, puis `npm start`.
4. Ouvrir `http://localhost:4200`.

Les requêtes Angular utilisent l’API `http://localhost:8081/produits`. Le projet backend se trouve dans le dossier voisin `Mini Projet 3 Backend\laptops-api`.
