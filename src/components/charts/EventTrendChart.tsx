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
    <div className="bg-primary p-8 rounded-xl  h-[400px]">
        <h2 className="font-bold mb-4 ">Event Volume Trends</h2>
      <ResponsiveContainer width="100%" height="90%">
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