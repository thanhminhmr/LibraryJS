CREATE DATABASE  IF NOT EXISTS `library_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `library_db`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: library_db
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `books` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `publisher` varchar(255) NOT NULL,
  `quantity` int(10) unsigned NOT NULL,
  `otherInfo` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Giải tích 1','Nguyễn Đình Trí','ĐHQGHN',50,''),(2,'Giải tích 2','Nguyễn Đình Trí','ĐHQGHN',40,''),(3,'Kiến trúc hướng dịch vụ','Võ Đình Hiếu','ĐHQGHN',60,''),(4,'Oxford Advanced Learner\'s Dictionary','James Murray','Oxford',10,''),(5,'Tội lỗi','Lãng tử cô độc','gacsach',9,''),(6,'Hoa nở dưới vực sâu','Thanh Khê','gacsach',10,''),(7,'Cô gái Phương Nam','Thanh Khê','gacsach',6,''),(8,'Sherlock Holmes 3','Conan Doyle','gacsach',10,'');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bookId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `borrowDate` datetime NOT NULL,
  `dueDate` datetime NOT NULL,
  `otherInfo` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookId_idx` (`bookId`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `bookId` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON UPDATE NO ACTION,
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
INSERT INTO `loans` VALUES (1,1,3,'2017-10-01 00:00:00','2017-10-06 00:00:00',''),(2,2,4,'2017-10-02 00:00:00','2017-10-07 00:00:00',''),(3,3,1,'2017-10-03 00:00:00','2017-10-08 00:00:00','');
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(63) CHARACTER SET latin1 NOT NULL,
  `password` varchar(63) CHARACTER SET latin1 NOT NULL,
  `role` tinyint(3) unsigned NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` tinyint(3) unsigned NOT NULL,
  `otherInfo` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'abc','abc123',0,'Nguyễn Văn A','1996-03-23',0,''),(2,'def','def456',1,'Phạm Thị B','1987-05-20',1,''),(3,'xyz','xyz789',0,'Trần Văn C','1998-02-14',2,''),(4,'jkl','jkl001',1,'Nguyễn Thị D','1979-03-25',0,''),(5,'gintoki','nnsvvei',1,'Đặng Văn K','1980-05-25',1,'');
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

-- Dump completed on 2018-04-04  9:42:34
