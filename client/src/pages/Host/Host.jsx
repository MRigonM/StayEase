import React, { useEffect, useMemo, useState } from "react";
import api from "../../authService/AxiosInstance"; // adjust path if different
import Navbar from "../../components/Navbar";

const placeTypeOptions = ["Apartment", "House", "Studio", "Room", "Villa", "Loft", "Cabin"];
const categoryOptions = [
  { id: 1, name: "Luxury" },
  { id: 2, name: "Budget" },
  { id: 3, name: "Room" },
  { id: 4, name: "Family" },
  { id: 5, name: "Business" },
  { id: 6, name: "Beachfront" },
  { id: 7, name: "Mountain" },
];

const Host = () => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Prefill owner full name from localStorage
  const userName = useMemo(() => localStorage.getItem("userName") || "", []);
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    nightPrice: "",
    placeType: "Studio",
    // geo
    region: { id: 1, name: "North America" },
    country: { id: 1, name: "USA" },
    location: { id: 5, name: "Chicago" },
    // owner
    owner: {
      fullName: "", // will set from localStorage
      email: "",
      phoneNumber: "",
    },
    // dynamic lists
    imageUrls: ["Files/Image/Property/downtown_studio.jpg"],
    roomServices: [{ description: "Smart TV with Netflix" }, { description: "Balcony" }],
    categories: [{ id: 3, name: "Room" }, { id: 2, name: "Budget" }],
  });

  useEffect(() => {
    setForm((f) => ({ ...f, owner: { ...f.owner, fullName: userName } }));
  }, [userName]);

  // ------- helpers -------
  const setField = (path, value) => {
    // path examples: "name", "owner.email", "location.id"
    const parts = path.split(".");
    setForm((prev) => {
      const copy = structuredClone(prev);
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const addRoomService = () => {
    setForm((f) => ({ ...f, roomServices: [...f.roomServices, { description: "" }] }));
  };
  const removeRoomService = (idx) => {
    setForm((f) => ({
      ...f,
      roomServices: f.roomServices.filter((_, i) => i !== idx),
    }));
  };
  const updateRoomService = (idx, value) => {
    setForm((f) => {
      const rs = [...f.roomServices];
      rs[idx] = { description: value };
      return { ...f, roomServices: rs };
    });
  };

  const addImageUrl = () => {
    setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ""] }));
  };
  const removeImageUrl = (idx) => {
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== idx) }));
  };
  const updateImageUrl = (idx, value) => {
    setForm((f) => {
      const arr = [...f.imageUrls];
      arr[idx] = value;
      return { ...f, imageUrls: arr };
    });
  };

  const toggleCategory = (cat) => {
    setForm((f) => {
      const exists = f.categories.some((c) => c.id === cat.id);
      const categories = exists
        ? f.categories.filter((c) => c.id !== cat.id)
        : [...f.categories, cat];
      return { ...f, categories };
    });
  };

  // ------- validation -------
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (form.nightPrice === "" || isNaN(Number(form.nightPrice)) || Number(form.nightPrice) <= 0) {
      e.nightPrice = "Enter a positive nightly price.";
    }
    if (!form.placeType) e.placeType = "Place type is required.";
    if (!form.owner.fullName.trim()) e.fullName = "Owner full name is required.";
    if (!form.owner.email.trim()) e.email = "Owner email is required.";
    if (!form.owner.phoneNumber.trim()) e.phoneNumber = "Owner phone is required.";
    if (!form.location?.id || !form.location?.name) e.location = "Location ID and name are required.";
    if (!form.region?.id || !form.region?.name) e.region = "Region ID and name are required.";
    if (!form.country?.id || !form.country?.name) e.country = "Country ID and name are required.";
    if (!form.imageUrls.length || form.imageUrls.some((u) => !u.trim())) {
      e.imageUrls = "At least one image URL is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ------- payload mapper -------
const buildPayload = () => {
  return {
    Name: form.name.trim(),
    Description: form.description.trim(),
    NightPrice: Number(form.nightPrice),
    PlaceType: form.placeType,
    RegionId: Number(form.region.id),
    CountryId: Number(form.country.id),
    LocationId: Number(form.location.id),
    OwnerFullName: form.owner.fullName.trim(),
    OwnerEmail: form.owner.email.trim(),
    OwnerPhoneNumber: form.owner.phoneNumber.trim(),

    // tani dërgon vetëm emrat e file-ve
    Images: form.imageUrls.filter((u) => u.trim()),

    CategoryIds: form.categories.map((c) => Number(c.id)),
    RoomServices: form.roomServices
      .filter((r) => r.description.trim())
      .map((r) => r.description.trim())
  };
};


  
  // ------- submit -------
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    const payload = buildPayload();
    try {
      setSubmitting(true);
      // Adjust endpoint to your API route:
      console.log("Payload:", payload);
      const res = await api.post("/Property/CreateProperty", payload);
      
      const { isSuccess, message: msg } = res.data || {};
      setMessage(isSuccess ? (msg || "Property created successfully.") : (msg || "Failed to create property."));
      if (isSuccess) {
        // Optionally clear/keep form—here we keep but you can reset if you want.
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message || "Server error while creating property.";
      setMessage(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };




  // ------- mini preview -------
  const primaryImage = form.imageUrls?.[0] || "";
  const nightly = Number(form.nightPrice) || 0;

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Become a Host</h1>
          <p className="text-sm text-neutral-600">Create a new listing with an Airbnb-style flow.</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <form onSubmit={onSubmit} className="lg:col-span-2 space-y-6">
          {/* Listing Basics */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Listing basics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                  placeholder="Downtown Studio"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nightly price (€)</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                  placeholder="120"
                  value={form.nightPrice}
                  onChange={(e) => setField("nightPrice", e.target.value)}
                />
                {errors.nightPrice && <p className="text-red-600 text-sm mt-1">{errors.nightPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Place type</label>
                <select
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                  value={form.placeType}
                  onChange={(e) => setField("placeType", e.target.value)}
                >
                  {placeTypeOptions.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
                {errors.placeType && <p className="text-red-600 text-sm mt-1">{errors.placeType}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
                  placeholder="Compact studio in the heart of downtown."
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Region ID</label>
                <input
                  type="number"
                  className="w-full rounded-xl border px-3 py-2"
                  value={form.region.id}
                  onChange={(e) => setField("region.id", e.target.value)}
                />
                <label className="block text-sm font-medium mt-3 mb-1">Region Name</label>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  value={form.region.name}
                  onChange={(e) => setField("region.name", e.target.value)}
                />
                {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Country ID</label>
                <input
                  type="number"
                  className="w-full rounded-xl border px-3 py-2"
                  value={form.country.id}
                  onChange={(e) => setField("country.id", e.target.value)}
                />
                <label className="block text-sm font-medium mt-3 mb-1">Country Name</label>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  value={form.country.name}
                  onChange={(e) => setField("country.name", e.target.value)}
                />
                {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location ID</label>
                <input
                  type="number"
                  className="w-full rounded-xl border px-3 py-2"
                  value={form.location.id}
                  onChange={(e) => setField("location.id", e.target.value)}
                />
                <label className="block text-sm font-medium mt-3 mb-1">Location Name</label>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  value={form.location.name}
                  onChange={(e) => setField("location.name", e.target.value)}
                />
                {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          </section>

          {/* Owner */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Owner</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  value={form.owner.fullName}
                  onChange={(e) => setField("owner.fullName", e.target.value)}
                />
                {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border px-3 py-2"
                  placeholder="john.doe@gmail.com"
                  value={form.owner.email}
                  onChange={(e) => setField("owner.email", e.target.value)}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  placeholder="11234567890"
                  value={form.owner.phoneNumber}
                  onChange={(e) => setField("owner.phoneNumber", e.target.value)}
                />
                {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>
          </section>

          {/* Media */}
            <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Photos</h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="text-sm underline"
                >
                  + Add URL
                </button>
                <label className="text-sm underline cursor-pointer">
                  + Browse
                 {/* <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                    // për preview
                    const localUrl = URL.createObjectURL(file);

                    // për backend – vetëm emri i file-it
                    setForm((f) => ({
                        ...f,
                        imageUrls: [...f.imageUrls, file.name],  // kjo shkon në payload
                        previewUrls: [...(f.previewUrls || []), localUrl] // vetëm për shfaqje
                    }));
                    }
                }}
                /> */}

                </label>
              </div>
            </div>
            <div className="space-y-3">
              {form.imageUrls.map((u, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    className="flex-1 rounded-xl border px-3 py-2"
                    placeholder="https://example.com/photo.jpg"
                    value={u}
                    onChange={(e) => updateImageUrl(idx, e.target.value)}
                  />
                  {u && (
                    <img
                      src={u}
                      alt="preview"
                      className="w-12 h-12 rounded object-cover border"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeImageUrl(idx)}
                    className="text-sm px-2 py-1 rounded-lg border"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {errors.imageUrls && (
                <p className="text-red-600 text-sm mt-1">{errors.imageUrls}</p>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-3">
              Tip: You can either paste an image URL or browse an image file
              (will be shown as a local preview URL).
            </p>
          </section>

          {/* Amenities (Room Services) */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Room services</h2>
              <button type="button" onClick={addRoomService} className="text-sm underline">
                + Add service
              </button>
            </div>
            <div className="space-y-3">
              {form.roomServices.map((r, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    className="flex-1 rounded-xl border px-3 py-2"
                    placeholder="e.g., Wi-Fi, Coffee machine"
                    value={r.description}
                    onChange={(e) => updateRoomService(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeRoomService(idx)}
                    className="text-sm px-2 py-1 rounded-lg border"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryOptions.map((cat) => {
                const active = form.categories.some((c) => c.id === cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`rounded-2xl border px-3 py-2 text-sm text-left transition
                    ${active ? "border-black ring-1 ring-black" : "hover:border-black/40"}`}
                  >
                    {cat.name}
                    {active && <span className="ml-2 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-black text-white px-5 py-2.5 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create listing"}
            </button>
            {message && <span className="text-sm">{message}</span>}
          </div>
        </form>

        {/* Right: live preview */}
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {primaryImage ? (
              <img src={primaryImage} alt="preview" className="h-48 w-full object-cover" />
            ) : (
              <div className="h-48 w-full bg-neutral-200" />
            )}
            <div className="p-4">
              <div className="text-sm text-neutral-500">
                {form.location?.name || "Location"}, {form.country?.name || ""}
              </div>
              <div className="font-semibold">{form.name || "Your listing name"}</div>
              <div className="text-sm text-neutral-600 line-clamp-2">
                {form.description || "Listing description will appear here."}
              </div>
              <div className="mt-2">
                <span className="font-semibold">€{nightly || 0}</span>
                <span className="text-neutral-500"> night</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.categories.slice(0, 3).map((c) => (
                  <span key={c.id} className="text-xs rounded-full border px-2 py-1">
                    {c.name}
                  </span>
                ))}
                {form.categories.length > 3 && (
                  <span className="text-xs text-neutral-500">+{form.categories.length - 3} more</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <h3 className="text-sm font-medium mb-2">Owner</h3>
            <div className="text-sm">
              <div>{form.owner.fullName || "—"}</div>
              <div className="text-neutral-600">{form.owner.email || "—"}</div>
              <div className="text-neutral-600">{form.owner.phoneNumber || "—"}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
};

export default Host;
