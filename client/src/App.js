import React, { useState } from 'react';

function App() {
  // State for search
  const [searchName, setSearchName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // State for upload
  const [uploadName, setUploadName] = useState('');
  const [file, setFile] = useState(null);

  // Search handler
  const handleSearch = async () => {
    if (!searchName) {
      alert('Please enter a name to search');
      return;
    }
    const res = await fetch(`/api/getImage?name=${searchName}`);
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setImageUrl(`/${data.filename}?t=${Date.now()}`); // cache-buster
  };

  // Upload handler
  const handleUpload = async () => {
    if (!file || !uploadName) {
      alert('Please select a file and enter a filename (with extension)');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`/api/upload?name=${uploadName}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert(`Upload successful! Saved as ${uploadName}`);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!searchName) {
      alert('Please enter the image name to delete');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${searchName}?`);
    if (!confirmDelete) return;

    const res = await fetch(`/api/deleteImage?name=${searchName}`, { method: 'DELETE' });
    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert(data.message);
      setImageUrl(''); // clear image from UI
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Search Section */}
      <h2>Search Image</h2>
      <input
        type="text"
        placeholder="Enter image name (e.g. cat.png)"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {imageUrl && (
        <div style={{ marginTop: '10px' }}>
          <img src={imageUrl} alt={searchName} style={{ width: '200px' }} />
          <button
            onClick={handleDelete}
            style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
          >
            Delete
          </button>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      {/* Upload Section */}
      <h2>Upload New Image</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Enter filename (e.g. cat.png)"
        value={uploadName}
        onChange={(e) => setUploadName(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;