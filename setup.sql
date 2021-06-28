


-- Exportiere Datenbank Struktur für hosterlist
CREATE DATABASE IF NOT EXISTS `hosterlist` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `hosterlist`;

-- Exportiere Struktur von Tabelle hosterlist.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `UUID` char(46) NOT NULL,
  `username` text NOT NULL,
  `email` text DEFAULT NULL,
  `password` text NOT NULL,
  `verified` tinytext NOT NULL,
  `verificationToken` mediumtext NOT NULL,
  PRIMARY KEY (`UUID`),
  KEY `UUID` (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle hosterlist.hoster
CREATE TABLE IF NOT EXISTS `hoster` (
  `UUID` varchar(64) NOT NULL,
  `name` text NOT NULL,
  KEY `UUID` (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle hosterlist.services
CREATE TABLE IF NOT EXISTS `services` (
  `UUID` varchar(64) NOT NULL,
  `hoster_UUID` varchar(64) NOT NULL,
  `type` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `virtualisierung` tinytext NOT NULL,
  `neofetch_data` longtext NOT NULL,
  `swap_RAM` tinytext NOT NULL,
  `upgrade_possibillity` tinytext NOT NULL,
  `uptime_percentage` tinytext NOT NULL,
  `testPeriod` tinytext NOT NULL,
  KEY `FK_services_hoster` (`hoster_UUID`),
  CONSTRAINT `FK_services_hoster` FOREIGN KEY (`hoster_UUID`) REFERENCES `hoster` (`UUID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Daten Export vom Benutzer nicht ausgewählt

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
