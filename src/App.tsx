import React, { useState, useEffect, useRef } from 'react';
import About from './About';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'work' | 'contact'>('home');
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [shopHovered, setShopHovered] = useState(false);
  const [shopPressed, setShopPressed] = useState(false);
  const [shopClickCount, setShopClickCount] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoFadeIn, setVideoFadeIn] = useState(false);
  const [cursorMessage, setCursorMessage] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [catState, setCatState] = useState<'idle' | 'typing'>('idle');
  const catStateRef = useRef<'idle' | 'typing'>('idle');
  const [descriptionLines, setDescriptionLines] = useState<string[]>(['this is a portfolio']);
  const [currentTypingLine, setCurrentTypingLine] = useState('');
  const isTypingRef = useRef(false);
  const currentTextRef = useRef('');
  const currentCharIndexRef = useRef(0);
  const currentTypingLineRef = useRef('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectListRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledRef = useRef(false);
  const joinUsHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMousePositionRef = useRef<{ x: number; y: number } | null>(null);
  const [showHomeLink, setShowHomeLink] = useState(false);
  const lastTypedTextRef = useRef('');

  const portfolioItems = [
    { name: 'about', description: 'Internet troll turned Writer/Director' },
    { name: 'work', description: 'Stuff I have done' },
    { name: 'contact', description: 'Give me your money' },
  ];

  const poems = [
    { name: 'the', urduName: 'یہ', poem: 'The place you grew up in still exists.' },
    { name: 'world', urduName: 'دنیا', poem: 'World without wonder is a world that is dead.' },
    { name: 'is', urduName: 'ہے', poem: 'Is it arrogant to tell me to grow up?' },
    { name: 'our', urduName: 'ہماری', poem: 'Our sand castles are still here.' },
    { name: 'playground', urduName: 'کھیل کا میدان', poem: 'Playgrounds are fountains of life.' },
    { name: 'and', urduName: 'اور', poem: 'And so what if you choose your own path?' },
    { name: 'we', urduName: 'ہم', poem: 'We will survive only together.' },
    { name: 'must', urduName: 'چاہیے', poem: 'Must you always have something to say?' },
    { name: 'play', urduName: 'کھیلنا', poem: 'Play time is the deepest meditation.' },
  ];

  const projects = [...portfolioItems, ...poems];


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track mouse position for desktop scroll detection
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Handle desktop scroll to check which element is under cursor
  useEffect(() => {
    if (isMobile || !projectListRef.current) return;

    const handleScroll = () => {
      if (!lastMousePositionRef.current) return;

      const { x, y } = lastMousePositionRef.current;
      const elementUnderCursor = document.elementFromPoint(x, y);

      if (!elementUnderCursor) return;

      // Find which project element contains this element
      projectRefs.current.forEach((ref, index) => {
        if (ref && (ref === elementUnderCursor || ref.contains(elementUnderCursor))) {
          if (activeProject !== index) {
            setActiveProject(index);
            const text = index < 3
              ? projects[index].description
              : projects[index].poem;
            startTyping(text);
          }
        }
      });
    };

    const container = projectListRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, activeProject, projects]);

  useEffect(() => {
    if (!isMobile || !projectListRef.current) return;

    const handleScroll = () => {
      if (!projectListRef.current) return;

      // Mark that user has scrolled
      if (!hasScrolledRef.current) {
        hasScrolledRef.current = true;
      }

      const container = projectListRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestProject = null;
      let closestDistance = Infinity;

      projectRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const projectCenter = rect.top + rect.height / 2;
          const distance = Math.abs(projectCenter - containerCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestProject = index;
          }
        }
      });

      if (closestProject !== null && closestProject !== activeProject) {
        setActiveProject(closestProject);

        // Trigger typing animation on mobile
        const text = closestProject < 3
          ? projects[closestProject].description
          : projects[closestProject].poem;
        startTyping(text);
      }
    };

    const container = projectListRef.current;
    container.addEventListener('scroll', handleScroll);

    // Don't call handleScroll on mount - wait for user to scroll

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isMobile, activeProject]);

  useEffect(() => {
    if (currentPage !== 'home') return;

    let scrollTarget = 0;
    let animationFrame: number | null = null;

    const smoothScroll = () => {
      if (!projectListRef.current) return;

      const current = projectListRef.current.scrollTop;
      const diff = scrollTarget - current;

      // Smoother easing with 8% interpolation
      if (Math.abs(diff) > 0.1) {
        projectListRef.current.scrollTop = current + diff * 0.08;
        animationFrame = requestAnimationFrame(smoothScroll);
      } else {
        projectListRef.current.scrollTop = scrollTarget;
        animationFrame = null;
      }
    };

    const handleGlobalScroll = (e: WheelEvent) => {
      e.preventDefault();

      if (projectListRef.current) {
        // Update target scroll position - slower multiplier
        scrollTarget += e.deltaY * 0.4;

        // Clamp to valid scroll range
        const maxScroll = projectListRef.current.scrollHeight - projectListRef.current.clientHeight;
        scrollTarget = Math.max(0, Math.min(scrollTarget, maxScroll));

        // Start smooth scrolling if not already running
        if (animationFrame === null) {
          animationFrame = requestAnimationFrame(smoothScroll);
        }
      }
    };

    // Initialize scroll target
    if (projectListRef.current) {
      scrollTarget = projectListRef.current.scrollTop;
    }

    // Add wheel event listener to the entire document
    document.addEventListener('wheel', handleGlobalScroll, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleGlobalScroll);
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentPage]);


  const handleProjectClick = (index: number, projectName: string) => {
    if (index < 3) {
      const pageName = projectName.toLowerCase() as 'about' | 'work' | 'contact';
      setCurrentPage(pageName);
    }
  };

  const transitionToTyping = () => {
    if (catStateRef.current === 'idle') {
      setCatState('typing');
      catStateRef.current = 'typing';
    }
  };

  const transitionToIdle = () => {
    if (catStateRef.current === 'typing') {
      setCatState('idle');
      catStateRef.current = 'idle';
    }
  };

  const typeNextCharacter = () => {
    const MAX_LINE_WIDTH = window.innerWidth < 640 ? 32 : window.innerWidth < 1024 ? 46 : window.innerWidth < 1280 ? 48 : 52;

    if (currentCharIndexRef.current >= currentTextRef.current.length) {
      // Finished typing - just stop, leave the last line where it is
      isTypingRef.current = false;
      transitionToIdle();
      return;
    }

    const prevLine = currentTypingLineRef.current;
    const isFirstWord = prevLine === '' && currentCharIndexRef.current === 0;

    if (isFirstWord) {
      // Type entire first word at once
      const firstSpaceIndex = currentTextRef.current.indexOf(' ');
      const firstWord = firstSpaceIndex > -1
        ? currentTextRef.current.substring(0, firstSpaceIndex + 1)
        : currentTextRef.current;

      currentCharIndexRef.current = firstWord.length;
      currentTypingLineRef.current = firstWord;
      setCurrentTypingLine(firstWord);

      transitionToTyping();

      // Schedule next character with dynamic speed
      const speed = (typeNextCharacter as any).speed || 15;
      typingTimeoutRef.current = setTimeout(typeNextCharacter, speed);
      return;
    }

    // Skip leading spaces after a line wrap
    if (prevLine === '' && currentTextRef.current[currentCharIndexRef.current] === ' ') {
      currentCharIndexRef.current++;
      typingTimeoutRef.current = setTimeout(typeNextCharacter, 0);
      return;
    }

    // Check if we're at a space - if so, look ahead to see if the next word fits
    if (currentTextRef.current[currentCharIndexRef.current] === ' ') {
      // Find the next word
      let wordStart = currentCharIndexRef.current + 1;
      let wordEnd = wordStart;

      while (wordEnd < currentTextRef.current.length && currentTextRef.current[wordEnd] !== ' ') {
        wordEnd++;
      }

      const nextWord = currentTextRef.current.substring(wordStart, wordEnd);
      const lineWithNextWord = prevLine + ' ' + nextWord;

      // Check if next word alone would exceed limit
      if (lineWithNextWord.length > MAX_LINE_WIDTH && prevLine.trim() !== '') {
        // Wrap before this word
        setDescriptionLines(lines => [...lines, prevLine.trim()]);
        currentTypingLineRef.current = '';
        setCurrentTypingLine('');
        currentCharIndexRef.current++;
        typingTimeoutRef.current = setTimeout(typeNextCharacter, 0);
        return;
      }

      // If next word fits, check if there's a word after it
      // Find the word after next
      let secondWordStart = wordEnd + 1;
      if (secondWordStart < currentTextRef.current.length && currentTextRef.current[wordEnd] === ' ') {
        let secondWordEnd = secondWordStart;
        while (secondWordEnd < currentTextRef.current.length && currentTextRef.current[secondWordEnd] !== ' ') {
          secondWordEnd++;
        }

        const secondWord = currentTextRef.current.substring(secondWordStart, secondWordEnd);
        const lineWithBothWords = lineWithNextWord + ' ' + secondWord;

        // If adding both words would exceed the limit, but we're past 70% full,
        // wrap now to keep the two words together on the next line
        if (lineWithBothWords.length > MAX_LINE_WIDTH && prevLine.length >= MAX_LINE_WIDTH * 0.7) {
          setDescriptionLines(lines => [...lines, prevLine.trim()]);
          currentTypingLineRef.current = '';
          setCurrentTypingLine('');
          currentCharIndexRef.current++;
          typingTimeoutRef.current = setTimeout(typeNextCharacter, 0);
          return;
        }
      }
    }

    // Type next character
    currentCharIndexRef.current++;
    const newChar = currentTextRef.current[currentCharIndexRef.current - 1];
    const newLine = prevLine + newChar;

    currentTypingLineRef.current = newLine;
    setCurrentTypingLine(newLine);

    // Schedule next character with dynamic speed
    const speed = (typeNextCharacter as any).speed || 15;
    typingTimeoutRef.current = setTimeout(typeNextCharacter, speed);
  };

  const startTyping = (text: string) => {
    // Prevent duplicate typing of the same text
    if (text === lastTypedTextRef.current && isTypingRef.current) {
      return;
    }

    lastTypedTextRef.current = text;

    // Stop current typing if any
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Save incomplete line before starting new text
    const lineToSave = currentTypingLineRef.current;
    if (lineToSave) {
      setDescriptionLines(prev => [...prev, lineToSave]);
    }

    // Start new text
    currentTypingLineRef.current = '';
    setCurrentTypingLine('');
    isTypingRef.current = true;
    currentTextRef.current = text;
    currentCharIndexRef.current = 0;

    // Calculate minimum duration (1 second) and minimum characters to type
    const minDuration = 1000; // 1 second in milliseconds
    const typingSpeed = 15; // milliseconds per character
    const minCharacters = Math.ceil(minDuration / typingSpeed);

    // If text is too short, pad it with spaces or slow down typing
    if (text.length < minCharacters) {
      // Adjust typing speed to last at least 1 second
      const adjustedSpeed = minDuration / text.length;
      // Store the adjusted speed for this typing session
      (typeNextCharacter as any).speed = adjustedSpeed;
    } else {
      (typeNextCharacter as any).speed = typingSpeed;
    }

    typeNextCharacter();
  };

  const handleProjectHover = (index: number) => {
    setActiveProject(index);

    const text = index < 3
      ? projects[index].description
      : projects[index].poem;

    startTyping(text);
  };

  const handleProjectLeave = (index: number) => {
  };

  const handleShopClick = () => {
    if (shopClickCount === 0) {
      setShopClickCount(1);
      setCursorMessage('are you sure?');
    } else if (shopClickCount === 1) {
      setShowVideo(true);
      setShowHomeLink(false);
      setTimeout(() => setVideoFadeIn(true), 50);
      setTimeout(() => setShowHomeLink(true), 8000);
    }
  };

  const handleBackToHome = () => {
    setShowVideo(false);
    setVideoFadeIn(false);
    setShowHomeLink(false);
    setShopClickCount(0);
    setCursorMessage('');
    setShopHovered(false);
    setShopPressed(false);
    // Reset to fresh homepage
    setDescriptionLines(['this is a portfolio']);
    setCurrentTypingLine('');
    currentTypingLineRef.current = '';
    isTypingRef.current = false;
    lastTypedTextRef.current = '';
    setActiveProject(null);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  if (currentPage === 'about') {
    return <About onBack={() => setCurrentPage('home')} onNavigate={setCurrentPage} currentPage={currentPage} />;
  }

  if (showVideo) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className={`flex flex-col items-center transition-opacity duration-1000 ${videoFadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <video
            src="/pearls.mp4"
            autoPlay
            loop
            className="max-w-[90vw] max-h-[80vh]"
          />
          <button
            onClick={handleBackToHome}
            className={`mt-4 text-white underline text-sm font-jetbrains-mono transition-opacity duration-1000 ${showHomeLink ? 'opacity-100' : 'opacity-0'}`}
          >
            home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white font-mono overflow-hidden">

      <div className="h-full flex items-center justify-center relative">
        <div className="fixed inset-0 pointer-events-none z-20">
          <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-b from-white via-white/95 via-white/80 via-white/60 via-white/40 via-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-white via-white/95 via-white/80 via-white/60 via-white/40 via-white/20 to-transparent"></div>
        </div>

        {/* Description container - centered left of project list on desktop, centered on mobile */}
        <div className="fixed left-[5%] sm:left-1/2 bottom-[55%] z-10 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[280px] xl:w-[320px] h-[60vh] overflow-hidden sm:translate-x-[-280px] md:translate-x-[-320px] lg:translate-x-[-340px] xl:translate-x-[-380px]">
          <div className="flex flex-col items-start justify-end h-full" style={{ lineHeight: '1.5' }}>
            {descriptionLines.map((line, index) => (
              <div
                key={`${index}-${line}`}
                className="text-black text-xs sm:text-sm md:text-sm lg:text-base text-left font-jetbrains-mono"
              >
                {line}
              </div>
            ))}
            {currentTypingLine && (
              <div
                className="text-black text-xs sm:text-sm md:text-sm lg:text-base text-left font-jetbrains-mono"
              >
                {currentTypingLine}
              </div>
            )}
          </div>
        </div>

        {/* Shop button - new image button */}
        <button
          onMouseEnter={() => {
            setShopHovered(true);
            setCursorMessage(shopClickCount === 0 ? 'would you like to know what god looks like?' : 'are you sure?');
          }}
          onMouseLeave={() => {
            setShopHovered(false);
            setShopPressed(false);
            setCursorMessage('');
          }}
          onMouseDown={() => setShopPressed(true)}
          onMouseUp={() => setShopPressed(false)}
          onClick={handleShopClick}
          className="fixed left-4 bottom-[35%] z-30"
        >
          <img
            src={shopPressed ? '/button-pressed.jpg' : '/button-idle.webp'}
            alt="Shop button"
            className="w-20 h-auto"
          />
        </button>

        {/* Cursor message */}
        {cursorMessage && (
          <div
            className="fixed pointer-events-none z-50 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap"
            style={{
              left: `${cursorPos.x + 15}px`,
              top: `${cursorPos.y + 15}px`,
            }}
          >
            {cursorMessage}
          </div>
        )}

        <div className="absolute left-1/2 transform translate-x-0 pl-3 sm:pl-4 md:pl-5 pr-8 sm:pr-0">
          <div className="w-44 sm:w-60 md:w-80 lg:w-96 xl:w-[500px]">
            <div
              ref={projectListRef}
              className="h-screen overflow-y-scroll scrollbar-hide relative z-10 pointer-events-none"
              style={{ paddingTop: '65vh' }}
            >
              <div className="pb-[50vh]">
                {projects.map((project, index) => (
                  <div key={project.name}>
                    <div className="flex items-start">
                      <div
                        ref={el => projectRefs.current[index] = el}
                        className="cursor-pointer flex-1 pointer-events-auto group py-1 sm:py-2"
                        onClick={() => handleProjectClick(index, project.name)}
                        onMouseEnter={() => handleProjectHover(index)}
                        onMouseLeave={() => handleProjectLeave(index)}
                      >
                        <div className="text-sm sm:text-base md:text-lg xl:text-xl leading-tight font-roboto-mono break-words pointer-events-none">
                          <span
                            className={`inline-block px-1 py-0.5 ${
                              activeProject === index
                                ? 'bg-[#2414ff] text-white font-bold'
                                : 'text-black'
                            }`}
                          >
                            {index >= 3 ? (
                              activeProject === index ? (
                                project.name
                              ) : (
                                <>
                                  <span className="group-hover:hidden">{(project as any).urduName}</span>
                                  <span className="hidden group-hover:inline">{project.name}</span>
                                </>
                              )
                            ) : (
                              project.name
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed z-30 left-[5%] sm:left-[24%] md:left-[26%] lg:left-[28%] xl:left-[30%] 2xl:left-[32%] pointer-events-none"
          style={{ top: 'calc(60% + 56px)' }}>
          <div className="relative w-[60vw] h-[60vw] sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 2xl:w-80 2xl:h-80"
            style={{ maxWidth: 'min(300px, calc(50vw - 5%))', maxHeight: 'min(300px, calc(50vw - 5%))' }}>
            <img
              src={shopHovered ? '/shop.gif' : `/${catState}.gif`}
              alt="Cat animation"
              className="w-full h-full object-contain scale-150"
              style={{ transformOrigin: 'center center' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;