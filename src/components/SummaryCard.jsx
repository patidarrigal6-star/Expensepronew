import React from 'react';

export const SummaryCard = React.memo(({ title, amount, icon: Icon, color, subtitle }) => {
    const isString = typeof amount === 'string';
    const formattedAmount = isString ? amount : `₹${(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    return (
        <div className="card summary-card glass">
            <div className="watermark" style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.02, transform: 'rotate(-5deg)', color: 'white' }}>
                <Icon size={120} />
            </div>
            
            {/* Primary Content Group - Vertically Centered Unit */}
            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                
                {/* Top-Aligned Data Row: Text flush with Icon Top */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    
                    {/* 42px Fixed Icon Container */}
                    <div className="icon-wrapper" style={{ 
                        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', 
                        color: '#ffffff', 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '11px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 0 6px rgba(139, 92, 246, 0.3)',
                        flexShrink: 0
                    }}>
                        <Icon size={20} strokeWidth={2.5} />
                    </div>

                    {/* Data Block - Top Aligned */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, padding: 0, paddingTop: '1px' }}>
                            {title}
                        </p>
                        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', margin: 0, padding: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {formattedAmount}
                        </h2>
                    </div>
                </div>

                {/* Description - Grouped (Centered with whole unit by card flex) */}
                {subtitle && (
                    <p style={{ 
                        fontSize: '11px', 
                        color: 'rgba(255,255,255,0.4)', 
                        fontWeight: 500, 
                        marginTop: '10px', 
                        padding: 0, 
                        paddingLeft: '54px' 
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
});
