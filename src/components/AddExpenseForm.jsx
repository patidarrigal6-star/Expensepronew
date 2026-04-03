import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Plus, AlertCircle, CheckCircle2, ChevronDown, Tag } from 'lucide-react';
import { CATEGORIES } from '../utils/categories';

const AddExpenseForm = React.memo(({
    saveSuccess,
    setSaveSuccess,
    setActiveTab,
    isQuickMode,
    addExpense,
    addFormDate,
    setAddFormDate
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const dropdownRef = useRef(null);

    // Handle clicking outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCategorySelect = (name) => {
        setSelectedCategory(name);
        setIsDropdownOpen(false);
    };

    if (saveSuccess) {
        return (
            <div className="success-view-glass text-center">
                <div className="success-icon-wrapper-glass">
                    <CheckCircle2 size={40} className="text-success" />
                </div>
                <h2 className="mb-4 text-white font-semibold text-2xl">Expense Recorded! ✅</h2>
                <p className="text-white/60 mb-8">Aapka kharcha safely Google Sheet mein save ho gaya hai.</p>
                <div className="flex flex-col gap-3">
                    <button
                        className="btn-save-gradient"
                        onClick={() => {
                            setSaveSuccess(false);
                            setSelectedCategory('');
                            document.querySelector('.expense-form')?.reset();
                        }}
                    >
                        Add Another Entry
                    </button>
                    {!isQuickMode && (
                        <button 
                            className="btn-cancel-glass justify-center w-full" 
                            onClick={() => setActiveTab('dashboard')}
                        >
                            Go to Dashboard
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="expense-modal-content">
            <div className="form-header">
                <h2>Add New Transaction</h2>
                {!isQuickMode && (
                    <button className="btn-cancel-glass" onClick={() => setActiveTab('dashboard')}>
                        <AlertCircle size={18} /> Cancel
                    </button>
                )}
            </div>
            <form onSubmit={addExpense} className="expense-form">
                <div className="form-group">
                    <label className="premium-label">Date</label>
                    <div className="input-with-icon">
                        <Calendar size={18} className="field-icon" />
                        <input
                            type="date"
                            name="date"
                            required
                            className="premium-input"
                            value={addFormDate}
                            onChange={(e) => setAddFormDate(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label className="premium-label">Category</label>
                    <div className="glass-dropdown-wrapper" ref={dropdownRef}>
                        <div 
                            className={`glass-dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ position: 'relative' }}
                        >
                            <Tag size={18} className="field-icon" />
                            <span className={`dropdown-text ${selectedCategory ? 'text-white' : 'text-white/40'}`}>
                                {selectedCategory || 'Select Category'}
                            </span>
                            <ChevronDown size={18} className="dropdown-arrow-absolute" />
                        </div>

                        {isDropdownOpen && (
                            <div className="glass-dropdown-menu">
                                {CATEGORIES.map(cat => (
                                    <div 
                                        key={cat.id} 
                                        className={`glass-dropdown-item ${selectedCategory === cat.name ? 'selected' : ''}`}
                                        onClick={() => handleCategorySelect(cat.name)}
                                    >
                                        <div className="text-xl w-6 flex justify-center">{cat.icon}</div>
                                        <span>{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Hidden input to maintain compatibility with existing form submission logic */}
                        <input type="hidden" name="category" value={selectedCategory} required />
                    </div>
                </div>

                <div className="form-group">
                    <label className="premium-label">Amount (₹)</label>
                    <input 
                        type="number" 
                        name="amount" 
                        required 
                        className="premium-input" 
                        placeholder="Enter amount" 
                    />
                </div>
                <div className="form-group">
                    <label className="premium-label">Note</label>
                    <input 
                        type="text" 
                        name="note" 
                        className="premium-input" 
                        placeholder="What's this for?" 
                    />
                </div>
                <button type="submit" className="btn-premium-gradient">Save Expense</button>
            </form>
        </div>
    );
});

export default AddExpenseForm;
