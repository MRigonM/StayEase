import React, { useState, useEffect } from "react";
import api from "../../authService/AxiosInstance";

const Members = () => {
    const [members, setMembers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [form, setForm] = useState({ id: 0, name: "", role: "", groupId: 0 });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchMembers();
        fetchGroups();
    }, []);

    const fetchMembers = async () => {
        const res = await api.get("/Members");
        setMembers(res.data);
    };

    const fetchGroups = async () => {
        const res = await api.get("/Group");
        setGroups(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.groupId || form.groupId === 0) {
    alert("Please select a valid group before submitting.");
    return;
  }

  // gjej emrin e grupit nga groupId
  const selectedGroup = groups.find((g) => g.id === form.groupId);

  const payload = {
    id: form.id,
    name: form.name.trim(),
    role: form.role.trim(),
    groupId: form.groupId,
    groupName: selectedGroup ? selectedGroup.groupName : "",
  };

  if (isEditing) {
    await api.put(`/Members/${form.id}`, payload);
  } else {
    await api.post("/Members", payload);
  }

  setForm({ id: 0, name: "", role: "", groupId: 0 });
  setIsEditing(false);
  fetchMembers();
};


    const handleEdit = (member) => {
        setForm(member);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        await api.delete(`/Members/${id}`);
        fetchMembers();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Members</h2>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-3 mb-6"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <input
                    type="text"
                    name="role"
                    placeholder="Role"
                    value={form.role}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <select
                    name="groupId"
                    value={form.groupId}
                    onChange={(e) => setForm({ ...form, groupId: parseInt(e.target.value) })}
                    className="border rounded-md px-3 py-2 flex-1"
                    required
                >
                    <option value={0} disabled>
                        -- Select Group --
                    </option>
                    {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.groupName}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    {isEditing ? "Update" : "Create"}
                </button>
            </form>

            {/* List */}
            <ul className="space-y-3">
                {members.map((m) => (
                    <li
                        key={m.id}
                        className="flex justify-between items-center border rounded-lg px-4 py-2"
                    >
            <span>
              <span className="font-semibold">{m.name}</span> ({m.role}) –{" "}
                <span className="italic">Group ID: {m.groupId}</span>
            </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(m)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(m.id)}
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

export default Members;
