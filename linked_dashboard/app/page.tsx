'use client';

import { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import Link from 'next/link';

// Dashboard components
import SystemStatusCard from '../components/SystemStatusCard';
import MetricCard from '../components/MetricCard';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    faceRecognition: 'online',
    airConditioning: 'online',
    maintenance: 'online',
    nodeRed: 'online'
  });
  
  const [acData, setAcData] = useState([
    ['Date', 'Temperature', 'Optimal Setting'],
    ['2023-10-01', 24, 22],
    ['2023-10-02', 25, 23],
    ['2023-10-03', 26, 23],
    ['2023-10-04', 23, 21],
    ['2023-10-05', 22, 20],
    ['2023-10-06', 24, 22],
    ['2023-10-07', 25, 23],
  ]);
  
  const [maintenanceData, setMaintenanceData] = useState([
    ['Equipment', 'Status'],
    ['AC Unit 1', 'Healthy'],
    ['AC Unit 2', 'Maintenance Required'],
    ['AC Unit 3', 'Healthy'],
    ['AC Unit 4', 'Warning'],
  ]);
  
  const [faceRecognitionStats, setFaceRecognitionStats] = useState({
    totalFaces: 156,
    recognizedFaces: 142,
    unknownFaces: 14,
    accuracy: 91
  });

  useEffect(() => {
    // Simulate loading data from APIs
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
    
    // In a real implementation, we would fetch data from our API routes:
    // async function fetchData() {
    //   try {
    //     const [acResponse, maintenanceResponse, faceResponse] = await Promise.all([
    //       fetch('/api/ac-controller/data'),
    //       fetch('/api/maintenance/status'),
    //       fetch('/api/face-recognition/stats')
    //     ]);
    //     
    //     const acData = await acResponse.json();
    //     const maintenanceData = await maintenanceResponse.json();
    //     const faceData = await faceResponse.json();
    //     
    //     setAcData(acData);
    //     setMaintenanceData(maintenanceData);
    //     setFaceRecognitionStats(faceData);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //     setLoading(false);
    //   }
    // }
    // 
    // fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">rtankihaAzaross Dashboard</h1>
      
      {/* System Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SystemStatusCard 
          title="Face Recognition" 
          status={systemStatus.faceRecognition} 
          icon="👤" 
        />
        <SystemStatusCard 
          title="Air Conditioning" 
          status={systemStatus.airConditioning} 
          icon="❄️" 
        />
        <SystemStatusCard 
          title="Maintenance System" 
          status={systemStatus.maintenance} 
          icon="🔧" 
        />
        <SystemStatusCard 
          title="Node-RED Automation" 
          status={systemStatus.nodeRed} 
          icon="🔄" 
        />
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Faces" 
          value={faceRecognitionStats.totalFaces} 
          icon="👥" 
        />
        <MetricCard 
          title="Recognition Rate" 
          value={`${faceRecognitionStats.accuracy}%`} 
          icon="📊" 
        />
        <MetricCard 
          title="AC Units" 
          value={maintenanceData.length - 1} 
          icon="❄️" 
        />
        <MetricCard 
          title="Maintenance Alerts" 
          value="1" 
          icon="🚨" 
          alertLevel="warning" 
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">AC Temperature & Optimal Settings</h2>
          <Chart
            chartType="LineChart"
            width="100%"
            height="300px"
            data={acData}
            options={{
              hAxis: { title: 'Date' },
              vAxis: { title: 'Temperature (°C)' },
              series: {
                0: { color: '#3B82F6' },
                1: { color: '#10B981' }
              },
              legend: { position: 'bottom' }
            }}
          />
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Equipment Maintenance Status</h2>
          <Chart
            chartType="PieChart"
            width="100%"
            height="300px"
            data={[
              ['Status', 'Count'],
              ['Healthy', 2],
              ['Warning', 1],
              ['Maintenance Required', 1],
            ]}
            options={{
              colors: ['#10B981', '#F59E0B', '#EF4444'],
              legend: { position: 'bottom' }
            }}
          />
        </div>
      </div>
      
      {/* Quick Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/face-recognition" className="card flex flex-col items-center justify-center p-6 hover:bg-gray-50">
          <div className="text-4xl mb-2">👤</div>
          <h3 className="text-lg font-semibold">Face Recognition</h3>
          <p className="text-sm text-gray-500 text-center mt-2">Manage face detection and recognition services</p>
        </Link>
        
        <Link href="/ac-controller" className="card flex flex-col items-center justify-center p-6 hover:bg-gray-50">
          <div className="text-4xl mb-2">❄️</div>
          <h3 className="text-lg font-semibold">AC Controller</h3>
          <p className="text-sm text-gray-500 text-center mt-2">Monitor and control air conditioning systems</p>
        </Link>
        
        <Link href="/maintenance" className="card flex flex-col items-center justify-center p-6 hover:bg-gray-50">
          <div className="text-4xl mb-2">🔧</div>
          <h3 className="text-lg font-semibold">Maintenance</h3>
          <p className="text-sm text-gray-500 text-center mt-2">View maintenance predictions and schedules</p>
        </Link>
      </div>
      
      {/* Node-RED Integration */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Node-RED Automation</h2>
          <Link href="/node-red" className="btn-primary text-sm">Open Editor</Link>
        </div>
        <p className="text-gray-600 mb-4">Manage and monitor your automation workflows</p>
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm font-mono">Status: <span className="text-green-500">Running</span></p>
          <p className="text-sm font-mono">Active Flows: 3</p>
          <p className="text-sm font-mono">Last Deployment: 2023-10-15 14:30</p>
        </div>
      </div>
    </div>
  );
}