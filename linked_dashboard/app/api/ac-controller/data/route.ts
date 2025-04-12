import { NextResponse } from 'next/server';

// This would normally connect to the Air Conditioning Controller API
export async function GET() {
  // Mock data - in production, this would fetch from the actual AC Controller API
  const acData = {
    currentData: {
      temperature: 24.5,
      humidity: 45,
      optimalSetting: 22,
      powerConsumption: 1.2, // kW/h
      mode: 'cooling'
    },
    historicalData: [
      ['Date', 'Temperature', 'Optimal Setting'],
      ['2023-10-01', 24, 22],
      ['2023-10-02', 25, 23],
      ['2023-10-03', 26, 23],
      ['2023-10-04', 23, 21],
      ['2023-10-05', 22, 20],
      ['2023-10-06', 24, 22],
      ['2023-10-07', 25, 23],
    ],
    units: [
      { id: 1, name: 'AC Unit 1', location: 'Main Office', status: 'online' },
      { id: 2, name: 'AC Unit 2', location: 'Conference Room', status: 'online' },
      { id: 3, name: 'AC Unit 3', location: 'Server Room', status: 'online' },
      { id: 4, name: 'AC Unit 4', location: 'Break Room', status: 'online' },
    ],
    predictions: {
      nextDayTemperature: [22, 23, 25, 26, 25, 24, 23],
      nextDayOptimalSettings: [20, 21, 22, 23, 22, 21, 20],
      energySavings: 15.3 // percentage
    }
  };

  return NextResponse.json(acData);
}