export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  console.log(`🌐 API Request: ${options.method || 'GET'} ${API_URL}${path}`);
  console.log('📤 Headers:', headers);
  if (options.body) console.log('📦 Body:', options.body);
  
  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    console.log(`📥 Response Status: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      let msg = 'Error de red';
      let errorData = null;
      try { 
        errorData = await res.json(); 
        msg = errorData.message || JSON.stringify(errorData); 
      } catch (e) {
        console.log('No se pudo parsear la respuesta de error como JSON');
      }
      console.error('❌ API Error:', { status: res.status, message: msg, data: errorData });
      throw new Error(msg);
    }
    
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      console.log('✅ API Response:', data);
      return data;
    }
    const text = await res.text();
    console.log('✅ API Response (text):', text);
    return text;
  } catch (error) {
    console.error('💥 API Fetch Error:', error);
    throw error;
  }
}


