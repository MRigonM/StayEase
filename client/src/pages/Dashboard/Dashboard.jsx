import React, { useState } from "react";
import Departamenti from "../../components/Groups/Departamenti";
import Asistenti from "../../components/Member/Asistenti";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("departamenti");

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("departamenti")}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "departamenti"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    Groups
                </button>
                <button
                    onClick={() => setActiveTab("asistenti")}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "asistenti"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    Asistenti
                </button>
            </div>

            {/* Content */}
            {activeTab === "departamenti" && <Departamenti />}
            {activeTab === "asistenti" && <Asistenti />}
        </div>
    );
};

export default Dashboard;
