const STORAGE_KEY = "maithreya_company_info";

export interface CompanyInfo {
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  aboutText: string;
  aboutText2: string;
  missionText: string;
  visionText: string;
}

const defaults: CompanyInfo = {
  address: "123 Business Avenue, Financial District, Hyderabad",
  phone1: "9951597247",
  phone2: "8247617139",
  email: "reddynarayana11@gmail.com",
  aboutText:
    "Maithreya Investors and Developers is a leading finance and real estate company dedicated to democratising wealth creation. We pool capital from hundreds of investors to build professionally managed, diversified portfolios — giving every individual access to institutional-grade investment opportunities.",
  aboutText2:
    "Our innovative Multi-Level Marketing network empowers business developers, team leaders, marketing managers and directors to grow their wealth while expanding the community — creating a sustainable ecosystem of financial growth and real estate security.",
  missionText:
    "To make professional investment management accessible to every Indian investor — regardless of wealth level — through pooled funds, expert management, and transparent reporting.",
  visionText:
    "To become India's most trusted community-driven investment platform, where every member of our network shares in the prosperity of a professionally managed, diversified portfolio.",
};

function loadInfo(): CompanyInfo {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaults, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return { ...defaults };
}

export function useCompanyInfo() {
  const info = loadInfo();

  const saveInfo = (updates: Partial<CompanyInfo>) => {
    const current = loadInfo();
    const next = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return { info, saveInfo };
}
