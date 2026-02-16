"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EventTrendChart = ({data}:any) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 h-[340px]">
        <h2 className="font-bold ">Event Volume Trends</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date"/>
          <Tooltip/>
          <Line type="monotone" dataKey="events" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventTrendChart;