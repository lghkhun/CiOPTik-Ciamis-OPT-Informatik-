import React from 'react';

// Custom Tooltip Component for a more polished look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Heuristic to differentiate chart types: Bar/Line charts have a label from the X-axis, Pie charts do not.
    const isPieChart = !label;
    const title = isPieChart ? payload[0].name : label;

    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-gray-800 mb-2">{title}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.color || pld.stroke || pld.fill }} className="flex justify-between space-x-4">
            {/* For Pie Chart, the title is already the item name, so use a generic label. For others, use the series name. */}
            <span>{isPieChart ? 'Total Serangan' : pld.name}:</span>
            <span className="font-medium">{pld.value.toFixed(2)} Ha</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
