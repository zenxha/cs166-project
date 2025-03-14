# CS166 Final Project

## Frontend Setup Instructions
1. Clone the repository
2. Navigate to cs166-project/frontend
3. Run `npm i`
4. Run `npm run dev`
5. Go to site at http://localhost:5173
Remark: Ensure backend is up for full functionality.

## Backend Setup Instructions
1. Clone the repository (If you already did, then ignore this step)
2. Navigate to cs166-project/backend
3. Create a `.env` file
4. Write `DATABASE_URL=postgresql://user:password@db:5432/pizzastore` in the `.env` file
5. Run the database container from the docker-compose file in project root. (Command: `docker compose -f 'docker-compose.yml' up -d --build 'db'`)
7. Wait for database to start up.
8. Run the backend container from the docker-compose file in project root. (Command: `docker compose -f 'docker-compose.yml' up -d --build 'backend'`)
9. Wait for  backend to start up.
Remark: We used the VSCode docker plugin to run the 
