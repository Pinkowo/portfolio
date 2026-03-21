export interface Profile {
  name: string;
  nameEn: string;
  nickname: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
}

export const PROFILE: Profile = {
  name: "李逸歆",
  nameEn: "Yi-Hsin, Li",
  nickname: "Pink",
  email: "pinkowo057@gmail.com",
  phone: "0987978057",
  linkedinUrl: "https://www.linkedin.com/in/pink-li",
  githubUrl: "http://github.com/Pinkowo",
  resumeUrl: "https://tinyurl.com/pink-resume",
};
