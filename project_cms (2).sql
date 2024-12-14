-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2024 at 03:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_cms`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `name`, `category`, `description`) VALUES
(1, 'Humayra Adiba', 'Myself', 'Admin'),
(2, 'Md. Abdul Mannan', 'Father', 'Birthday 30 november'),
(3, 'Rabeya Sultana', 'Mother', '20 May'),
(5, 'Adiba Kangkshita', 'Family', ''),
(8, 'Anwita', 'Sister', 'Special'),
(9, 'Humayra Adiba', 'Friend', 'From 2013'),
(10, 'Humayra Adiba', 'Friend', 'goru'),
(11, 'mimi', 'dst hai mera', 'university'),
(22, 'Brainless', 'GOAT', 'Dhinka Chika'),
(23, 'Israt Zannat', 'Friend', 'varsity'),
(24, 'John Doe', 'Friend', 'Test contact');

-- --------------------------------------------------------

--
-- Table structure for table `email`
--

CREATE TABLE `email` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email`
--

INSERT INTO `email` (`id`, `address`, `contact_id`) VALUES
(1, 'humayra.csecu@gmail.com', 1),
(2, 'mamannancomilla@gmail.com', 2),
(3, 'rabeyaruna1980@gmail.com', 3),
(5, 'adibahumayra0220@gmail.com', 5),
(12, 'humayra.csecu@gmail.com', 1),
(16, 'tonmoy.csecu@gmail.com', 22),
(17, 'mimiisrat1234@gmail.com', 23),
(19, 'john@gmail.com', 24);

-- --------------------------------------------------------

--
-- Table structure for table `manages`
--

CREATE TABLE `manages` (
  `user_id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manages`
--

INSERT INTO `manages` (`user_id`, `contact_id`) VALUES
(1, 2),
(2, 1),
(2, 2),
(2, 3),
(12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `mobile`
--

CREATE TABLE `mobile` (
  `id` int(11) NOT NULL,
  `number` varchar(20) NOT NULL,
  `contact_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mobile`
--

INSERT INTO `mobile` (`id`, `number`, `contact_id`) VALUES
(1, '01844900130', 1),
(2, '01818-185973', 2),
(3, '01818-950035', 3),
(5, '01575-032863', 5),
(9, '01626218246', 22),
(10, '01842172983', 23);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(100) NOT NULL,
  `last_login` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sign_in_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `previous_password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `last_login`, `sign_in_time`, `previous_password`) VALUES
(1, 'Humayra Adiba', 'humayra.csecu@gmail.com', '$2a$12$ErK3ia/imuXyD7ji2wqcOOy7.e1HOOe/2ddZKbGScCfQSXNyOvPrW', 'Admin', '2024-12-13 08:35:35', '2024-12-03 04:15:44', 'password123'),
(2, 'Md. Abdul Mannan', 'mamannancomilla@gmail.com', '$2a$12$PE3uDKS7Gmrn6wlyU.pdeur9YUOgtNwl6Go.JRQNFO2xrGfjqz6Ii', 'General User', '2024-12-13 08:41:21', '2024-12-03 04:15:44', 'securepass456'),
(3, 'Rabeya Sultana', 'rabeyaruna1980@gmail.com', '$2a$12$8yOfcLye9yGrnWUirDvVI.qqbtFhLEDh3EQJb2gK9fNj5NiCuhE7G', 'General User', '2024-12-02 16:27:44', '2024-12-03 04:15:44', 'runa@1980'),
(5, 'Fahmidur Rahman Emon', 'fahmidurrahmanemon@gmail.com', '$2a$12$0E7nBjx6cz995BVx0MtDV.r8QhqUpsrhQWNuQCT425YUNgswnt5EO', 'General User', '2024-12-13 08:41:21', '2024-12-03 04:15:44', 'emon0845'),
(8, 'kangkshita', 'kangkshita12345@gmail.com', '$2a$12$d1xZgs2nU2XTqSdFC0dogeyLUfRdEBS6bbBt6yjRlIXr64T1tcSOO', 'General User', '2024-12-03 04:20:41', '2024-12-03 04:19:46', '3456'),
(12, 'adibahumayra0220@gmail.com', 'adibahumayra0220@gmail.com', '$2b$10$jzdD83JU.kAXU3wSs28JQ.4wuPk30O8/rBv6QqNTj/dH2tnwUqS4a', 'General User', '2024-12-13 08:41:21', '2024-12-03 11:03:45', '123'),
(14, 'Justin', 'justin123@gmail.com', '$2b$10$J8SShmLv1Zn8GFUssLgdqeDhUZi9jx9Lv3Q9ZB9gWpfabUJaDWftK', 'General User', '2024-12-13 08:41:21', '2024-12-08 03:17:16', '123'),
(15, 'Lorence', 'lorence123@gmail.com', '$2b$10$ryYALOuB6wipW3RZf59nsu7US7atEGDmKfkAYVrkm3QQwFkI3dmAy', 'General User', '2024-12-13 08:41:21', '2024-12-13 07:21:37', '123'),
(16, 'Carl Korence', 'carlkorrence123@gmail.com', '$2b$10$D5LgahA4zhZXNAj5Y4GWRu/.YhgmhGetkj7Skm1/PJ24ZYrjBNzhm', 'General User', '2024-12-13 08:37:29', '2024-12-13 08:19:31', '123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email`
--
ALTER TABLE `email`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_email_contact` (`contact_id`);

--
-- Indexes for table `manages`
--
ALTER TABLE `manages`
  ADD PRIMARY KEY (`user_id`,`contact_id`);

--
-- Indexes for table `mobile`
--
ALTER TABLE `mobile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mobile_contact` (`contact_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `email`
--
ALTER TABLE `email`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `mobile`
--
ALTER TABLE `mobile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email`
--
ALTER TABLE `email`
  ADD CONSTRAINT `email_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`),
  ADD CONSTRAINT `fk_contact_id` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_email_contact` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mobile`
--
ALTER TABLE `mobile`
  ADD CONSTRAINT `fk_mobile_contact` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mobile_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
