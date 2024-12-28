async function generateCode() {
  try {
    console.log('Sending request to generate code...');
    const response = await fetch(
      'https://file-sender-eta.vercel.app/generate_code'
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    document.getElementById('chat-code').innerText = `Chat Code: ${data.code}`;
  } catch (error) {
    console.error('Failed to generate code:', error);
    alert('Failed to generate chat code. Please try again later.');
  }
}

async function joinSession(event) {
  event.preventDefault();
  try {
    const code = document.getElementById('session-code').value;
    const response = await fetch(
      'https://file-sender-eta.vercel.app/join-session',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    alert(data.message || data.error);
  } catch (error) {
    console.error('Failed to join session:', error);
    alert('Failed to join session. Please check the code and try again.');
  }
}

document.getElementById('upload-form').onsubmit = async function (event) {
  event.preventDefault();
  try {
    const formData = new FormData(this);
    const code = document.getElementById('upload-code').value;

    const response = await fetch(
      `https://file-sender-eta.vercel.app/upload/${code}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    alert(data.message || data.error);

    if (data.message && data.message === 'File uploaded successfully.') {
      console.log('File uploaded successfully:', data);
      alert('File uploaded successfully!');
      downloadFile(code);
    } else {
      console.error('File upload failed:', data.error);
      alert('Failed to upload file. Please try again.');
    }
  } catch (error) {
    console.error('File upload failed:', error);
    alert('Failed to upload file. Please try again.');
  }
};

async function downloadFile(code) {
  try {
    const response = await fetch(
      `https://file-sender-eta.vercel.app/download/${code}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'uploaded-file'; 
    link.click();
  } catch (error) {
    console.error('Failed to download file:', error);
    alert('Failed to download the file. Please try again.');
  }
}
