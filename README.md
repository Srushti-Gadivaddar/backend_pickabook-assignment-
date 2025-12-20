# PickABook – Backend

This repository contains the backend implementation for the PickABook assignment.  
It is responsible for image processing, face detection, and integration with the image generation model.

---

## 🚀 Features
- Upload and process child images
- Face detection using **face-api.js**
- Image blending and processing using **Canvas**
- Stylized image generation using the **Pollinations model**
- REST API built with **Node.js and Express**
- Cloud-based image handling

---

## 🛠 Tech Stack
- Node.js
- Express.js
- face-api.js
- Canvas
- Multer
- Axios
- Cloudinary

---

## ⚙️ Setup & Installation

1. Clone the repository
```bash
git clone https://github.com/Srushti-Gadivaddar/backend_pickabook-assignment-.git
cd backend_pickabook-assignment-
Install dependencies

bash
Copy code
npm install
Create a .env file using .env.example

env
Copy code
PORT=8080
CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value
Start the server

bash
Copy code
npm start
🔗 API Endpoints
POST /upload – Upload child image

POST /generate – Generate personalized illustration

⚠️ Limitations
Uses free image generation models with lower identity consistency
Output quality depends on input image lighting and resolution
Generated images may vary between executions

🔮 Improvements in V2
Integrate identity-preserving models (Instant-ID / ControlNet)
Improve blending for lighting and pose consistency
Optimize performance and scalability

