# rtankihaAzaross

rtankihaAzaross is a comprehensive project that integrates AI models, a dashboard system, and automation workflows to provide a complete solution for monitoring, analyzing, and controlling systems.

## Table of Contents

- [Overview](#overview)
- [Components](#components)
- [Installation Guide](#installation-guide)
  - [AI Models Installation](#ai-models-installation)
  - [Dashboard Installation](#dashboard-installation)
  - [Automation Installation](#automation-installation)
- [How It Works](#how-it-works)
  - [AI Models](#ai-models)
  - [Dashboard System](#dashboard-system)
  - [Automation](#automation)
- [Integration](#integration)

## Overview

rtankihaAzaross combines cutting-edge AI models for face recognition and air conditioning system management with a modern dashboard interface and powerful automation workflows. This integrated system allows for efficient monitoring, control, and automation of various processes.

## Components

1. **AI Models**:
   - Face Recognition System
   - Air Conditioning Controller
   - Maintenance Prediction System

2. **Dashboard System**:
   - Modern web-based interface
   - Real-time monitoring
   - Data visualization

3. **Automation**:
   - Node-RED based workflow automation
   - Event-driven process management
   - Integration capabilities

## Installation Guide

### AI Models Installation

#### Face Recognition System

1. **Prerequisites**:
   - Docker Desktop installed
   - Minimum 4GB RAM, 2 CPU cores
   - 10GB free disk space

2. **Installation Steps**:
   1. Install Docker Desktop
   2. Download the archive from the latest release: https://github.com/exadel-inc/CompreFace/releases
   3. Unzip the archive
   4. Run Docker
   5. Open Command prompt (write `cmd` in Windows search bar)
   6. Navigate to the extracted folder: `cd path_of_the_folder`
   7. Run command: `docker-compose up -d`
   8. Access the system at http://localhost:8000/login

#### Air Conditioning Controller & Maintenance System

1. **Prerequisites**:
   - Python 3.7 or higher
   - TensorFlow 2.x
   - Pandas, NumPy, Matplotlib

2. **Installation Steps**:
   1. Navigate to the AI model directory: `cd "ai model/aircondtion controller"`
   2. Install required Python packages: `pip install tensorflow pandas numpy matplotlib`
   3. Run the model creation script: `python model.py`
   4. For maintenance prediction, navigate to: `cd "../maintenace"`
   5. Run the maintenance model: `python model.py`

### Dashboard Installation

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - npm (v6 or higher)

2. **Installation Steps**:
   1. Navigate to the dashboard directory: `cd dashboard`
   2. Install npm dependencies: `npm install`
   3. For development mode with live preview: `npm run dev`
   4. For production build: `npm run production`
   5. Access the dashboard through the generated dist files

### Automation Installation

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - npm (v6 or higher)

2. **Installation Steps**:
   1. Install Node-RED globally: `npm install -g --unsafe-perm node-red`
   2. Navigate to the automation directory: `cd automation/workflow`
   3. Install dependencies: `npm install`
   4. Start Node-RED: `node-red`
   5. Access the Node-RED editor at http://localhost:1880

## How It Works

### AI Models

#### Face Recognition

The face recognition system uses deep learning models to detect, recognize, and verify faces. It provides three main services:

- **Face Detection**: Identifies and locates faces in images
- **Face Recognition**: Identifies who a person is by comparing against known faces
- **Face Verification**: Confirms if a face belongs to a specific person

The system is containerized using Docker for easy deployment and scaling. It exposes REST APIs for integration with other systems.

#### Air Conditioning Controller

This AI model uses LSTM (Long Short-Term Memory) neural networks to predict optimal air conditioning settings based on historical data. The model:

- Analyzes patterns in temperature, humidity, and usage data
- Predicts optimal settings for comfort and energy efficiency
- Provides recommendations for AC system operation

#### Maintenance Prediction

The maintenance prediction system uses machine learning to forecast when equipment maintenance is needed. It:

- Analyzes equipment performance data
- Identifies patterns that indicate potential failures
- Predicts maintenance needs before failures occur
- Generates maintenance schedules to prevent downtime

### Dashboard System

The dashboard provides a modern, responsive interface for monitoring and controlling the entire system. Key features include:

- Real-time data visualization
- System status monitoring
- User management with role-based access control
- Configuration management for AI models and automation workflows
- Responsive design for desktop and mobile access

The dashboard is built using modern web technologies and follows best practices for UI/UX design.

### Automation

The automation system is based on Node-RED, a powerful flow-based programming tool. It enables:

- Creation of automated workflows without coding
- Integration between AI models and the dashboard
- Event-driven automation based on triggers from various sources
- Scheduled tasks and processes
- Data transformation and routing

The visual programming interface makes it easy to create complex automation workflows that connect the various components of the system.

## Integration

The three main components work together to provide a complete solution:

1. **AI Models** process data and make predictions or identifications
2. **Dashboard** provides visualization and user interface for the system
3. **Automation** connects everything together and enables workflow automation

Data flows between these components through APIs and messaging systems, creating a cohesive platform for monitoring, analysis, and control.