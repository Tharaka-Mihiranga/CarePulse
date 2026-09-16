import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  UserPlus, 
  LifeBuoy, 
  Server, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  CreditCard, 
  Download, 
  Plus, 
  Search, 
  Bell, 
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { Transaction, PageId } from '../types';

interface AdminDashboardProps {
  transactions: Transaction[];
  onNavigate: (page: PageId) => void;
  onAddTransaction: (tx: Transaction) => void;
}

export function AdminDashboard({
  transactions,
  onNavigate,
  onAddTransaction,
}: AdminDashboardProps) {
  const [timeframe, setTimeframe] = useState<'30days' | '7days'>('30days');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Doctor');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportData = () => {
    triggerToast("Exporting clinical & financial analytics report (CSV) - Download started!");
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName) return;
    triggerToast(`User account for ${newUserName} (${newUserRole}) provisioned successfully!`);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // SVG Chart data points
  const chartPoints30d = [
    { label: 'W1', rev: 9200, users: 480 },
    { label: 'W2', rev: 14500, users: 780 },
    { label: 'W3', rev: 11200, users: 650 },
    { label: 'W4', rev: 18400, users: 950 },
    { label: 'W5', rev: 22100, users: 1180 },
    { label: 'W6', rev: 28900, users: 1540 },
    { label: 'W7', rev: 36200, users: 2100 },
    { label: 'W8', rev: 48294, users: 3642 },
  ];

  const chartPoints7d = [
    { label: 'Mon', rev: 4100, users: 320 },
    { label: 'Tue', rev: 5900, users: 450 },
    { label: 'Wed', rev: 6800, users: 510 },
    { label: 'Thu', rev: 7200, users: 590 },
    { label: 'Fri', rev: 9100, users: 780 },
    { label: 'Sat', rev: 8400, users: 690 },
    { label: 'Sun', rev: 10400, users: 920 },
  ];

  const activePoints = timeframe === '30days' ? chartPoints30d : chartPoints7d;
  const maxRev = Math.max(...activePoints.map(p => p.rev));

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 text-sm animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Wireframe Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <span>⚡ AdminCore Control Center</span>
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px]">v4.1 Enterprise</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500">Cross-hospital real-time telemetry, revenue analytics, and system audit log.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#4f46e5] hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New User</span>
          </button>
        </div>
      </div>

      {/* Key Performance Indicators (Metrics Grid from Wireframe 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-2">Total Revenue</div>
          <div className="text-2xl font-bold text-slate-900 mb-2">$48,294.00</div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>▲ 12.5%</span>
            <span className="text-slate-400 font-normal ml-1">vs last month</span>
          </div>
        </div>

        {/* Metric 2: Active Users */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-2">Active Users</div>
          <div className="text-2xl font-bold text-slate-900 mb-2">3,642</div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>▲ 8.1%</span>
            <span className="text-slate-400 font-normal ml-1">vs last month</span>
          </div>
        </div>

        {/* Metric 3: New Signups */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-2">New Signups</div>
          <div className="text-2xl font-bold text-slate-900 mb-2">482</div>
          <div className="text-xs font-semibold text-rose-600 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>▼ 2.4%</span>
            <span className="text-slate-400 font-normal ml-1">vs last month</span>
          </div>
        </div>

        {/* Metric 4: Pending Tickets */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-2">Pending Tickets</div>
          <div className="text-2xl font-bold text-slate-900 mb-2">18</div>
          <div className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>▲ 4</span>
            <span className="text-slate-400 font-normal ml-1">requires attention</span>
          </div>
        </div>
      </div>

      {/* Dashboard Body Grid (2 Columns: 2fr left, 1fr right from Wireframe 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Revenue & Performance Analytics</h2>
                <p className="text-xs text-slate-500">Gross revenue vs active patient engagement trajectory</p>
              </div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="30days">Last 30 Days (Weekly)</option>
                <option value="7days">Last 7 Days (Daily)</option>
              </select>
            </div>

            {/* Interactive SVG Visualization replacing placeholder */}
            <div className="h-64 w-full relative pt-4 pb-2">
              <div className="h-full w-full flex items-end justify-between gap-3 px-2 border-b border-slate-200">
                {activePoints.map((pt, i) => {
                  const heightPercent = Math.round((pt.rev / maxRev) * 85);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      {/* Hover Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-2 py-1 shadow-lg pointer-events-none whitespace-nowrap mb-1">
                        <div>Rev: ${pt.rev.toLocaleString()}</div>
                        <div className="text-indigo-300">{pt.users} Active Users</div>
                      </div>

                      {/* Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[38px] bg-gradient-to-t from-indigo-600 to-indigo-400 hover:to-indigo-300 rounded-t-md transition-all duration-300 group-hover:shadow-md"
                      />

                      {/* Label */}
                      <span className="text-[11px] font-medium text-slate-500">{pt.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-indigo-600 inline-block"></span>
                  Gross Revenue Flow
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Patient Signups +18.4%
                </span>
              </div>
              <button
                onClick={() => onNavigate('payment')}
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Billing Center</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
                <p className="text-xs text-slate-500">Live feed from Checkout Express & Hospital Billing</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-44 pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>
                <button
                  onClick={() => onNavigate('payment')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  + New Charge
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="pb-3 px-2">Patient / Customer</th>
                    <th className="pb-3 px-2">Item / Description</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        {tx.user}
                        <span className="block text-[10px] text-slate-400 font-mono font-normal">{tx.id}</span>
                      </td>
                      <td className="py-3 px-2 text-slate-600 max-w-[180px] truncate">
                        {tx.description}
                      </td>
                      <td className="py-3 px-2 text-slate-500">{tx.date}</td>
                      <td className="py-3 px-2 font-bold text-slate-900">${tx.amount.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            tx.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right Column (1/3 Width) */}
        <div className="space-y-6">
          
          {/* System Status Card from Wireframe 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>System Telemetry & Health</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-slate-600">Server Load</span>
                  <strong className="text-slate-900">42%</strong>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium">
                  <span className="text-slate-600">Database Storage</span>
                  <strong className="text-slate-900">68%</strong>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-600">Core API Uptime</span>
                <strong className="text-emerald-600 font-bold text-sm">99.9%</strong>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>EHR Synchronization</span>
                <span className="text-emerald-700 font-medium">Live (0.12s latency)</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed Widget from Wireframe 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Recent System Activity
            </h2>

            <ul className="space-y-4 text-xs">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-sm">
                  👤
                </div>
                <div>
                  <p className="text-slate-800">
                    <strong>New user registered</strong> (Eleanor Vance, MRN-84920)
                  </p>
                  <div className="text-[11px] text-slate-400 mt-0.5">5 mins ago</div>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-sm">
                  💳
                </div>
                <div>
                  <p className="text-slate-800">
                    <strong>Payment #1092 processed</strong> ($129.00 via Checkout)
                  </p>
                  <div className="text-[11px] text-slate-400 mt-0.5">12 mins ago</div>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-sm">
                  ⚠️
                </div>
                <div>
                  <p className="text-slate-800">
                    <strong>Database backup completed</strong> (Cluster us-central1)
                  </p>
                  <div className="text-[11px] text-slate-400 mt-0.5">1 hour ago</div>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 text-sm">
                  🔒
                </div>
                <div>
                  <p className="text-slate-800">
                    <strong>Password reset requested</strong> for staff s.jenkins
                  </p>
                  <div className="text-[11px] text-slate-400 mt-0.5">2 hours ago</div>
                </div>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Provision New Hospital User</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Arthur Bell"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Email</label>
                <input
                  type="email"
                  placeholder="e.g. a.bell@carepulse.org"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">System Role & Access Tier</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Doctor">Doctor / Physician (EHR Read/Write)</option>
                  <option value="Nurse">Nurse / Clinical Care Staff</option>
                  <option value="Pharmacist">Pharmacist (PharmacyDirect)</option>
                  <option value="Billing Admin">Billing & Finance Specialist</option>
                  <option value="System Admin">Super Administrator</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
