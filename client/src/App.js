import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);

  // Search for image
  const handleSearch = async () => {
    const res = await fetch(`/api/getImage?name=${name}`);
    const data = await res.json();
    setImageUrl(`/${data.filename}`);
  };

  // Upload new image
  const handleUpload = async () => {
    if (!file || !name) {
      alert('Please select a file and enter a name');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    await fetch(`/api/upload?name=${name}`, {
      method: 'POST',
      body: formData,
    });

    alert('Upload successful!');
    handleSearch(); // Refresh image
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Image Search</h2>
      <input
        type="text"
        placeholder="Enter character name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt={name}
            style={{ width: '200px', marginTop: '10px' }}
          />
        </div>
      )}

      <h2>Upload New Image</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;