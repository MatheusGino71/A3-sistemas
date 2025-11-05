# ZENIT Anti-Fraud System

## Project Overview

ZENIT is a cutting-edge anti-fraud system designed to mitigate the risks associated with PIX transactions. By leveraging advanced technologies and methodologies, ZENIT aims to provide a robust, secure, and efficient solution to users navigating the complexities of digital payments.

## Problem Statement

The proliferation of digital payment systems such as PIX has led to an increase in fraud vulnerabilities. ZENIT addresses these vulnerabilities by employing a multi-faceted approach to fraud detection and prevention, ensuring users are protected from potential threats.

## Three-Pillar Solution Architecture
1. **Authentication**  
   Secure user access through industry-standard authentication protocols.  
2. **Fraud Detection**  
   Real-time monitoring and reporting systems to identify suspicious transactions.  
3. **Risk Analysis**  
   Comprehensive analysis of transaction data to assess risk factors and prevent fraud.

## Detailed Functionality List
- **Authentication**: Secure login and user management.  
- **Fraud Reports**: Generate detailed reports on fraudulent activities.  
- **Risk Analysis**: Analytical tools to assess transaction risks.  
- **Notifications**: Alerts and notifications for suspicious activity.  
- **Dashboard**: User-friendly interface to monitor transactions in real-time.  
- **PWA**: Progressive Web App for seamless user experience.  
- **Security**: Implementing best practices for data protection.  
- **Monitoring**: Continuous system monitoring to ensure operational integrity.

## Architecture Diagrams
- **Current Node.js + SQLite Architecture**:  
  ![Node.js + SQLite Architecture](path/to/node-sqlite-diagram.png)  
- **Future Java Microservices Architecture**:  
  ![Java Microservices Architecture](path/to/java-microservices-diagram.png)

## Complete Technology Stack Comparison Table
| Technology           | Description                           |
|---------------------|---------------------------------------|
| Node.js             | JavaScript runtime for server-side   |
| SQLite              | Lightweight database engine           |
| Java                | Object-oriented programming           |
| PostgreSQL          | Object-relational database            |
| Docker              | Containerization platform             |
| Prometheus          | Monitoring system                     |
| Grafana             | Visualization tool for metrics        |

## Installation Prerequisites & Setup Instructions
1. Install Node.js (version x.x.x)  
2. Install SQLite (version x.x.x)  
3. Clone the repository:  
   ```bash  
   git clone https://github.com/MatheusGino71/A3-sistemas.git  
   ```  
4. Navigate to the project directory:  
   ```bash  
   cd A3-sistemas  
   ```  
5. Install dependencies:  
   ```bash  
   npm install  
   ```  
6. Set up your database configuration in `.env`.  

## Execution Commands
### Manual Execution  
   ```bash  
   npm start  
   ```  
### Docker Execution  
   ```bash  
   docker-compose up  
   ```  

## Complete API Documentation
### Endpoints
- **Authentication**  
   - POST `/api/auth/login` - Login a user  
   - POST `/api/auth/register` - Register a new user  
- **Reports**  
   - GET `/api/reports` - Retrieve fraud reports  
   - POST `/api/reports` - Create a new fraud report  
- **Risk Analysis**  
   - GET `/api/risk` - Analyze transaction risks  
- **Notifications**  
   - GET `/api/notifications` - Retrieve notifications  

### Rate Limiting  
   Rate limits are implemented to prevent abuse of the API. Standard request limits are 1000 requests per hour.

## Testing Information
- **E2E Testing**: Use Playwright for end-to-end testing  
- **Unit Testing**: Use JUnit for unit testing classes and methods.  

## Monitoring Setup
- **Prometheus**: For collecting metrics.  
- **Grafana**: For visualizing the collected data.

## Security Implementations
- **JWT**: For secure authentication token generation  
- **Rate Limiting**: To prevent abuse  
- **Validation**: Input validation to avoid malicious data  
- **Helmet**: For setting HTTP headers for security  
- **Bcrypt**: For password hashing  

## Full Project Structure Tree
```
A3-sistemas/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
├── tests/
├── .env
├── package.json
└── README.md
```

## CI/CD Pipeline Details
- Automated testing with each pull request.  
- Continuous deployment to production with Docker containers.

## Contribution Guidelines
We welcome contributions! Please follow these steps:  
1. Fork the repo  
2. Create a new branch  
3. Make your changes  
4. Create a pull request  

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author
Matheus Gino

# Dashboard Features
- **Real-time Analytics**: Live updates on transaction status.  
- **User-Friendly Design**: Intuitive interface for easy navigation.  
- **Responsive Design**: Optimized for various device sizes.

## Design System
- **Color Palette**:  
  | Color Name  | Hex Value  |
  |-------------|------------|
  | Primary     | #003366    |
  | Secondary   | #FFCC00    |

- **Responsiveness Breakpoints**:  
  - Mobile:  ≤ 600px  
  - Tablet:  ≥ 601px and ≤ 960px  
  - Desktop: ≥ 961px

## API Integration Examples
- Sample code for API calls to authenticate and post reports.

## Microservices CQRS Architecture
- Description and diagram illustrating the Command Query Responsibility Segregation approach.

## PostgreSQL Setup
- Step-by-step guide for PostgreSQL installation and configuration.

## Azure Deployment Guide with Container Instances
- How to deploy the application on Azure using container instances.

## Production Considerations
- Best practices and recommendations for operating ZENIT in production.