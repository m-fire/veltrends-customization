### 1. Run PostgreSQL Server with docker compose

```bash
docker-compose up -d
```

### 2. Run Bash

```bash
docker exec -it postgres bash
```

### 3. login as postgres

```bash
su - postgres
```

### 4. Run following statements

```postgresql
CREATE DATABASE veltrends ENCODING 'UTF8';
CREATE USER username WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE veltrends TO username;
ALTER USER username CREATEDB;
-- apply to postgresql:15.x 
ALTER DATABASE veltrends OWNER TO username;
```
