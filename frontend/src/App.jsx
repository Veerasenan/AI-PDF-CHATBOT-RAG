import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiUpload, FiSend, FiFileText } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file");

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE_URL}/upload/`, formData);
      setUploadedFileName(file.name);
      toast.success("✅ PDF uploaded and processed successfully!");
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: question }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat/`, { question });
      setMessages(prev => [...prev, {
        type: 'bot',
        text: res.data.answer,
        sources: res.data.sources
      }]);
    } catch (err) {
      toast.error("Failed to get response. Is backend running?");
    } finally {
      setQuestion('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-5xl font-bold text-center mb-2 text-indigo-700">📘 AI PDF Chatbot</h1>
        <p className="text-center text-gray-600 mb-10">Upload PDF • Ask Questions • Get Smart Answers</p>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <FiFileText className="text-indigo-600" /> Upload Your PDF
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl p-5 cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-10 py-4 rounded-2xl font-medium flex items-center gap-2"
            >
              <FiUpload /> {uploading ? 'Processing...' : 'Upload PDF'}
            </button>
          </div>
          {uploadedFileName && <p className="mt-3 text-green-600">✅ Uploaded: {uploadedFileName}</p>}
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-3xl shadow-xl flex flex-col h-[580px]">
          <div className="bg-indigo-700 text-white p-5 rounded-t-3xl font-medium text-lg">
            💬 Chat with your Document
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-400">
                Upload a PDF and start asking questions...
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-5 py-4 rounded-2xl ${
                  msg.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                }`}>
                  {msg.text}
                  {msg.sources && <p className="text-xs mt-2 opacity-70">Sources: {msg.sources.join(", ")}</p>}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500">Thinking...</div>}
          </div>

          <form onSubmit={handleAsk} className="p-6 border-t">
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any question about the document..."
                className="flex-1 border border-gray-300 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-2xl disabled:opacity-50"
              >
                <FiSend size={26} />
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;