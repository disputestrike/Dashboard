CREATE TABLE `initiatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`initiativeId` varchar(64) NOT NULL,
	`goal` enum('A','B','C','D') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`owner` varchar(255),
	`status` enum('Not Started','In Progress','Complete','At Risk') NOT NULL DEFAULT 'Not Started',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `initiatives_id` PRIMARY KEY(`id`),
	CONSTRAINT `initiatives_initiativeId_unique` UNIQUE(`initiativeId`)
);
--> statement-breakpoint
CREATE TABLE `subBoxes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subBoxId` varchar(64) NOT NULL,
	`initiativeId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` enum('Not Started','In Progress','Complete','At Risk') NOT NULL DEFAULT 'Not Started',
	`notes` text,
	`documentUrl` varchar(500),
	`documentName` varchar(255),
	`owner` varchar(255),
	`dueDate` timestamp,
	`completedDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subBoxes_id` PRIMARY KEY(`id`),
	CONSTRAINT `subBoxes_subBoxId_unique` UNIQUE(`subBoxId`)
);
