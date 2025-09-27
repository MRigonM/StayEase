"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../authService/AxiosInstance";

export default function CreateProperty() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    nightPrice: "",
    placeType: "",
    region: { id: "", name: "" },
    country: { id: "", name: "" },
    location: { id: "", name: "" },
    owner: { fullName: "", email: "", phoneNumber: "" },
    images: [],       // local file previews
    imageUrls: [],    // saved image URLs from backend
    categories: [],
    roomServices: [],
  });

  const [dropdowns, setDropdowns] = useState({
    countries: [],
    regions: [],
    locations: [],
    categories: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const BASE_URL = "https://localhost:5000/";

  // Fetch dropdown data
  useEffect(() => {
    api.get("/Property/GetProperties").then((res) => {
      const props = res.data.data;

      const unique = (arr, key) =>
          Array.from(new Map(arr.map((i) => [i[key], i])).values());

      setDropdowns({
        countries: unique(props.map((p) => p.country), "id"),
        regions: unique(props.map((p) => p.region), "id"),
        locations: unique(props.map((p) => p.location), "id"),
        categories: unique(props.flatMap((p) => p.categories), "id"),
      });
    });
  }, []);

  const setField = (field, value) => {
    setForm((prev) => {
      const keys = field.split(".");
      let copy = { ...prev };
      let cur = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const toggleCategory = (cat) => {
    setForm((f) => {
      const exists = f.categories.some((c) => c.id === cat.id);
      return {
        ...f,
        categories: exists
            ? f.categories.filter((c) => c.id !== cat.id)
            : [...f.categories, cat],
      };
    });
  };

  const onFileChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm((f) => ({ ...f, images: [...f.images, ...files] }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("Name", form.name);
      fd.append("Description", form.description);
      fd.append("NightPrice", form.nightPrice);
      fd.append("PlaceType", form.placeType);

      fd.append("Region.Id", form.region.id);
      fd.append("Region.Name", form.region.name);
      fd.append("Country.Id", form.country.id);
      fd.append("Country.Name", form.country.name);
      fd.append("Location.Id", form.location.id);
      fd.append("Location.Name", form.location.name);

      fd.append("Owner.FullName", form.owner.fullName);
      fd.append("Owner.Email", form.owner.email);
      fd.append("Owner.PhoneNumber", form.owner.phoneNumber);

      form.images.forEach((file) => fd.append("Images", file));
      form.roomServices.forEach((rs, i) =>
          fd.append(`RoomServices[${i}].Description`, rs.description)
      );
      form.categories.forEach((c, i) => {
        fd.append(`Categories[${i}].Id`, c.id);
        fd.append(`Categories[${i}].Name`, c.name);
      });

      const res = await api.post("/Property/CreateProperty", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Property created!");

      // Update form with backend returned images
      if (res.data.data?.imageUrls) {
        setForm((f) => ({
          ...f,
          imageUrls: res.data.data.imageUrls,
          images: [], // clear local previews
        }));
      }
    } catch (err) {
      console.error(err);
      setMessage("Error creating property.");
    } finally {
      setSubmitting(false);
    }
  };

  const primaryImage =
      form.imageUrls?.length > 0
          ? form.imageUrls[0]  // use directly, no BASE_URL
          : form.images.length > 0
              ? URL.createObjectURL(form.images[0])
              : null;


  const nightly = form.nightPrice;

  return (
      <>
        <Navbar />
        <div className="min-h-screen bg-neutral-50">
          <div className="border-b bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6">
              <h1 className="text-2xl font-semibold tracking-tight">Become a Host</h1>
              <p className="text-sm text-neutral-600">
                Create a new listing with an Airbnb-style flow.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: form */}
            <form onSubmit={onSubmit} className="lg:col-span-2 space-y-6">
              {/* Listing Basics */}
              <section className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Listing basics</h2>
                <input
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                />
                <input
                    type="number"
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    placeholder="Nightly Price"
                    value={form.nightPrice}
                    onChange={(e) => setField("nightPrice", e.target.value)}
                />
                <input
                    type="text"
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    placeholder="Place Type"
                    value={form.placeType}
                    onChange={(e) => setField("placeType", e.target.value)}
                />
                <textarea
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                />
              </section>

              {/* Owner Info */}
              <section className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Owner Information</h2>
                <input
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    placeholder="Full Name"
                    value={form.owner.fullName}
                    onChange={(e) => setField("owner.fullName", e.target.value)}
                />
                <input
                    type="email"
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    placeholder="Email"
                    value={form.owner.email}
                    onChange={(e) => setField("owner.email", e.target.value)}
                />
                <input
                    type="tel"
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Phone Number"
                    value={form.owner.phoneNumber}
                    onChange={(e) => setField("owner.phoneNumber", e.target.value)}
                />
              </section>

              {/* Room Services */}
              <section className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Room Services</h2>
                {form.roomServices.map((rs, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <input
                          className="w-full border rounded-xl px-3 py-2"
                          placeholder="Service description"
                          value={rs.description}
                          onChange={(e) => {
                            const updated = [...form.roomServices];
                            updated[i].description = e.target.value;
                            setForm((f) => ({ ...f, roomServices: updated }));
                          }}
                      />
                      <button
                          type="button"
                          className="text-red-500"
                          onClick={() =>
                              setForm((f) => ({
                                ...f,
                                roomServices: f.roomServices.filter((_, idx) => idx !== i),
                              }))
                          }
                      >
                        ✕
                      </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="border px-3 py-1 rounded-xl mt-2"
                    onClick={() =>
                        setForm((f) => ({
                          ...f,
                          roomServices: [...f.roomServices, { description: "" }],
                        }))
                    }
                >
                  + Add Room Service
                </button>
              </section>

              {/* Images */}
              <section className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Images</h2>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFileChange}
                    className="mb-2"
                />
                <div className="flex gap-2 flex-wrap">
                  {form.imageUrls?.map((img, i) => (
                      <img
                          key={i}
                          src={img}  // just use it directly
                          alt={`property-${i}`}
                          className="h-20 w-20 object-cover rounded-lg border"
                      />
                  ))}
                  {form.images?.map((img, i) => (
                      <img
                          key={i + form.imageUrls.length}
                          src={URL.createObjectURL(img)}
                          alt={`preview-${i}`}
                          className="h-20 w-20 object-cover rounded-lg border"
                      />
                  ))}
                </div>
              </section>

              {/* Location */}
              <section className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                      className="border rounded-xl px-3 py-2"
                      value={form.country?.id || ""}
                      onChange={(e) => {
                        const country = dropdowns.countries.find(
                            (c) => String(c.id) === e.target.value
                        );
                        setForm((f) => ({
                          ...f,
                          country: country || { id: "", name: "" },
                        }));
                      }}
                  >
                    <option value="">Select Country</option>
                    {dropdowns.countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                    ))}
                  </select>

                  <select
                      className="border rounded-xl px-3 py-2"
                      value={form.region?.id || ""}
                      onChange={(e) => {
                        const region = dropdowns.regions.find(
                            (r) => String(r.id) === e.target.value
                        );
                        setForm((f) => ({
                          ...f,
                          region: region || { id: "", name: "" },
                        }));
                      }}
                  >
                    <option value="">Select Region</option>
                    {dropdowns.regions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                    ))}
                  </select>

                  <select
                      className="border rounded-xl px-3 py-2"
                      value={form.location?.id || ""}
                      onChange={(e) => {
                        const location = dropdowns.locations.find(
                            (l) => String(l.id) === e.target.value
                        );
                        setForm((f) => ({
                          ...f,
                          location: location || { id: "", name: "" },
                        }));
                      }}
                  >
                    <option value="">Select Location</option>
                    {dropdowns.locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                    ))}
                  </select>
                </div>
              </section>

              {/* Categories */}
              <section className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {dropdowns.categories.map((cat) => {
                    const active = form.categories.some((c) => c.id === cat.id);
                    return (
                        <button
                            type="button"
                            key={cat.id}
                            onClick={() => toggleCategory(cat)}
                            className={`border px-3 py-2 rounded-xl text-sm ${
                                active ? "bg-black text-white" : ""
                            }`}
                        >
                          {cat.name}
                        </button>
                    );
                  })}
                </div>
              </section>

              <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-black text-white px-5 py-2.5"
              >
                {submitting ? "Creating..." : "Create Listing"}
              </button>
              {message && <p className="mt-2">{message}</p>}
            </form>

            {/* Right: preview */}
            <aside className="space-y-4">
              <div className="bg-white border rounded-2xl overflow-hidden">
                {primaryImage ? (
                    <img src={primaryImage} className="h-48 w-full object-cover" />
                ) : (
                    <div className="h-48 w-full bg-gray-200" />
                )}
                <div className="p-4">
                  <div className="text-sm text-gray-500">
                    {form.location?.name} {form.country?.name}
                  </div>
                  <div className="font-semibold">{form.name || "Your listing"}</div>
                  <p className="text-sm text-gray-600">{form.description}</p>
                  <div className="mt-2">
                    <span className="font-semibold">€{nightly || 0}</span>
                    <span className="text-gray-500"> night</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </>
  );
}
