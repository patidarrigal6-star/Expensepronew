import React from 'react';
import { CreditCard, PieChart as PieIcon, Home, DollarSign, AlertCircle } from 'lucide-react';
import { SummaryCard } from './SummaryCard';

const SummaryCardsSection = React.memo(({ stats, currentMonthName }) => (
    <div className="summary-section">
        <SummaryCard title="TODAY'S TOTAL" amount={stats.todayTotal} icon={CreditCard} />
        <SummaryCard title={`${currentMonthName.toUpperCase()} EXPENSE`} amount={stats.totalPeriodic} icon={PieIcon} />
        <SummaryCard
            title="REMAINING BUDGET"
            amount={stats.remaining}
            icon={Home}
            subtitle={`Budget: ₹${stats.budget.toLocaleString('en-IN')}`}
        />
        <SummaryCard title="DAILY AVERAGE" amount={stats.dailyAverage} icon={DollarSign} subtitle="Spending Speed" />
        <SummaryCard title="HIGHEST CATEGORY" amount={stats.highestAmount} icon={AlertCircle} subtitle={stats.highestCategory} />
        <SummaryCard title="SIP INVESTMENT" amount={stats.sipTotal} icon={PieIcon} subtitle={currentMonthName} />
    </div>
));

export default SummaryCardsSection;
