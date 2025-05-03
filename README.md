# anamcara-ai
# Getting Started
 
> [!TIP]
> This section provides instructions on how to run, build, and manage the Anamncara-AI project locally.
 
### Prerequisites
 
Clone the repository locally.
Before running the project, ensure that you have the following installed:
 
- Node.js (version 18 or higher)
- NPM
 
### Installation
 
To install all the necessary dependencies, run:
 
```
npm install
```
 
To install a specific dependency, run:
 
```
npm install [depedency name]
```
 
### Running the Development Server
 
To start the development server, use the following command:
 
```
npm run dev
```
 
This will start the Vite development server, and you can access the application at http://localhost:**_(port specified in vite.config)_** (3004 by default).
 
### Building for Production
 
To create an optimized production build, run:
 
```
npm run build
```
 
This will generate a dist folder containing the compiled files, ready for deployment.
 
### Previewing the Production Build
 
After building the application, you can preview the production build locally by running:
 
```
npm run preview
```
 
This will start a local server to preview the production build at http://localhost:4173.
