# Arquitetura do Sistema - Sistema de Adoção Responsável

## 1. Diagrama de Arquitetura Geral

```mermaid
graph TB
    subgraph "Cliente"
        WEB[Web Browser]
        MOBILE[Mobile App]
    end

    subgraph "Load Balancer"
        LB[Nginx/HAProxy]
    end

    subgraph "Frontend Layer"
        REACT[React App<br/>Vite + Material-UI]
        MOBILE_APP[React Native App]
    end

    subgraph "API Gateway"
        GATEWAY[API Gateway<br/>Rate Limiting<br/>Authentication]
    end

    subgraph "Backend Services"
        AUTH[Auth Service<br/>JWT + bcrypt]
        API[Main API<br/>Node.js + Express]
        SOCKET[Socket.IO<br/>Real-time Chat]
        UPLOAD[File Upload Service<br/>Multer + AWS S3]
        NOTIFICATION[Notification Service<br/>Push + Email]
    end

    subgraph "Database Layer"
        POSTGRES[(PostgreSQL<br/>Main Database)]
        REDIS[(Redis<br/>Cache + Sessions)]
        MONGO[(MongoDB<br/>Logs + Analytics)]
    end

    subgraph "External Services"
        EMAIL[Email Service<br/>SendGrid/SES]
        SMS[SMS Service<br/>Twilio]
        MAPS[Maps API<br/>Google Maps]
        PAYMENT[Payment Gateway<br/>Stripe/PagSeguro]
        STORAGE[Cloud Storage<br/>AWS S3/Cloudinary]
    end

    subgraph "Infrastructure"
        DOCKER[Docker Containers]
        K8S[Kubernetes Cluster]
        MONITOR[Monitoring<br/>Prometheus + Grafana]
        LOGS[Centralized Logging<br/>ELK Stack]
    end

    %% Connections
    WEB --> LB
    MOBILE --> LB
    LB --> REACT
    LB --> MOBILE_APP
    
    REACT --> GATEWAY
    MOBILE_APP --> GATEWAY
    
    GATEWAY --> AUTH
    GATEWAY --> API
    GATEWAY --> SOCKET
    GATEWAY --> UPLOAD
    
    AUTH --> POSTGRES
    AUTH --> REDIS
    API --> POSTGRES
    API --> REDIS
    API --> MONGO
    SOCKET --> REDIS
    UPLOAD --> STORAGE
    
    API --> EMAIL
    API --> SMS
    API --> MAPS
    API --> PAYMENT
    NOTIFICATION --> EMAIL
    NOTIFICATION --> SMS
    
    AUTH -.-> DOCKER
    API -.-> DOCKER
    SOCKET -.-> DOCKER
    UPLOAD -.-> DOCKER
    NOTIFICATION -.-> DOCKER
    
    DOCKER -.-> K8S
    K8S -.-> MONITOR
    K8S -.-> LOGS
```

## 2. Arquitetura de Microserviços

```mermaid
graph TB
    subgraph "API Gateway"
        GATEWAY[Kong/Zuul<br/>- Routing<br/>- Rate Limiting<br/>- Authentication<br/>- Load Balancing]
    end

    subgraph "Core Services"
        USER_SERVICE[User Service<br/>- Authentication<br/>- Profile Management<br/>- Permissions]
        
        ANIMAL_SERVICE[Animal Service<br/>- Animal CRUD<br/>- Photo Management<br/>- Search & Filter]
        
        ADOPTION_SERVICE[Adoption Service<br/>- Process Management<br/>- Matching Algorithm<br/>- Status Tracking]
        
        COMMUNICATION_SERVICE[Communication Service<br/>- Chat System<br/>- Notifications<br/>- Email/SMS]
    end

    subgraph "Support Services"
        FILE_SERVICE[File Service<br/>- Upload/Download<br/>- Image Processing<br/>- Storage Management]
        
        NOTIFICATION_SERVICE[Notification Service<br/>- Push Notifications<br/>- Email Templates<br/>- SMS Gateway]
        
        ANALYTICS_SERVICE[Analytics Service<br/>- Usage Metrics<br/>- Reports<br/>- Business Intelligence]
        
        AUDIT_SERVICE[Audit Service<br/>- Activity Logging<br/>- Security Events<br/>- Compliance]
    end

    subgraph "Data Layer"
        USER_DB[(User Database<br/>PostgreSQL)]
        ANIMAL_DB[(Animal Database<br/>PostgreSQL)]
        ADOPTION_DB[(Adoption Database<br/>PostgreSQL)]
        CHAT_DB[(Chat Database<br/>MongoDB)]
        FILE_DB[(File Metadata<br/>PostgreSQL)]
        ANALYTICS_DB[(Analytics Database<br/>ClickHouse)]
        CACHE[(Redis Cache)]
    end

    %% Gateway connections
    GATEWAY --> USER_SERVICE
    GATEWAY --> ANIMAL_SERVICE
    GATEWAY --> ADOPTION_SERVICE
    GATEWAY --> COMMUNICATION_SERVICE

    %% Service to service communication
    ADOPTION_SERVICE --> USER_SERVICE
    ADOPTION_SERVICE --> ANIMAL_SERVICE
    ADOPTION_SERVICE --> COMMUNICATION_SERVICE
    COMMUNICATION_SERVICE --> NOTIFICATION_SERVICE
    ANIMAL_SERVICE --> FILE_SERVICE
    USER_SERVICE --> AUDIT_SERVICE

    %% Database connections
    USER_SERVICE --> USER_DB
    USER_SERVICE --> CACHE
    ANIMAL_SERVICE --> ANIMAL_DB
    ANIMAL_SERVICE --> CACHE
    ADOPTION_SERVICE --> ADOPTION_DB
    ADOPTION_SERVICE --> CACHE
    COMMUNICATION_SERVICE --> CHAT_DB
    FILE_SERVICE --> FILE_DB
    ANALYTICS_SERVICE --> ANALYTICS_DB
    AUDIT_SERVICE --> ANALYTICS_DB
```

## 3. Fluxo de Dados

```mermaid
graph LR
    subgraph "Data Sources"
        USER_INPUT[User Input]
        API_CALLS[API Calls]
        EXTERNAL_DATA[External APIs]
        FILE_UPLOADS[File Uploads]
    end

    subgraph "Data Processing"
        VALIDATION[Data Validation]
        TRANSFORMATION[Data Transformation]
        BUSINESS_LOGIC[Business Logic]
        MATCHING_ALGO[Matching Algorithm]
    end

    subgraph "Data Storage"
        TRANSACTIONAL_DB[(Transactional DB<br/>PostgreSQL)]
        DOCUMENT_DB[(Document DB<br/>MongoDB)]
        CACHE_LAYER[(Cache Layer<br/>Redis)]
        FILE_STORAGE[(File Storage<br/>S3/Cloudinary)]
    end

    subgraph "Data Output"
        API_RESPONSE[API Responses]
        NOTIFICATIONS[Notifications]
        REPORTS[Reports & Analytics]
        FILE_DOWNLOADS[File Downloads]
    end

    %% Flow
    USER_INPUT --> VALIDATION
    API_CALLS --> VALIDATION
    EXTERNAL_DATA --> TRANSFORMATION
    FILE_UPLOADS --> VALIDATION

    VALIDATION --> BUSINESS_LOGIC
    TRANSFORMATION --> BUSINESS_LOGIC
    BUSINESS_LOGIC --> MATCHING_ALGO

    BUSINESS_LOGIC --> TRANSACTIONAL_DB
    BUSINESS_LOGIC --> DOCUMENT_DB
    BUSINESS_LOGIC --> CACHE_LAYER
    FILE_UPLOADS --> FILE_STORAGE

    TRANSACTIONAL_DB --> API_RESPONSE
    DOCUMENT_DB --> API_RESPONSE
    CACHE_LAYER --> API_RESPONSE
    BUSINESS_LOGIC --> NOTIFICATIONS
    TRANSACTIONAL_DB --> REPORTS
    FILE_STORAGE --> FILE_DOWNLOADS
```

## 4. Segurança e Autenticação

```mermaid
graph TB
    subgraph "Client Layer"
        CLIENT[Client Application]
    end

    subgraph "Security Gateway"
        WAF[Web Application Firewall]
        RATE_LIMITER[Rate Limiter]
        DDoS_PROTECTION[DDoS Protection]
    end

    subgraph "Authentication Layer"
        AUTH_SERVICE[Authentication Service]
        JWT_VALIDATOR[JWT Validator]
        MFA_SERVICE[MFA Service]
        OAUTH_PROVIDER[OAuth Provider]
    end

    subgraph "Authorization Layer"
        RBAC[Role-Based Access Control]
        PERMISSION_SERVICE[Permission Service]
        RESOURCE_GUARD[Resource Guard]
    end

    subgraph "Data Protection"
        ENCRYPTION[Data Encryption]
        HASHING[Password Hashing]
        AUDIT_LOG[Audit Logging]
        DATA_MASKING[Data Masking]
    end

    subgraph "Secure Storage"
        ENCRYPTED_DB[(Encrypted Database)]
        SECURE_FILES[(Secure File Storage)]
        KEY_VAULT[(Key Vault)]
    end

    %% Flow
    CLIENT --> WAF
    WAF --> RATE_LIMITER
    RATE_LIMITER --> DDoS_PROTECTION
    DDoS_PROTECTION --> AUTH_SERVICE

    AUTH_SERVICE --> JWT_VALIDATOR
    AUTH_SERVICE --> MFA_SERVICE
    AUTH_SERVICE --> OAUTH_PROVIDER

    JWT_VALIDATOR --> RBAC
    RBAC --> PERMISSION_SERVICE
    PERMISSION_SERVICE --> RESOURCE_GUARD

    RESOURCE_GUARD --> ENCRYPTION
    ENCRYPTION --> HASHING
    HASHING --> AUDIT_LOG
    AUDIT_LOG --> DATA_MASKING

    DATA_MASKING --> ENCRYPTED_DB
    DATA_MASKING --> SECURE_FILES
    ENCRYPTION --> KEY_VAULT
```

## 5. Deployment e DevOps

```mermaid
graph TB
    subgraph "Development"
        DEV_ENV[Development Environment]
        GIT[Git Repository]
        IDE[IDE/VS Code]
    end

    subgraph "CI/CD Pipeline"
        BUILD[Build Stage]
        TEST[Test Stage]
        SECURITY_SCAN[Security Scan]
        QUALITY_GATE[Quality Gate]
        DEPLOY[Deploy Stage]
    end

    subgraph "Container Registry"
        DOCKER_REGISTRY[Docker Registry]
        HELM_CHARTS[Helm Charts]
    end

    subgraph "Orchestration"
        KUBERNETES[Kubernetes Cluster]
        INGRESS[Ingress Controller]
        SERVICE_MESH[Service Mesh<br/>Istio]
    end

    subgraph "Monitoring & Observability"
        PROMETHEUS[Prometheus]
        GRAFANA[Grafana]
        JAEGER[Jaeger Tracing]
        ELK[ELK Stack]
        ALERTMANAGER[Alert Manager]
    end

    subgraph "Infrastructure"
        CLOUD_PROVIDER[Cloud Provider<br/>AWS/GCP/Azure]
        CDN[Content Delivery Network]
        LOAD_BALANCER[Load Balancer]
        AUTO_SCALING[Auto Scaling Groups]
    end

    %% Flow
    DEV_ENV --> GIT
    GIT --> BUILD
    BUILD --> TEST
    TEST --> SECURITY_SCAN
    SECURITY_SCAN --> QUALITY_GATE
    QUALITY_GATE --> DEPLOY

    DEPLOY --> DOCKER_REGISTRY
    DOCKER_REGISTRY --> KUBERNETES
    HELM_CHARTS --> KUBERNETES

    KUBERNETES --> INGRESS
    KUBERNETES --> SERVICE_MESH
    SERVICE_MESH --> PROMETHEUS
    PROMETHEUS --> GRAFANA
    KUBERNETES --> JAEGER
    KUBERNETES --> ELK
    PROMETHEUS --> ALERTMANAGER

    KUBERNETES --> CLOUD_PROVIDER
    INGRESS --> CDN
    INGRESS --> LOAD_BALANCER
    KUBERNETES --> AUTO_SCALING
```

## Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Material-UI** - Biblioteca de componentes
- **React Router** - Roteamento
- **Socket.IO Client** - Comunicação em tempo real

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Socket.IO** - WebSocket para chat
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos

### Database
- **PostgreSQL** - Banco principal
- **Redis** - Cache e sessões
- **MongoDB** - Logs e chat (opcional)

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **Nginx** - Proxy reverso
- **Kubernetes** - Orquestração produção

### Monitoramento
- **Prometheus** - Métricas
- **Grafana** - Dashboards
- **ELK Stack** - Logs centralizados

### Segurança
- **Helmet** - Headers de segurança
- **CORS** - Cross-origin requests
- **Rate Limiting** - Controle de taxa
- **SSL/TLS** - Criptografia em trânsito