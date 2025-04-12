import { NextResponse } from 'next/server';

// This would normally connect to the Face Recognition system API
export async function GET() {
  // Mock data - in production, this would fetch from the actual Face Recognition API
  const stats = {
    totalFaces: 156,
    recognizedFaces: 142,
    unknownFaces: 14,
    accuracy: 91,
    recentDetections: [
      { id: 1, timestamp: '2023-10-15T09:23:45', name: 'John Doe', confidence: 0.98 },
      { id: 2, timestamp: '2023-10-15T10:15:22', name: 'Jane Smith', confidence: 0.95 },
      { id: 3, timestamp: '2023-10-15T11:05:17', name: 'Unknown', confidence: 0.62 },
      { id: 4, timestamp: '2023-10-15T12:45:33', name: 'Alice Johnson', confidence: 0.89 },
    ]
  };

  return NextResponse.json(stats);
}