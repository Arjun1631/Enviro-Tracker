import React from 'react';
import { useData } from '../contexts/DataContext';
import AccuracyChart from '../components/AccuracyChart';

const AccuracyMatrix: React.FC = () => {
  const { accuracy } = useData();
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accuracy Matrix</h1>
        <p className="text-gray-600">
          Performance metrics for anomaly detection.
        </p>
      </div>
      
      {/* Performance metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Accuracy"
          value={`${(accuracy.accuracy * 100).toFixed(1)}%`}
          description="Overall correctness of the model"
          color="bg-blue-500"
        />
        <MetricCard
          title="Precision"
          value={`${(accuracy.precision * 100).toFixed(1)}%`}
          description="Ratio of true positives to all positive predictions"
          color="bg-green-500"
        />
        <MetricCard
          title="Recall"
          value={`${(accuracy.recall * 100).toFixed(1)}%`}
          description="Ratio of true positives to all actual positives"
          color="bg-amber-500"
        />
        <MetricCard
          title="F1 Score"
          value={`${(accuracy.f1Score * 100).toFixed(1)}%`}
          description="Harmonic mean of precision and recall"
          color="bg-purple-500"
        />
      </div>
      
      {/* Confusion matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Performance Metrics
          </h2>
          <AccuracyChart metrics={accuracy} />
        </div>
        
        <div className="card p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Confusion Matrix
          </h2>
          <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded">
            <div className="p-4 border-r border-b border-gray-200 bg-green-50">
              <p className="text-sm font-medium text-gray-700">True Positive</p>
              <p className="text-2xl font-bold text-green-600">{accuracy.truePositives}</p>
              <p className="text-xs text-gray-500">Correctly identified anomalies</p>
            </div>
            <div className="p-4 border-b border-gray-200 bg-red-50">
              <p className="text-sm font-medium text-gray-700">False Positive</p>
              <p className="text-2xl font-bold text-red-600">{accuracy.falsePositives}</p>
              <p className="text-xs text-gray-500">False alarms</p>
            </div>
            <div className="p-4 border-r border-gray-200 bg-red-50">
              <p className="text-sm font-medium text-gray-700">False Negative</p>
              <p className="text-2xl font-bold text-red-600">{accuracy.falseNegatives}</p>
              <p className="text-xs text-gray-500">Missed anomalies</p>
            </div>
            <div className="p-4 bg-green-50">
              <p className="text-sm font-medium text-gray-700">True Negative</p>
              <p className="text-2xl font-bold text-green-600">{accuracy.trueNegatives}</p>
              <p className="text-xs text-gray-500">Correctly identified normal data</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* System explanation */}
      <div className="card p-5 mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          Understanding the Accuracy Matrix
        </h2>
        <div className="text-gray-700 space-y-3">
          <p>
            <strong>Accuracy:</strong> The proportion of true results (both true positives and true negatives) among all predictions.
          </p>
          <p>
            <strong>Precision:</strong> Of all the anomalies our system detected, how many were actually anomalies?
          </p>
          <p>
            <strong>Recall:</strong> Of all the real anomalies, how many did our system detect?
          </p>
          <p>
            <strong>F1 Score:</strong> A balanced measure that takes both precision and recall into account.
          </p>
          <p>
            Our AI system continuously improves as it processes more data and receives feedback from real-world conditions,
            leading to more accurate anomaly detection and fewer false alarms over time.
          </p>
        </div>
      </div>
    </div>
  );
};

// MetricCard component
const MetricCard: React.FC<{
  title: string;
  value: string;
  description: string;
  color: string;
}> = ({ title, value, description, color }) => {
  return (
    <div className="card p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default AccuracyMatrix;