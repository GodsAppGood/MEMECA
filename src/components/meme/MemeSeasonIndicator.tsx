import React from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';

const data = [
  { name: 'Dead Memes', value: 20, color: '#ea384c' },
  { name: 'Cold Memes', value: 20, color: '#F97316' },
  { name: 'Neutral Memes', value: 20, color: '#8E9196' },
  { name: 'Hot Memes', value: 20, color: '#22c55e' },
  { name: 'Explosive Memes', value: 20, color: '#15803d' }
];

const currentValue = 75; // This could be dynamic based on your data

export const MemeSeasonIndicator = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 my-12">
      <h2 className="text-2xl font-bold text-center mb-8">Meme Season Indicator</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative w-full md:w-2/3">
          <PieChart width={400} height={250}>
            <Pie
              data={data}
              cx={200}
              cy={200}
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                value={currentValue}
                position="center"
                className="text-2xl font-bold"
                fontSize="24px"
              />
            </Pie>
          </PieChart>
          
          {/* Pointer */}
          <div 
            className="absolute"
            style={{
              left: '200px',
              top: '200px',
              width: '2px',
              height: '70px',
              backgroundColor: '#000',
              transformOrigin: 'bottom center',
              transform: `rotate(${180 - (currentValue / 100 * 180)}deg)`,
              transition: 'transform 0.5s ease-out'
            }}
          />
        </div>

        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">What's driving the meme trend now?</h3>
          
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name} ({index * 20}-{(index + 1) * 20})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};