Pour faire tourner le projet, il est nécessaire d'avoir sur sa machine un server SQL (MAMP ou autre)

## FRONT END

Aller dans le chemin front/groupomania-app et executer la commande
```
npm run serve
```

## BACK END

Avec MySQL, créer la database "groupomania_development" (ou le nom de votre choix) avec la commande
```
CREATE DATABASE groupomania_development CHARACTER SET 'utf8';
```

puis
```
USE groupomania_development;
```

Importer ensuite le backup de la BDD en éxecutant le fichier bdd_groupomania.sql fourni à la racine du projet.

Pour cela, éxecuter la commande
```
SOURCE chemin_du_fichier ;
```

Les informations de connexion à la base de données sont stockées dans le fichier .env à la racine du dossier back
Il faut donc renseigner dans le .env les champs username, password et database avec les infos correspondantes.

Pour faire tourner le back, aller dans le chemin du dossier back et executer la commande
```
node server
```
