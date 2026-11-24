/*
  ProductionHouseDB — SQL Server schema
  Generated from the Halha / Hala Media React admin + marketing frontend
  (mockData.js, DashboardContext, SiteContentContext, page components).

  Usage:
    1. Connect as a login that can create databases.
    2. Run this script in SSMS / sqlcmd (SQLCMD mode not required).
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF DB_ID(N'ProductionHouseDB') IS NULL
BEGIN
    CREATE DATABASE ProductionHouseDB COLLATE Arabic_CI_AS;
END
GO

USE ProductionHouseDB;
GO

/* -------------------------------------------------------------------------- */
/* Drop objects in reverse dependency order (idempotent re-run)               */
/* -------------------------------------------------------------------------- */
IF OBJECT_ID(N'dbo.InvoiceItems', N'U') IS NOT NULL DROP TABLE dbo.InvoiceItems;
IF OBJECT_ID(N'dbo.Invoices', N'U') IS NOT NULL DROP TABLE dbo.Invoices;
IF OBJECT_ID(N'dbo.SignedContracts', N'U') IS NOT NULL DROP TABLE dbo.SignedContracts;
IF OBJECT_ID(N'dbo.ContractTemplates', N'U') IS NOT NULL DROP TABLE dbo.ContractTemplates;
IF OBJECT_ID(N'dbo.ClientPayments', N'U') IS NOT NULL DROP TABLE dbo.ClientPayments;
IF OBJECT_ID(N'dbo.EquipmentReservations', N'U') IS NOT NULL DROP TABLE dbo.EquipmentReservations;
IF OBJECT_ID(N'dbo.Equipment', N'U') IS NOT NULL DROP TABLE dbo.Equipment;
IF OBJECT_ID(N'dbo.Payouts', N'U') IS NOT NULL DROP TABLE dbo.Payouts;
IF OBJECT_ID(N'dbo.Expenses', N'U') IS NOT NULL DROP TABLE dbo.Expenses;
IF OBJECT_ID(N'dbo.PayrollMonthSettings', N'U') IS NOT NULL DROP TABLE dbo.PayrollMonthSettings;
IF OBJECT_ID(N'dbo.EmployeePayrollMonths', N'U') IS NOT NULL DROP TABLE dbo.EmployeePayrollMonths;
IF OBJECT_ID(N'dbo.Tasks', N'U') IS NOT NULL DROP TABLE dbo.Tasks;
IF OBJECT_ID(N'dbo.OrderRevisions', N'U') IS NOT NULL DROP TABLE dbo.OrderRevisions;
IF OBJECT_ID(N'dbo.OrderNotes', N'U') IS NOT NULL DROP TABLE dbo.OrderNotes;
IF OBJECT_ID(N'dbo.OrderAssignments', N'U') IS NOT NULL DROP TABLE dbo.OrderAssignments;
IF OBJECT_ID(N'dbo.OrderFinancials', N'U') IS NOT NULL DROP TABLE dbo.OrderFinancials;
IF OBJECT_ID(N'dbo.Orders', N'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID(N'dbo.ServiceFormFields', N'U') IS NOT NULL DROP TABLE dbo.ServiceFormFields;
IF OBJECT_ID(N'dbo.ServiceCatalog', N'U') IS NOT NULL DROP TABLE dbo.ServiceCatalog;
IF OBJECT_ID(N'dbo.DailyAttendance', N'U') IS NOT NULL DROP TABLE dbo.DailyAttendance;
IF OBJECT_ID(N'dbo.EmployeeProfiles', N'U') IS NOT NULL DROP TABLE dbo.EmployeeProfiles;
IF OBJECT_ID(N'dbo.Notifications', N'U') IS NOT NULL DROP TABLE dbo.Notifications;
IF OBJECT_ID(N'dbo.PhotoPackages', N'U') IS NOT NULL DROP TABLE dbo.PhotoPackages;
IF OBJECT_ID(N'dbo.DigitalProducts', N'U') IS NOT NULL DROP TABLE dbo.DigitalProducts;
IF OBJECT_ID(N'dbo.SiteBloggers', N'U') IS NOT NULL DROP TABLE dbo.SiteBloggers;
IF OBJECT_ID(N'dbo.PortfolioWorks', N'U') IS NOT NULL DROP TABLE dbo.PortfolioWorks;
IF OBJECT_ID(N'dbo.Clients', N'U') IS NOT NULL DROP TABLE dbo.Clients;
IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL DROP TABLE dbo.Users;
GO

/* -------------------------------------------------------------------------- */
/* Users / Employees                                                          */
/* -------------------------------------------------------------------------- */
CREATE TABLE dbo.Users (
    UserId              INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Users PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NOT NULL,
    FullName            NVARCHAR(150)     NOT NULL,
    FullNameEn          NVARCHAR(150)     NULL,
    Email               NVARCHAR(200)     NOT NULL,
    /* Admin Team dialog: username + password (store a hash in PasswordHash, never plaintext in production) */
    Username            NVARCHAR(30)      NOT NULL,
    PasswordHash        NVARCHAR(256)     NOT NULL CONSTRAINT DF_Users_PasswordHash DEFAULT (N'demo1234'),
    Role                NVARCHAR(20)      NOT NULL CONSTRAINT CK_Users_Role CHECK (Role IN (N'ADMIN', N'EMPLOYEE')),
    AvatarUrl           NVARCHAR(500)     NULL,
    JoinDate            DATE              NOT NULL,
    IsActive            BIT               NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT (1),
    EmploymentStatus    NVARCHAR(20)      NOT NULL CONSTRAINT DF_Users_Employment DEFAULT (N'working')
                        CONSTRAINT CK_Users_Employment CHECK (EmploymentStatus IN (N'working', N'dismissed')),
    CreatedAt           DATETIME2(0)      NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT UQ_Users_PublicCode UNIQUE (PublicCode),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT UQ_Users_Username UNIQUE (Username),
    CONSTRAINT CK_Users_Username CHECK (
        LEN(Username) BETWEEN 3 AND 30
        AND Username NOT LIKE N'%[^a-zA-Z0-9._-]%'
    )
);
GO

CREATE TABLE dbo.EmployeeProfiles (
    EmployeeProfileId   INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_EmployeeProfiles PRIMARY KEY,
    UserId              INT               NOT NULL,
    Specialty           NVARCHAR(50)      NULL,
    HourlyRate          DECIMAL(18,2)     NULL,
    DailyRate           DECIMAL(18,2)     NULL,
    BaseSalary          DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Employee_BaseSalary DEFAULT (0),
    AttendanceDays      INT               NOT NULL CONSTRAINT DF_Employee_Attend DEFAULT (0),
    AbsenceDays         INT               NOT NULL CONSTRAINT DF_Employee_Absent DEFAULT (0),
    NetSalary           DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Employee_Net DEFAULT (0),
    CONSTRAINT UQ_EmployeeProfiles_UserId UNIQUE (UserId),
    CONSTRAINT FK_EmployeeProfiles_Users FOREIGN KEY (UserId)
        REFERENCES dbo.Users (UserId) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.DailyAttendance (
    AttendanceId        INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_DailyAttendance PRIMARY KEY,
    EmployeeId          INT               NOT NULL,
    AttendanceDate      DATE              NOT NULL,
    Status              NVARCHAR(20)      NOT NULL
                        CONSTRAINT CK_Attendance_Status CHECK (Status IN (N'present', N'absent', N'late', N'on_leave')),
    CheckInTime         TIME(0)           NULL,
    Notes               NVARCHAR(500)     NULL,
    CreatedAt           DATETIME2(0)      NOT NULL CONSTRAINT DF_Attendance_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT UQ_DailyAttendance_EmployeeDate UNIQUE (EmployeeId, AttendanceDate),
    CONSTRAINT FK_DailyAttendance_Users FOREIGN KEY (EmployeeId)
        REFERENCES dbo.Users (UserId) ON DELETE NO ACTION
);
GO

CREATE NONCLUSTERED INDEX IX_DailyAttendance_Date
    ON dbo.DailyAttendance (AttendanceDate) INCLUDE (Status, EmployeeId);
CREATE NONCLUSTERED INDEX IX_DailyAttendance_EmployeeId
    ON dbo.DailyAttendance (EmployeeId, AttendanceDate);
GO

CREATE TABLE dbo.EmployeePayrollMonths (
    PayrollMonthId      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_EmployeePayrollMonths PRIMARY KEY,
    EmployeeId          INT               NOT NULL,
    YearMonth           CHAR(7)           NOT NULL, -- yyyy-MM
    AttendanceDays      INT               NOT NULL CONSTRAINT DF_PayMonth_Attend DEFAULT (0),
    AbsenceDays         INT               NOT NULL CONSTRAINT DF_PayMonth_Absent DEFAULT (0),
    ExtraDeductions     DECIMAL(18,2)     NOT NULL CONSTRAINT DF_PayMonth_Extra DEFAULT (0),
    CONSTRAINT UQ_EmployeePayrollMonths UNIQUE (EmployeeId, YearMonth),
    CONSTRAINT FK_EmployeePayrollMonths_Users FOREIGN KEY (EmployeeId)
        REFERENCES dbo.Users (UserId) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.PayrollMonthSettings (
    PayrollSettingId    INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_PayrollMonthSettings PRIMARY KEY,
    YearMonth           CHAR(7)           NOT NULL,
    WorkDays            INT               NOT NULL CONSTRAINT CK_Payroll_WorkDays CHECK (WorkDays BETWEEN 1 AND 31),
    CONSTRAINT UQ_PayrollMonthSettings_YearMonth UNIQUE (YearMonth)
);
GO

/* -------------------------------------------------------------------------- */
/* Clients                                                                    */
/* -------------------------------------------------------------------------- */
CREATE TABLE dbo.Clients (
    ClientId            INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Clients PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NOT NULL,
    ContactName         NVARCHAR(150)     NOT NULL,
    CompanyName         NVARCHAR(200)     NULL,
    Phone               NVARCHAR(30)      NULL,
    Email               NVARCHAR(200)     NULL,
    Status              NVARCHAR(20)      NOT NULL CONSTRAINT DF_Clients_Status DEFAULT (N'Active'),
    TotalSpent          DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Clients_Spent DEFAULT (0),
    RemainingBalance    DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Clients_Remaining DEFAULT (0),
    TotalOrders         INT               NOT NULL CONSTRAINT DF_Clients_Orders DEFAULT (0),
    CreatedAt           DATETIME2(0)      NOT NULL CONSTRAINT DF_Clients_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT UQ_Clients_PublicCode UNIQUE (PublicCode)
);
GO

CREATE NONCLUSTERED INDEX IX_Clients_Phone ON dbo.Clients (Phone);
CREATE NONCLUSTERED INDEX IX_Clients_Status ON dbo.Clients (Status);
GO

/* -------------------------------------------------------------------------- */
/* Catalog / services                                                         */
/* -------------------------------------------------------------------------- */
CREATE TABLE dbo.ServiceCatalog (
    ServiceId           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ServiceCatalog PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NOT NULL,
    NameAr              NVARCHAR(150)     NOT NULL,
    NameEn              NVARCHAR(150)     NULL,
    IsEnabled           BIT               NOT NULL CONSTRAINT DF_Service_Enabled DEFAULT (1),
    BasePrice           DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Service_Price DEFAULT (0),
    IconKey             NVARCHAR(50)      NULL,
    CONSTRAINT UQ_ServiceCatalog_PublicCode UNIQUE (PublicCode)
);
GO

CREATE TABLE dbo.ServiceFormFields (
    FieldId             INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ServiceFormFields PRIMARY KEY,
    ServiceId           INT               NOT NULL,
    FieldKey            NVARCHAR(50)      NOT NULL,
    LabelAr             NVARCHAR(200)     NOT NULL,
    SortOrder           INT               NOT NULL CONSTRAINT DF_ServiceField_Sort DEFAULT (0),
    CONSTRAINT FK_ServiceFormFields_Service FOREIGN KEY (ServiceId)
        REFERENCES dbo.ServiceCatalog (ServiceId) ON DELETE CASCADE
);
GO

/* -------------------------------------------------------------------------- */
/* Orders + financials + notes                                                */
/* -------------------------------------------------------------------------- */
CREATE TABLE dbo.Orders (
    OrderId             INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Orders PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NOT NULL,
    ClientId            INT               NOT NULL,
    ServiceType         NVARCHAR(100)     NOT NULL,
    Description         NVARCHAR(1000)    NULL,
    Status              NVARCHAR(30)      NOT NULL
                        CONSTRAINT CK_Orders_Status CHECK (Status IN (
                            N'new_lead', N'quoted', N'in_production', N'internal_qa',
                            N'client_review', N'completed', N'cancelled')),
    Priority            NVARCHAR(20)      NOT NULL
                        CONSTRAINT CK_Orders_Priority CHECK (Priority IN (N'urgent', N'high', N'medium', N'low')),
    DueDate             DATE              NULL,
    CreatedAt           DATE              NOT NULL,
    AdminNotes          NVARCHAR(2000)    NULL,
    CONSTRAINT UQ_Orders_PublicCode UNIQUE (PublicCode),
    CONSTRAINT FK_Orders_Clients FOREIGN KEY (ClientId)
        REFERENCES dbo.Clients (ClientId) ON DELETE NO ACTION
);
GO

CREATE NONCLUSTERED INDEX IX_Orders_ClientId ON dbo.Orders (ClientId);
CREATE NONCLUSTERED INDEX IX_Orders_Status ON dbo.Orders (Status) INCLUDE (DueDate, Priority);
CREATE NONCLUSTERED INDEX IX_Orders_CreatedAt ON dbo.Orders (CreatedAt);
CREATE NONCLUSTERED INDEX IX_Orders_DueDate ON dbo.Orders (DueDate);
GO

CREATE TABLE dbo.OrderAssignments (
    OrderId             INT               NOT NULL,
    EmployeeId          INT               NOT NULL,
    AssignedAt          DATETIME2(0)      NOT NULL CONSTRAINT DF_OrderAssign_At DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_OrderAssignments PRIMARY KEY (OrderId, EmployeeId),
    CONSTRAINT FK_OrderAssignments_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders (OrderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderAssignments_Users FOREIGN KEY (EmployeeId)
        REFERENCES dbo.Users (UserId) ON DELETE NO ACTION
);
GO

CREATE NONCLUSTERED INDEX IX_OrderAssignments_EmployeeId ON dbo.OrderAssignments (EmployeeId);
GO

CREATE TABLE dbo.OrderFinancials (
    OrderFinancialId    INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OrderFinancials PRIMARY KEY,
    OrderId             INT               NOT NULL,
    TotalCost           DECIMAL(18,2)     NOT NULL,
    DiscountAmount      DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrderFin_Discount DEFAULT (0),
    DepositPaid         BIT               NOT NULL CONSTRAINT DF_OrderFin_DepositPaid DEFAULT (0),
    DepositAmount       DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrderFin_Deposit DEFAULT (0),
    DirectCosts         DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrderFin_Direct DEFAULT (0),
    RemainingBalance    DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrderFin_Remaining DEFAULT (0),
    CONSTRAINT UQ_OrderFinancials_OrderId UNIQUE (OrderId),
    CONSTRAINT FK_OrderFinancials_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders (OrderId) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.OrderNotes (
    NoteId              INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OrderNotes PRIMARY KEY,
    OrderId             INT               NOT NULL,
    AuthorUserId        INT               NULL,
    NoteText            NVARCHAR(2000)    NOT NULL,
    CreatedAt           DATETIME2(0)      NOT NULL CONSTRAINT DF_OrderNotes_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_OrderNotes_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders (OrderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderNotes_Users FOREIGN KEY (AuthorUserId)
        REFERENCES dbo.Users (UserId) ON DELETE SET NULL
);
GO

CREATE TABLE dbo.OrderRevisions (
    RevisionId          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OrderRevisions PRIMARY KEY,
    OrderId             INT               NOT NULL,
    RevisionDate        DATE              NOT NULL,
    Note                NVARCHAR(1000)    NOT NULL,
    CONSTRAINT FK_OrderRevisions_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders (OrderId) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Tasks (
    TaskId              INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Tasks PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NOT NULL,
    OrderId             INT               NOT NULL,
    AssignedEmployeeId  INT               NULL,
    Title               NVARCHAR(300)     NOT NULL,
    Priority            NVARCHAR(20)      NOT NULL,
    Status              NVARCHAR(30)      NOT NULL,
    EstimatedHours      DECIMAL(9,2)      NULL,
    LoggedHours         DECIMAL(9,2)      NULL,
    DueDate             DATE              NULL,
    DeliverableLink     NVARCHAR(500)     NULL,
    Notes               NVARCHAR(2000)    NULL,
    CONSTRAINT UQ_Tasks_PublicCode UNIQUE (PublicCode),
    CONSTRAINT FK_Tasks_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders (OrderId) ON DELETE CASCADE,
    CONSTRAINT FK_Tasks_Users FOREIGN KEY (AssignedEmployeeId)
        REFERENCES dbo.Users (UserId) ON DELETE SET NULL
);
GO

CREATE NONCLUSTERED INDEX IX_Tasks_AssignedEmployeeId ON dbo.Tasks (AssignedEmployeeId);
CREATE NONCLUSTERED INDEX IX_Tasks_OrderId ON dbo.Tasks (OrderId);
CREATE NONCLUSTERED INDEX IX_Tasks_Status ON dbo.Tasks (Status);
GO

/* -------------------------------------------------------------------------- */
/* Equipment                                                                  */
/* -------------------------------------------------------------------------- */
CREATE TABLE dbo.Equipment (
    EquipmentId         INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Equipment PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NOT NULL,
    Name                NVARCHAR(150)     NOT NULL,
    Category            NVARCHAR(50)      NOT NULL,
    SerialNumber        NVARCHAR(80)      NOT NULL,
    Status              NVARCHAR(30)      NOT NULL
                        CONSTRAINT CK_Equipment_Status CHECK (Status IN (
                            N'operational', N'checked_out', N'maintenance', N'lost')),
    CONSTRAINT UQ_Equipment_PublicCode UNIQUE (PublicCode),
    CONSTRAINT UQ_Equipment_Serial UNIQUE (SerialNumber)
);
GO

CREATE NONCLUSTERED INDEX IX_Equipment_Status ON dbo.Equipment (Status);
CREATE NONCLUSTERED INDEX IX_Equipment_Category ON dbo.Equipment (Category);
GO

CREATE TABLE dbo.EquipmentReservations (
    ReservationId       INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_EquipmentReservations PRIMARY KEY,
    EquipmentId         INT               NOT NULL,
    OrderId             INT               NULL,
    AssignedEmployeeId  INT               NULL,
    CheckoutDate        DATE              NOT NULL,
    ReturnDate          DATE              NULL,
    CONSTRAINT FK_EquipRes_Equipment FOREIGN KEY (EquipmentId)
        REFERENCES dbo.Equipment (EquipmentId) ON DELETE CASCADE,
    CONSTRAINT FK_EquipRes_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders (OrderId) ON DELETE SET NULL,
    CONSTRAINT FK_EquipRes_Users FOREIGN KEY (AssignedEmployeeId)
        REFERENCES dbo.Users (UserId) ON DELETE SET NULL
);
GO

CREATE NONCLUSTERED INDEX IX_EquipmentReservations_OrderId ON dbo.EquipmentReservations (OrderId);
GO

/* -------------------------------------------------------------------------- */
/* Expenses / payouts / invoices / contracts                                  */
/* -------------------------------------------------------------------------- */
CREATE TABLE dbo.Expenses (
    ExpenseId           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Expenses PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NULL,
    Title               NVARCHAR(200)     NOT NULL,
    Category            NVARCHAR(80)      NOT NULL,
    Amount              DECIMAL(18,2)     NOT NULL,
    ExpenseDate         DATE              NOT NULL,
    IsRecurring         BIT               NOT NULL CONSTRAINT DF_Expenses_Recurring DEFAULT (0),
    Notes               NVARCHAR(1000)    NULL
);
GO

CREATE NONCLUSTERED INDEX IX_Expenses_Date ON dbo.Expenses (ExpenseDate);
CREATE NONCLUSTERED INDEX IX_Expenses_Category ON dbo.Expenses (Category);
GO

CREATE TABLE dbo.Payouts (
    PayoutId            INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Payouts PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NULL,
    RecipientName       NVARCHAR(150)     NOT NULL,
    RecipientType       NVARCHAR(50)      NOT NULL,
    Amount              DECIMAL(18,2)     NOT NULL,
    OrderId             INT               NULL,
    Status              NVARCHAR(20)      NOT NULL CONSTRAINT CK_Payouts_Status CHECK (Status IN (N'paid', N'pending')),
    DueDate             DATE              NULL,
    CONSTRAINT FK_Payouts_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders (OrderId) ON DELETE SET NULL
);
GO

CREATE TABLE dbo.Invoices (
    InvoiceId           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Invoices PRIMARY KEY,
    InvoiceNumber       NVARCHAR(40)      NOT NULL,
    OrderId             INT               NULL,
    ClientId            INT               NOT NULL,
    Amount              DECIMAL(18,2)     NOT NULL,
    PaidAmount          DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Invoices_Paid DEFAULT (0),
    RemainingAmount     DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Invoices_Remaining DEFAULT (0),
    DueDate             DATE              NOT NULL,
    PaymentStatus       NVARCHAR(20)      NOT NULL
                        CONSTRAINT CK_Invoices_Status CHECK (PaymentStatus IN (N'paid', N'partial', N'overdue', N'unpaid')),
    CreatedAt           DATETIME2(0)      NOT NULL CONSTRAINT DF_Invoices_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT UQ_Invoices_Number UNIQUE (InvoiceNumber),
    CONSTRAINT FK_Invoices_Orders FOREIGN KEY (OrderId)
        REFERENCES dbo.Orders (OrderId) ON DELETE SET NULL,
    CONSTRAINT FK_Invoices_Clients FOREIGN KEY (ClientId)
        REFERENCES dbo.Clients (ClientId) ON DELETE NO ACTION
);
GO

CREATE NONCLUSTERED INDEX IX_Invoices_ClientId ON dbo.Invoices (ClientId);
CREATE NONCLUSTERED INDEX IX_Invoices_OrderId ON dbo.Invoices (OrderId);
CREATE NONCLUSTERED INDEX IX_Invoices_DueDate ON dbo.Invoices (DueDate);
CREATE NONCLUSTERED INDEX IX_Invoices_PaymentStatus ON dbo.Invoices (PaymentStatus);
GO

CREATE TABLE dbo.InvoiceItems (
    InvoiceItemId       INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_InvoiceItems PRIMARY KEY,
    InvoiceId           INT               NOT NULL,
    Description         NVARCHAR(300)     NOT NULL,
    Quantity            INT               NOT NULL CONSTRAINT DF_InvoiceItems_Qty DEFAULT (1),
    UnitPrice           DECIMAL(18,2)     NOT NULL,
    CONSTRAINT FK_InvoiceItems_Invoices FOREIGN KEY (InvoiceId)
        REFERENCES dbo.Invoices (InvoiceId) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.ContractTemplates (
    TemplateId          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ContractTemplates PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NOT NULL,
    Title               NVARCHAR(200)     NOT NULL,
    ContractType        NVARCHAR(100)     NOT NULL,
    Body                NVARCHAR(MAX)     NOT NULL,
    CONSTRAINT UQ_ContractTemplates_PublicCode UNIQUE (PublicCode)
);
GO

CREATE TABLE dbo.SignedContracts (
    SignedContractId    INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SignedContracts PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NULL,
    ClientId            INT               NOT NULL,
    TemplateId          INT               NULL,
    Title               NVARCHAR(200)     NOT NULL,
    ContractType        NVARCHAR(100)     NULL,
    IsSigned            BIT               NOT NULL CONSTRAINT DF_SignedContracts_Signed DEFAULT (0),
    SignedDate          DATE              NULL,
    CONSTRAINT FK_SignedContracts_Clients FOREIGN KEY (ClientId)
        REFERENCES dbo.Clients (ClientId) ON DELETE CASCADE,
    CONSTRAINT FK_SignedContracts_Templates FOREIGN KEY (TemplateId)
        REFERENCES dbo.ContractTemplates (TemplateId) ON DELETE SET NULL
);
GO

CREATE TABLE dbo.ClientPayments (
    ClientPaymentId     INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ClientPayments PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NULL,
    ClientId            INT               NOT NULL,
    PaymentDate         DATE              NOT NULL,
    Amount              DECIMAL(18,2)     NOT NULL,
    Method              NVARCHAR(50)      NULL,
    CONSTRAINT FK_ClientPayments_Clients FOREIGN KEY (ClientId)
        REFERENCES dbo.Clients (ClientId) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Notifications (
    NotificationId      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Notifications PRIMARY KEY,
    PublicCode          NVARCHAR(20)      NULL,
    Type                NVARCHAR(20)      NOT NULL,
    Title               NVARCHAR(200)     NOT NULL,
    Message             NVARCHAR(500)     NOT NULL,
    RelativeTimeLabel   NVARCHAR(50)      NULL,
    IsRead              BIT               NOT NULL CONSTRAINT DF_Notifications_Read DEFAULT (0),
    CreatedAt           DATETIME2(0)      NOT NULL CONSTRAINT DF_Notifications_CreatedAt DEFAULT (SYSUTCDATETIME())
);
GO

/* -------------------------------------------------------------------------- */
/* Marketing site CMS (frontend SiteContentContext)                           */
/* -------------------------------------------------------------------------- */
CREATE TABLE dbo.PortfolioWorks (
    WorkId              INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_PortfolioWorks PRIMARY KEY,
    PublicCode          NVARCHAR(40)      NOT NULL,
    Title               NVARCHAR(200)     NOT NULL,
    Details             NVARCHAR(1000)    NULL,
    VideoUrl            NVARCHAR(500)     NULL,
    ImageUrl            NVARCHAR(500)     NULL,
    CssClass            NVARCHAR(50)      NULL,
    SortOrder           INT               NOT NULL CONSTRAINT DF_Works_Sort DEFAULT (0),
    CONSTRAINT UQ_PortfolioWorks_PublicCode UNIQUE (PublicCode)
);
GO

CREATE TABLE dbo.SiteBloggers (
    BloggerId           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SiteBloggers PRIMARY KEY,
    PublicCode          NVARCHAR(40)      NOT NULL,
    FullName            NVARCHAR(150)     NOT NULL,
    Niche               NVARCHAR(150)     NULL,
    Label               NVARCHAR(200)     NULL,
    Description         NVARCHAR(1000)    NULL,
    ImageUrl            NVARCHAR(500)     NULL,
    SampleVideoUrl      NVARCHAR(500)     NULL,
    VideoPrice          DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Bloggers_Price DEFAULT (0),
    CONSTRAINT UQ_SiteBloggers_PublicCode UNIQUE (PublicCode)
);
GO

CREATE TABLE dbo.DigitalProducts (
    DigitalProductId    INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_DigitalProducts PRIMARY KEY,
    PublicCode          NVARCHAR(40)      NOT NULL,
    Title               NVARCHAR(150)     NOT NULL,
    Hint                NVARCHAR(300)     NULL,
    Price               DECIMAL(18,2)     NOT NULL,
    IconKey             NVARCHAR(50)      NULL,
    CONSTRAINT UQ_DigitalProducts_PublicCode UNIQUE (PublicCode)
);
GO

CREATE TABLE dbo.PhotoPackages (
    PhotoPackageId      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_PhotoPackages PRIMARY KEY,
    PublicCode          NVARCHAR(40)      NOT NULL,
    Name                NVARCHAR(150)     NOT NULL,
    Details             NVARCHAR(1000)    NULL,
    Price               DECIMAL(18,2)     NOT NULL,
    ImageUrl            NVARCHAR(500)     NULL,
    CONSTRAINT UQ_PhotoPackages_PublicCode UNIQUE (PublicCode)
);
GO

/* ========================================================================== */
/* Seed data — translated from src/data/mockData.js and content.js            */
/* ========================================================================== */

INSERT INTO dbo.Users (PublicCode, FullName, FullNameEn, Email, Username, PasswordHash, Role, JoinDate, IsActive, EmploymentStatus)
VALUES
 (N'u1', N'سارة الأحمد', N'Sara Al-Ahmad', N'sara@hala-media.sa', N'sara', N'demo1234', N'ADMIN', '2024-01-15', 1, N'working'),
 (N'u3', N'نورة السالم', N'Noura Al-Salem', N'noura@hala-media.sa', N'noura', N'demo1234', N'EMPLOYEE', '2024-02-10', 1, N'working'),
 (N'u4', N'أحمد الزهراني', N'Ahmed Al-Zahrani', N'ahmed@hala-media.sa', N'ahmed', N'demo1234', N'EMPLOYEE', '2024-04-05', 1, N'working'),
 (N'u5', N'لينا القحطاني', N'Lina Al-Qahtani', N'lina@hala-media.sa', N'lina', N'demo1234', N'EMPLOYEE', '2024-01-20', 1, N'working'),
 (N'u6', N'فهد المطيري', N'Fahad Al-Mutairi', N'fahad@hala-media.sa', N'fahad', N'demo1234', N'EMPLOYEE', '2024-05-12', 1, N'working'),
 (N'u7', N'ريم العتيبي', N'Reem Al-Otaibi', N'reem@hala-media.sa', N'reem', N'demo1234', N'EMPLOYEE', '2024-06-01', 1, N'working'),
 (N'u8', N'محمود الشمري', N'Mahmoud Al-Shammari', N'mahmoud@hala-media.sa', N'mahmoud', N'demo1234', N'EMPLOYEE', '2024-07-15', 1, N'dismissed'),
 (N'u9', N'عمر الحارثي', N'Omar Al-Harthy', N'omar@hala-media.sa', N'omar', N'demo1234', N'EMPLOYEE', '2024-08-01', 1, N'working');
GO

INSERT INTO dbo.EmployeeProfiles (UserId, Specialty, HourlyRate, DailyRate, BaseSalary, AttendanceDays, AbsenceDays, NetSalary)
SELECT u.UserId, v.Specialty, v.HourlyRate, v.DailyRate, v.BaseSalary, v.AttendanceDays, v.AbsenceDays, v.NetSalary
FROM (VALUES
    (N'u3', N'VIDEO_EDITOR',      CAST(75 AS DECIMAL(18,2)), CAST(600 AS DECIMAL(18,2)), CAST(6000 AS DECIMAL(18,2)), 19, 1, CAST(5700 AS DECIMAL(18,2))),
    (N'u4', N'GRAPHIC_DESIGNER',  CAST(65 AS DECIMAL(18,2)), CAST(520 AS DECIMAL(18,2)), CAST(5000 AS DECIMAL(18,2)), 18, 2, CAST(4500 AS DECIMAL(18,2))),
    (N'u5', N'WEB_DEVELOPER',     CAST(90 AS DECIMAL(18,2)), CAST(720 AS DECIMAL(18,2)), CAST(7500 AS DECIMAL(18,2)), 20, 0, CAST(7500 AS DECIMAL(18,2))),
    (N'u6', N'VIDEO_EDITOR',      CAST(70 AS DECIMAL(18,2)), CAST(560 AS DECIMAL(18,2)), CAST(5500 AS DECIMAL(18,2)), 17, 3, CAST(4675 AS DECIMAL(18,2))),
    (N'u7', N'GRAPHIC_DESIGNER',  CAST(60 AS DECIMAL(18,2)), CAST(480 AS DECIMAL(18,2)), CAST(4500 AS DECIMAL(18,2)), 16, 4, CAST(3600 AS DECIMAL(18,2))),
    (N'u8', N'GRAPHIC_DESIGNER',  CAST(62 AS DECIMAL(18,2)), CAST(496 AS DECIMAL(18,2)), CAST(4800 AS DECIMAL(18,2)),  8, 2, CAST(3840 AS DECIMAL(18,2))),
    (N'u9', N'VIDEO_EDITOR',      CAST(72 AS DECIMAL(18,2)), CAST(576 AS DECIMAL(18,2)), CAST(5800 AS DECIMAL(18,2)), 18, 2, CAST(5220 AS DECIMAL(18,2)))
) AS v(PublicCode, Specialty, HourlyRate, DailyRate, BaseSalary, AttendanceDays, AbsenceDays, NetSalary)
INNER JOIN dbo.Users u ON u.PublicCode = v.PublicCode;
GO

INSERT INTO dbo.PayrollMonthSettings (YearMonth, WorkDays) VALUES ('2026-09', 22);
GO

INSERT INTO dbo.DailyAttendance (EmployeeId, AttendanceDate, Status, CheckInTime, Notes)
SELECT u.UserId, v.AttendanceDate, v.Status, v.CheckInTime, v.Notes
FROM (VALUES
    (N'u3', CAST('2026-09-25' AS DATE), N'present',  CAST('09:05' AS TIME(0)), N''),
    (N'u4', CAST('2026-09-25' AS DATE), N'late',     CAST('09:42' AS TIME(0)), N'ازدحام مروري'),
    (N'u5', CAST('2026-09-25' AS DATE), N'present',  CAST('08:55' AS TIME(0)), N''),
    (N'u6', CAST('2026-09-25' AS DATE), N'absent',   CAST(NULL AS TIME(0)),    N'إجازة مرضية'),
    (N'u7', CAST('2026-09-25' AS DATE), N'present',  CAST('09:10' AS TIME(0)), N''),
    (N'u8', CAST('2026-09-25' AS DATE), N'on_leave', CAST(NULL AS TIME(0)),    N'إجازة سنوية'),
    (N'u9', CAST('2026-09-25' AS DATE), N'present',  CAST('09:00' AS TIME(0)), N''),
    (N'u3', CAST('2026-09-26' AS DATE), N'present',  CAST('08:58' AS TIME(0)), N''),
    (N'u4', CAST('2026-09-26' AS DATE), N'present',  CAST('09:02' AS TIME(0)), N''),
    (N'u5', CAST('2026-09-26' AS DATE), N'late',     CAST('09:35' AS TIME(0)), N''),
    (N'u6', CAST('2026-09-26' AS DATE), N'present',  CAST('09:08' AS TIME(0)), N''),
    (N'u7', CAST('2026-09-26' AS DATE), N'absent',   CAST(NULL AS TIME(0)),    N'لم يحضر'),
    (N'u8', CAST('2026-09-26' AS DATE), N'on_leave', CAST(NULL AS TIME(0)),    N'إجازة سنوية'),
    (N'u9', CAST('2026-09-26' AS DATE), N'present',  CAST('09:12' AS TIME(0)), N''),
    (N'u3', CAST('2026-09-27' AS DATE), N'present',  CAST('09:00' AS TIME(0)), N''),
    (N'u4', CAST('2026-09-27' AS DATE), N'present',  CAST('09:04' AS TIME(0)), N''),
    (N'u5', CAST('2026-09-27' AS DATE), N'present',  CAST('08:50' AS TIME(0)), N''),
    (N'u6', CAST('2026-09-27' AS DATE), N'late',     CAST('09:50' AS TIME(0)), N'موعد شخصي'),
    (N'u7', CAST('2026-09-27' AS DATE), N'present',  CAST('09:15' AS TIME(0)), N''),
    (N'u8', CAST('2026-09-27' AS DATE), N'present',  CAST('09:07' AS TIME(0)), N''),
    (N'u9', CAST('2026-09-27' AS DATE), N'on_leave', CAST(NULL AS TIME(0)),    N'إذن رسمي')
) AS v(PublicCode, AttendanceDate, Status, CheckInTime, Notes)
INNER JOIN dbo.Users u ON u.PublicCode = v.PublicCode;
GO

INSERT INTO dbo.Clients (PublicCode, ContactName, CompanyName, Phone, Email, Status, TotalSpent, RemainingBalance, TotalOrders)
VALUES
 (N'cl-001', N'خالد النخيل', N'شركة النخيل للتجزئة', N'0501234567', N'khaled@nakheel.sa', N'VIP', 18500, 4250, 2),
 (N'cl-002', N'منى العربي', N'مطعم البيت العربي', N'0557654321', N'mona@alarabi.sa', N'Active', 12000, 5500, 1),
 (N'cl-003', N'ليلى الحسن', N'مجوهرات ليلى', N'0509876543', N'layla@jewels.sa', N'Active', 0, 5500, 1),
 (N'cl-004', N'د. سامر العلي', N'عيادة الأسنان التخصصية', N'0512345678', N'samir@dental.sa', N'VIP', 7500, 6500, 1),
 (N'cl-005', N'طارق الكود', N'أكاديمية الكود للتعليم', N'0534567890', N'tariq@codeacademy.sa', N'Inactive', 3200, 0, 1),
 (N'cl-006', N'سوبرماركت الواحة', N'الواحة', N'0523456789', NULL, N'Active', 0, 1900, 1),
 (N'cl-007', N'شركة التقنية الذكية', N'التقنية الذكية', N'0545678901', NULL, N'Active', 0, 20000, 1),
 (N'cl-008', N'فندق النجوم الخمس', N'فندق النجوم', N'0556789012', NULL, N'Active', 0, 9000, 1),
 (N'cl-009', N'متجر الورود', N'متجر الورود', N'0561112233', NULL, N'Active', 0, 2800, 1);
GO

INSERT INTO dbo.ServiceCatalog (PublicCode, NameAr, NameEn, IsEnabled, BasePrice, IconKey)
VALUES
 (N'svc-001', N'تصوير فيديو', N'Video Production', 1, 5000, N'Video'),
 (N'svc-002', N'تصميم جرافيك', N'Graphic Design', 1, 1500, N'Palette'),
 (N'svc-003', N'تطوير موقع', N'Web Development', 1, 8000, N'Code'),
 (N'svc-004', N'تصميم هوية', N'Brand Identity', 1, 4500, N'Briefcase'),
 (N'svc-005', N'إنتاج محتوى', N'Content Production', 1, 2000, N'FileText');
GO

INSERT INTO dbo.ServiceFormFields (ServiceId, FieldKey, LabelAr, SortOrder)
SELECT s.ServiceId, v.FieldKey, v.LabelAr, v.SortOrder
FROM (VALUES
    (N'svc-001', N'duration', N'مدة الفيديو (ثانية)', 1),
    (N'svc-001', N'footage', N'هل لديك لقطات جاهزة؟', 2),
    (N'svc-001', N'voiceover', N'هل تحتاج تعليقاً صوتياً؟', 3),
    (N'svc-001', N'audience', N'الجمهور المستهدف', 4),
    (N'svc-002', N'items', N'عدد القطع المطلوبة', 1),
    (N'svc-002', N'brand_guide', N'هل لديك دليل هوية بصرية؟', 2),
    (N'svc-002', N'format', N'الصيغ المطلوبة (PDF, AI, PNG)', 3),
    (N'svc-003', N'pages', N'عدد الصفحات', 1),
    (N'svc-003', N'booking', N'هل تحتاج نظام حجز؟', 2),
    (N'svc-003', N'payment', N'هل تحتاج بوابة دفع؟', 3),
    (N'svc-003', N'cms', N'هل تحتاج لوحة تحكم للمحتوى؟', 4),
    (N'svc-004', N'industry', N'المجال / القطاع', 1),
    (N'svc-004', N'competitors', N'المنافسون الرئيسيون', 2),
    (N'svc-004', N'deliverables', N'المواد المطلوبة', 3),
    (N'svc-005', N'posts_count', N'عدد المنشورات', 1),
    (N'svc-005', N'platforms', N'المنصات المستهدفة', 2),
    (N'svc-005', N'tone', N'أسلوب المحتوى', 3)
) AS v(ServiceCode, FieldKey, LabelAr, SortOrder)
INNER JOIN dbo.ServiceCatalog s ON s.PublicCode = v.ServiceCode;
GO

INSERT INTO dbo.Orders (PublicCode, ClientId, ServiceType, Description, Status, Priority, DueDate, CreatedAt, AdminNotes)
SELECT v.PublicCode, c.ClientId, v.ServiceType, v.Description, v.Status, v.Priority, v.DueDate, v.CreatedAt, v.AdminNotes
FROM (VALUES
    (N'ord-001', N'cl-001', N'تصوير فيديو', N'إنتاج 3 فيديوهات تسويقية لمنتجات الموسم الجديد', N'in_production', N'high', CAST('2026-09-28' AS DATE), CAST('2026-09-01' AS DATE), N''),
    (N'ord-002', N'cl-002', N'تصميم جرافيك', N'مواد تصميم إعلانية متكاملة للمطعم', N'client_review', N'urgent', CAST('2026-09-25' AS DATE), CAST('2026-08-20' AS DATE), N''),
    (N'ord-003', N'cl-003', N'تصميم هوية', N'تصميم هوية بصرية كاملة: شعار وبطاقات وأكياس', N'new_lead', N'medium', CAST('2026-10-15' AS DATE), CAST('2026-09-19' AS DATE), N''),
    (N'ord-004', N'cl-004', N'تطوير موقع', N'موقع إلكتروني متكامل مع نظام حجز المواعيد', N'in_production', N'high', CAST('2026-10-30' AS DATE), CAST('2026-09-05' AS DATE), N''),
    (N'ord-005', N'cl-005', N'إنتاج محتوى', N'تصميم 20 منشور لمنصات التواصل الاجتماعي', N'completed', N'low', CAST('2026-09-10' AS DATE), CAST('2026-08-25' AS DATE), N''),
    (N'ord-006', N'cl-006', N'تصميم جرافيك', N'مواد تسويقية: لافتات وفلايرز وقوائم طعام', N'internal_qa', N'high', CAST('2026-09-22' AS DATE), CAST('2026-09-08' AS DATE), N''),
    (N'ord-007', N'cl-007', N'تطوير موقع', N'منصة SaaS متكاملة مع لوحة تحكم للعملاء', N'quoted', N'medium', CAST('2026-11-20' AS DATE), CAST('2026-09-18' AS DATE), N''),
    (N'ord-008', N'cl-008', N'تصوير فيديو', N'فيلم ترويجي احترافي للفندق + 10 ريلز', N'in_production', N'urgent', CAST('2026-10-05' AS DATE), CAST('2026-09-10' AS DATE), N''),
    (N'ord-009', N'cl-009', N'تصميم جرافيك', N'تصميم كتالوج موسمي — أُلغي بناءً على طلب العميل', N'cancelled', N'low', CAST('2026-09-18' AS DATE), CAST('2026-09-08' AS DATE), N'تم الإلغاء قبل بدء التنفيذ')
) AS v(PublicCode, ClientCode, ServiceType, Description, Status, Priority, DueDate, CreatedAt, AdminNotes)
INNER JOIN dbo.Clients c ON c.PublicCode = v.ClientCode;
GO

INSERT INTO dbo.OrderFinancials (OrderId, TotalCost, DiscountAmount, DepositPaid, DepositAmount, DirectCosts, RemainingBalance)
SELECT o.OrderId, v.TotalCost, v.DiscountAmount, v.DepositPaid, v.DepositAmount, 0, v.RemainingBalance
FROM (VALUES
    (N'ord-001', CAST(8500 AS DECIMAL(18,2)), CAST(0 AS DECIMAL(18,2)), CAST(1 AS BIT), CAST(4250 AS DECIMAL(18,2)), CAST(4250 AS DECIMAL(18,2))),
    (N'ord-002', CAST(12000 AS DECIMAL(18,2)), CAST(500 AS DECIMAL(18,2)), CAST(1 AS BIT), CAST(6000 AS DECIMAL(18,2)), CAST(5500 AS DECIMAL(18,2))),
    (N'ord-003', CAST(5500 AS DECIMAL(18,2)), CAST(0 AS DECIMAL(18,2)), CAST(0 AS BIT), CAST(0 AS DECIMAL(18,2)), CAST(5500 AS DECIMAL(18,2))),
    (N'ord-004', CAST(15000 AS DECIMAL(18,2)), CAST(1000 AS DECIMAL(18,2)), CAST(1 AS BIT), CAST(7500 AS DECIMAL(18,2)), CAST(6500 AS DECIMAL(18,2))),
    (N'ord-005', CAST(3200 AS DECIMAL(18,2)), CAST(0 AS DECIMAL(18,2)), CAST(1 AS BIT), CAST(3200 AS DECIMAL(18,2)), CAST(0 AS DECIMAL(18,2))),
    (N'ord-006', CAST(4200 AS DECIMAL(18,2)), CAST(200 AS DECIMAL(18,2)), CAST(1 AS BIT), CAST(2100 AS DECIMAL(18,2)), CAST(1900 AS DECIMAL(18,2))),
    (N'ord-007', CAST(22000 AS DECIMAL(18,2)), CAST(2000 AS DECIMAL(18,2)), CAST(0 AS BIT), CAST(0 AS DECIMAL(18,2)), CAST(20000 AS DECIMAL(18,2))),
    (N'ord-008', CAST(18000 AS DECIMAL(18,2)), CAST(0 AS DECIMAL(18,2)), CAST(1 AS BIT), CAST(9000 AS DECIMAL(18,2)), CAST(9000 AS DECIMAL(18,2))),
    (N'ord-009', CAST(2800 AS DECIMAL(18,2)), CAST(0 AS DECIMAL(18,2)), CAST(0 AS BIT), CAST(0 AS DECIMAL(18,2)), CAST(2800 AS DECIMAL(18,2)))
) AS v(OrderCode, TotalCost, DiscountAmount, DepositPaid, DepositAmount, RemainingBalance)
INNER JOIN dbo.Orders o ON o.PublicCode = v.OrderCode;
GO

INSERT INTO dbo.OrderAssignments (OrderId, EmployeeId)
SELECT o.OrderId, u.UserId
FROM (VALUES
    (N'ord-001', N'u3'),
    (N'ord-001', N'u6'),
    (N'ord-002', N'u4'),
    (N'ord-004', N'u5'),
    (N'ord-005', N'u4'),
    (N'ord-006', N'u4'),
    (N'ord-006', N'u7'),
    (N'ord-006', N'u8'),
    (N'ord-008', N'u3'),
    (N'ord-008', N'u9')
) AS v(OrderCode, UserCode)
INNER JOIN dbo.Orders o ON o.PublicCode = v.OrderCode
INNER JOIN dbo.Users u ON u.PublicCode = v.UserCode;
GO

INSERT INTO dbo.OrderRevisions (OrderId, RevisionDate, Note)
SELECT o.OrderId, v.RevisionDate, v.Note
FROM (VALUES
    (N'ord-001', CAST('2026-09-10' AS DATE), N'طلب تغيير الموسيقى التصويرية'),
    (N'ord-001', CAST('2026-09-15' AS DATE), N'تعديل الألوان لتتوافق مع الهوية البصرية'),
    (N'ord-006', CAST('2026-09-18' AS DATE), N'تعديل الخطوط')
) AS v(OrderCode, RevisionDate, Note)
INNER JOIN dbo.Orders o ON o.PublicCode = v.OrderCode;
GO

INSERT INTO dbo.Tasks (PublicCode, OrderId, AssignedEmployeeId, Title, Priority, Status, EstimatedHours, LoggedHours, DueDate, DeliverableLink, Notes)
SELECT v.PublicCode, o.OrderId, u.UserId, v.Title, v.Priority, v.Status, v.EstimatedHours, v.LoggedHours, v.DueDate, v.DeliverableLink, v.Notes
FROM (VALUES
    (N'tsk-001', N'ord-001', N'u3', N'مونتاج الفيديو التسويقي الأول - النخيل', N'urgent', N'in_progress', CAST(8 AS DECIMAL(9,2)), CAST(5.5 AS DECIMAL(9,2)), CAST('2026-09-23' AS DATE), CAST(NULL AS NVARCHAR(500)), N'تم الانتهاء من الخام، الآن في مرحلة التلوين'),
    (N'tsk-002', N'ord-001', N'u6', N'تصميم مقدمة الفيديو - النخيل', N'high', N'todo', CAST(4 AS DECIMAL(9,2)), CAST(0 AS DECIMAL(9,2)), CAST('2026-09-24' AS DATE), CAST(NULL AS NVARCHAR(500)), N''),
    (N'tsk-003', N'ord-004', N'u5', N'تطوير صفحة الحجز - عيادة الأسنان', N'high', N'in_progress', CAST(16 AS DECIMAL(9,2)), CAST(9 AS DECIMAL(9,2)), CAST('2026-10-10' AS DATE), N'https://github.com/hala-media/dental-website', N'الـ API للحجز جاهز'),
    (N'tsk-004', N'ord-006', N'u4', N'تصميم منشورات انستغرام - الواحة', N'high', N'in_review', CAST(6 AS DECIMAL(9,2)), CAST(6 AS DECIMAL(9,2)), CAST('2026-09-21' AS DATE), N'https://figma.com/file/abc123', N'جاهز للمراجعة، 12 منشور مكتمل'),
    (N'tsk-005', N'ord-006', N'u7', N'تصميم لافتات خارجية - الواحة', N'high', N'in_progress', CAST(5 AS DECIMAL(9,2)), CAST(3 AS DECIMAL(9,2)), CAST('2026-09-22' AS DATE), CAST(NULL AS NVARCHAR(500)), N''),
    (N'tsk-006', N'ord-008', N'u3', N'مونتاج ريلز الفندق - النجوم الخمس', N'urgent', N'todo', CAST(12 AS DECIMAL(9,2)), CAST(0 AS DECIMAL(9,2)), CAST('2026-09-30' AS DATE), CAST(NULL AS NVARCHAR(500)), N''),
    (N'tsk-007', N'ord-008', N'u6', N'مونتاج الفيلم الترويجي - النجوم الخمس', N'urgent', N'todo', CAST(20 AS DECIMAL(9,2)), CAST(0 AS DECIMAL(9,2)), CAST('2026-10-03' AS DATE), CAST(NULL AS NVARCHAR(500)), N''),
    (N'tsk-008', N'ord-005', N'u4', N'تصميم منشورات أكاديمية الكود', N'low', N'completed', CAST(8 AS DECIMAL(9,2)), CAST(7.5 AS DECIMAL(9,2)), CAST('2026-09-10' AS DATE), N'https://drive.google.com/folder/xyz', N'تم التسليم والموافقة'),
    (N'tsk-009', N'ord-006', N'u8', N'تصميم الهوية المرئية - الواحة', N'high', N'in_progress', CAST(6 AS DECIMAL(9,2)), CAST(2 AS DECIMAL(9,2)), CAST('2026-09-22' AS DATE), CAST(NULL AS NVARCHAR(500)), N'العمل على دليل الألوان والخطوط'),
    (N'tsk-010', N'ord-008', N'u9', N'مونتاج الريلز الإضافية - النجوم الخمس', N'urgent', N'in_progress', CAST(10 AS DECIMAL(9,2)), CAST(4 AS DECIMAL(9,2)), CAST('2026-10-01' AS DATE), CAST(NULL AS NVARCHAR(500)), N'تم الانتهاء من 4 ريلز')
) AS v(PublicCode, OrderCode, UserCode, Title, Priority, Status, EstimatedHours, LoggedHours, DueDate, DeliverableLink, Notes)
INNER JOIN dbo.Orders o ON o.PublicCode = v.OrderCode
INNER JOIN dbo.Users u ON u.PublicCode = v.UserCode;
GO

INSERT INTO dbo.Equipment (PublicCode, Name, Category, SerialNumber, Status)
VALUES
 (N'eq-001', N'Sony FX3', N'Cameras', N'FX3-8821', N'operational'),
 (N'eq-002', N'Canon R5', N'Cameras', N'R5-4410', N'checked_out'),
 (N'eq-003', N'Sony 24-70 GM II', N'Lenses', N'GM-2470', N'checked_out'),
 (N'eq-004', N'Sigma 35mm Art', N'Lenses', N'SG-35A', N'operational'),
 (N'eq-005', N'Aputure 600d Pro', N'Lighting', N'AP-600D', N'operational'),
 (N'eq-006', N'Godox SL60', N'Lighting', N'GX-SL60', N'maintenance'),
 (N'eq-007', N'Rode Wireless GO II', N'Audio', N'RD-WG2', N'checked_out'),
 (N'eq-008', N'DJI Mini 4 Pro', N'Drones', N'DJ-M4P', N'operational'),
 (N'eq-009', N'SmallRig Cage FX3', N'Accessories', N'SR-CAGE', N'lost'),
 (N'eq-010', N'Tripod Manfrotto 055', N'Accessories', N'MF-055', N'operational');
GO

INSERT INTO dbo.EquipmentReservations (EquipmentId, OrderId, AssignedEmployeeId, CheckoutDate, ReturnDate)
SELECT e.EquipmentId, o.OrderId, u.UserId, v.CheckoutDate, v.ReturnDate
FROM (VALUES
    (N'eq-002', N'ord-001', N'u3', CAST('2026-09-20' AS DATE), CAST('2026-09-29' AS DATE)),
    (N'eq-003', N'ord-008', N'u9', CAST('2026-09-22' AS DATE), CAST('2026-10-05' AS DATE)),
    (N'eq-007', N'ord-001', N'u3', CAST('2026-09-20' AS DATE), CAST('2026-09-29' AS DATE))
) AS v(EquipCode, OrderCode, UserCode, CheckoutDate, ReturnDate)
INNER JOIN dbo.Equipment e ON e.PublicCode = v.EquipCode
INNER JOIN dbo.Orders o ON o.PublicCode = v.OrderCode
INNER JOIN dbo.Users u ON u.PublicCode = v.UserCode;
GO

INSERT INTO dbo.Expenses (PublicCode, Title, Category, Amount, ExpenseDate, IsRecurring, Notes)
VALUES
 (N'exp-001', N'Adobe Creative Cloud', N'برمجيات', 850, '2026-09-01', 1, NULL),
 (N'exp-002', N'Midjourney Pro', N'برمجيات', 300, '2026-09-01', 1, NULL),
 (N'exp-003', N'إيجار المكتب', N'مصاريف ثابتة', 8000, '2026-09-01', 1, NULL),
 (N'exp-004', N'Frame.io', N'برمجيات', 450, '2026-09-05', 1, NULL),
 (N'exp-005', N'معدات تصوير جديدة', N'معدات', 12000, '2026-09-12', 0, NULL),
 (N'exp-006', N'Figma Pro', N'برمجيات', 200, '2026-09-01', 1, NULL);
GO

INSERT INTO dbo.Payouts (PublicCode, RecipientName, RecipientType, Amount, OrderId, Status, DueDate)
SELECT v.PublicCode, v.RecipientName, v.RecipientType, v.Amount, o.OrderId, v.Status, v.DueDate
FROM (VALUES
    (N'pay-003', N'نورة السالم', N'موظف', CAST(3750 AS DECIMAL(18,2)), N'ord-001', N'paid', CAST('2026-09-15' AS DATE)),
    (N'pay-004', N'أحمد الزهراني', N'موظف', CAST(2800 AS DECIMAL(18,2)), N'ord-005', N'paid', CAST('2026-09-10' AS DATE)),
    (N'pay-006', N'فهد المطيري', N'موظف', CAST(3200 AS DECIMAL(18,2)), N'ord-001', N'pending', CAST('2026-09-30' AS DATE)),
    (N'pay-007', N'لينا القحطاني', N'موظف', CAST(5600 AS DECIMAL(18,2)), N'ord-004', N'pending', CAST('2026-10-05' AS DATE))
) AS v(PublicCode, RecipientName, RecipientType, Amount, OrderCode, Status, DueDate)
INNER JOIN dbo.Orders o ON o.PublicCode = v.OrderCode;
GO

INSERT INTO dbo.Invoices (InvoiceNumber, OrderId, ClientId, Amount, PaidAmount, RemainingAmount, DueDate, PaymentStatus)
SELECT v.InvoiceNumber, o.OrderId, c.ClientId, v.Amount, v.PaidAmount, v.RemainingAmount, v.DueDate, v.PaymentStatus
FROM (VALUES
    (N'INV-2026-014', N'ord-001', N'cl-001', CAST(8500 AS DECIMAL(18,2)), CAST(4250 AS DECIMAL(18,2)), CAST(4250 AS DECIMAL(18,2)), CAST('2026-09-30' AS DATE), N'partial'),
    (N'INV-2026-015', N'ord-002', N'cl-002', CAST(11500 AS DECIMAL(18,2)), CAST(6000 AS DECIMAL(18,2)), CAST(5500 AS DECIMAL(18,2)), CAST('2026-09-20' AS DATE), N'overdue'),
    (N'INV-2026-016', N'ord-004', N'cl-004', CAST(14000 AS DECIMAL(18,2)), CAST(7500 AS DECIMAL(18,2)), CAST(6500 AS DECIMAL(18,2)), CAST('2026-10-15' AS DATE), N'partial'),
    (N'INV-2026-010', N'ord-005', N'cl-005', CAST(3200 AS DECIMAL(18,2)), CAST(3200 AS DECIMAL(18,2)), CAST(0 AS DECIMAL(18,2)), CAST('2026-09-10' AS DATE), N'paid')
) AS v(InvoiceNumber, OrderCode, ClientCode, Amount, PaidAmount, RemainingAmount, DueDate, PaymentStatus)
INNER JOIN dbo.Orders o ON o.PublicCode = v.OrderCode
INNER JOIN dbo.Clients c ON c.PublicCode = v.ClientCode;
GO

INSERT INTO dbo.InvoiceItems (InvoiceId, Description, Quantity, UnitPrice)
SELECT i.InvoiceId, v.Description, v.Quantity, v.UnitPrice
FROM (VALUES
    (N'INV-2026-014', N'إنتاج 3 فيديوهات تسويقية', 1, CAST(8500 AS DECIMAL(18,2))),
    (N'INV-2026-015', N'مواد تصميم إعلانية', 1, CAST(12000 AS DECIMAL(18,2))),
    (N'INV-2026-015', N'خصم', 1, CAST(-500 AS DECIMAL(18,2))),
    (N'INV-2026-016', N'موقع مع نظام حجز', 1, CAST(15000 AS DECIMAL(18,2))),
    (N'INV-2026-016', N'خصم', 1, CAST(-1000 AS DECIMAL(18,2))),
    (N'INV-2026-010', N'20 منشور سوشيال', 20, CAST(160 AS DECIMAL(18,2)))
) AS v(InvoiceNumber, Description, Quantity, UnitPrice)
INNER JOIN dbo.Invoices i ON i.InvoiceNumber = v.InvoiceNumber;
GO

INSERT INTO dbo.ContractTemplates (PublicCode, Title, ContractType, Body)
VALUES
 (N'tpl-prod', N'اتفاقية إنتاج', N'Production Agreement', N'اتفاق بين هالة ميديا والعميل لتقديم خدمات الإنتاج البصري وفق الجدول والمخرجات المتفق عليها.'),
 (N'tpl-inf', N'عقد حملة مؤثرة', N'Influencer Campaign Contract', N'ينظم التعاون مع صناع المحتوى، عدد القطع، مواعيد النشر، وحقوق الاستخدام.'),
 (N'tpl-ret', N'عقد ريتينر', N'Retainer Contract', N'اتفاق شهري لإدارة المحتوى والتصميم بعدد ساعات أو قطع محددة مسبقاً.');
GO

INSERT INTO dbo.SignedContracts (PublicCode, ClientId, TemplateId, Title, ContractType, IsSigned, SignedDate)
SELECT v.PublicCode, c.ClientId, t.TemplateId, v.Title, v.ContractType, 1, v.SignedDate
FROM (VALUES
    (N'ct-001', N'cl-001', N'tpl-prod', N'اتفاقية إنتاج 2026', N'Production Agreement', CAST('2026-01-10' AS DATE)),
    (N'ct-002', N'cl-002', N'tpl-inf', N'عقد حملة مؤثرة', N'Influencer Campaign Contract', CAST('2026-08-18' AS DATE)),
    (N'ct-003', N'cl-004', N'tpl-prod', N'عقد تطوير موقع', N'Production Agreement', CAST('2026-09-05' AS DATE)),
    (N'ct-004', N'cl-005', N'tpl-ret', N'عقد ريتينر محتوى', N'Retainer Contract', CAST('2026-08-24' AS DATE))
) AS v(PublicCode, ClientCode, TemplateCode, Title, ContractType, SignedDate)
INNER JOIN dbo.Clients c ON c.PublicCode = v.ClientCode
INNER JOIN dbo.ContractTemplates t ON t.PublicCode = v.TemplateCode;
GO

INSERT INTO dbo.ClientPayments (PublicCode, ClientId, PaymentDate, Amount, Method)
SELECT v.PublicCode, c.ClientId, v.PaymentDate, v.Amount, v.Method
FROM (VALUES
    (N'pay-c1', N'cl-001', CAST('2026-09-02' AS DATE), CAST(4250 AS DECIMAL(18,2)), N'تحويل بنكي'),
    (N'pay-c2', N'cl-001', CAST('2026-03-20' AS DATE), CAST(10000 AS DECIMAL(18,2)), N'شبكة'),
    (N'pay-c3', N'cl-002', CAST('2026-08-22' AS DATE), CAST(6000 AS DECIMAL(18,2)), N'تحويل بنكي'),
    (N'pay-c4', N'cl-004', CAST('2026-09-06' AS DATE), CAST(7500 AS DECIMAL(18,2)), N'تحويل بنكي'),
    (N'pay-c5', N'cl-005', CAST('2026-09-10' AS DATE), CAST(3200 AS DECIMAL(18,2)), N'كاش')
) AS v(PublicCode, ClientCode, PaymentDate, Amount, Method)
INNER JOIN dbo.Clients c ON c.PublicCode = v.ClientCode;
GO

INSERT INTO dbo.Notifications (PublicCode, Type, Title, Message, RelativeTimeLabel, IsRead)
VALUES
 (N'n1', N'warning', N'طلب متأخر', N'طلب مطعم البيت العربي متأخر عن الموعد المحدد', N'10 دقائق', 0),
 (N'n2', N'info', N'طلب جديد', N'مجوهرات ليلى أرسلت طلباً جديداً لتصميم الهوية', N'45 دقيقة', 0),
 (N'n3', N'success', N'تم الاستلام', N'أكاديمية الكود وافقت على التسليم النهائي', N'2 ساعة', 1),
 (N'n4', N'warning', N'طلب مراجعة', N'سوبرماركت الواحة طلب تعديلات على التصميم', N'3 ساعات', 1),
 (N'n5', N'info', N'موظف جديد', N'تم إضافة محمود الشمري كمصمم جرافيك', N'أمس', 1);
GO

INSERT INTO dbo.PortfolioWorks (PublicCode, Title, Details, VideoUrl, ImageUrl, CssClass, SortOrder)
VALUES
 (N'sirocco', N'عمل فيديو 01', N'لقطة قصيرة من أرشيف هلها.', N'/video/1788685717360-r3hc5f.mp4', N'', N'video-1', 1),
 (N'bayt', N'عمل فيديو 02', N'لقطة قصيرة من أرشيف هلها.', N'/video/1788814285055-b1dk7d.mp4', N'', N'video-2', 2),
 (N'nomad', N'عمل فيديو 03', N'لقطة قصيرة من أرشيف هلها.', N'/video/1788815915320-0b8ipf.mp4', N'', N'video-3', 3),
 (N'khayma', N'عمل فيديو 04', N'لقطة قصيرة من أرشيف هلها.', N'/video/1788815975401-1g5k6r.mp4', N'', N'video-4', 4),
 (N'wadi', N'عمل فيديو 05', N'لقطة قصيرة من أرشيف هلها.', N'/video/1788816353326-jv6nm.mp4', N'', N'video-5', 5);
GO

INSERT INTO dbo.SiteBloggers (PublicCode, FullName, Niche, Label, Description, ImageUrl, SampleVideoUrl, VideoPrice)
VALUES
 (N'adel', N'عادل', N'أسلوب وحضور', N'حضور هادئ وصورة لها طابع', N'صانع محتوى يهتم بالتفاصيل، الإضاءة، والحضور البصري الذي يبقى في الذاكرة.', N'/Images/1788226481371_1e639c98_62cf_40ad_b550_15200da50a7b.webp', N'', 7150),
 (N'moaz', N'معاذ', N'حديث وكاميرا', N'صوت قريب من الناس', N'يقدّم المحتوى بصدق ووضوح، ويجعل الكاميرا مساحة للحديث لا للاستعراض.', N'/Images/1788226498435_WhatsApp_Image_2026_08_31_at_9.30.54_PM.webp', N'', 7150),
 (N'hamza', N'حمزة', N'طاقة يومية', N'حركة وضوء وشارع', N'يحب المشاهد الحية، والقصص التي تبدأ من الشارع وتنتهي عند الجمهور.', N'/Images/1788340426787_cropped.webp', N'', 7150),
 (N'habiba', N'حبيبة', N'جمال وأسلوب', N'أناقة تشبه صاحبتها', N'صوت هادئ في عالم الصورة، يختار اللون والإطار كما يختار كلماته.', N'/Images/1788340327682_cropped.webp', N'', 7150),
 (N'yasser', N'ياسر', N'سفر وحضور', N'لحظة فيها ضوء', N'يلتقط الإيقاع الهادئ للأماكن والوجوه، ويعيد روايتها بعدسة دافئة.', N'/Images/1788226510379_IMG_20260703_WA0026.jpg.webp', N'', 7150);
GO

INSERT INTO dbo.DigitalProducts (PublicCode, Title, Hint, Price, IconKey)
VALUES
 (N'app', N'تطبيق', N'تجربة على الموبايل', 32500, N'app'),
 (N'website', N'موقع إلكتروني', N'واجهة سريعة وواضحة', 13000, N'website'),
 (N'menu', N'منيو إلكتروني', N'قائمة تُفتح في ثانية', 6500, N'menu');
GO

INSERT INTO dbo.PhotoPackages (PublicCode, Name, Details, Price, ImageUrl)
VALUES
 (N'photo-default', N'جلسة تصوير فوتوغرافي', N'جلسة تصوير احترافية للمنتجات والمحل أو المطعم أو المكان.', 1300, N'');
GO
