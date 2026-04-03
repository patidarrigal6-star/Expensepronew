import React from 'react';
import { 
  History, LayoutDashboard, PieChart, Settings, PlusCircle, LogOut, X, ChevronRight, TrendingUp, Wallet
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onAddClick, isOpen, onClose, onLogout }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'history', label: 'History', icon: History },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
        { id: 'investments', label: 'Investments', icon: TrendingUp },
    ];

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '2.5rem', 
                    padding: '0 4px',
                    height: '40px',
                    gap: '16px' // Increased gap for proper breathing room
                }}>
                    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="logo-icon-wrapper" style={{ display: 'flex', alignItems: 'center', color: '#a855f7' }}>
                            <Wallet size={26} strokeWidth={2.5} />
                        </div>
                        <div className="logo-text" style={{ 
                            fontSize: '1.4rem', // Slightly reduced for better architectural balance
                            fontWeight: 700, 
                            color: '#ffffff', 
                            letterSpacing: '-0.01em',
                            lineHeight: 1,
                            marginTop: '-2px' // Micro-adjustment for absolute visual centering
                        }}>ExpensePro</div>
                    </div>
                    <button className="mobile-toggle" style={{ 
                        padding: 0, 
                        width: 32, 
                        height: 32, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        borderRadius: '8px',
                        color: 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="nav-list" style={{ flex: 1, padding: '0 4px' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    onClose();
                                }}
                            >
                                <Icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                                <span className="sidebar-text">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="sidebar-footer" style={{ 
                    marginTop: 'auto', 
                    paddingTop: '2rem', 
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <button 
                        className="btn-premium-gradient" 
                        onClick={() => { onAddClick(); onClose(); }}
                    >
                        <PlusCircle size={20} />
                        <span className="sidebar-text">Add Expense</span>
                    </button>
                    <button 
                        onClick={onLogout} 
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '12px 20px',
                            width: '100%',
                            color: '#ef4444',
                            fontSize: '1rem', 
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
