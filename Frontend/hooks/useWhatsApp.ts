import { useState, useEffect } from 'react';

export const DEFAULT_WHATSAPP_NUMBER = '8801719068999';
export const DEFAULT_WHATSAPP_MESSAGE =
  'Hello SAIN International Logistics, I would like to inquire about freight & shipping services.';

export const getStoredWhatsAppNumber = (): string => {
  try {
    // 1. First check dedicated whatsapp key
    const direct = localStorage.getItem('sain_whatsapp_number');
    if (direct && direct.trim()) return direct.trim().replace(/[^0-9]/g, '');

    // 2. Next check hero config key
    const heroRaw = localStorage.getItem('sain_hero_content_config');
    if (heroRaw) {
      const heroConfig = JSON.parse(heroRaw);
      if (heroConfig.whatsappNumber && heroConfig.whatsappNumber.trim()) {
        return heroConfig.whatsappNumber.trim().replace(/[^0-9]/g, '');
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_WHATSAPP_NUMBER;
};

export const getStoredWhatsAppMessage = (): string => {
  try {
    const heroRaw = localStorage.getItem('sain_hero_content_config');
    if (heroRaw) {
      const heroConfig = JSON.parse(heroRaw);
      if (heroConfig.whatsappDefaultMessage && heroConfig.whatsappDefaultMessage.trim()) {
        return heroConfig.whatsappDefaultMessage.trim();
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_WHATSAPP_MESSAGE;
};

export const useWhatsAppConfig = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>(getStoredWhatsAppNumber);
  const [defaultMessage, setDefaultMessage] = useState<string>(getStoredWhatsAppMessage);

  useEffect(() => {
    const handleUpdate = () => {
      setPhoneNumber(getStoredWhatsAppNumber());
      setDefaultMessage(getStoredWhatsAppMessage());
    };

    window.addEventListener('sain_whatsapp_updated', handleUpdate);
    window.addEventListener('sain_hero_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('sain_whatsapp_updated', handleUpdate);
      window.removeEventListener('sain_hero_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return { phoneNumber, defaultMessage };
};
