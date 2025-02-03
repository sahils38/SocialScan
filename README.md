 # SocialScan

## Overview
SocialScan is a web-based tool that allows users to log into social media platforms and generate a detailed profile analysis. It captures screenshots of the user's profile, direct messages, and past comments, compiling them into a single PDF report.

## Features
- Automated login to Instagram (support for Facebook and Twitter planned)
- Screenshots of profile, direct messages, and user comments
- PDF generation of the collected screenshots
- Secure authentication and data handling

## Technologies Used
- **Frontend**: TypeScript, Next.js (Deployed on [Vercel](https://social-scan.vercel.app))
- **Backend**: Node.js, Express, Playwright (Deployed on [Railway](https://socialscan-production.up.railway.app))
- **Database**: Firebase Authentication (for secure login handling)

## Installation (For Local Development)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/socialscan.git
   cd socialscan
   ```
2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
3. Set up environment variables for Firebase and API keys.
4. Run the backend:
   ```bash
   npm start
   ```
5. Run the frontend:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:5173` in your browser.

## Deployment
- **Frontend**: Hosted on [Vercel](https://social-scan.vercel.app)
- **Backend**: Hosted on [Railway](https://socialscan-production.up.railway.app)

## Usage
1. Visit [SocialScan](https://social-scan.vercel.app)
2. Enter login credentials for the desired platform
3. The backend will log in using Playwright, capture screenshots, and generate a downloadable PDF report
4. Download the report from the provided link

## Video Demo
*A walkthrough video showcasing how SocialScan works will be added soon.*

## Future Enhancements
- Multi-platform support (Facebook, Twitter)
- Improved UI/UX for a smoother experience
- Advanced data analysis for deeper insights

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

