import { useState } from 'react';

interface AboutProps {
  onBack: () => void;
  onNavigate: (page: 'home' | 'about' | 'work' | 'contact') => void;
  currentPage: 'home' | 'about' | 'work' | 'contact';
}

const milestones = [
  ['2001', 'spawned'],
  ['2012', 'competed in professional Street Fighter tournaments'],
  ['2014', 'failed a class for the first time'],
  ['2017', 'scored zero points in a season of varsity basketball'],
  ['2019', 'graduated with a 2.0 GPA'],
  ['2020', 'forgave my parents'],
  ['2021', 'left the country'],
  ['2023', 'worked on some campaigns'],
  ['2024', 'my girl told me she was a lesbian'],
  ['2025', 'perfected a chai recipe'],
];

const photos = [
  '/IMG_8355.jpg',
  '/IMG_8358.jpg',
  '/IMG_8354.jpg',
  '/IMG_8357.jpg',
  '/image000000.JPEG',
  '/IMG_8356.jpg',
];

function MilestonesList({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <hr className="border-t border-black/20" />
      <p className="text-center font-jetbrains-mono text-xs sm:text-sm mt-4 sm:mt-6">
        Important Milestones
      </p>
      <div className="font-jetbrains-mono text-xs sm:text-sm mt-4 sm:mt-6">
        {milestones.map(([year, desc]) => (
          <div key={year} className="flex min-h-[3rem] items-start">
            <span className="w-14 shrink-0 underline">{year}</span>
            <span className="shrink-0 mr-2">-</span>
            <span>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function About({ onBack, onNavigate, currentPage }: AboutProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(1);

  const handlePhotoClick = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  return (
    <div
      className="bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
        <nav className="flex justify-between items-center mb-8 sm:mb-12 md:mb-16 font-roboto-mono text-xs sm:text-sm md:text-base gap-2 sm:gap-4">
          <button
            onClick={() => onNavigate('home')}
            className={`underline hover:opacity-60 transition-opacity ${
              currentPage === 'home' ? 'font-bold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`underline hover:opacity-60 transition-opacity ${
              currentPage === 'about' ? 'font-bold' : ''
            }`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('work')}
            className={`underline hover:opacity-60 transition-opacity ${
              currentPage === 'work' ? 'font-bold' : ''
            }`}
          >
            Work
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`underline hover:opacity-60 transition-opacity ${
              currentPage === 'contact' ? 'font-bold' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Desktop: 3 columns with milestones in right column */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-12 items-start">
          <div className="font-jetbrains-mono text-xs sm:text-sm leading-relaxed">
            <p className="mb-4">
              <span className="font-bold">Hi,</span> I'm Shahzeb.<br />
              I'm currently available for work!<br />
              You should send me an email or something.
            </p>
            <a
              href="mailto:shuhzeb@gmail.com"
              className="hover:opacity-60 transition-opacity inline-block break-all"
            >
              shuhzeb@gmail.com
            </a>
          </div>

          <div>
            <img
              src={photos[currentPhotoIndex]}
              alt="Portrait"
              className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handlePhotoClick}
            />
          </div>

          <div className="font-jetbrains-mono text-xs sm:text-sm leading-relaxed">
            <p>
              <span className="font-bold">After</span> a childhood in gaming and sports, I realized nothing makes me happier than getting in someones head.
              <br /><br />
              This naturally pushed me to intersect consumer psychology and art.
              <br /><br />
              With a deep understanding of pop culture, I create community focused campaigns and installations to help brands stand out in this saturated landscape.
            </p>
            <MilestonesList className="mt-6" />
          </div>
        </div>

        {/* Mobile/tablet: stacked layout */}
        <div className="lg:hidden flex flex-col gap-6 sm:gap-8">
          <div className="font-jetbrains-mono text-xs sm:text-sm leading-relaxed">
            <p className="mb-4">
              <span className="font-bold">Hi,</span> I'm Shahzeb.<br />
              I'm currently available for work!<br />
              You should send me an email or something.
            </p>
            <a
              href="mailto:shuhzeb@gmail.com"
              className="hover:opacity-60 transition-opacity inline-block break-all"
            >
              shuhzeb@gmail.com
            </a>
          </div>

          <div className="flex justify-center">
            <img
              src={photos[currentPhotoIndex]}
              alt="Portrait"
              className="h-auto cursor-pointer hover:opacity-90 transition-opacity object-contain max-h-[35vh]"
              onClick={handlePhotoClick}
            />
          </div>

          <div className="font-jetbrains-mono text-xs sm:text-sm leading-relaxed">
            <p>
              <span className="font-bold">After</span> a childhood in gaming and sports, I realized nothing makes me happier than getting in someones head.
              <br /><br />
              This naturally pushed me to intersect consumer psychology and art.
              <br /><br />
              With a deep understanding of pop culture, I create community focused campaigns and installations to help brands stand out in this saturated landscape.
            </p>
          </div>

          <MilestonesList className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default About;
