# Restaurant Microservices Backend

A scalable, decoupled backend infrastructure for a Restaurant application built using **.NET 10**, **C#**, and **Microservices Architecture**. This repository contains the server-side code that powers the React frontend, utilizing **Clean Architecture** principles and an **API Gateway** pattern.

## Features

- **API Gateway Routing:** Centralized entry point using YARP (Yet Another Reverse Proxy) for seamless request routing to microservices.
- **Clean Architecture:** Strict separation of concerns (Core, Application, Infrastructure, API) for maintainability and testability.
- **Microservices-based:** Independent deployment and development for Auth, Menu, and Order domains.
- **Stateless Authentication:** JWT-based authentication and authorization using BCrypt for password hashing.
- **Object Mapping:** High-performance DTO mapping using Mapster.
- **Interactive Documentation:** Auto-generated OpenAPI (Swagger) documentation for all microservices.

## Tech Stack

- **Framework:** .NET 10 (C#)
- **Database:** SQL Server
- **ORM:** Entity Framework Core
- **API Gateway:** YARP
- **Authentication:** JWT Bearer & BCrypt.Net-Next
- **Mapping:** Mapster
- **API Documentation:** Swashbuckle.AspNetCore (Swagger)

## Project Structure

The solution (`Restraunt app.sln`) is divided into an API Gateway and three distinct microservices, each following Clean Architecture.

```text
Server Side/
├── ApiGateway/                  # YARP Reverse Proxy
├── AuthService/                 # Handles Users & JWT Generation
│   ├── AuthService.API          # Controllers & Dependency Injection
│   ├── AuthService.Application  # Business Logic & DTOs
│   ├── AuthService.Core         # Domain Entities & Interfaces
│   └── AuthService.Infrastructure # EF Core Contexts & External Services
├── MenuService/                 # Manages Restaurant Menu Items
│   ├── MenuService.API
│   └── ... (Clean Architecture Layers)
└── OrderService/                # Handles Customer Orders
    ├── OrderService.API
    └── ... (Clean Architecture Layers)
```

## Installation & Setup Instructions

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server (LocalDB, Express, or Docker instance)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/restaurant-microservices.git
cd restaurant-microservices/"Server Side"/"Restraunt app"
```

### 2. Configure Environment Variables
Update the `appsettings.json` or `appsettings.Development.json` in the **API** project of each microservice (`AuthService.API`, `MenuService.API`, `OrderService.API`):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RestaurantDb;Trusted_Connection=True;MultipleActiveResultSets=true;Encrypt=False"
  },
  "JwtSettings": {
    "Secret": "your_super_secret_jwt_key_here",
    "Issuer": "RestaurantApp",
    "Audience": "RestaurantAppUsers",
    "ExpiryMinutes": 60
  }
}
```
*(Note: Ensure the YARP configuration in `ApiGateway/appsettings.json` points to the correct local ports of your microservices).*

### 3. Apply Database Migrations
Run Entity Framework migrations to generate your SQL Server database tables. For each service, run the following from the root solution folder:

```bash
dotnet ef database update --project AuthService/AuthService.Infrastructure --startup-project AuthService/AuthService.API
dotnet ef database update --project MenuService/MenuService.Infrastructure --startup-project MenuService/MenuService.API
```

## How to Run the Project

To run the full backend environment locally, you must start the API Gateway and all microservices.

**Using the .NET CLI:**
Open multiple terminal windows or use a bash script to run the services:
```bash
dotnet run --project ApiGateway/ApiGateway.csproj
dotnet run --project AuthService/AuthService.API/AuthService.API.csproj
dotnet run --project MenuService/MenuService.API/MenuService.API.csproj
dotnet run --project OrderService/OrderService.API/OrderService.API.csproj
```

**Using Visual Studio:**
1. Right-click the Solution -> **Set Startup Projects**.
2. Select **Multiple startup projects**.
3. Set the action to **Start** for `ApiGateway`, `AuthService.API`, `MenuService.API`, and `OrderService.API`.
4. Press `F5`.

## API Endpoints

Once the microservices are running, you can interact with the endpoints. Standard routing via the API Gateway is formatted as `http://localhost:<GatewayPort>/api/<service>/...`.

* **Auth Service:** `/api/auth/register`, `/api/auth/login`
* **Menu Service:** `/api/menu` (GET, POST, PUT, DELETE)
* **Order Service:** `/api/orders` (GET, POST, PUT)

*For comprehensive endpoint details, payloads, and testing, visit the Swagger UI for each service (e.g., `http://localhost:<ServicePort>/swagger`).*

## Usage Examples

**Authenticating a User:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
```

**Fetching the Menu:**
```bash
curl -X GET http://localhost:5000/api/menu \
     -H "Authorization: Bearer <Your_JWT_Token>"
```

## Future Improvements
- [ ] Implement Frontend Using React
- [ ] Implement Redis for caching frequently accessed menu items.
- [ ] Add a message broker (RabbitMQ/Kafka) for asynchronous communication (e.g., Order created -> Notify kitchen).
- [ ] Containerize services using Docker and Docker Compose for easier local development.
- [ ] Implement integration and unit tests using xUnit and Moq.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
