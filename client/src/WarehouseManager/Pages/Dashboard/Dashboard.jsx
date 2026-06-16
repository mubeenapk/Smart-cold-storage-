import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Layers, 
  UserPlus, 
  PlusSquare, 
  Thermometer, 
  FileText, 
  BellRing, 
  LayoutDashboard 
} from 'lucide-react';
import style from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const managerActions = [
    { title: "Staff Management", desc: "View and manage all staff", icon: <Users size={28} />, path: "/warehouse/staff", color: "#2563eb" },
    { title: "Warehouse Sections", desc: "Manage storage zones", icon: <Layers size={28} />, path: "/warehouse/section", color: "#7c3aed" },
    { title: "Add New Staff", desc: "Onboard new employees", icon: <UserPlus size={28} />, path: "/warehouse/addstaff", color: "#059669" },
    { title: "Inventory Entry", desc: "Add products to stock", icon: <PlusSquare size={28} />, path: "/warehouse/addproduct", color: "#db2777" },
    { title: "Temp. Monitor", desc: "Real-time climate tracking", icon: <Thermometer size={28} />, path: "/warehouse/temperaturemonitor", color: "#0284c7" },
    { title: "System Alerts", desc: "View urgent notifications", icon: <BellRing size={28} />, path: "/warehouse/viewalert", color: "#dc2626" },
  ];

  return (
    <div className={style.dashboardWrapper}>
      <div className={style.overlay}>
        <header className={style.header}>
          <div className={style.titleArea}>
            <LayoutDashboard size={32} className={style.titleIcon} />
            <div>
              <h1>Manager Portal</h1>
              <p>ColdCore Warehouse Logistics</p>
            </div>
          </div>
        </header>

        <div className={style.actionGrid}>
          {managerActions.map((action, index) => (
            <div 
              key={index} 
              className={style.actionCard} 
              onClick={() => navigate(action.path)}
            >
              <div className={style.iconCircle} style={{ color: action.color, backgroundColor: `${action.color}15` }}>
                {action.icon}
              </div>
              <div className={action.textDetails}>
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;