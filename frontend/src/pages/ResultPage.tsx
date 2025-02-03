import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Define the structure of the response data
interface AnalysisResult {
  caseNumber: string;
  platformName: string;
  username: string;
  pdfUrl: string;
}

const ResultPage: React.FC = () => {
  const { caseNumber } = useParams<{ caseNumber: string }>(); // Retrieve the dynamic case number from the URL
  const [result, setResult] = useState<AnalysisResult>({
    caseNumber: '',
    platformName: '',
    username: '',
    pdfUrl: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Ensure caseNumber is defined before making the API call
    if (!caseNumber) {
      setError('No case number provided.');
      setLoading(false);
      return;
    }

    const fetchResultData = async () => {
      try {
        setLoading(true);
        // Make a GET request to your API endpoint using the dynamic caseNumber
        const response = await axios.get<AnalysisResult>(`https://socialscan-production.up.railway.app/results/${caseNumber}`);
        
        // The response data should match the AnalysisResult interface
        const { caseNumber: resultCaseNumber, platformName, username } = response.data;
        
        // Update the pdfUrl to include the caseNumber for the dynamic download link
        const updatedPdfUrl = `https://socialscan-production.up.railway.app/download/${caseNumber}`;
        
        setResult({
          caseNumber: resultCaseNumber,
          platformName,
          username,
          pdfUrl: updatedPdfUrl, // Use the updated URL with caseNumber
        });
      } catch (err) {
        console.error('Error fetching result data:', err);
        setError('Failed to fetch result data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [caseNumber]); // Trigger fetch when caseNumber changes

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full bg-blue-600 text-white text-center py-4">
        <h1 className="text-2xl font-bold">Social Media Analysis</h1>
      </header>

      <main className="w-full max-w-3xl bg-white shadow-md rounded-lg mt-8 p-6">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Analysis Details</h2>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Case Number:</span> {result.caseNumber}
                </p>
                <p>
                  <span className="font-medium">Platform Name:</span> {result.platformName}
                </p>
                <p>
                  <span className="font-medium">Username:</span> {result.username}
                </p>
              </div>
            </div>

            <div className="mt-6">
              {result.pdfUrl ? (
                <a
                  href={result.pdfUrl}
                  download
                  className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
                >
                  Download PDF
                </a>
              ) : (
                <p className="text-gray-500">Generating PDF...</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ResultPage;
