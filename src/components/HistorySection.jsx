import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Trash2, Search, Filter, Calendar as CalendarIcon, Info } from 'lucide-react';
import { CATEGORIES, getCategoryDetails } from '../utils/categories';

const HistorySection = React.memo(({ expenses, onDelete }) => {
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [dateFilter, setDateFilter] = useState('');
    const [viewType, setViewType] = useState('All Categories'); // This can be used for secondary toggles
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterYear, setFilterYear] = useState('All');
    const [isDateFocused, setIsDateFocused] = useState(false);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = ['2024', '2025', '2026'];

    const filteredHistory = expenses.filter(exp => {
        const expDate = parseISO(exp.date);
        const matchesCategory = categoryFilter === 'All Categories' || exp.category === categoryFilter;
        const matchesDate = !dateFilter || exp.date === dateFilter;
        
        const matchesMonth = filterMonth === 'All' || months[expDate.getMonth()] === filterMonth;
        const matchesYear = filterYear === 'All' || expDate.getFullYear().toString() === filterYear;

        return matchesCategory && matchesDate && matchesMonth && matchesYear;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="history-view-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>


            {/* Filters Section (Card with 3 Selectors) */}
            <div className="card glass history-filter-card" style={{ 
                padding: '1.5rem', 
                borderRadius: '24px', 
                marginBottom: '2rem',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{ position: 'relative' }}>
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ 
                            width: '100%', 
                            background: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.08)', 
                            borderRadius: '12px', 
                            padding: '14px 18px', 
                            color: '#ffffff', 
                            fontSize: '1rem', 
                            fontWeight: 600,
                            appearance: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All Categories" style={{ background: '#0f172a' }}>All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.name} style={{ background: '#0f172a' }}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ position: 'relative' }}>
                    <input 
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        onFocus={() => setIsDateFocused(true)}
                        onBlur={() => setIsDateFocused(false)}
                        style={{ 
                            width: '100%', 
                            background: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.08)', 
                            borderRadius: '12px', 
                            padding: '14px 18px', 
                            color: (dateFilter || isDateFocused) ? '#ffffff' : 'transparent', 
                            fontSize: '1rem', 
                            fontWeight: 600,
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: 2
                        }}
                    />
                    {!dateFilter && !isDateFocused && (
                        <div style={{
                            position: 'absolute',
                            left: '18px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            pointerEvents: 'none',
                            zIndex: 1
                        }}>
                            Date
                        </div>
                    )}
                </div>

                {/* 3rd Row: Month & Year Picker Side-by-Side */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <select 
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            style={{ 
                                width: '100%', 
                                background: 'rgba(255,255,255,0.03)', 
                                border: '1px solid rgba(255,255,255,0.08)', 
                                borderRadius: '12px', 
                                padding: '14px 18px', 
                                color: '#ffffff', 
                                fontSize: '1rem', 
                                fontWeight: 600,
                                appearance: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="All" style={{ background: '#0f172a' }}>All Months</option>
                            {months.map(m => (
                                <option key={m} value={m} style={{ background: '#0f172a' }}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <select 
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            style={{ 
                                width: '100%', 
                                background: 'rgba(255,255,255,0.03)', 
                                border: '1px solid rgba(255,255,255,0.08)', 
                                borderRadius: '12px', 
                                padding: '14px 18px', 
                                color: '#ffffff', 
                                fontSize: '1rem', 
                                fontWeight: 600,
                                appearance: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="All" style={{ background: '#0f172a' }}>All Years</option>
                            {years.map(y => (
                                <option key={y} value={y} style={{ background: '#0f172a' }}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Transactions Table Card */}
            <div className="card glass history-table-card" style={{ 
                padding: '2rem', 
                borderRadius: '28px', 
                border: '1px solid rgba(255,255,255,0.05)',
                minHeight: '400px'
            }}>
                <div className="table-responsive">
                    <table className="transaction-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 0.5rem 1rem', fontSize: '0.9rem' }}>Date</th>
                                <th style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 0.5rem 1rem', fontSize: '0.9rem' }}>Category</th>
                                <th style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 0.5rem 1rem', fontSize: '0.9rem' }}>Amount</th>
                                <th style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 0.5rem 1rem', fontSize: '0.9rem' }}>Note</th>
                                <th style={{ textAlign: 'right', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '0 1rem 0.5rem 1rem', fontSize: '0.9rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.length > 0 ? filteredHistory.map(exp => {
                                const details = getCategoryDetails(exp.category);
                                return (
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
                                                padding: '6px 14px', 
                                                borderRadius: '12px', 
                                                background: `${details.color}15`, 
                                                color: details.color, 
                                                fontSize: '0.85rem', 
                                                fontWeight: 700 
                                            }}>
                                                <span style={{ fontSize: '1rem' }}>{details.icon}</span>
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', fontWeight: 900, color: '#ffffff', fontSize: '1.15rem' }}>
                                            ₹{exp.amount.toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {exp.note || '-'}
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', textAlign: 'right', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
                                            <button 
                                                onClick={() => onDelete(exp.id)}
                                                style={{ 
                                                    background: 'rgba(255,255,255,0.05)', 
                                                    border: '1px solid rgba(255,255,255,0.1)', 
                                                    color: 'rgba(255,255,255,0.4)', 
                                                    width: '36px', 
                                                    height: '36px', 
                                                    borderRadius: '50%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                            >
                                                <Info size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)', fontSize: '1.1rem', fontWeight: 600 }}>
                                        No entries found for the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

export default HistorySection;
