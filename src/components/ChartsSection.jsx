import React from 'react';
import { format } from 'date-fns';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { getCategoryDetails } from '../utils/categories';

const ChartsSection = React.memo(({ chartData, stats, viewMode, selectedDate }) => (
    <div className="analytics-section">
        {/* Category Distribution (Left) */}
        <div className="card chart-card glass" style={{ height: '420px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.5rem' }}>
            <h3 style={{ 
                margin: 0, 
                marginBottom: '1.25rem',
                fontSize: '1.2rem', 
                fontWeight: 800, 
                color: 'rgba(255,255,255,0.95)'
            }}>
                Category Distribution
            </h3>
            <div className="chart-layout">
                <div className="chart-main">
                    <div className="donut-center" style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none', zIndex: 10 }}>
                        <div className="donut-total" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                            ₹{stats.totalPeriodic.toLocaleString('en-IN')}
                        </div>
                        <div className="donut-label" style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 700, 
                            color: 'rgba(255,255,255,0.25)', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.15em',
                            marginTop: '2px'
                        }}>
                            {format(selectedDate, 'MMM')}
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie
                                    data={chartData.pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        background: 'rgba(15, 23, 42, 0.95)', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        borderRadius: '12px', 
                                        color: '#fff',
                                        boxShadow: '0 10px 25px -10px rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(10px)'
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-legend" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px', 
                    overflowY: 'auto', 
                    overflowX: 'hidden',
                    flex: 1,
                    paddingRight: '6px' 
                }}>
                    {chartData.pieData.slice(0, 7).map((entry) => {
                        const chartTotal = chartData.pieData.reduce((sum, item) => sum + item.value, 0);
                        const percent = chartTotal > 0 ? ((entry.value / chartTotal) * 100).toFixed(0) : 0;
                        const details = getCategoryDetails(entry.name);
                        return (
                            <div key={entry.name} className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0px' }}>
                                <div style={{ 
                                    width: '32px', 
                                    minWidth: '32px',
                                    height: '32px', 
                                    borderRadius: '8px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '1rem'
                                }}>
                                    {details.icon}
                                </div>
                                <div className="legend-info" style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0, flex: 1 }}>
                                    <span style={{ 
                                        fontSize: '0.85rem', 
                                        fontWeight: 700, 
                                        color: '#fff',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {entry.name}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', lineHeight: 1.1 }}>{percent}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Recent Activity (Right) */}
        <div className="card chart-card glass" style={{ height: '420px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <h3 style={{ 
                margin: 0, 
                marginBottom: '1.25rem',
                fontSize: '1.2rem', 
                fontWeight: 800, 
                color: 'rgba(255,255,255,0.95)'
            }}>
                Recent Activity
            </h3>
            <div className="chart-container" style={{ flex: 1, padding: '0.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.barData} margin={{ top: 10, right: 10, left: -20, bottom: 35 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.3)', fontWeight: 600 }} 
                            tickFormatter={(val) => {
                                const d = new Date(val);
                                return isNaN(d) ? val : format(d, 'dd MMM');
                            }}
                            dy={15}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.3)', fontWeight: 600 }} 
                            tickCount={5}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            contentStyle={{ 
                                background: 'rgba(15, 23, 42, 0.95)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '12px', 
                                color: '#fff', 
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 10px 25px -10px rgba(0,0,0,0.5)'
                            }}
                        />
                        <Bar 
                            dataKey="amount" 
                            fill="url(#barGradient)" 
                            radius={[8, 8, 0, 0]} 
                            barSize={32} 
                            style={{ filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.2))' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
));

export default ChartsSection;
