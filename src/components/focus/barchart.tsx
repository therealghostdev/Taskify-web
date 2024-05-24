import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Button, Menu, MenuItem } from "@mui/material";

// Sample data
const weeklyData = [
  { day: "Sunday", hours: 5 },
  { day: "Monday", hours: 8 },
  { day: "Tuesday", hours: 7 },
  { day: "Wednesday", hours: 6 },
  { day: "Thursday", hours: 9 },
  { day: "Friday", hours: 4 },
  { day: "Saturday", hours: 3 },
];

const monthlyData = [
  { week: "Week 1", hours: 20 },
  { week: "Week 2", hours: 25 },
  { week: "Week 3", hours: 18 },
  { week: "Week 4", hours: 22 },
];

const yearlyData = [
  { month: "January", hours: 80 },
  { month: "February", hours: 75 },
  { month: "March", hours: 85 },
  { month: "April", hours: 90 },
  { month: "May", hours: 70 },
  { month: "June", hours: 60 },
  { month: "July", hours: 95 },
  { month: "August", hours: 80 },
  { month: "September", hours: 75 },
  { month: "October", hours: 85 },
  { month: "November", hours: 90 },
  { month: "December", hours: 70 },
];

// Custom tick and label renderers (if needed)
const renderCustomAxisTick = ({ x, y, payload }: any) => {
  return (
    <text x={x} y={y + 15} textAnchor="middle" fill="#666">
      {payload.value}
    </text>
  );
};

const renderCustomBarLabel = ({ x, y, width, height, value }: any) => {
  return (
    <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>
      {value}
    </text>
  );
};

const BarchartComponent: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (range: "weekly" | "monthly" | "yearly") => {
    setTimeRange(range);
    handleClose();
  };

  const getData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const getXKey = () => {
    switch (timeRange) {
      case "weekly":
        return "day";
      case "monthly":
        return "week";
      case "yearly":
        return "month";
      default:
        return "day";
    }
  };

  return (
    <div className="w-full flex flex-col md:px-6 py-4 gap-y-6 z-[1]">
      <div className="w-full flex justify-between items-center md:px-12 px-6">
        <h1 className="text-[#A5A5A5] text-2xl">Overview</h1>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={{ backgroundColor: "#A5A5A5", color: "#FFFFFF" }}
        >
          Select Time Range
        </Button>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleMenuItemClick("weekly")}>
            Weekly
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("monthly")}>
            Monthly
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("yearly")}>
            Yearly
          </MenuItem>
        </Menu>
      </div>
      <div className="lg:w-3/4 w-full h-96">
        <ResponsiveContainer>
          <BarChart
            data={getData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            className="w-full"
          >
            <XAxis dataKey={getXKey()} tick={renderCustomAxisTick} />
            <YAxis />
            <Legend />
            <Bar
              dataKey="hours"
              fill="#A5A5A5"
              onMouseEnter={(data, index) => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
              label={renderCustomBarLabel}
              barSize={30}
              className="hover:cursor-pointer"
            >
              {getData().map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hoveredBar === index ? "#8687E7" : "#A5A5A5"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarchartComponent;
