import { useEffect, useState } from "react";

export default function AdminImageUpload() {
  const [watches, setWatches] = useState([]);
  const [selectedWatch, setSelectedWatch] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const backend = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${backend}/api/watches`)
      .then(res => res.json())
      .then(data => setWatches(data));
  }, []);

  const updateImage = async () => {
    await fetch(`${backend}/api/admin/update-image/${selectedWatch}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl })
    });

    alert("Image updated!");
  };

  return (
    <div>
      <h2>Admin: Update Watch Images</h2>

      <select onChange={(e) => setSelectedWatch(e.target.value)}>
        <option>-- Select Watch --</option>
        {watches.map(w => (
          <option key={w.id} value={w.id}>
            {w.brand} {w.model}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Paste Cloudinary URL"
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button onClick={updateImage}>Update Image</button>
    </div>
  );
}
