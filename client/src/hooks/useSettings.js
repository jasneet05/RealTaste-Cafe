import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://realtaste.onrender.com/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
        }
      } else {
        // Fallback settings if API doesn't exist
        setSettings({ maintenanceMode: false });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Fallback settings
      setSettings({ maintenanceMode: false });
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refetch: fetchSettings };
};