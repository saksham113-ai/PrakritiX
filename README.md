Deloyment Link - https://prakritix.netlify.app/

# 🌿 PrakritiX: Smart Waste Management System

**PrakritiX** is an intelligent, AI-powered ecosystem designed to revolutionize how urban waste is segregated, monitored, and processed. By leveraging Machine Learning and IoT, it bridges the gap between traditional waste collection and a sustainable, circular economy.
---
## 🚀 Key Features
* 🧠 **Real-time AI Classification**: Automatically identifies and sorts waste into Organic, Recyclable, and Hazardous categories using Computer Vision.
* 📊 **Smart Monitoring Dashboard**: A data-rich interface for municipalities to track fill levels across bins in real-time.
* ♻️ **Incentive Engine**: Gamified rewards for citizens who participate in proper waste disposal.
* 📍 **Route Optimization**: AI-driven logistics to reduce carbon footprints of collection trucks.
---
## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Vite |
| **Backend** | Python (FastAPI / Flask) |
| **AI/ML** | TensorFlow, OpenCV, Scikit-Learn |
| **Database** | MongoDB / Firebase |
| **IoT Integration** | Raspberry Pi / ESP32 |
---
## 🧠 Machine Learning & Logic
The software core utilizes a specialized pipeline to ensure high accuracy with low latency on edge devices.
* **Model Architecture:** Built on **MobileNetV2** (via TensorFlow Lite) for optimized performance on Raspberry Pi/Jetson Nano.
* **Processing Pipeline:**
    1.  **Image Pre-processing:** Resizing to 224x224, normalization, and noise reduction using OpenCV.
    2.  **Inference:** Classification into Organic, Plastic, Paper, Metal, or Glass.
    3.  **Confidence Thresholding:** Only actions with >85% confidence trigger the physical sorting gates.
* **Optimization:** Quantization-aware training was used to reduce the model size by 75% without significant accuracy loss.
---
## ⚙️ Backend & API Service
The infrastructure is designed for real-time data handling and heavy analytical tasks.
* **FastAPI Core:** Handles asynchronous requests from multiple IoT bins simultaneously.
* **Real-time Updates:** **WebSockets** maintain a persistent connection between the bins and the dashboard for "Live Fill-Level" monitoring.
* **Route Optimization Service:**
    * Implements the **Dijkstra Algorithm** or **Ant Colony Optimization** to generate the most fuel-efficient route for collection trucks.
    * Triggers "Priority Pickups" when a bin exceeds 90% capacity.
* **Database:** **PostgreSQL** for persistent storage of waste logs, and **Redis** for high-speed caching of live bin statuses.
---
## 🖥️ Frontend & Visualization
A high-performance dashboard for municipal administrators.
* **Tech:** React.js + Tailwind CSS + Vite.
* **Interactive Maps:** Uses **Leaflet.js** to render a live geospatial view of every PrakritiX bin in the city.
* **Data Analytics:** * **Chart.js** integration for visualizing "Waste Diversion Rates."
    * Predictive analytics to forecast which areas will produce the most waste during festivals or weekends.
---
## 🔄 System Flow
```mermaid
graph LR
    A[Camera Feed] --> B(CV Model)
    B --> C{Classification}
    C -->|Plastic| D[Servo Gate 1]
    C -->|Organic| E[Servo Gate 2]
    D & E --> F[Cloud API]
    F --> G[(Database)]
    F --> H[Admin Dashboard]
