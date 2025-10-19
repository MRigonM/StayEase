import React, { useState, useEffect } from "react";
import api from "../../authService/AxiosInstance";

const Asistenti = () => {
    const [asistenti, setAsistenti] = useState([]);
    const [departamenti, setDepartamenti] = useState([]);
    const [form, setForm] = useState({ id: 0, name: "",mbiemri: "", pozita: "", departamentiId: 0 });
    const [isEditing, setIsEditing] = useState(false);

    const [filterDepartamentiId, setFilterDepartamentiId] = useState(0);

    useEffect(() => {
        fetchAsistenti();
        fetchDepartamenti();
    }, []);

    const fetchAsistenti = async (departamentiId) => {
        let url = "/Asistenti";
        if (departamentiId && departamentiId > 0) {
            url += `?departamentiId=${departamentiId}`;
        }
        const res = await api.get(url);
        setAsistenti(res.data);
    };

    const fetchDepartamenti = async () => {
        const res = await api.get("/Departamenti");
        setDepartamenti(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.departamentiId || form.departamentiId === 0) {
            alert("Please select a valid departamenti before submitting.");
            return;
        }

        const selectedDepartamenti = departamenti.find((g) => g.id === form.departamentiId);

        const payload = {
            id: form.id,
            name: form.name.trim(),
            mbiemri: form.mbiemri.trim(),
            pozita: form.pozita.trim(),
            departamentiId: form.departamentiId,
            departamentiName: selectedDepartamenti ? selectedDepartamenti.emriDepartamentitName : "",
        };

        if (isEditing) {
            await api.put(`/Asistenti/${form.id}`, payload);
        } else {
            await api.post("/Asistenti", payload);
        }

        setForm({ id: 0, name: "",mbiemri: "", pozita: "", departamentiId: 0 });
        setIsEditing(false);
        fetchAsistenti(filterDepartamentiId); // reload keeping filter
    };

    const handleEdit = (asistenti) => {
        setForm(asistenti);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        await api.delete(`/Asistenti/${id}`);
        fetchAsistenti(filterDepartamentiId); // reload keeping filter
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Asistenti</h2>

            <div className="mb-4">
                <label className="block font-medium mb-2">Filter by Departamenti</label>
                <select
                    value={filterDepartamentiId}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setFilterDepartamentiId(value);
                        fetchAsistenti(value);
                    }}
                    className="border rounded-md px-3 py-2"
                >
                    <option value={0}>-- All Departamenti --</option>
                    {departamenti.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.emriDepartamentitName}
                        </option>
                    ))}
                </select>
            </div>

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
                    name="mbiemri"
                    placeholder="Mbiemri"
                    value={form.mbiemri}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <input
                    type="text"
                    name="pozita"
                    placeholder="Pozita"
                    value={form.Pozita}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <select
                    name="departamentiId"
                    value={form.departamentiId}
                    onChange={(e) =>
                        setForm({ ...form, departamentiId: parseInt(e.target.value) })
                    }
                    className="border rounded-md px-3 py-2 flex-1"
                    required
                >
                    <option value={0} disabled>
                        -- Select Departamenti --
                    </option>
                    {departamenti.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.emriDepartamentitName}
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

            <ul className="space-y-3">
                {asistenti.map((m) => (
                    <li
                        key={m.id}
                        className="flex justify-between items-center border rounded-lg px-4 py-2"
                    >
            <span>
              <span className="font-semibold">{m.name}</span> ({m.pozita}) –{" "}
                <span className="ml-1 italic font-bold">
                Departamenti Name: {m.departamentiName}
              </span>
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

export default Asistenti;
