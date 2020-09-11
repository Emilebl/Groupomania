-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: groupomania_development
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `postId` (`postId`),
  KEY `userId` (`userId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (25,24,14,'Ok pas de problèmes','2020-09-08 11:38:09','2020-09-08 11:38:09'),(26,24,12,'Ça marche !','2020-09-08 11:38:48','2020-09-08 11:38:48'),(27,24,15,'Bien reçu ! Merci Admin','2020-09-08 11:43:03','2020-09-08 11:43:03'),(28,25,15,'Trop cool ! Je n\'arrive qu\'à 12h30 gardez moi des petits fours..','2020-09-08 11:43:54','2020-09-08 11:43:54'),(29,25,16,'Miam ! Dépêche toi Julie je vais tout finir sinon ahah','2020-09-08 11:49:15','2020-09-08 11:49:15'),(30,26,16,'Ca avait l\'air mimi, j\'étais en Espagne à Madrid moi !','2020-09-08 11:51:23','2020-09-08 11:51:23'),(31,25,12,'Je précise qu\'il y a des trucs végan pour ceux qui veulent..','2020-09-08 11:52:28','2020-09-08 11:52:28'),(34,26,14,'J\'étais à Memphis pour rendre visite à des amis de longue date !!','2020-09-08 12:10:56','2020-09-08 12:10:56'),(35,27,14,'J\'admet ne pas être fan du bowling non plus... peut être un resto tout simplement ?','2020-09-08 12:15:37','2020-09-08 12:15:37'),(36,28,13,'J\'adorais à l\'époque !','2020-09-08 14:53:31','2020-09-08 14:53:31'),(37,28,12,'Mon groupe preféré','2020-09-08 17:06:59','2020-09-08 17:06:59'),(39,27,12,'Par pitié tout mais pas ça ... j\'ai horreur du bowling !!','2020-09-11 09:23:08','2020-09-11 09:23:08'),(40,29,15,'Trop cool !','2020-09-11 13:16:50','2020-09-11 13:16:50'),(41,29,16,'Youpiiii','2020-09-11 13:17:20','2020-09-11 13:17:20');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (24,13,'Petite mise au point','Bonjour à tous et bienvenue sur le réseau social interne de Groupomania ! Je vous demanderais de respecter les règles de courtoisie et de politesse lorsque vous posterez et commenterez des publications, sous peine de suppression !',NULL,'2020-09-08 11:36:01','2020-09-08 11:36:01'),(25,12,'Surprise au 2ème..','RDV à 12h à la caféteria du 2ème  pour notre pot de rentrée !','http://localhost:3000/images/Buffet.jpg1599565256176.jpg','2020-09-08 11:40:56','2020-09-08 11:40:56'),(26,15,'Souvenir de vacances','J\'étais en Bourgogne le weekend dernier ! Et vous c\'était comment vos vacances ?','http://localhost:3000/images/PiqueNique.jpg1599565514443.jpg','2020-09-08 11:45:14','2020-09-08 11:45:14'),(27,16,'Un bowling pour la rentrée ?','Hello ! Pour célébrer la rentrée je propose une soirée bowling ce mois ci ! Dites moi si vous êtes dispos !','http://localhost:3000/images/Bowling.jpg1599565705575.jpg','2020-09-08 11:48:25','2020-09-08 11:48:25'),(28,14,'Un peu de Nostalgie..','Mon ancien groupe avec mes acolytes de Memphis !','http://localhost:3000/images/oldband...jpg1599567297731.jpg','2020-09-08 12:14:57','2020-09-08 12:14:57'),(29,12,'C\'est bientôt Noël !!','Comme chaque année, le CE nous régale avec des petites miniardises du terroir ! Vous trouverez sur vos bureaux un panier gourmand...','http://localhost:3000/images/sapin.jpg1599829994474.jpg','2020-09-11 13:13:14','2020-09-11 13:13:14');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20200721092853-create-user.js'),('20200721093058-create-post.js'),('20200723132935-create-user-react.js'),('20200730124939-create-comment.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userreacts`
--

DROP TABLE IF EXISTS `userreacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userreacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `postId` (`postId`),
  KEY `userId` (`userId`),
  CONSTRAINT `userreacts_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `userreacts_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userreacts`
--

LOCK TABLES `userreacts` WRITE;
/*!40000 ALTER TABLE `userreacts` DISABLE KEYS */;
INSERT INTO `userreacts` VALUES (152,24,14,1,'2020-09-08 11:38:20','2020-09-08 11:38:20'),(156,24,15,1,'2020-09-08 11:42:48','2020-09-08 11:42:48'),(158,25,15,1,'2020-09-08 11:44:12','2020-09-08 11:44:12'),(159,24,16,1,'2020-09-08 11:48:31','2020-09-08 11:48:31'),(161,25,16,1,'2020-09-08 11:48:51','2020-09-08 11:48:51'),(162,26,16,1,'2020-09-08 11:49:54','2020-09-08 11:49:54'),(163,24,12,1,'2020-09-08 11:51:55','2020-09-08 11:51:55'),(164,25,12,1,'2020-09-08 11:51:56','2020-09-08 11:51:56'),(165,26,12,1,'2020-09-08 11:53:14','2020-09-08 11:53:14'),(167,25,14,1,'2020-09-08 12:09:18','2020-09-08 12:09:18'),(168,26,14,1,'2020-09-08 12:09:27','2020-09-08 12:09:27'),(169,28,14,1,'2020-09-08 12:15:02','2020-09-08 12:15:02'),(170,27,14,0,'2020-09-08 12:15:08','2020-09-08 12:15:08'),(171,28,12,1,'2020-09-08 17:06:45','2020-09-08 17:06:45'),(172,27,12,0,'2020-09-08 17:09:31','2020-09-08 17:09:31'),(176,26,15,1,'2020-09-09 18:07:30','2020-09-09 18:07:30'),(177,29,15,1,'2020-09-11 13:16:44','2020-09-11 13:16:44'),(178,29,16,1,'2020-09-11 13:17:13','2020-09-11 13:17:13');
/*!40000 ALTER TABLE `userreacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `profilePic` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12,'bailay.emile@live.fr','$2b$10$PKxDo6AOVsLNCFjMsJ2sOOARntLEXO8nJy0r1CL24X2n6VFGbqMqe','Bailay','Emile','http://localhost:3000/images/EmilePP.jpg1599667867928.jpg','J\'adore le NYHC et les crèpes',0,'2020-09-08 11:28:22','2020-09-09 16:11:07'),(13,'admin@gmail.com','$2b$10$BNEbmobG14KwAol0AahCbeZgjqIVUWiPjNz3FjrL2yGgEojoblf2W','Admin','Admin','http://localhost:3000/images/adminpp.jpg1599564633120.jpg','Je suis l\'administrateur de ce réseau',1,'2020-09-08 11:30:33','2020-09-08 11:30:33'),(14,'jordan@gmail.com','$2b$10$S1f6QiHT99w7R2fAU7x5uubhpxI/EG76uQAypiPlVksJAJkEc9g2O','Houston','Jordan','http://localhost:3000/images/JordanPP.jpg1599565058842.jpg','J\'ai inventé le rap d\'aujourd\'hui en 1993 !',0,'2020-09-08 11:37:39','2020-09-08 11:37:39'),(15,'julie@gmail.com','$2b$10$qvCKWe27j6eG/dehVcVFKuEGP0MIlCCStdDlkhEZzmdxyDMUXjDta','Sanier','Julie','http://localhost:3000/images/JuliePP.jpg1599565353902.jpg','C\'est moi Julie des RH !! Passez me voir en cas de souci',0,'2020-09-08 11:42:33','2020-09-08 11:42:33'),(16,'sarah@gmail.com','$2b$10$b4lDmcs2T6/VRGBYeQd.rOvf2BoW2OU6jWdKhuOvzno7cJUw.IpJS','Kateb','Sarah','http://localhost:3000/images/SarahPP.jpg1599565639167.jpg','Grande passionnée d’échecs et de cuisine',0,'2020-09-08 11:47:19','2020-09-08 11:47:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-11 15:19:27
