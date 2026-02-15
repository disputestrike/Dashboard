CREATE TABLE `auditLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100) NOT NULL,
	`entityId` int,
	`oldValue` text,
	`newValue` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`institutionId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`owner` varchar(255) NOT NULL,
	`status` enum('Active','Inactive','Pending') NOT NULL DEFAULT 'Active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `institutions_id` PRIMARY KEY(`id`),
	CONSTRAINT `institutions_institutionId_unique` UNIQUE(`institutionId`)
);
--> statement-breakpoint
CREATE TABLE `performanceData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`institutionId` int NOT NULL,
	`variableId` int NOT NULL,
	`month` varchar(20) NOT NULL,
	`year` int NOT NULL,
	`baselineValue` text,
	`actualValue` text,
	`status` enum('Green','Yellow','Red') NOT NULL,
	`notes` text,
	`submittedBy` int,
	`submittedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performanceData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performanceVariables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`variableId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`unit` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performanceVariables_id` PRIMARY KEY(`id`),
	CONSTRAINT `performanceVariables_variableId_unique` UNIQUE(`variableId`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`permissions` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `userInstitutionAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`institutionId` int NOT NULL,
	`roleId` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userInstitutionAssignments_id` PRIMARY KEY(`id`)
);
