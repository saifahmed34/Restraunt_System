# Restaurant App Backend (Microservices)

This repository contains the backend services for the **Restaurant App**, built using a **Microservices Architecture** and **Clean Architecture** principles in .NET. It powers the React frontend by providing scalable, decoupled APIs for authentication, menu management, and order processing.

## 🚀 Technologies Used
- **Framework:** .NET 10 (C#)
- **API Gateway:** YARP (Yet Another Reverse Proxy)
- **Database:** SQL Server
- **ORM:** Entity Framework Core
- **Authentication:** JWT (JSON Web Tokens) & BCrypt for password hashing
- **Mapping:** Mapster
- **Documentation:** Swagger / OpenAPI

## 🏗️ Architecture & Services

The application is structured into several independent microservices, each following Clean Architecture (Core, Application, Infrastructure, and API layers):

* **ApiGateway**: Serves as the single entry point for the frontend, routing all incoming requests to the appropriate backend microservices using YARP.
* **AuthService**: Handles user registration, login, and JWT generation.
* **MenuService**: Manages the restaurant's menu items, categories, and pricing.
* **OrderService**: Processes customer orders, cart management, and tracks order status.

## 📂 Project Structure (Clean Architecture)
Each microservice is divided into the following layers to maintain separation of concerns:
* **API**: The entry point of the service (Controllers, Minimal APIs, Dependency Injection setup).
* **Application**: Contains the business use cases, interfaces, and DTOs.
* **Core / Domain**: The heart of the service containing domain entities and core business logic.
* **Infrastructure**: Handles external concerns like Database Contexts (EF Core), Migrations, and external API integrations.

## ⚙️ Getting Started

### Prerequisites
* [.NET SDK](https://dotnet.microsoft.com/download) (Version 10.0 or later)
* SQL Server (LocalDB or an active instance)
* IDE: Visual Studio, VS Code, or Rider

### Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   ```
2. **Database Configuration:**
   Update the `DefaultConnection` string in the `appsettings.json` (or `appsettings.Development.json`) for each service's API project (`AuthService.API`, `MenuService.API`, etc.) to point to your local SQL Server instance.
   
3. **Apply Migrations:**
   Navigate to the Infrastructure layer of each service (or run from the API layer using the EF Core CLI) and update the database:
   ```bash
   cd AuthService/AuthService.API
   dotnet ef database update
   ```
   *(Repeat for MenuService and OrderService as needed)*

4. **Run the Application:**
   You can run the entire solution using your IDE's multiple-startup-projects feature, or by running each API project via CLI. Ensure the **ApiGateway** is running, as the frontend will communicate through it.
   ```bash
   dotnet run --project ApiGateway/ApiGateway.csproj
   dotnet run --project AuthService/AuthService.API/AuthService.API.csproj
   # ... run other services
   ```

## 🔐 Authentication
The system uses stateless JWT authentication. Clients must authenticate via the `AuthService` to receive a token, which must then be passed in the `Authorization` header (`Bearer <token>`) for protected endpoints in other services.

## 📚 API Documentation
Each individual microservice integrates **Swagger UI** for easy API discovery and testing. When running a service locally in Development mode, you can navigate to `/swagger` to view and interact with the endpoints.
