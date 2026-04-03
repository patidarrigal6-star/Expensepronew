import React, { useState, useMemo, useEffect, useRef, useCallback, Suspense } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieIcon,
  Plus, 
  LogOut, 
  ChevronRight, 
  ChevronDown, 
  Filter, 
  Search, 
  Menu, 
  X,
  Calendar, 
  CreditCard, 
  ShoppingCart, 
  Home, 
  Info, 
  AlertCircle, 
  AlertTriangle,
  Lightbulb, 
  Activity, 
  Download, 
  History, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  LayoutDashboard,
  History as HistoryIcon,
  BarChart2,
} from 'lucide-react';
import {
  format,
  isToday,
  startOfMonth,
  startOfYear,
  subMonths,
  startOfDay,
  parseISO,
  getDaysInMonth,
  isSameMonth,
  isSameYear,
  differenceInDays,
  endOfMonth,
  isSameDay,
  parse,
  subDays,
  eachDayOfInterval,
  endOfYear,
  eachMonthOfInterval
} from 'date-fns';
import Sidebar from './components/Sidebar';
import { SummaryCard } from './components/SummaryCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import Login from './components/Login';
import { useDebounce } from './hooks/useDebounce';

import { CATEGORIES, getCategoryDetails } from './utils/categories';
import AnalyticsSection from './components/AnalyticsSection';
import SummaryCardsSection from './components/SummaryCardsSection';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import BudgetInsightSection from './components/BudgetInsightSection';
import AddExpenseForm from './components/AddExpenseForm';
import HistorySection from './components/HistorySection';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ChartsSection = React.lazy(() => import('./components/ChartsSection'));

const API_URL = 'https://script.google.com/macros/s/AKfycbz-q1728GPVjcLQxejyXib1TGDhpqz-PBJubpTkCzbUtaTwsMTUL7XVBN6GEtkz0aUy/exec';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyBudgets, setMonthlyBudgets] = useLocalStorage('expensePro_monthlyBudgets', { default: 50000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('expensePro_isLoggedIn', false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInputVal, setBudgetInputVal] = useState('');
  const [showReportMenu, setShowReportMenu] = useState(false);
  const reportMenuRef = useRef(null);
  const [addFormDate, setAddFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [invViewType, setInvViewType] = useState('all');
  const [invMonth, setInvMonth] = useState(new Date().getMonth());
  const [invYear, setInvYear] = useState(new Date().getFullYear());

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      const mappedData = data
        .filter(item => item.Category && item.Amount)
        .map((item, index) => {
          let dateStr = format(new Date(), 'yyyy-MM-dd');
          let parsedDate = null;
          const currentYear = new Date().getFullYear();

          if (item.Month && item.Month.includes('-') && !item.Month.includes('To')) {
            try {
              parsedDate = parse(item.Month, 'dd-MM-yyyy', new Date());
              if (!parsedDate || isNaN(parsedDate.getTime())) {
                parsedDate = parseISO(item.Month);
              }
            } catch (e) {}
          }

          if ((!parsedDate || isNaN(parsedDate.getTime())) && item.Timestamp) {
            const tsDate = new Date(item.Timestamp);
            if (!isNaN(tsDate.getTime())) parsedDate = tsDate;
          }

          if ((!parsedDate || isNaN(parsedDate.getTime())) && item.Month && item.Month.includes('To')) {
            try {
              const dayStr = item.Month.split('To')[0].trim();
              parsedDate = parse(dayStr, 'd MMM', new Date(currentYear, 0, 1));
            } catch (e) {}
          }

          if (parsedDate && !isNaN(parsedDate.getTime())) {
            dateStr = format(parsedDate, 'yyyy-MM-dd');
          }

          return {
            id: index,
            date: dateStr,
            category: item.Category,
            amount: Number(item.Amount),
            note: item.Discerption || ''
          };
        }).reverse();

      setExpenses(mappedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn || isQuickMode) fetchExpenses();
  }, [isLoggedIn, isQuickMode, fetchExpenses]);

  const [resetMode, setResetMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true') {
      setResetMode(true);
    }
    if (params.get('mode') === 'quick') {
      setIsQuickMode(true);
      setActiveTab('add');
    } else if (params.get('add') === 'true' && isLoggedIn) {
      setActiveTab('add');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reportMenuRef.current && !reportMenuRef.current.contains(event.target)) {
        setShowReportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = useCallback(() => setIsLoggedIn(true), [setIsLoggedIn]);
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem('expensePro_isLoggedIn');
    window.location.reload();
  }, [setIsLoggedIn]);

  const updateBudget = useCallback((monthKey, value) => {
    setMonthlyBudgets(prev => ({ ...prev, [monthKey]: Number(value) }));
  }, [setMonthlyBudgets]);

  const updateDefaultBudget = useCallback((value) => {
    setMonthlyBudgets(prev => ({ ...prev, default: Number(value) }));
  }, [setMonthlyBudgets]);

  const currentMonthKey = format(selectedDate || new Date(), 'yyyy-MM');
  const budgetObj = monthlyBudgets || { default: 50000 };
  const currentBudget = budgetObj[currentMonthKey] || budgetObj.default || 50000;

  const handleSaveBudgetModal = useCallback((e) => {
    e.preventDefault();
    if (budgetInputVal && !isNaN(budgetInputVal)) {
      updateBudget(currentMonthKey, Number(budgetInputVal));
      updateDefaultBudget(Number(budgetInputVal));
      setShowBudgetModal(false);
    }
  }, [budgetInputVal, currentMonthKey, updateBudget, updateDefaultBudget]);

  const currentMonthName = format(selectedDate || new Date(), 'MMMM');


  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 24; i++) options.push(subMonths(new Date(), i));
    return options;
  }, []);

  const stats = useMemo(() => {
    const periodStart = startOfMonth(selectedDate);
    const yearStart = startOfYear(selectedDate);
    const lastMonthStart = startOfMonth(subMonths(selectedDate, 1));
    const lastYearStart = startOfYear(subMonths(selectedDate, 12));

    const categoryTotals = {};
    let totalPeriodic = 0;
    let todayTotal = 0;
    let sipTotal = 0;
    let lastPeriodTotal = 0;

    expenses.forEach(exp => {
      const expDate = parseISO(exp.date);
      const isInMonth = startOfMonth(expDate).getTime() === periodStart.getTime();
      const isInYear = startOfYear(expDate).getTime() === yearStart.getTime();
      const isInPeriod = viewMode === 'monthly' ? isInMonth : isInYear;

      if (isInPeriod) {
        if (exp.category === 'SIP Investment') sipTotal += exp.amount;
        else {
          totalPeriodic += exp.amount;
          categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        }
      }

      if (isToday(expDate)) todayTotal += exp.amount;
    });

    let highestCategory = 'None';
    let highestAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    });

    const budgetToUse = viewMode === 'monthly' ? currentBudget : currentBudget * 12;

    const daysPassed = isSameMonth(periodStart, new Date()) 
      ? new Date().getDate() 
      : getDaysInMonth(periodStart);
    const dailyAverage = totalPeriodic / Math.max(1, daysPassed);

    return {
      totalPeriodic,
      todayTotal,
      sipTotal,
      remaining: budgetToUse - totalPeriodic - sipTotal,
      highestCategory,
      highestAmount,
      budget: budgetToUse,
      dailyAverage
    };
  }, [expenses, currentBudget, viewMode, selectedDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = parseISO(exp.date);
      const periodStart = startOfMonth(selectedDate);
      const isInPeriod = startOfMonth(expDate).getTime() === periodStart.getTime();

      const matchesSearch = exp.note.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || exp.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;

      return isInPeriod && matchesSearch && matchesCategory;
    });
  }, [expenses, debouncedSearchTerm, filterCategory, selectedDate]);

  const handleDownloadPDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      const tableColumn = ["Date", "Category", "Amount", "Note"];
      const tableRows = [];

      filteredExpenses.forEach(exp => {
        const expenseData = [
          format(parseISO(exp.date), 'dd MMM yyyy'),
          exp.category,
          `Rs. ${exp.amount.toLocaleString('en-IN')}`,
          exp.note || '-'
        ];
        tableRows.push(expenseData);
      });

      // Header Section
      doc.setFontSize(22);
      doc.setTextColor(168, 85, 247);
      doc.text("ExpensePro Report", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`${currentMonthName} 2026`, 14, 30);
      doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy')}`, 14, 35);

      // Summary Section
      doc.setDrawColor(168, 85, 247);
      doc.setLineWidth(0.5);
      doc.line(14, 40, 196, 40);

      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`Total Monthly Expense: Rs. ${stats.totalPeriodic.toLocaleString('en-IN')}`, 14, 48);
      doc.text(`Total SIP Investment: Rs. ${stats.sipTotal.toLocaleString('en-IN')}`, 14, 53);
      doc.text(`Remaining Budget: Rs. ${stats.remaining.toLocaleString('en-IN')}`, 14, 58);

      autoTable(doc, {
        startY: 65,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [168, 85, 247], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [248, 248, 248] }
      });

      const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 65;
      doc.setFontSize(10);
      doc.setTextColor(168, 85, 247);
      doc.text("Report generated by ExpensePro Dashboard", 14, finalY + 15);

      // LOW-LEVEL ROBUST DOWNLOAD TRIGGER
      const pdfData = doc.output();
      const pdfBuffer = new ArrayBuffer(pdfData.length);
      const pdfArray = new Uint8Array(pdfBuffer);
      for (let i = 0; i < pdfData.length; i++) {
        pdfArray[i] = pdfData.charCodeAt(i);
      }
      
      const blob = new Blob([pdfArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ExpensePro_Report_2026.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("PDF Error:", error);
    }
  }, [filteredExpenses, currentMonthName, stats]);

  const chartData = useMemo(() => {
    const periodStart = startOfMonth(selectedDate);
    const catMap = {};
    CATEGORIES.forEach(cat => catMap[cat.name] = 0);

    expenses.forEach(e => {
      const expDate = parseISO(e.date);
      if (startOfMonth(expDate).getTime() === periodStart.getTime()) {
        catMap[e.category] = (catMap[e.category] || 0) + e.amount;
      }
    });

    const pieData = CATEGORIES.map(cat => ({
      name: cat.name,
      value: catMap[cat.name] || 0,
      color: cat.color
    }));

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        last7Days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
    }

    const barData = last7Days.map(dateStr => {
        const dayExpenses = expenses.filter(e => e.date === dateStr && e.category !== 'SIP Investment');
        return {
            date: format(parseISO(dateStr), 'dd MMM'),
            amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0)
        };
    });

    return { pieData, barData };
  }, [expenses, selectedDate]);

  const addExpense = useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = Number(formData.get('amount'));
    const category = formData.get('category');
    const note = formData.get('note');
    const date = formData.get('date') || addFormDate;

    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ category, amount, note, Discerption: note, Month: format(parseISO(date), 'dd-MM-yyyy'), timestamp: new Date().toISOString() })
      });
      setTimeout(fetchExpenses, 2000);
      if (isQuickMode) setSaveSuccess(true);
      else setActiveTab('dashboard');
    } catch (e) {
      console.error(e);
    }
  }, [addFormDate, isQuickMode, fetchExpenses]);

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, []);

  if (!isLoggedIn && !isQuickMode) return <Login onLoginSuccess={handleLogin} initialResetMode={resetMode} onQuickAdd={() => { setIsQuickMode(true); setActiveTab('add'); }} />;

  return (
    <div className="app-container mesh-gradient" id="app-root-container">
      {!isQuickMode && (
        <>
          <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddClick={() => setActiveTab('add')}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
          />
        </>
      )}

      <main className="main-content">
        <header className="page-header responsive-header">
          <div className="header-info">
            <h1>
              {activeTab === 'investments' ? 'Portfolio Analysis' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="header-subtitle">
              {activeTab === 'investments' 
                ? 'Track your SIPs and investment performance with precision.'
                : 'Welcome back, track your spending seamlessly.'}
            </p>
          </div>

          <div className="header-controls-group">
            <div className="header-actions">
                {activeTab === 'investments' && (
                <div className="investment-header-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap' }}>
                    {invViewType === 'custom' && (
                    <div className="custom-selectors" style={{ display: 'flex', gap: '8px', animation: 'fadeIn 0.3s' }}>
                        <select 
                        value={invMonth} 
                        onChange={(e) => setInvMonth(Number(e.target.value))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>{format(new Date(2026, i, 1), 'MMMM')}</option>
                        ))}
                        </select>
                        <select 
                        value={invYear} 
                        onChange={(e) => setInvYear(Number(e.target.value))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    )}
                    <div className="investment-filters" style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'nowrap' }}>
                    <div 
                        onClick={() => setInvViewType('all')}
                        style={{ 
                        background: invViewType === 'all' ? 'var(--primary)' : 'transparent', 
                        color: invViewType === 'all' ? 'white' : 'rgba(255,255,255,0.4)', 
                        padding: '8px 20px', 
                        borderRadius: '10px', 
                        fontSize: '0.9rem', 
                        fontWeight: invViewType === 'all' ? 700 : 600, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                        }}
                    >
                        <HistoryIcon size={16} />
                        All Time
                    </div>
                    <div 
                        onClick={() => setInvViewType('month')}
                        style={{ 
                        background: invViewType === 'month' ? 'var(--primary)' : 'transparent', 
                        color: invViewType === 'month' ? 'white' : 'rgba(255,255,255,0.4)', 
                        padding: '8px 16px', 
                        borderRadius: '10px', 
                        fontSize: '0.9rem', 
                        fontWeight: invViewType === 'month' ? 700 : 600, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                        }}
                    >
                        <Calendar size={16} />
                        This Month
                    </div>
                    <div 
                        onClick={() => setInvViewType('custom')}
                        style={{ 
                        background: invViewType === 'custom' ? 'var(--primary)' : 'transparent', 
                        color: invViewType === 'custom' ? 'white' : 'rgba(255,255,255,0.4)', 
                        padding: '8px 16px', 
                        borderRadius: '10px', 
                        fontSize: '0.9rem', 
                        fontWeight: invViewType === 'custom' ? 700 : 600, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                        }}
                    >
                        <Filter size={16} />
                        Custom
                    </div>
                    </div>
                </div>
                )}
                {activeTab === 'dashboard' && (
                <div className="dashboard-controls" style={{ display: 'flex', gap: '20px', position: 'relative', flexWrap: 'nowrap' }}>
                    <div 
                    className="control-pill" 
                    onClick={() => setViewMode(viewMode === 'monthly' ? 'yearly' : 'monthly')}
                    style={{ whiteSpace: 'nowrap' }}
                    >
                    {viewMode === 'monthly' ? 'Monthly View' : 'Yearly View'}
                    <ChevronDown size={16} />
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                    <div 
                        className="control-pill" 
                        onClick={() => setShowReportMenu(!showReportMenu)}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {currentMonthName} {selectedDate.getFullYear()}
                        <ChevronDown size={16} />
                    </div>
                    
                    {showReportMenu && (
                        <div className="card glass shadow-xl" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '200px', zIndex: 100, padding: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                        {monthOptions.map((date, idx) => (
                            <div 
                            key={idx}
                            onClick={() => {
                                setSelectedDate(date);
                                setShowReportMenu(false);
                            }}
                            style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: 'white', transition: 'all 0.2s', fontSize: '0.9rem' }}
                            >
                            {format(date, 'MMMM yyyy')}
                            </div>
                        ))}
                        </div>
                    )}
                    </div>

                    <button 
                    className="btn btn-success" 
                    onClick={handleDownloadPDF}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        background: '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0 24px', 
                        height: '44px',
                        borderRadius: '12px', 
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                    }}>
                    <Download size={20} strokeWidth={2.5} />
                    Download Report
                    </button>
                </div>
                )}
            </div>
            
            {activeTab !== 'investments' && (
              <div className="control-pill date-pill">
                <Calendar size={18} strokeWidth={2.5} />
                <span>{format(new Date(), 'EEEE, dd MMMM')}</span>
              </div>
            )}
          </div>
        </header>



        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="card glass insight-banner">
               <div className="insight-icon-wrapper">
                 <Lightbulb size={20} />
               </div>
               <p className="insight-text">
                 <span className="insight-label">Insight:</span> Your SIP savings rate of {((stats.sipTotal / (stats.totalPeriodic + stats.sipTotal || 1)) * 100).toFixed(1)}% is looking healthy! Keep it up.
               </p>
            </div>
            <SummaryCardsSection stats={stats} currentMonthName={currentMonthName} />
            <Suspense fallback={<div>Loading Charts...</div>}>
              <ChartsSection chartData={chartData} stats={stats} viewMode={viewMode} selectedDate={selectedDate} />
            </Suspense>
            <div className="dashboard-grid-rebalanced" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', gridColumn: 'span 4' }}>
              <RecentTransactionsTable filteredExpenses={filteredExpenses} setActiveTab={setActiveTab} />
              <BudgetInsightSection 
                stats={stats} 
                viewMode={viewMode} 
                currentMonthKey={currentMonthKey} 
                setBudgetInputVal={setBudgetInputVal}
                setShowBudgetModal={setShowBudgetModal}
              />
            </div>
          </div>
        )}

        {/* Budget Edit Modal */}
        {showBudgetModal && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.8)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease'
          }}>
            <div className="card glass" style={{ 
              width: '400px', 
              padding: '2rem', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#0B0F19' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Update {currentMonthName} Budget</h3>
                <button onClick={() => setShowBudgetModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveBudgetModal}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>MONTHLY BUDGET AMOUNT (₹)</label>
                  <input 
                    autoFocus
                    type="number"
                    value={budgetInputVal}
                    onChange={(e) => setBudgetInputVal(e.target.value)}
                    style={{ 
                      width: '100%', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px', 
                      padding: '12px 16px', 
                      color: 'white', 
                      fontSize: '1.2rem', 
                      fontWeight: 700 
                    }}
                    placeholder="Enter amount"
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowBudgetModal(false)}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
                  >
                    Save Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
           <div className="expenses-view">
            <HistorySection expenses={expenses} onDelete={deleteExpense} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsSection chartData={chartData} />
        )}

        {activeTab === 'investments' && (
          <div className="investments-view" style={{ animation: 'fadeIn 0.4s ease-out' }}>
             <div className="card glass" style={{ 
                padding: '2rem', 
                borderRadius: '28px', 
                border: '1px solid rgba(255,255,255,0.05)',
                minHeight: '400px'
             }}>
                <div className="table-responsive">
                    <table className="transaction-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 1rem 1rem', fontSize: '0.9rem' }}>Date</th>
                                <th style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 1rem 1rem', fontSize: '0.9rem' }}>Investment</th>
                                <th style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 1rem 1rem', fontSize: '0.9rem' }}>Amount</th>
                                <th style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 1rem 1rem', fontSize: '0.9rem' }}>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.filter(e => {
                                if (e.category !== 'SIP Investment') return false;
                                const d = parseISO(e.date);
                                if (invViewType === 'month') return isSameMonth(d, new Date());
                                if (invViewType === 'custom') return d.getMonth() === invMonth && d.getFullYear() === invYear;
                                return true;
                            }).sort((a,b) => new Date(b.date) - new Date(a.date)).map((exp) => (
                                <tr key={exp.id} style={{ 
                                    background: 'rgba(255,255,255,0.02)', 
                                    borderRadius: '16px',
                                    transition: 'all 0.2s'
                                }}>
                                    <td style={{ padding: '1.25rem 1rem', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px', fontWeight: 800, color: '#ffffff' }}>
                                        {format(parseISO(exp.date), 'dd MMM yyyy')}
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <span className="badge" style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            background: 'rgba(16, 185, 129, 0.1)', 
                                            color: '#10b981', 
                                            padding: '6px 14px', 
                                            borderRadius: '12px', 
                                            fontSize: '0.85rem', 
                                            fontWeight: 700 
                                        }}>
                                            <span style={{ fontSize: '1rem', color: '#eab308' }}>💰</span>
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: 900, color: '#ffffff', fontSize: '1.15rem' }}>
                                        ₹{exp.amount.toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', borderTopRightRadius: '16px', borderBottomRightRadius: '16px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                        {exp.note || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="form-container card">
            <AddExpenseForm saveSuccess={saveSuccess} setSaveSuccess={setSaveSuccess} setActiveTab={setActiveTab} isQuickMode={isQuickMode} addExpense={addExpense} addFormDate={addFormDate} setAddFormDate={setAddFormDate} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
