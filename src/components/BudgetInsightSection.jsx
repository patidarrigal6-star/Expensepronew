import React from 'react';
import { TrendingUp, TrendingDown, Edit3 } from 'lucide-react';

const BudgetInsightSection = React.memo(({ stats, viewMode, currentMonthKey, setBudgetInputVal, setShowBudgetModal }) => {
    const usagePercentage = Math.round((stats.totalPeriodic / stats.budget) * 100);
    const isSafe = stats.remaining > 0;

    return (
        <div className="budget-section" style={{ height: '100%' }}>
            <div className="card insight-card glass" style={{ 
                height: '100%',
                padding: '1.5rem',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
            }}>
                {/* Header with Edit Icon and Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: '1.2rem', 
                            fontWeight: 800, 
                            color: 'rgba(255,255,255,0.95)'
                        }}>
                            {viewMode === 'monthly' ? "Monthly Budget" : "Yearly Budget"}
                        </h3>
                        {viewMode === 'monthly' && (
                            <div 
                                onClick={() => {
                                    setBudgetInputVal(stats.budget);
                                    setShowBudgetModal(true);
                                }}
                                style={{ 
                                    width: '28px', 
                                    height: '28px', 
                                    background: 'rgba(255,255,255,0.05)', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                <Edit3 size={14} color="#eab308" />
                            </div>
                        )}
                    </div>
                    
                    {isSafe ? (
                        <div style={{ 
                            background: 'rgba(16, 185, 129, 0.08)', 
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            color: '#10b981', 
                            padding: '4px 10px', 
                            borderRadius: '10px', 
                            fontSize: '0.72rem', 
                            fontWeight: 800, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '5px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '2px' }} />
                            Safe
                        </div>
                    ) : (
                        <div style={{ 
                            background: 'rgba(239, 68, 68, 0.08)', 
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            color: '#ef4444', 
                            padding: '4px 10px', 
                            borderRadius: '10px', 
                            fontSize: '0.72rem', 
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            Over Budget
                        </div>
                    ) }
                </div>

                {/* Circular Progress Section */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '0.5rem 0' }}>
                    <svg viewBox="0 0 100 100" style={{ width: '190px', height: '190px', transform: 'rotate(-90deg)' }}>
                        {/* Background Track */}
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                        {/* Foreground Progress */}
                        <circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke={isSafe ? "#6366f1" : "#ef4444"}
                            strokeWidth="10"
                            strokeDasharray={`${Math.min(100, usagePercentage) * 2.639} 263.9`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.16, 1, 0.3, 1)', filter: isSafe ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' : 'none' }}
                        />
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-1px' }}>
                            {usagePercentage}%
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '-4px' }}>
                            USED
                        </div>
                    </div>
                </div>

                {/* Quick Info Boxes (Grid 2x1) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="card glass" style={{ background: 'rgba(255,255,255,0.01)', padding: '0.85rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <TrendingUp size={12} />
                            USED
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                            ₹{stats.totalPeriodic.toLocaleString('en-IN')}
                        </div>
                    </div>

                    <div className="card glass" style={{ background: 'rgba(255,255,255,0.01)', padding: '0.85rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <TrendingDown size={12} />
                            REMAIN
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isSafe ? '#10b981' : '#ef4444' }}>
                            ₹{Math.abs(stats.remaining).toLocaleString('en-IN')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default BudgetInsightSection;
