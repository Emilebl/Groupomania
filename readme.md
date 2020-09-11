Pour faire tourner le projet, il est nécessaire d'avoir sur sa machine un server SQL (MAMP ou autre)

## FRONT END

Aller dans le chemin front/groupomania-app et executer la commande
```
npm run serve
```

## BACK END

Avec MySQL, créer la database "groupomania_development" avec la commande
```
CREATE DATABASE groupomania_development CHARACTER SET 'utf8';
```

Importer ensuite le backup de la BDD en éxecutant le fichier bdd_groupomania.sql fourni à la racine du projet.

Pour cela, éxecuter la commande
```
SOURCE chemin_du_fichier ;
```

Pour faire tourner le back, aller dans le chemin du dossier back et executer la commande
```
node server
```
