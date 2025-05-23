import React, { useState, ReactNode } from 'react';
import { Settings, Mail, Phone, MapPin, Award, Calendar, Clock, Info, FileText, ExternalLink, GraduationCap, Microscope } from 'lucide-react';

// Types
interface Professor {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  profileImage: string;
  biography: string;
  education: Education[];
  expertise: string[];
  courses: Course[];
  research: ResearchItem[];
  publications: Publication[];
  achievements: Achievement[];
  officeHours: OfficeHour[];
  socialLinks: SocialLink[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  field: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  schedule: string;
  semester: string;
  year: string;
  description: string;
}

interface ResearchItem {
  title: string;
  description: string;
}

interface Publication {
  title: string;
  authors: string[];
  journal: string;
  year: string;
  url?: string;
}

interface Achievement {
  title: string;
  year: string;
  description: string;
}

interface OfficeHour {
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

// Shared Components
interface SectionContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <section className={`bg-white rounded-lg shadow-sm p-6 mb-6 hover:shadow-md transition-all duration-300 ${className}`}>
      <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
};

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ text, variant = 'primary', size = 'md' }) => {
  const variants = {
    primary: 'bg-[#3B82F6] text-white',
    secondary: 'bg-[#1E2533] text-white',
    accent: 'bg-[#F59E0B] text-white'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`${variants[variant]} ${sizes[size]} rounded-full font-medium mr-2 mb-2 inline-block`}>
      {text}
    </span>
  );
};

// Profile Components
const ProfileHeader: React.FC<{ professor: Professor }> = ({ professor }) => {
  return (
    <div className="bg-[#1E2533] text-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="p-8 flex flex-col md:flex-row">
        <div className="md:mr-8 mb-6 md:mb-0 flex justify-center">
          <img 
            src={professor.profileImage} 
            alt={professor.name} 
            className="w-40 h-40 object-cover rounded-full border-4 border-white"
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold mb-2">{professor.name}</h1>
          <p className="text-xl opacity-90 mb-1">{professor.title}</p>
          <p className="text-lg opacity-80">{professor.department}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <Mail className="mr-2" size={18} />
              <a href={`mailto:${professor.email}`} className="hover:underline">
                {professor.email}
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2" size={18} />
              <a href={`tel:${professor.phone}`} className="hover:underline">
                {professor.phone}
              </a>
            </div>
            <div className="flex items-center sm:col-span-2">
              <MapPin className="mr-2" size={18} />
              <span>{professor.office}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#151B2A] p-4 flex justify-center space-x-4">
        {professor.socialLinks.map((link, index) => (
          <a 
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
          >
            {link.platform}
          </a>
        ))}
      </div>
    </div>
  );
};

// Main Profile Page Component
const ProfessorProfile: React.FC<{ professor: Professor }> = ({ professor }) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'courses', label: 'Courses' },
    { id: 'research', label: 'Research' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader professor={professor} />
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                    : 'text-gray-600 hover:text-[#3B82F6] hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main content sections */}
            <SectionContainer title="Biography">
              <p className="text-gray-700 leading-relaxed">{professor.biography}</p>
            </SectionContainer>
            
            <SectionContainer title="Research Interests">
              {professor.research.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-700 mt-1">{item.description}</p>
                </div>
              ))}
            </SectionContainer>
            
            <SectionContainer title="Publications">
              {professor.publications.map((pub, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">{pub.title}</h3>
                  <p className="text-gray-600 text-sm">{pub.authors.join(', ')}</p>
                  <p className="text-gray-500 text-sm">{pub.journal}, {pub.year}</p>
                </div>
              ))}
            </SectionContainer>
          </div>
          
          <div className="space-y-6">
            {/* Sidebar sections */}
            <SectionContainer title="Areas of Expertise">
              <div className="flex flex-wrap">
                {professor.expertise.map((item, index) => (
                  <Badge key={index} text={item} variant={index % 2 ? 'secondary' : 'primary'} />
                ))}
              </div>
            </SectionContainer>
            
            <SectionContainer title="Education">
              {professor.education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.year}</p>
                </div>
              ))}
            </SectionContainer>
            
            <SectionContainer title="Office Hours">
              {professor.officeHours.map((oh, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800">{oh.day}</h3>
                  <p className="text-gray-600">
                    {oh.startTime} - {oh.endTime}
                  </p>
                  <p className="text-gray-500">{oh.location}</p>
                </div>
              ))}
            </SectionContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorProfile;