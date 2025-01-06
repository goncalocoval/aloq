# Aloq

<img src="client/public/images/logo-nobg.png" alt="Aloq Logo" width="100">

Aloq is an application designed to help startups and businesses choose the best technology park or incubator based on multiple criteria such as location, cost, and service availability. The application leverages the AHP (Analytic Hierarchy Process) method to calculate the optimal option, offering a user-friendly and intuitive interface.

---

## Features

- **User Authentication**: Secure registration with email verification, login, and password recovery.  
- **Search System**: Search for parks/incubators based on up to 7 criteria, setting priorities for each.  
- **Result Analysis**: View top results sorted by score or cost, with detailed breakdowns of criteria contributions.  
- **Search History**: Access the last 5 searches and analyze details.  
- **Profile Management**: Edit personal information directly from the profile page.  
- **Intuitive Design**: Fully functional on desktop devices.  

---

## Links

- **Live Application**: [aloq.vercel.app](https://aloq.vercel.app)  
- **Backend**: Hosted on Render  
- **Frontend**: Hosted on Vercel  
- **Database**: PostgreSQL, hosted on Render  
- **GitHub Repository**: [Aloq Repository](https://github.com/goncalocoval/aloq)  

---

## Installation / Run Locally

### Prerequisites

Ensure you have the following tools installed:  

- [Node.js](https://nodejs.org/) (version 18 or higher)  
- npm or yarn  
- [PostgreSQL](https://www.postgresql.org/)  
- Git  

---

### Backend

1. Clone the repository and navigate to the backend directory:  
   ```bash
   git clone https://github.com/goncalocoval/aloq.git
   cd aloq/server
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure environment variables (see **Environment Variables** section below).  

4. Run database migrations:  
   ```bash
   npx prisma migrate dev
   ```

5. (Optional) Seed the database:  
   ```bash
   npx ts-node prisma/seed.ts
   ```

6. Start the server:  
   ```bash
   npm run start
   ```

---

### Frontend

1. Navigate to the frontend directory:  
   ```bash
   cd ../client
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Configure environment variables (see **Environment Variables** section below).  

4. Start the development server:  
   ```bash
   npm run dev
   ```

5. Open the application in your browser at:  
   [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create `.env` files for both backend and frontend with the following configurations:  

### Backend  
```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database-name>
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=<current-frontend-url>
```

### Frontend  
```env
NEXT_PUBLIC_API_URL=<current-backend-url>
```

---

## Key Endpoints

- `/auth/register`: User registration.  
- `/auth/login`: User login.  
- `/search`: Perform a search.  
- `/search/history`: Retrieve search history.  
- `/profile`: Manage user profile.  

---

## FAQ

1. **How do I recover my password?**  
   Go to the login page and click on "Forgot Password." Follow the instructions sent to your email.  

2. **Why don't I see results when searching?**  
   Ensure that the selected criteria match the data available in the database.  

3. **How are results calculated?**  
   Results are calculated using the AHP method, based on selected criteria and their priorities.  

4. **How can I edit my profile?**  
   Navigate to the profile page, click "Edit Details", make changes and save.  

---

## Documentation

- [User Manual (PDF)](User_Manual.pdf)

---

## Feedback

We’d love to hear your feedback!  

- **Report bugs or issues**: [Issues](https://github.com/goncalocoval/aloq/issues)  
- **Contact us via email**: aloqplatform@gmail.com  

---

## Contributing

Contributions are welcome!  

1. Fork the repository.  
2. Create a new branch for your feature:  
   ```bash
   git checkout -b feature/new-feature
   ```  

3. Commit your changes:  
   ```bash
   git commit -m "Add new feature"
   ```  

4. Push to GitHub:  
   ```bash
   git push origin feature/new-feature
   ```  

5. Open a Pull Request.  

---

## Acknowledgements

- **Render**: Hosting for backend and database.  
- **Vercel**: Hosting for frontend.  
- **Prisma**: ORM used for database management.  
- **Tailwind CSS**: Styling for the frontend.  
- **Node.js & Nest.js**: Backend development.  