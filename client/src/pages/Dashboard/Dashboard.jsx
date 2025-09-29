import React, { useState } from "react";
import Groups from "../../components/Groups/Groups";
import Members from "../../components/Member/Members";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("groups");

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "groups"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    Groups
                </button>
                <button
                    onClick={() => setActiveTab("members")}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === "members"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    Members
                </button>
            </div>

            {/* Content */}
            {activeTab === "groups" && <Groups />}
            {activeTab === "members" && <Members />}
        </div>
    );
};

export default Dashboard;
