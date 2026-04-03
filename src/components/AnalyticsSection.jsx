import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const AnalyticsSection = React.memo(({ chartData }) => (
    <div className="analytics-view dashboard-grid">
        <div className="card chart-card span-4">
            <h3>Monthly Spending Trend</h3>
            <div className="chart-container" style={{ height: '350px', width: '100%', minHeight: '350px', padding: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.barData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorAmountMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                <stop offset="50%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500 }} 
                            dx={-10}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                background: 'rgba(15, 23, 42, 0.95)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '14px', 
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                            }} 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#8b5cf6" 
                            fillOpacity={1} 
                            fill="url(#colorAmountMain)" 
                            strokeWidth={4} 
                            animationDuration={1500} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="card chart-card span-2">
            <h3>Category Breakdown</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData.pieData}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {chartData.pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="card chart-card span-2">
            <h3>Spend Analysis</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.pieData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradientSide" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#9333ea" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Bar dataKey="value" fill="url(#barGradientSide)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
));

export default AnalyticsSection;
