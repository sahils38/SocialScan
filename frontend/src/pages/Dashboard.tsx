import React, { useState, useEffect } from 'react';
import { getDocs, addDoc, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Import Firestore database
import { Users, Search, FileText, Database } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [activeCases, setActiveCases] = useState(0);
  const [profilesAnalyzed, setProfilesAnalyzed] = useState(0);
  const [dataCollected, setDataCollected] = useState('0GB');
  const [reportsGenerated, setReportsGenerated] = useState(0);
  const [existingCases, setExistingCases] = useState<any[]>([]); // State for storing cases from Firestore

  // Form state for adding a new case
  const [caseNumber, setCaseNumber] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null); // State for the generated PDF file URL

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch department name from localStorage
  useEffect(() => {
    const dept = localStorage.getItem('departmentName');
    setDepartmentName(dept || '');
    fetchDashboardData(); // Fetch stats when the component mounts
    fetchExistingCases(); // Fetch existing cases when the component mounts
  }, []);

  // Fetch stats for the dashboard (Active Cases, Reports, etc.)
  const fetchDashboardData = async () => {
    try {
      const casesRef = collection(db, 'cases');
      const querySnapshot = await getDocs(casesRef);

      let activeCount = 0;
      let profileCount = 0;
      let reportCount = 0;

      querySnapshot.forEach((doc) => {
        const caseData = doc.data();
        if (caseData.status === 'Active') {
          activeCount++;
        }
        // Add logic to calculate profilesAnalyzed, reportsGenerated, and dataCollected
      });

      setActiveCases(activeCount);
      setProfilesAnalyzed(profileCount); // Replace with actual logic
      setDataCollected('2.4TB'); // Replace with actual logic
      setReportsGenerated(reportCount); // Replace with actual logic
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Fetch existing cases from Firestore
  const fetchExistingCases = async () => {
    try {
      const casesRef = collection(db, 'cases');
      let caseQuery;

      if (searchTerm) {
        caseQuery = query(casesRef, where('caseNumber', '>=', searchTerm)); // Simple search based on case number
      } else {
        caseQuery = casesRef;
      }

      const querySnapshot = await getDocs(caseQuery);
      const cases: any[] = [];

      querySnapshot.forEach((doc) => {
        cases.push(doc.data());
      });

      setExistingCases(cases); // Update the state with fetched cases
    } catch (error) {
      console.error('Error fetching existing cases:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        caseNumber,
        username,
        password,
        platform,
      };

      const response = await fetch('https://socialscan-production.up.railway.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is JSON
      const isJson = response.headers.get('content-type')?.includes('application/json');

      if (isJson) {
        const data = await response.json();

        if (response.ok) {
          console.log('Login successful:', data);

          // Save the case to Firestore
          const newCase = {
            caseNumber,
            platform,
            username,
            status: 'Active',
            createdAt: new Date(),
            backendResponse: data,
          };
          await addDoc(collection(db, 'cases'), newCase);

          setCaseNumber('');
          setUsername('');
          setPassword('');
          fetchDashboardData();
          fetchExistingCases();

          alert('Analysis started successfully!');

          // Redirect to the result page
          navigate(`/result/${caseNumber}`);
        } else {
          console.error('Backend error:', data);
          alert(`Error: ${data.message || 'Something went wrong'}`);
        }
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error('Unexpected response format:', text);
        alert(`Error: ${text || 'Unexpected response format'}`);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Failed to start the analysis. Please try again.');
    }
  };

  return (
    <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Investigation Dashboard</h1>
          <p className="text-gray-400 mt-1">{departmentName} Department</p>
        </div>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'new' ? 'bg-blue-600' : 'bg-slate-800'}`}
            onClick={() => setActiveTab('new')}
          >
            New Case
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'existing' ? 'bg-blue-600' : 'bg-slate-800'}`}
            onClick={() => setActiveTab('existing')}
          >
            Existing Cases
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-slate-900">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">In Progress</span>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Active Cases</h3>
          <p className="text-2xl font-bold mt-1">{activeCases}</p>
        </div>
        <div className="bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-slate-900">
              <Search className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">This Month</span>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Profiles Analyzed</h3>
          <p className="text-2xl font-bold mt-1">{profilesAnalyzed}</p>
        </div>
        <div className="bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-slate-900">
              <Database className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total</span>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Data Collected</h3>
          <p className="text-2xl font-bold mt-1">{dataCollected}</p>
        </div>
        <div className="bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-slate-900">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-400">Reports</span>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Reports Generated</h3>
          <p className="text-2xl font-bold mt-1">{reportsGenerated}</p>
        </div>
      </div>

      {/* Form for New Case */}
      {activeTab === 'new' && (
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Start New Case</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Case Number</label>
              <input
                type="text"
                className="mt-1 px-4 py-2 w-full bg-slate-700 text-white rounded-lg"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Platform</label>
              <select
                className="mt-1 px-4 py-2 w-full bg-slate-700 text-white rounded-lg"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Username</label>
              <input
                type="text"
                className="mt-1 px-4 py-2 w-full bg-slate-700 text-white rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <input
                type="password"
                className="mt-1 px-4 py-2 w-full bg-slate-700 text-white rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Begin Analysis
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Cases */}
      {activeTab === 'existing' && (
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Existing Cases</h2>
          <input
            type="text"
            className="px-4 py-2 w-full bg-slate-700 text-white rounded-lg mb-4"
            placeholder="Search by case number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 text-gray-400">Case Number</th>
                <th className="px-4 py-2 text-gray-400">Platform</th>
                <th className="px-4 py-2 text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {existingCases.map((caseData, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{caseData.caseNumber}</td>
                  <td className="px-4 py-2">{caseData.platform}</td>
                  <td className="px-4 py-2">{caseData.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Download PDF Button */}
      {pdfFileUrl && (
        <div className="mt-6">
          <a href={pdfFileUrl} download="InvestigationReport.pdf" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            Download Report PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
