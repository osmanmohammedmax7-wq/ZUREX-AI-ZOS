import { useMemo, useState } from 'react';
import {
  AudioLines,
  Bot,
  Briefcase,
  Check,
  ChevronRight,
  Circle,
  Database,
  FileText,
  Globe,
  Mic,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  Sparkles,
  Square,
  Volume2,
  Wrench,
} from 'lucide-react';
import { askOllama, getOllamaModels } from './lib/ollama';
import type { ChatMessage, SearchResult, TabKey, TaskItem, TaskStatus } from './types';

const timelineStages: Array<{ label: string; state: 'done' | 'active' | 'pending' }> = [
  { label: 'Understanding Request', state: 'done' },
  { label: 'Planning', state: 'done' },
  { label: 'Creating Files', state: 'done' },
  { label: 'Building Interface', state: 'active' },
  { label: 'Testing', state: 'pending' },
  { label: 'Fixing Errors', state: 'pending' },
  { label: 'Finalizing', state: 'pending' },
];

const initialTasks: TaskItem[] = [
  {
    id: 1,
    name: 'Task 01 — Accounting App',
    status: 'Working',
    kind: 'Working',
    progress: 72,
    tools: ['Code Generator', 'Database', 'File Manager'],
    files: [
      { name: 'App.tsx', state: 'Created' },
      { name: 'Dashboard.tsx', state: 'Updated' },
      { name: 'database.sql', state: 'Created' },
    ],
    activity: [
      { time: '12:41:08', text: 'Analyzing project structure...' },
      { time: '12:41:15', text: 'Creating application interface...' },
      { time: '12:41:29', text: 'Connecting database...' },
      { time: '12:41:42', text: 'Running tests...' },
    ],
    decision: 'Used SQLite for a lightweight local accounting workflow with fast local persistence.',
    result: 'The accounting dashboard is running with a clean invoice and transaction layout.',
  },
  {
    id: 2,
    name: 'Task 02 — Website Design',
    status: 'Waiting',
    kind: 'Waiting',
    progress: 22,
    tools: ['Web Search', 'App Builder'],
    files: [{ name: 'LandingPage.tsx', state: 'Created' }],
    activity: [{ time: '12:45:00', text: 'Waiting for design approval...' }],
    decision: 'Exploring a premium luxury brand concept with premium contrast and whitespace.',
    result: 'A premium landing page theme is prepared for review.',
  },
  {
    id: 3,
    name: 'Task 03 — Search',
    status: 'Completed',
    kind: 'Completed',
    progress: 100,
    tools: ['Web Search', 'Calculator'],
    files: [{ name: 'research-summary.md', state: 'Created' }],
    activity: [{ time: '12:50:11', text: 'Research summary completed.' }],
    decision: 'Sorted the most relevant AI app architecture solutions by clarity and ROI.',
    result: 'The research report is ready and categorized for the next task.',
  },
];

const initialMessages: ChatMessage[] = [
  { id: 1, role: 'assistant', text: 'Hello, I am ZUREX AI — ZOS. Tell me what you want to build or optimize, and I will plan, execute, validate, and deliver it.' },
];

const initialSearchResults: SearchResult[] = [
  {
    title: 'Best frameworks for executive AI systems',
    source: 'ZUREX Research',
    snippet: 'A strong executive AI system combines orchestration, task planning, execution validation, and user-friendly reporting loops.',
    url: 'https://example.com/research/executive-ai',
  },
  {
    title: 'Designing premium dark UI systems',
    source: 'UI Insights',
    snippet: 'Warm black palettes, soft glass layers, and gold accents produce a premium AI product identity without visual noise.',
    url: 'https://example.com/research/ui-design',
  },
  {
    title: 'Local model orchestration with Ollama',
    source: 'AI Builders',
    snippet: 'Ollama enables local model deployments with fast iteration and reduced cloud dependency for autonomous workflows.',
    url: 'https://example.com/research/ollama',
  },
];

const toolCards = [
  { name: 'Code Generator', state: 'Running', icon: <Sparkles size={16} /> },
  { name: 'Database', state: 'Connected', icon: <Database size={16} /> },
  { name: 'File Manager', state: 'Ready', icon: <FileText size={16} /> },
  { name: 'Web Search', state: 'Online', icon: <Globe size={16} /> },
  { name: 'Calculator', state: 'Ready', icon: <Briefcase size={16} /> },
  { name: 'App Builder', state: 'Active', icon: <Wrench size={16} /> },
];

const settingsSections = [
  'Account',
  'Language',
  'Voice',
  'AI Model',
  'Appearance',
  'Notifications',
  'Privacy',
  'Permissions',
  'Connected Tools',
  'Search Settings',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('Best AI app architecture patterns');
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialSearchResults);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(1);
  const [prompt, setPrompt] = useState('Build me an accounting app for my store.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [models, setModels] = useState<string[]>(['llama3.1']);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? tasks[0],
    [selectedTaskId, tasks],
  );

  const statusColorMap: Record<TaskStatus, string> = {
    Planning: '#f7d58a',
    Working: '#f5b461',
    Testing: '#efc862',
    Waiting: '#d0b77e',
    Completed: '#7ae7ad',
    Error: '#ff7d7d',
  };

  const runTaskFromPrompt = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    setIsProcessing(true);

    const modelName = models[0] || 'llama3.1';
    const assistantReply = await askOllama(`${userPrompt}\n\nRespond as a premium executive AI assistant and clearly describe the plan, tools, and result.`);

    const newTask: TaskItem = {
      id: Date.now(),
      name: userPrompt.length > 28 ? `${userPrompt.slice(0, 28)}...` : userPrompt,
      status: 'Working',
      kind: 'Working',
      progress: 68,
      tools: ['Code Generator', 'File Manager', 'App Builder'],
      files: [
        { name: 'ZUREXTask.tsx', state: 'Created' },
        { name: 'workflow.md', state: 'Updated' },
      ],
      activity: [
        { time: '12:00:00', text: 'Understanding request...' },
        { time: '12:00:09', text: 'Planning execution...' },
        { time: '12:00:21', text: 'Starting implementation...' },
      ],
      decision: 'The workflow was structured around executive planning, practical tool selection, and user-visible delivery.',
      result: assistantReply,
    };

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: 'user', text: userPrompt },
      { id: prev.length + 2, role: 'assistant', text: assistantReply },
    ]);

    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    setActiveTab('tasks');
    setIsProcessing(false);
  };

  const handleSend = async () => {
    await runTaskFromPrompt(prompt);
    setPrompt('');
  };

  const handleVoiceToggle = () => {
    setIsListening((prev) => !prev);
    setActiveTab('voice');
  };

  const handleSearch = async () => {
    const text = searchQuery.trim();
    if (!text) return;

    const answer = await askOllama(`Research and summarize this topic: ${text}`);

    setSearchResults([
      {
        title: `Search result: ${text}`,
        source: 'ZUREX Research',
        snippet: answer,
        url: 'https://example.com/search/result',
      },
      ...initialSearchResults,
    ]);
  };

  const handleCreateTask = async () => {
    await runTaskFromPrompt(`Create a new task for: ${searchQuery}`);
  };

  const loadModels = async () => {
    const nextModels = await getOllamaModels();
    setModels(nextModels);
  };

  return (
    <div className="app-shell">
      <div className="bg-glow glow-one" />
      <div className="bg-glow glow-two" />

      <header className="topbar glass-panel">
        <div className="brand-wrap">
          <div className="brand-mark">Z</div>
          <div>
            <div className="brand-name">ZUREX AI</div>
            <div className="brand-sub">ZOS Executive Intelligence</div>
          </div>
        </div>

        <nav className="nav">
          {[
            { key: 'chat', label: 'Chat', icon: <Bot size={16} /> },
            { key: 'voice', label: 'Voice', icon: <Mic size={16} /> },
            { key: 'search', label: 'ZUREX Search', icon: <Search size={16} /> },
            { key: 'tasks', label: 'Tasks', icon: <Briefcase size={16} /> },
            { key: 'settings', label: 'Settings', icon: <Settings size={16} /> },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key as TabKey)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="top-actions">
          <button type="button" className="ghost-button small">
            <Circle size={12} />
            Local AI
          </button>
          <button type="button" className="primary-button small" onClick={loadModels}>
            <Sparkles size={14} />
            Connect Ollama
          </button>
        </div>
      </header>

      <main className="main-layout">
        <section className="content-panel glass-panel">
          {activeTab === 'chat' && (
            <div className="panel-stack chat-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Executive workflow</p>
                  <h2>AI Command Console</h2>
                </div>
                <div className="header-actions">
                  <button type="button" className="ghost-button small">
                    <Square size={12} />
                    New Chat
                  </button>
                  <button type="button" className="ghost-button small">
                    <Pause size={12} />
                    Stop
                  </button>
                </div>
              </div>

              <div className="chat-feed">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div className="avatar">
                      {message.role === 'assistant' ? <Bot size={18} /> : <ChevronRight size={18} />}
                    </div>
                    <div className="bubble">
                      {message.text}
                    </div>
                  </div>
                ))}
                {isProcessing && <div className="processing-badge">ZUREX is processing your request...</div>}
              </div>

              <div className="composer glass-input">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Tell ZUREX to build, research, optimize, or automate..."
                />
                <div className="composer-actions">
                  <div className="chip-row">
                    <span className="chip">Voice</span>
                    <span className="chip">Search</span>
                    <span className="chip">Task</span>
                  </div>
                  <div className="composer-buttons">
                    <button type="button" className="ghost-button">
                      <Pause size={14} />
                      Stop
                    </button>
                    <button type="button" className="primary-button" onClick={handleSend}>
                      <Check size={14} />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="panel-stack voice-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Audio control</p>
                  <h2>Voice Interface</h2>
                </div>
              </div>

              <div className="voice-card glass-panel">
                <button type="button" onClick={handleVoiceToggle} className={`mic-button ${isListening ? 'live' : ''}`}>
                  <Mic size={52} />
                </button>
                <div className="voice-state">{isListening ? 'Listening...' : 'Microphone ready'}</div>
                <div className="voice-controls">
                  <button type="button" className="ghost-button" onClick={() => setVoiceEnabled((prev) => !prev)}>
                    <Volume2 size={16} />
                    {voiceEnabled ? 'Mute' : 'Unmute'}
                  </button>
                  <button type="button" className="ghost-button" onClick={handleVoiceToggle}>
                    <Square size={16} />
                    Stop
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="panel-stack search-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Knowledge retrieval</p>
                  <h2>ZUREX Search</h2>
                </div>
              </div>

              <div className="search-box glass-input">
                <Search size={18} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the web, topics, and ideas"
                />
                <button type="button" className="primary-button" onClick={handleSearch}>
                  Search
                </button>
              </div>

              <div className="search-results">
                {searchResults.map((result) => (
                  <article key={`${result.title}-${result.source}`} className="result-card glass-panel">
                    <div className="result-topline">{result.source}</div>
                    <h3>{result.title}</h3>
                    <p>{result.snippet}</p>
                    <div className="result-meta">
                      <span>{result.url}</span>
                      <button type="button" className="text-button" onClick={handleCreateTask}>
                        Create Task
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="panel-stack tasks-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Task management</p>
                  <h2>Execution Workspace</h2>
                </div>
                <button type="button" className="primary-button small">
                  <Plus size={14} />
                  New Task
                </button>
              </div>

              <div className="task-list">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    className={`task-card glass-panel ${selectedTaskId === task.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <div className="task-card-header">
                      <span className="task-name">{task.name}</span>
                      <span className="status-pill" style={{ background: `${statusColorMap[task.status]}22`, color: statusColorMap[task.status] }}>
                        {task.status}
                      </span>
                    </div>
                    <div className="mini-progress">
                      <div style={{ width: `${task.progress}%` }} />
                    </div>
                    <div className="task-meta">
                      <span>{task.kind}</span>
                      <span>{task.progress}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="panel-stack settings-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">System preferences</p>
                  <h2>Settings</h2>
                </div>
              </div>

              <div className="settings-grid">
                {settingsSections.map((section) => (
                  <div key={section} className="setting-item glass-panel">
                    <span>{section}</span>
                    <button type="button" className="text-button">Configure</button>
                  </div>
                ))}
              </div>

              <div className="settings-actions">
                <button type="button" className="ghost-button">Cancel</button>
                <button type="button" className="primary-button">Save</button>
              </div>
            </div>
          )}
        </section>

        <aside className="side-panel glass-panel">
          {selectedTask && (
            <>
              <div className="side-header">
                <div>
                  <p className="eyebrow">Task status</p>
                  <h3>{selectedTask.name}</h3>
                </div>
                <span className="status-pill large" style={{ background: `${statusColorMap[selectedTask.status]}22`, color: statusColorMap[selectedTask.status] }}>
                  {selectedTask.status}
                </span>
              </div>

              <div className="progress-block">
                <div className="progress-row">
                  <span>Progress</span>
                  <strong>{selectedTask.progress}% — {selectedTask.status}</strong>
                </div>
                <div className="glass-progress">
                  <div style={{ width: `${selectedTask.progress}%` }} />
                </div>
              </div>

              <div className="timeline-block">
                <h4>Timeline</h4>
                <div className="timeline">
                  {timelineStages.map((stage) => (
                    <div key={stage.label} className={`timeline-item ${stage.state}`}>
                      <div className="dot" />
                      <span>{stage.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="activity-block">
                <h4>Live Activity</h4>
                <ul>
                  {selectedTask.activity.map((activity) => (
                    <li key={`${activity.time}-${activity.text}`}>
                      <span>{activity.time}</span>
                      <p>{activity.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="current-action">
                <p className="eyebrow">Current Action</p>
                <h4>ZUREX is working</h4>
                <p>Building the dashboard interface...</p>
              </div>

              <div className="tool-grid">
                {toolCards.map((tool) => (
                  <div key={tool.name} className="tool-card glass-panel">
                    <span className="tool-icon">{tool.icon}</span>
                    <div>
                      <strong>{tool.name}</strong>
                      <small>{tool.state}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="files-block">
                <h4>Files</h4>
                <ul>
                  {selectedTask.files.map((file) => (
                    <li key={file.name}>
                      <span>📄 {file.name}</span>
                      <em>{file.state}</em>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="decision-block">
                <h4>AI Decisions</h4>
                <p>{selectedTask.decision}</p>
              </div>

              <div className="error-block">
                <h4>Errors & Fixes</h4>
                <div className="error-box">
                  <strong>⚠ Error detected</strong>
                  <p>{selectedTask.error || 'A validation delay was detected during the task cycle.'}</p>
                  <span>Fixing automatically...</span>
                </div>
              </div>

              <div className="control-row">
                <button type="button" className="ghost-button">
                  <Pause size={14} />
                  Pause
                </button>
                <button type="button" className="ghost-button">
                  <Play size={14} />
                  Resume
                </button>
                <button type="button" className="ghost-button">
                  <Square size={14} />
                  Stop
                </button>
              </div>

              <div className="bottom-actions">
                <button type="button" className="ghost-button">Ask ZUREX</button>
                <button type="button" className="primary-button">Open Result</button>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
