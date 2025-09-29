import React, { useState, useEffect } from "react";
import api from "../../authService/AxiosInstance";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [form, setForm] = useState({ id: 0, groupName: "", description: "" });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const res = await api.get("/Group");
        setGroups(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await api.put(`/Group/${form.id}`, form);
        } else {
            await api.post("/Group", form);
        }
        setForm({ id: 0, groupName: "", description: "" });
        setIsEditing(false);
        fetchGroups();
    };

    const handleEdit = (group) => {
        setForm(group);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        await api.delete(`/Group/${id}`);
        fetchGroups();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Groups</h2>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-3 mb-6"
            >
                <input
                    type="text"
                    name="groupName"
                    placeholder="Group Name"
                    value={form.groupName}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    {isEditing ? "Update" : "Create"}
                </button>
            </form>

            {/* List */}
            <ul className="space-y-3">
                {groups.map((g) => (
                    <li
                        key={g.id}
                        className="flex justify-between items-center border rounded-lg px-4 py-2"
                    >
            <span>
              <span className="font-semibold">{g.groupName}</span> –{" "}
                {g.description}
            </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(g)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(g.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Groups;
