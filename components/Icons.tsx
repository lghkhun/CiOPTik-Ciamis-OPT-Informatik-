
import React from 'react';

export const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L4 23l2 .5-1-2.5 2-.5-1-2.5 2-.5-1-2.5 2-.5-1-2.5 1.5-1.5C16.5 4 17 8 17 8zM15 2c-2.22 0-4.22 1.53-5 3.65C11.53 4.23 13.62 3.5 15 3.5c2.5 0 4.5 2 4.5 4.5 0 1.67-1.11 3.33-2.5 4.5.5-1.67.5-3.5 0-5-1.11-2.22-3.33-3.5-5.5-3.5z" />
  </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

export const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const ApproveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ThumbUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.993 0-1.85-1.007-1.85-2.207v-6.786a2.25 2.25 0 01.092-.85l2.094-3.526A2 2 0 018.82 5.235V5.5a2.25 2.25 0 01-4.5 0V5.235c0-2.034 1.866-3.75 4.12-3.75h.584c.47 0 .92.066 1.358.193l2.836.66c.21.05.39.13.54.24zM7 10a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);

export const ThumbDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.017c.993 0 1.85 1.007 1.85 2.207v6.786a2.25 2.25 0 01-.092.85l-2.094 3.526A2 2 0 0115.18 18.765V18.5a2.25 2.25 0 014.5 0v.265c0 2.034-1.866 3.75-4.12 3.75h-.584c-.47 0-.92-.066-1.358-.193l-2.836-.66a2 2 0 01-.54-.24zM17 14a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.6-2.6L11.25 18l1.938-.648a3.375 3.375 0 002.6-2.6L16.25 13l.648 1.938a3.375 3.375 0 002.6 2.6L21 18l-1.938.648a3.375 3.375 0 00-2.6 2.6z" />
    </svg>
);

export const DatabaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

export const InformationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const EggIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="7" ry="5" transform="rotate(-30 12 12)" />
      <ellipse cx="15" cy="15" rx="3" ry="2" transform="rotate(-30 15 15)" />
      <ellipse cx="9" cy="9" rx="4" ry="2.5" transform="rotate(-30 9 9)" />
    </svg>
);

export const LarvaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6,16 A4,4 0 1,1 14,16 H18 A2,2 0 1,1 18,20 H16 A4,4 0 1,1 8,20 V18 A2,2 0 1,1 8,14 H6 A4,4 0 1,1 6,6 H8 A2,2 0 1,1 8,10 H10 A4,4 0 1,1 18,10 C18,8 16,6 16,6"/>
        <circle cx="7" cy="7" r="1.5" />
    </svg>
);

export const PupaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2 C9,2 7,5 7,9 C7,14 12,22 12,22 C12,22 17,14 17,9 C17,5 15,2 12,2z M10,14 L14,14 L14,15 L10,15z M10,12 L14,12 L14,13 L10,13z M10,10 L14,10 L14,11 L10,11z" />
    </svg>
);

export const AdultInsectIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20,8h-3V6c0-1.1-0.9-2-2-2h-2c-1.1,0-2,0.9-2,2v2H8V6c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6v2H0v2h2v2H0v2h2v2c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-2h3v2c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-2h3v-2h-3v-2h3V8z" />
    </svg>
);

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

export const BabyMouseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-2-9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
);

export const AdultMouseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 12c0-2.21-1.79-4-4-4s-4 1.79-4 4c0 1.63.98 3.04 2.38 3.65-.19.16-.38.33-.58.5-.6.5-1.09 1.14-1.47 1.85H12c-2.21 0-4-1.79-4-4s-1.79-4-4-4-4 1.79-4 4 .5 7 4 7h1v-2c0-1.66 1.34-3 3-3h1.43c.45-.78 1.05-1.44 1.77-2 .1-.09.2-.17.3-.25C13.53 14.1 14 13.1 14 12zM6 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm10 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
    </svg>
);

export const SporeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="2"/>
        <circle cx="16" cy="10" r="1.5"/>
        <circle cx="8" cy="10" r="1.5"/>
        <circle cx="12" cy="7" r="1"/>
        <circle cx="12" cy="17" r="1"/>
        <circle cx="17" cy="14" r="1.2"/>
        <circle cx="7" cy="14" r="1.2"/>
    </svg>
);

export const LeafSpotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L4 23l2 .5-1-2.5 2-.5-1-2.5 2-.5-1-2.5 2-.5-1-2.5 1.5-1.5C16.5 4 17 8 17 8z"/>
        <path d="M12 11l2 2 -2 2 -2 -2z" fill="#A0A0A0"/>
    </svg>
);


export const SporeReleaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L4 23l2 .5-1-2.5 2-.5-1-2.5 2-.5-1-2.5 2-.5-1-2.5 1.5-1.5C16.5 4 17 8 17 8z"/>
        <path d="M12 11l2 2 -2 2 -2 -2z" fill="#A0A0A0"/>
        <circle cx="18" cy="6" r="1"/>
        <circle cx="19" cy="9" r="0.8"/>
        <circle cx="17" cy="3" r="0.6"/>
    </svg>
);

export const BacteriaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <rect x="5" y="11" width="6" height="2" rx="1" transform="rotate(-30 8 12)" />
        <rect x="10" y="7" width="7" height="2" rx="1" transform="rotate(20 13.5 8)" />
        <rect x="12" y="14" width="8" height="2.5" rx="1.25" transform="rotate(-15 16 15.25)" />
    </svg>
);


export const InfectedLeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L4 23l2 .5-1-2.5 2-.5-1-2.5 2-.5-1-2.5 2-.5-1-2.5 1.5-1.5C16.5 4 17 8 17 8z" opacity="0.6"/>
        <path d="M17 8c-1.5-1.5-3-2.5-4.5-3C10.5 3 7.5 4 5 6c-1 1-2 2.5-2 4s1 3 2 4c1.5 1.5 3.5 2 5.5 2 1.5 0 3-.5 4.5-1.5" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
    </svg>
);

export const WaterDropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7.58 2 4 5.58 4 10c0 4.42 8 12 8 12s8-7.58 8-12c0-4.42-3.58-8-8-8z" />
    </svg>
);
