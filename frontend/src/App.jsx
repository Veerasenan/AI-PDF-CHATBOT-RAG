import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiUploadCloud,
  FiSend,
  FiFileText,
  FiX,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiCornerDownLeft,
  FiMessageCircle,
} from 'react-icons/fi';
import './App.css';

const API_BASE_URL = 'http://localhost:8000/api';
const MAX_FILE_MB = 25;

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function App() {
  // upload state
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState(0);

  // chat state
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);

  const hasDocument = Boolean(uploadedFileName);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [question]);

  const validateAndSetFile = useCallback((candidate) => {
    if (!candidate) return;
    if (candidate.type !== 'application/pdf' && !candidate.name.toLowerCase().endsWith('.pdf')) {
      toast.error("That file isn't a PDF. Choose a .pdf file to continue.");
      return;
    }
    if (candidate.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`That file is over ${MAX_FILE_MB} MB. Choose a smaller PDF.`);
      return;
    }
    setFile(candidate);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Choose a PDF file first.');

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE_URL}/upload/`, formData, {
        onUploadProgress: (evt) => {
          if (evt.total) setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size);
      setMessages([]);
      toast.success('Document ready — ask away.');
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed. Check the backend and try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveDocument = () => {
    setUploadedFileName('');
    setUploadedFileSize(0);
    setMessages([]);
    setFile(null);
  };

  const handleClearChat = () => setMessages([]);

  const submitQuestion = async () => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    if (!hasDocument) return toast.error('Upload a PDF before asking a question.');

    const userMsg = { id: crypto.randomUUID(), type: 'user', text: trimmed, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat/`, { question: trimmed });
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: 'bot',
          text: res.data.answer,
          sources: res.data.sources,
          time: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: 'error',
          text: "Couldn't reach the document assistant. Confirm the backend is running and try again.",
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitQuestion();
    }
  };

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  const suggestions = [
    'Summarize this document in three sentences',
    'What are the key takeaways?',
    'List any dates or figures mentioned',
  ];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <FiFileText className="brand-mark-doc" />
            <FiMessageCircle className="brand-mark-chat" />
          </span>
          <div>
            <h1>AskDoc</h1>
            <p>Ask questions, get answers straight from your document</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Document panel */}
        <section className="doc-panel" aria-label="Document upload">
          <h2 className="panel-label">Document</h2>

          {!hasDocument ? (
            <div
              className={`dropzone ${dragActive ? 'dropzone-active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <FiUploadCloud className="dropzone-icon" aria-hidden="true" />
              <p className="dropzone-title">Drop a PDF here</p>
              <p className="dropzone-sub">or click to browse · up to {MAX_FILE_MB} MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="sr-only"
                onChange={(e) => validateAndSetFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="doc-card">
              <FiFileText className="doc-card-icon" aria-hidden="true" />
              <div className="doc-card-info">
                <p className="doc-card-name" title={uploadedFileName}>{uploadedFileName}</p>
                <p className="doc-card-meta">{formatBytes(uploadedFileSize)} · ready</p>
              </div>
              <button
                className="icon-btn"
                onClick={handleRemoveDocument}
                aria-label="Remove document and start over"
                title="Remove document"
              >
                <FiX />
              </button>
            </div>
          )}

          {file && !hasDocument && (
            <div className="pending-file">
              <div className="pending-file-row">
                <FiFileText aria-hidden="true" />
                <span className="pending-file-name" title={file.name}>{file.name}</span>
                <span className="pending-file-size">{formatBytes(file.size)}</span>
                <button
                  className="icon-btn"
                  onClick={() => setFile(null)}
                  aria-label="Remove selected file"
                >
                  <FiX />
                </button>
              </div>

              {uploading && (
                <div className="progress-track" aria-hidden="true">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}

              <button
                className="primary-btn"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? `Processing… ${uploadProgress}%` : 'Process document'}
              </button>
            </div>
          )}

          {hasDocument && (
            <button className="ghost-btn" onClick={handleRemoveDocument}>
              Use a different PDF
            </button>
          )}
        </section>

        {/* Chat panel */}
        <section className="chat-panel" aria-label="Conversation">
          <div className="chat-header">
            <h2 className="panel-label">Conversation</h2>
            {messages.length > 0 && (
              <button className="ghost-btn ghost-btn-small" onClick={handleClearChat}>
                <FiTrash2 aria-hidden="true" /> Clear
              </button>
            )}
          </div>

          <div className="chat-scroll" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="empty-state">
                {hasDocument ? (
                  <>
                    <p className="empty-title">Ask something about {uploadedFileName}</p>
                    <div className="suggestion-list">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          className="suggestion-chip"
                          onClick={() => setQuestion(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="empty-title">No document yet</p>
                    <p className="empty-sub">Upload a PDF on the left to start a conversation about it.</p>
                  </>
                )}
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`msg-row msg-row-${msg.type}`}>
                <div className={`bubble bubble-${msg.type}`}>
                  <p className="bubble-text">{msg.text}</p>

                  {msg.sources?.length > 0 && (
                    <div className="footnotes">
                      <span className="footnotes-label">Sources</span>
                      <div className="footnotes-list">
                        {msg.sources.map((s, i) => (
                          <span key={i} className="footnote-chip">
                            <sup>{i + 1}</sup> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bubble-footer">
                    <span className="bubble-time">{formatTime(msg.time)}</span>
                    {msg.type === 'bot' && (
                      <button
                        className="copy-btn"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        aria-label="Copy response"
                      >
                        {copiedId === msg.id ? <FiCheck /> : <FiCopy />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg-row msg-row-bot">
                <div className="bubble bubble-bot bubble-typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              submitQuestion();
            }}
          >
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasDocument ? 'Ask a question about the document…' : 'Upload a PDF to begin…'}
              rows={1}
              disabled={!hasDocument}
              aria-label="Ask a question"
            />
            <button
              type="submit"
              className="send-btn"
              disabled={loading || !question.trim() || !hasDocument}
              aria-label="Send question"
            >
              <FiSend />
            </button>
          </form>
          <p className="composer-hint">
            <FiCornerDownLeft aria-hidden="true" /> to send · Shift + Enter for a new line
          </p>
        </section>
      </main>

      <ToastContainer position="top-right" theme="light" />
    </div>
  );
}

export default App;