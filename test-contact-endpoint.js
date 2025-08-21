// Simple test for the contact submission endpoint
const testContactSubmission = async () => {
  const baseUrl = 'http://localhost:3000';
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    sms: '+1234567890',
    sessionId: 'test-session-123',
    visitorNumber: 42,
    submissionType: 'unlock_benefits'
  };

  try {
    const response = await fetch(`${baseUrl}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Contact submission test successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Contact submission test failed:', error);
    return null;
  }
};

// Run the test if server is running
if (typeof window === 'undefined') {
  // Node.js environment
  testContactSubmission();
} else {
  // Browser environment
  console.log('Contact endpoint test ready. Call testContactSubmission() to run.');
}

module.exports = { testContactSubmission };