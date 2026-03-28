import { useGetCompanyInfo } from "./useQueries";

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

export function useCompanyInfo() {
  const { data } = useGetCompanyInfo();

  const backendInfo = data
    ? {
        address: data.address || defaults.address,
        phone1: data.phone1 || defaults.phone1,
        phone2: data.phone2 || defaults.phone2,
        email: data.email || defaults.email,
        aboutText: data.about || defaults.aboutText,
        aboutText2: defaults.aboutText2,
        missionText: data.mission || defaults.missionText,
        visionText: data.vision || defaults.visionText,
      }
    : defaults;

  return { info: backendInfo };
}
