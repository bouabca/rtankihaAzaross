import { NextResponse } from 'next/server';

// This would normally connect to the Maintenance Prediction System API
export async function GET() {
  // Mock data - in production, this would fetch from the actual Maintenance Prediction API
  const maintenanceData = {
    equipmentStatus: [
      { id: 1, name: 'AC Unit 1', status: 'Healthy', lastMaintenance: '2023-09-15', nextMaintenance: '2023-12-15' },
      { id: 2, name: 'AC Unit 2', status: 'Maintenance Required', lastMaintenance: '2023-08-10', nextMaintenance: '2023-10-20' },
      { id: 3, name: 'AC Unit 3', status: 'Healthy', lastMaintenance: '2023-09-25', nextMaintenance: '2023-12-25' },
      { id: 4, name: 'AC Unit 4', status: 'Warning', lastMaintenance: '2023-07-30', nextMaintenance: '2023-11-05' },
    ],
    maintenanceHistory: [
      { id: 1, equipmentId: 2, date: '2023-08-10', type: 'Regular', technician: 'John Smith', notes: 'Replaced air filter, cleaned coils' },
      { id: 2, equipmentId: 1, date: '2023-09-15', type: 'Regular', technician: 'Maria Garcia', notes: 'General inspection, no issues found' },
      { id: 3, equipmentId: 3, date: '2023-09-25', type: 'Regular', technician: 'John Smith', notes: 'Replaced refrigerant, adjusted settings' },
      { id: 4, equipmentId: 4, date: '2023-07-30', type: 'Emergency', technician: 'David Wong', notes: 'Fixed refrigerant leak, replaced damaged parts' },
    ],
    predictionMetrics: {
      accuracy: 92.5,
      falsePositives: 3,
      falseNegatives: 1,
      maintenanceCostSavings: 15200 // dollars
    },
    alerts: [
      { id: 1, equipmentId: 2, severity: 'High', message: 'Compressor efficiency below threshold', createdAt: '2023-10-14T08:45:22' },
      { id: 2, equipmentId: 4, severity: 'Medium', message: 'Unusual vibration patterns detected', createdAt: '2023-10-15T11:32:45' },
    ]
  };

  return NextResponse.json(maintenanceData);
}