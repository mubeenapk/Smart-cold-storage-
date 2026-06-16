import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MessageSquareWarning, UserCircle2 } from 'lucide-react';
import style from './StaffDashboard.module.css';

const StaffDashboard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Manage Products",
      desc: "View and update inventory",
      icon: <Package size={32} />,
      path: "/staff/viewproducts",
      color: "#3b82f6"
    },
    {
      title: "Complaints",
      desc: "Check and resolve issues",
      icon: <MessageSquareWarning size={32} />,
      path: "/staff/complaint",
      color: "#ef4444"
    },
    {
      title: "My Profile",
      desc: "Update your information",
      icon: <UserCircle2 size={32} />,
      path: "/staff/myprofile",
      color: "#10b981"
    }
  ];

  return (
    <div className={style.wrapper}>
      <header className={style.header}>
        <h1>Welcome to ColdCore</h1>
        <p>Staff Management Portal</p>
      </header>

      <div className={style.grid}>
        {actions.map((item, index) => (
          <div 
            key={index} 
            className={style.card} 
            onClick={() => navigate(item.path)}
          >
            <div className={style.icon} style={{ color: item.color }}>
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;