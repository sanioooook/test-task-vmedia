-- Create database if not exists
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'RailwayTickets')
BEGIN
    CREATE DATABASE RailwayTickets;
END;
GO

USE RailwayTickets;
GO

-- Table: Users
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        FirstName NVARCHAR(100) NOT NULL,
        LastName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PhoneNumber NVARCHAR(20) NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE() NOT NULL
    );
END;
GO

-- Table: Stations
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Stations]') AND type in (N'U'))
BEGIN
    CREATE TABLE Stations (
        StationId INT IDENTITY(1,1) PRIMARY KEY,
        StationName NVARCHAR(200) NOT NULL,
        City NVARCHAR(100) NOT NULL,
        State NVARCHAR(100) NULL,
        Country NVARCHAR(100) NOT NULL
    );
END;
GO

-- Table: TrainTypes
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TrainTypes]') AND type in (N'U'))
BEGIN
    CREATE TABLE TrainTypes (
        TrainTypeId INT IDENTITY(1,1) PRIMARY KEY,
        TrainType NVARCHAR(50) NOT NULL UNIQUE
    );
END;
GO

-- Table: Trains
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Trains]') AND type in (N'U'))
BEGIN
    CREATE TABLE Trains (
        TrainId INT IDENTITY(1,1) PRIMARY KEY,
        TrainNumber NVARCHAR(50) NOT NULL UNIQUE,
        Capacity INT NOT NULL,
        TrainTypeId INT NOT NULL FOREIGN KEY REFERENCES TrainTypes(TrainTypeId) ON DELETE CASCADE
    );
END;
GO

-- Table: Routes
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Routes]') AND type in (N'U'))
BEGIN
    CREATE TABLE Routes (
        RouteId INT IDENTITY(1,1) PRIMARY KEY,
        TrainId INT NOT NULL FOREIGN KEY REFERENCES Trains(TrainId) ON DELETE CASCADE,
        DepartureStationId INT NOT NULL FOREIGN KEY REFERENCES Stations(StationId) ON DELETE NO ACTION,
        ArrivalStationId INT NOT NULL FOREIGN KEY REFERENCES Stations(StationId) ON DELETE NO ACTION,
        DepartureTime DATETIME NOT NULL,
        ArrivalTime DATETIME NOT NULL,
        DistanceInKm INT NOT NULL
    );
END;
GO

-- Table: Tickets
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND type in (N'U'))
BEGIN
    CREATE TABLE Tickets (
        TicketId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
        RouteId INT NOT NULL FOREIGN KEY REFERENCES Routes(RouteId) ON DELETE CASCADE,
        SeatNumber NVARCHAR(10) NOT NULL,
        Price DECIMAL(10, 2) NOT NULL,
        PurchaseDate DATETIME DEFAULT GETDATE() NOT NULL
    );
END;
GO

-- Table: PaymentMethods
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentMethods]') AND type in (N'U'))
BEGIN
    CREATE TABLE PaymentMethods (
        PaymentMethodId INT IDENTITY(1,1) PRIMARY KEY,
        PaymentMethod NVARCHAR(50) NOT NULL UNIQUE
    );
END;
GO

-- Table: PaymentStatuses
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentStatuses]') AND type in (N'U'))
BEGIN
    CREATE TABLE PaymentStatuses (
        PaymentStatusId INT IDENTITY(1,1) PRIMARY KEY,
        PaymentStatus NVARCHAR(50) NOT NULL UNIQUE
    );
END;
GO

-- Table: PaymentTransactions
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaymentTransactions]') AND type in (N'U'))
BEGIN
    CREATE TABLE PaymentTransactions (
        TransactionId INT IDENTITY(1,1) PRIMARY KEY,
        TicketId INT NOT NULL FOREIGN KEY REFERENCES Tickets(TicketId) ON DELETE CASCADE,
        PaymentMethodId INT NOT NULL FOREIGN KEY REFERENCES PaymentMethods(PaymentMethodId) ON DELETE CASCADE,
        PaymentStatusId INT NOT NULL FOREIGN KEY REFERENCES PaymentStatuses(PaymentStatusId) ON DELETE CASCADE,
        TransactionDate DATETIME DEFAULT GETDATE() NOT NULL,
        Amount DECIMAL(10, 2) NOT NULL
    );
END;
GO

-- Seed data for TrainTypes
IF NOT EXISTS (SELECT * FROM TrainTypes)
BEGIN
    INSERT INTO TrainTypes (TrainType) VALUES
    ('Express'),
    ('Passenger'),
    ('Freight');
END;
GO

-- Seed data for PaymentMethods
IF NOT EXISTS (SELECT * FROM PaymentMethods)
BEGIN
    INSERT INTO PaymentMethods (PaymentMethod) VALUES
    ('Credit Card'),
    ('PayPal'),
    ('Cash');
END;
GO

-- Seed data for PaymentStatuses
IF NOT EXISTS (SELECT * FROM PaymentStatuses)
BEGIN
    INSERT INTO PaymentStatuses (PaymentStatus) VALUES
    ('Success'),
    ('Pending'),
    ('Failed');
END;
GO

-- Seed data for Stations
IF NOT EXISTS (SELECT * FROM Stations)
BEGIN
    INSERT INTO Stations (StationName, City, Country) VALUES
    ('Central Station', 'New York', 'USA'),
    ('Union Station', 'Los Angeles', 'USA'),
    ('King’s Cross', 'London', 'UK');
END;
GO

-- Seed data for Trains
IF NOT EXISTS (SELECT * FROM Trains)
BEGIN
    INSERT INTO Trains (TrainNumber, Capacity, TrainTypeId) VALUES
    ('EXP100', 500, 1),
    ('PASS200', 300, 2);
END;
GO

-- Seed data for Routes
IF NOT EXISTS (SELECT * FROM Routes)
BEGIN
    INSERT INTO Routes (TrainId, DepartureStationId, ArrivalStationId, DepartureTime, ArrivalTime, DistanceInKm) VALUES
    (1, 1, 2, '2024-11-21 08:00:00', '2024-11-21 16:00:00', 450),
    (2, 2, 3, '2024-11-22 10:00:00', '2024-11-22 20:00:00', 800);
END;
GO
