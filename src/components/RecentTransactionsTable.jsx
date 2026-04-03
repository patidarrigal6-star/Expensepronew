import React from 'react';
import { format, parseISO } from 'date-fns';
import { getCategoryDetails } from '../utils/categories';

const RecentTransactionsTable = React.memo(({ filteredExpenses, setActiveTab }) => (
    <div className="recent-section" style={{ height: '100%' }}>
        <div className="card table-card glass" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <div className="card-header-flex" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ 
                    margin: 0, 
                    fontSize: '1.2rem', 
                    fontWeight: 800, 
                    color: 'rgba(255,255,255,0.95)'
                }}>
                    Recent Transactions
                </h3>
                <button 
                  onClick={() => setActiveTab('history')}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'rgba(255,255,255,0.6)', 
                    padding: '6px 16px', 
                    borderRadius: '10px', 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="view-all-btn"
                >
                    View All
                </button>
            </div>
            <div className="table-responsive" style={{ flex: 1 }}>
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th style={{ width: '85px', paddingLeft: '1.5rem' }}>Date</th>
                            <th style={{ width: '165px' }}>Category</th>
                            <th style={{ textAlign: 'right', width: '105px' }}>Amount</th>
                            <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.slice(0, 5).map(exp => {
                            const details = getCategoryDetails(exp.category);
                            return (
                                <tr key={exp.id} className="tr-row">
                                    <td style={{ paddingLeft: '1.5rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                                        {format(parseISO(exp.date), 'dd MMM')}
                                    </td>
                                    <td>
                                        <span className="badge" style={{ 
                                            background: `${details.color}15`, 
                                            color: details.color, 
                                            borderColor: `${details.color}30` 
                                        }}>
                                            <span style={{ fontSize: '1rem' }}>{details.icon}</span>
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className="amount-symbol">₹</span>
                                        <span className="amount-value">{exp.amount.toLocaleString('en-IN')}</span>
                                    </td>
                                    <td style={{ 
                                        textAlign: 'right', 
                                        paddingRight: '1.5rem', 
                                        color: 'rgba(255,255,255,0.5)', 
                                        fontWeight: 500, 
                                        fontStyle: 'italic'
                                    }}>
                                        {exp.note || '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
));

export default RecentTransactionsTable;
