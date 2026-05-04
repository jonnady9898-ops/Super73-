/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Zap, 
  Paintbrush, 
  Flame, 
  CheckCircle2, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Plus, 
  X, 
  Star,
  Users,
  Clock,
  Award,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CreditCard,
  Calendar,
  Smartphone,
  ShieldCheck,
  HelpCircle,
  Info,
  DollarSign
} from 'lucide-react';

// --- Components ---

const SectionTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`font-display text-5xl md:text-8xl tracking-wider text-center mb-4 ${className}`}
  >
    {children}
  </motion.h2>
);

const SectionSubtitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.p 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.2 }}
    className={`text-center text-gray-400 tracking-[0.2em] uppercase mb-8 px-4 ${className}`}
  >
    {children}
  </motion.p>
);

const PathCard = ({ title, price, features, icon: Icon, onClick, accent = false }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`relative bg-dark-alt p-8 rounded-none border-2 border-transparent transition-all duration-300 cursor-pointer group ${accent ? 'border-primary/20 shadow-lg shadow-primary/5' : ''}`}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    <Icon className="w-16 h-16 text-primary mb-6" strokeWidth={1.5} />
    <h3 className="font-display text-3xl mb-2 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-xl font-bold text-primary mb-6">{price}</p>
    <ul className="space-y-3 mb-8">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
          <ArrowRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <button className="w-full py-4 border-2 border-primary font-display text-lg tracking-widest group-hover:bg-primary group-hover:text-dark transition-all">
      {title === 'Limited Edition' ? 'JOIN VIP LIST' : 'GET STARTED'}
    </button>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-primary transition-colors group px-4"
      >
        <span className="font-display text-xl md:text-2xl tracking-wide">{question}</span>
        <Plus className={`w-6 h-6 text-primary transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-8 px-4 text-gray-400 leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [activeStage, setActiveStage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesList, setShowFavoritesList] = useState(false);
  const [filterModel, setFilterModel] = useState('All');
  const [sortBy, setSortBy] = useState('Title');
  const [formPath, setFormPath] = useState('');
  const [currentSquadIndex, setCurrentSquadIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    timeline: '',
    inspiration: '',
    vip: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string | boolean) => {
    let error = '';
    if (name === 'name' && !value) error = 'Name is required';
    if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(value as string)) error = 'Invalid email format';
    }
    if (name === 'budget' && !value) error = 'Please select a budget range';
    
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    validateField(name, val);
  };

  const squadMembers = [
    { name: 'ALEX K.', location: 'LOS ANGELES', quote: 'Freedom on two wheels. My customized S2 is my primary way to navigate the hills.', image: 'https://picsum.photos/seed/squad1/800/800?grayscale' },
    { name: 'SAM T.', location: 'MIAMI', quote: 'Electric vibes only. The Miami streets were made for the RX-Series performance.', image: 'https://picsum.photos/seed/squad2/800/800?grayscale' },
    { name: 'JORDAN M.', location: 'AUSTIN', quote: 'Built for the urban jungle. I love how I can cut through gridlock with ease.', image: 'https://picsum.photos/seed/squad3/800/800?grayscale' },
    { name: 'RILEY W.', location: 'LONDON', quote: 'Tradition meets tech. My custom R-Series is the perfect blend of heritage and future.', image: 'https://picsum.photos/seed/squad4/800/800?grayscale' }
  ];

  const nextSquad = () => setCurrentSquadIndex((prev) => (prev + 1) % squadMembers.length);
  const prevSquad = () => setCurrentSquadIndex((prev) => (prev - 1 + squadMembers.length) % squadMembers.length);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const bikeCollection = [
    { 
      id: '1', 
      title: 'DESERT STORM RX', 
      model: 'RX-Series', 
      dateAdded: '2024-03-15',
      image: 'https://picsum.photos/seed/bike1/1200/800?grayscale',
      details: 'Custom military matte tan finish, extended GRZLY tires, and a specialized survival rack system for long-range desert exploration.',
      specs: ['Performance Kit', 'Baja Designs Lighting', 'Custom Seat']
    },
    { 
      id: '2', 
      title: 'STREET SLAYER S2', 
      model: 'S2-Series', 
      dateAdded: '2024-01-20',
      image: 'https://picsum.photos/seed/bike2/1200/800?grayscale',
      details: 'Aggressive urban commuter with neon accents and high-speed slick tires. Designed for maximum agility in city traffic.',
      specs: ['Lowered Stance', 'Underglow Lighting', 'Carbon Fiber Fenders']
    },
    { 
      id: '3', 
      title: 'MOTO HERITAGE', 
      model: 'R-Series', 
      dateAdded: '2023-11-05',
      image: 'https://picsum.photos/seed/bike3/1200/800?grayscale',
      details: 'Inspired by 70s motocross legends. Featuring a classic leather bench seat and retro-style decals.',
      specs: ['Leather Trim', 'Chrome Accents', 'Knobby Tires']
    },
    { 
      id: '4', 
      title: 'NEON NOIR', 
      model: 'S-Series', 
      dateAdded: '2024-04-01',
      image: 'https://picsum.photos/seed/bike4/1200/800?grayscale',
      details: 'A futuristic aesthetic with holographic paint and integrated smart-dash controls.',
      specs: ['Smart Connect', 'Iridescent Finish', 'Custom Battery Case']
    },
    { 
      id: '5', 
      title: 'RUGGED ROVER', 
      model: 'RX-Series', 
      dateAdded: '2023-12-12',
      image: 'https://picsum.photos/seed/bike5/1200/800?grayscale',
      details: 'Built for the mountains with heavy-duty torque tuning and specialized climbing gears.',
      specs: ['Hill Climb Mode', 'Rear Suspension Pro', 'All-Weather Guard']
    },
    { 
      id: '6', 
      title: 'ARCTIC ASSAULT', 
      model: 'S2-Series', 
      dateAdded: '2024-02-28',
      image: 'https://picsum.photos/seed/bike6/1200/800?grayscale',
      details: 'Winter-ready build with studded tires and a heated seat system for sub-zero performance.',
      specs: ['Studded Tires', 'Heated Seat', 'High-Vis Lighting']
    },
    { 
      id: '7', 
      title: 'SUPER SQUAD EDITION', 
      model: 'RX-Series', 
      dateAdded: '2024-05-01',
      image: 'https://images.unsplash.com/photo-1622328221191-450f38b43f11?q=80&w=1200&auto=format&fit=crop',
      details: 'A dedicated build for the community. High visibility, rugged components, and a custom squad-only aesthetics package.',
      specs: ['Elite Commuter Hub', 'Squad Paint-job', 'GPS Tracking']
    },
  ];

  const filteredAndSortedBikes = bikeCollection
    .filter(bike => filterModel === 'All' || bike.model === filterModel)
    .sort((a, b) => {
      if (sortBy === 'Title') return a.title.localeCompare(b.title);
      if (sortBy === 'Newest') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return 0;
    });

  const models = ['All', ...Array.from(new Set(bikeCollection.map(b => b.model)))];

  const klarnaOptions = [
    {
      title: 'Pay in 4',
      description: 'Split your purchase into 4 interest-free payments, paid automatically every 2 weeks.',
      icon: <CreditCard className="w-8 h-8" />,
      tag: 'No Interest'
    },
    {
      title: 'Pay over time',
      description: 'Break up a larger purchase into smaller monthly payments from 6-36 months.',
      icon: <Calendar className="w-8 h-8" />,
      tag: 'Low Monthly'
    },
    {
      title: 'Pay Later',
      description: 'Combine your purchases into one simple payment on your preferred day.',
      icon: <Clock className="w-8 h-8" />,
      tag: 'Flexible'
    }
  ];

  const klarnaFaqs = [
    {
      q: "Who can use Klarna?",
      a: "US residents at least 18 years old with a valid card or bank account and legal capacity to enter into a contract."
    },
    {
      q: "Can I modify my payment plan?",
      a: "Yes, you can often reschedule payments through the Klarna app or by contacting their support team."
    },
    {
      q: "How do I check my schedule?",
      a: "View everything in the Klarna app or website to see orders, due dates, and amounts."
    },
    {
      q: "What if something goes wrong?",
      a: "Klarna Buyer Protection offers security for your money and data with 24/7 fraud monitoring."
    }
  ];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  const notifications = [
    { name: 'Alex K.', city: 'Los Angeles', action: 'reserved a custom S2' },
    { name: 'Jordan M.', city: 'Miami', action: 'joined the Signature waitlist' },
    { name: 'Sam T.', city: 'Austin', action: 'booked a HALO consultation' },
    { name: 'Riley W.', city: 'London', action: 'secured a Limited Drop slot' }
  ];

  useEffect(() => {
    const showRandomNotification = () => {
      const randomIndex = Math.floor(Math.random() * notifications.length);
      setCurrentNotification(notifications[randomIndex]);
      setTimeout(() => setCurrentNotification(null), 5000);
    };

    const interval = setInterval(showRandomNotification, 15000);
    return () => clearInterval(interval);
  }, []);

  const sections = [
    { id: 'inspire', label: 'Inspire' },
    { id: 'motto', label: 'Our Motto' },
    { id: 'choose', label: 'Choose Path' },
    { id: 'gallery', label: 'Collection' },
    { id: 'squad', label: 'Super Squad' },
    { id: 'financing', label: 'Financing' },
    { id: 'specs', label: 'Tech Specs' },
    { id: 'connect', label: 'Connect' },
    { id: 'proof', label: 'Proof' },
    { id: 'faq', label: 'FAQ' },
    { id: 'action', label: 'Action' }
  ];

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const stats = [
    { label: 'Custom Builds', value: '350+', icon: Zap },
    { label: 'Satisfaction', value: '98%', icon: Star },
    { label: 'Delivery Weeks', value: '8-12', icon: Clock },
    { label: 'Celebrity Builds', value: '40+', icon: Users }
  ];

  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.findIndex(s => s.id === entry.target.id);
          setActiveStage(index);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div className="bg-pattern fixed inset-0 pointer-events-none z-0" />
      
      {/* Top Header Logo */}
      <div className="fixed top-0 left-0 right-0 z-[100] p-6 lg:p-10 pointer-events-none flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto cursor-pointer group"
          onClick={() => scrollTo('inspire')}
        >
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-primary flex items-center justify-center skew-x-custom group-hover:bg-white transition-colors duration-300">
               <Zap className="w-6 h-6 text-dark fill-dark" />
             </div>
             <h1 className="font-display text-3xl md:text-4xl tracking-tighter text-white">SUPER<span className="text-primary italic">73</span></h1>
          </div>
          <div className="text-[8px] md:text-[10px] tracking-[0.5em] md:tracking-[0.8em] text-primary/50 uppercase font-bold ml-1 -mt-1 group-hover:text-white transition-colors duration-300">Customs Program</div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => scrollTo('connect')}
          className="pointer-events-auto hidden md:flex items-center gap-2 px-6 py-3 bg-primary text-dark font-display text-xs tracking-widest skew-x-custom hover:bg-white transition-colors"
        >
          GET QUOTE <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Live Notification Feed */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-[120] glass-morphism p-4 border border-primary/20 flex items-center gap-4 max-w-[300px]"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-primary block">{currentNotification.name} from {currentNotification.city}</span>
              <span className="text-gray-400">{currentNotification.action}</span>
              <span className="block text-[8px] opacity-40 mt-1 uppercase tracking-tighter">verified activity • 2m ago</span>
            </div>
            <button onClick={() => setCurrentNotification(null)} className="ml-auto opacity-40 hover:opacity-100 p-1">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Conversion Bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[110] p-4 glass-morphism border-t border-primary/20 lg:hidden"
          >
            <button 
              onClick={() => scrollTo('connect')}
              className="w-full py-4 bg-primary text-dark font-display text-xl tracking-widest uppercase flex items-center justify-center gap-2"
            >
              BUILD YOUR LEGEND <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites Floating Indicator */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <button 
          onClick={() => setShowFavoritesList(!showFavoritesList)}
          className="relative glass-morphism p-4 hardware-border hover:border-primary transition-all group"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={favorites.length > 0 ? { scale: [1, 1.2, 1] } : {}}
              className="relative"
            >
              <Star className={`w-6 h-6 ${favorites.length > 0 ? 'text-primary fill-primary' : 'text-gray-500'}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-dark text-[10px] font-bold px-1.5 py-0.5 rounded-none">
                  {favorites.length}
                </span>
              )}
            </motion.div>
            <span className="font-display text-sm tracking-widest uppercase hidden md:block">SAVED BUILDS</span>
          </div>
        </button>

        <AnimatePresence>
          {showFavoritesList && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-4 w-72 bg-dark-alt hardware-border shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                <span className="font-display tracking-[0.2em] text-gray-500 text-xs">YOUR COLLECTION</span>
                <button onClick={() => setShowFavoritesList(false)}><X className="w-4 h-4" /></button>
              </div>
              {favorites.length === 0 ? (
                <p className="text-xs text-gray-600 italic">No builds saved yet.</p>
              ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {favorites.map(favId => {
                    const bike = bikeCollection.find(b => b.id === favId);
                    return bike ? (
                      <div key={favId} className="flex items-center gap-3 group">
                        <img src={bike.image} className="w-12 h-12 object-cover border border-white/10" alt={bike.title} />
                        <div className="flex-1">
                          <div className="text-[10px] font-display text-primary truncate">{bike.title}</div>
                          <button 
                            onClick={() => { setSelectedBike(bike); setShowFavoritesList(false); }}
                            className="text-[9px] uppercase tracking-tighter text-gray-500 hover:text-white"
                          >
                            View Details
                          </button>
                        </div>
                        <button onClick={() => toggleFavorite(favId)} className="text-gray-700 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
              {favorites.length > 0 && (
                <button 
                  onClick={() => {
                    setFormPath(`Inquiry for Saved Collection: ${favorites.map(id => bikeCollection.find(b => b.id === id)?.title).join(', ')}`);
                    setShowFavoritesList(false);
                    scrollTo('connect');
                  }}
                  className="w-full mt-6 py-3 bg-primary/20 text-primary border border-primary/30 font-display text-xs tracking-widest hover:bg-primary hover:text-dark transition-all"
                >
                  QUOTE ALL SAVED →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage Navigation */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[90] hidden lg:flex flex-col gap-6">
        {sections.map((sec, i) => (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className="group relative flex items-center justify-end"
          >
            <span className="absolute right-8 text-xs font-display tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all uppercase whitespace-nowrap">
              {sec.label}
            </span>
            <div className={`w-3 h-3 rounded-full border border-primary/50 transition-all duration-300 ${activeStage === i ? 'bg-primary scale-150' : 'bg-transparent'}`} />
          </button>
        ))}
      </div>

      {/* STAGE: HERO */}
      <section id="inspire" className="relative min-h-[85vh] flex items-center justify-center text-center px-4 overflow-hidden pt-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1622328221191-450f38b43f11?q=80&w=2000&auto=format&fit=crop" 
            alt="SUPER73 Community Collage" 
            className="w-full h-full object-cover opacity-30 filter contrast-125 saturate-150"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/80 to-dark" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 hero-customs-text"
        >
          <div className="mb-6 flex justify-center gap-4 text-primary text-xs tracking-[0.4em] uppercase font-bold">
            <span>Performance</span>
            <span className="opacity-30">•</span>
            <span>Style</span>
            <span className="opacity-30">•</span>
            <span>Legend</span>
          </div>
          <motion.h1 
            className="font-display text-7xl md:text-[12rem] leading-none mb-4 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent text-glow skew-x-custom"
          >
            YOUR RIDE<br />YOUR RULES
          </motion.h1>
          <p className="text-xl md:text-3xl font-light tracking-[0.3em] uppercase opacity-70 mb-12 max-w-4xl mx-auto">
            The world's most exclusive custom electric bike program.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('choose')}
            className="cta-polygon bg-primary text-dark px-16 py-6 font-display text-2xl tracking-widest hover:bg-accent transition-colors shadow-[0_0_30px_rgba(255,107,0,0.3)]"
          >
            START YOUR BUILD →
          </motion.button>
        </motion.div>
      </section>

      {/* STAGE: TRUST BAR */}
      <section className="py-8 bg-black/40 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2"><Award className="w-6 h-6" /> <span className="font-display text-xl tracking-widest">CES INNOVATION</span></div>
           <div className="flex items-center gap-2"><Award className="w-6 h-6" /> <span className="font-display text-xl tracking-widest">RED DOT DESIGN</span></div>
           <div className="flex items-center gap-2"><Award className="w-6 h-6" /> <span className="font-display text-xl tracking-widest">FORBES NEXT 100</span></div>
           <div className="flex items-center gap-2"><Award className="w-6 h-6" /> <span className="font-display text-xl tracking-widest">THE VERGE BEST E-BIKE</span></div>
        </div>
      </section>

      {/* STAGE: OUR MOTTO */}
      <section id="motto" className="py-16 relative z-10 overflow-hidden bg-gradient-to-b from-dark to-dark-alt/30">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8 inline-block"
          >
            <div className="p-4 glass-morphism hardware-border aspect-square w-64 mx-auto flex items-center justify-center">
              <img 
                src="https://picsum.photos/seed/motto/300/300?grayscale" 
                alt="Ride Together Explore Further" 
                className="w-full h-full object-contain opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
          <SectionTitle className="text-glow mb-8">OUR MOTTO</SectionTitle>
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="font-display text-4xl md:text-6xl text-primary tracking-tighter skew-x-custom">
              "RIDE TOGETHER, EXPLORE FURTHER"
            </h3>
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed tracking-wide">
              This motto captures the spirit of community and adventure at the heart of SUPER73. Whether you're cruising through the city or venturing off the beaten path, SUPER73 encourages riders to embrace the journey and discover more with every mile, side by side.
            </p>
          </div>
        </div>
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      </section>

      {/* STAGE: BENEFITS BENTO */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
             <div className="md:col-span-2 md:row-span-2 glass-morphism hardware-border p-10 flex flex-col justify-end group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <motion.div whileHover={{ rotate: 45 }} className="bg-primary p-4 rounded-full">
                    <ArrowRight className="text-dark w-8 h-8" />
                  </motion.div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=1200&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700 -z-10"
                />
                <h3 className="font-display text-5xl text-white mb-4">ENGINEERED <br/>FOR IDENTITY</h3>
                <p className="text-gray-400 font-light max-w-md">Your bike is an extension of your soul. We don't build commuters; we build mechanical manifestations of personality.</p>
             </div>
             
             <div className="glass-morphism hardware-border p-8 border-primary/20 flex flex-col justify-between bg-primary/5">
                <ShieldCheck className="text-primary w-12 h-12" />
                <div>
                   <h4 className="font-display text-xl text-white mb-2 uppercase">Lifetime Quality</h4>
                   <p className="text-xs text-gray-500 font-light">Every custom frame and component is backed by our Southern California craftsmanship guarantee.</p>
                </div>
             </div>

             <div className="glass-morphism hardware-border p-8 flex flex-col justify-between border-white/5">
                <Zap className="text-primary w-12 h-12" />
                <div>
                   <h4 className="font-display text-xl text-white mb-2 uppercase">Pro Performance</h4>
                   <p className="text-xs text-gray-500 font-light">Enhanced controllers and motor tuning available for those who need more than just looks.</p>
                </div>
             </div>

             <div className="md:col-span-1 glass-morphism hardware-border p-8 flex flex-row items-center gap-6 group cursor-pointer">
                <div className="text-5xl font-display text-primary skew-x-custom">98%</div>
                <div className="text-[10px] font-mono tracking-tighter text-gray-400 uppercase leading-tight font-bold">Client <br/>Satisfaction <br/>Rate</div>
             </div>
          </div>
        </div>
      </section>

      {/* STAGE: HOW IT WORKS */}
      <section className="py-12 relative z-10 bg-dark-alt/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: '01', title: 'CHOOSE BASE', desc: 'Select your preferred Super73 chassis from our lineup.' },
              { step: '02', title: 'DESIGN POD', desc: 'Work with our HALO designers on colors and textures.' },
              { step: '03', title: 'FABRICATION', desc: 'Hand-crafted assembly with premium components.' },
              { step: '04', title: 'DELIVERY', desc: 'Global white-glove shipping to your doorstep.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="font-display text-6xl text-primary/10 absolute -top-10 -left-6 select-none">{item.step}</div>
                <h3 className="font-display text-2xl mb-2 tracking-widest text-primary">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-4 -right-6 text-primary/20">→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STAGE: PATH SELECTOR */}
      <section id="choose" className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle>Three Ways to Go Custom</SectionTitle>
          <SectionSubtitle>From Dream Consultation to Limited Edition Drops</SectionSubtitle>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PathCard 
              title="Full Concierge Build"
              price="Starting at $12,000"
              icon={Zap}
              features={['Private HALO Design Lead', 'Bespoke hand-painted finishes', 'Full aerospace-grade alloy upgrades', 'Hand-stitched Italian leather seating']}
              onClick={() => { setFormPath('Full Concierge'); scrollTo('connect'); }}
            />
            <PathCard 
              accent
              title="Signature Series"
              price="$6,500 - $9,500"
              icon={Paintbrush}
              features={['Curated premium palettes', 'Premium performance suspension', 'Signature Carbon Fiber accents', '4-week priority delivery']}
              onClick={() => { setFormPath('Signature Series'); scrollTo('connect'); }}
            />
            <PathCard 
              title="Limited Collector Drops"
              price="$4,500 - $5,500"
              icon={Flame}
              features={['Strictly numbered editions', 'Rare 1-of-100 colorways', 'Exclusive Collector VIP access', 'Investment-grade craftsmanship']}
              onClick={() => { setFormPath('Limited Collector'); scrollTo('connect'); }}
            />
          </div>
        </div>
      </section>

      {/* STAGE: FINANCING / KLARNA */}
      <section id="financing" className="py-16 relative z-10 bg-dark-alt/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="font-display tracking-[0.4em] text-primary">KLARNA × SUPER73</span>
              </div>
              <h2 className="font-display text-6xl md:text-8xl leading-none text-glow uppercase mb-8 skew-x-custom">
                FLEXIBLE <br />WAYS TO PAY
              </h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed mb-12">
                We’ve partnered with Klarna to give you a better shopping experience. When you choose Klarna at checkout, you have the flexibility to choose a payment plan that works for you.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {klarnaOptions.map((opt, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-6 glass-morphism hardware-border group transition-all"
                  >
                    <div className="text-primary mb-4 group-hover:scale-110 transition-transform origin-left">
                      {opt.icon}
                    </div>
                    <div className="text-[10px] font-mono text-primary/50 tracking-widest uppercase mb-2">{opt.tag}</div>
                    <h4 className="font-display text-xl text-white mb-2">{opt.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">{opt.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 space-y-12">
              <div className="glass-morphism hardware-border p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -z-10 blur-3xl opacity-50" />
                <h3 className="font-display text-3xl tracking-widest text-white mb-10">HOW IT WORKS</h3>
                <div className="space-y-8">
                  {[
                    { step: '01', text: 'Shop what you love and choose Klarna at checkout.' },
                    { step: '02', text: 'Select your preferred payment option and complete purchase.' },
                    { step: '03', text: 'Manage payments and delivery in the Klarna app.' }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <span className="font-display text-primary text-2xl skew-x-custom">{s.step}</span>
                      <p className="text-gray-400 leading-relaxed pt-1">{s.text}</p>
                    </div>
                  ))}
                </div>


              </div>

              <div className="space-y-2">
                <h4 className="font-display text-sm tracking-[0.3em] text-gray-600 uppercase mb-4 px-2">Common Questions</h4>
                {klarnaFaqs.map((faq, i) => (
                  <div key={i} className="border-b border-white/5">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full py-4 text-left flex justify-between items-center group"
                    >
                      <span className={`font-medium transition-colors ${activeFaq === i ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`}>{faq.q}</span>
                      <Plus className={`w-4 h-4 transition-transform ${activeFaq === i ? 'rotate-45 text-primary' : 'text-gray-600'}`} />
                    </button>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 text-sm text-gray-500 font-light leading-relaxed pl-2 border-l border-primary/20">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-24 p-12 glass-morphism hardware-border border-primary/20 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 -z-10" />
             <div className="max-w-2xl mx-auto">
                <h3 className="font-display text-4xl mb-6 text-glow">ABOUT KLARNA</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed mb-8">
                  We’re Klarna—born in Sweden and proud to set a new standard for how people shop and pay across the world. Join more than 114m consumers who choose Klarna for smarter shopping.
                </p>
                <div className="flex flex-wrap justify-center gap-8 text-[10px] font-mono tracking-widest text-primary opacity-60">
                  <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> BUILT-IN SECURITY</div>
                  <div className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> NO HIDDEN FEES</div>
                  <div className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> 24/7 SUPPORT</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* STAGE: TECH SPECS */}
      <section id="specs" className="py-12 relative z-10 bg-dark-alt/10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle>THE BLUEPRINT</SectionTitle>
          <SectionSubtitle>Engineered Excellence. No Compromises.</SectionSubtitle>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { label: 'BATTERY', value: '960W-H (48V 20A) STATE-OF-THE-ART' },
                { label: 'MOTOR', value: '2000W PEAK OUTPUT / BRUSHLESS DC' },
                { label: 'TIRES', value: 'GRZLY ALL-TERRAIN FAT TIRES' },
                { label: 'SUSPENSION', value: 'ADJUSTABLE AIR FORK / MONO SHOCK' },
                { label: 'BRAKES', value: 'HYDRAULIC 4-PISTON CALIPERS' },
                { label: 'CONNECTIVITY', value: 'SMARTDISPLAY WITH NAVIGATION' },
              ].map((spec, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between items-end border-b border-white/5 pb-2 hover:border-primary/50 transition-colors group cursor-default"
                >
                  <span className="font-display text-xl text-gray-500 group-hover:text-primary transition-colors">{spec.label}</span>
                  <span className="font-mono text-xs text-primary">{spec.value}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="relative aspect-video glass-morphism p-4 hardware-border group">
              <div className="absolute top-2 left-2 text-[10px] text-primary/30 font-mono">CAD_RENDER_V4.2</div>
              <img 
                src="https://picsum.photos/seed/blueprint/800/450?grayscale&blur=2" 
                alt="Technical Drawing" 
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/2 h-1/2 border border-primary/20 animate-pulse flex items-center justify-center">
                   <div className="text-primary font-display text-4xl tracking-widest opacity-50">ENGINEERING PROOF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE: CONNECT / LEAD CAPTURE */}
      <section id="connect" className="py-12 bg-dark-alt/50 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-dark p-8 md:p-16 border-l-4 border-primary shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            
            <h2 className="font-display text-4xl md:text-6xl mb-8 tracking-wide">LET'S BUILD YOUR LEGEND</h2>
            {formPath && (
              <div className="mb-8 inline-block bg-primary/10 text-primary px-4 py-1 font-display tracking-widest text-sm">
                SELECTED PATH: {formPath.toUpperCase()}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-display text-primary tracking-widest uppercase">Your Name *</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('name', e.target.value)}
                    type="text" 
                    className={`w-full bg-dark-alt border ${formErrors.name ? 'border-red-500' : 'border-white/10'} p-4 focus:border-primary outline-none transition-colors`} 
                    placeholder="Full Name" 
                  />
                  {formErrors.name && <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-display text-primary tracking-widest uppercase">Email *</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('email', e.target.value)}
                    type="email" 
                    className={`w-full bg-dark-alt border ${formErrors.email ? 'border-red-500' : 'border-white/10'} p-4 focus:border-primary outline-none transition-colors`} 
                    placeholder="your@email.com" 
                  />
                  {formErrors.email && <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold">{formErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-display text-primary tracking-widest uppercase">Budget Range *</label>
                  <select 
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField('budget', e.target.value)}
                    className={`w-full bg-dark-alt border ${formErrors.budget ? 'border-red-500' : 'border-white/10'} p-4 focus:border-primary outline-none transition-colors appearance-none`}
                  >
                    <option value="">Select Range</option>
                    <option>$3,000 - $5,000</option>
                    <option>$5,000 - $8,000</option>
                    <option>$8,000+</option>
                    <option>Flexible</option>
                  </select>
                  {formErrors.budget && <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold">{formErrors.budget}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-display text-primary tracking-widest uppercase">Timeline</label>
                  <select 
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full bg-dark-alt border border-white/10 p-4 focus:border-primary outline-none transition-colors appearance-none"
                  >
                    <option value="">Desired Delivery</option>
                    <option>ASAP (2-4 Weeks)</option>
                    <option>1-2 Months</option>
                    <option>Just Planning</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-display text-primary tracking-widest uppercase">What Inspires You?</label>
                <textarea 
                  name="inspiration"
                  value={formData.inspiration}
                  onChange={handleInputChange}
                  rows={4} 
                  className="w-full bg-dark-alt border border-white/10 p-4 focus:border-primary outline-none transition-colors" 
                  placeholder="Tell us about the vibe... (e.g. Cyberpunk, Vintage Moto, Desert Explorer)" 
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  id="vip" 
                  name="vip"
                  type="checkbox" 
                  checked={formData.vip}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-primary bg-dark border-white/10" 
                />
                <label htmlFor="vip" className="text-sm text-gray-400">Send me VIP updates on new drops & customs</label>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={Object.values(formErrors).some(err => err !== '') || !formData.name || !formData.email || !formData.budget}
                className="w-full py-6 bg-primary text-dark font-display text-2xl tracking-widest hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                GET MY CUSTOM QUOTE →
              </motion.button>
            </form>
          </div>
        </div>
      </section>

      {/* STAGE: GALLERY */}
      <section id="gallery" className="py-12 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4">
          <SectionTitle>THE COLLECTION</SectionTitle>
          <SectionSubtitle>Hand-built in Southern California. Proven on the street.</SectionSubtitle>
          
          {/* Controls Bar */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6 glass-morphism p-6 hardware-border">
            <div className="flex flex-wrap justify-center gap-2">
              {models.map(m => (
                <button
                  key={m}
                  onClick={() => setFilterModel(m)}
                  className={`px-6 py-2 font-display tracking-widest text-xs border transition-all ${filterModel === m ? 'bg-primary text-dark border-primary' : 'bg-transparent text-gray-500 border-white/10 hover:border-primary/50'}`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-display text-xs tracking-widest text-gray-600 uppercase">Sort By:</span>
              <div className="flex gap-2">
                {['Title', 'Newest'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-4 py-2 font-display tracking-widest text-[10px] border transition-all ${sortBy === s ? 'text-primary border-primary' : 'text-gray-500 border-white/5 hover:border-white/20'}`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedBikes.map((bike, i) => (
                <motion.div 
                  layout
                  key={bike.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => { setSelectedBike(bike); setIsZoomed(false); }}
                  className="group relative aspect-[4/3] overflow-hidden bg-dark-alt hardware-border cursor-pointer"
                >
                  {/* Corner Target Markers */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 z-20" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 z-20" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 z-20" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 z-20" />

                  <img 
                    src={bike.image} 
                    alt={bike.title} 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 filter grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-xs text-primary font-bold tracking-widest uppercase mb-1">{bike.model}</div>
                    <h3 className="font-display text-2xl text-white">{bike.title}</h3>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={(e) => toggleFavorite(bike.id, e)}
                      className="p-2 glass-morphism hardware-border hover:text-primary transition-colors"
                    >
                      <Star className={`w-5 h-5 ${favorites.includes(bike.id) ? 'text-primary fill-primary' : 'text-white'}`} />
                    </button>
                    <div className="p-2 glass-morphism hardware-border opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* STAGE: SUPER SQUAD CAROUSEL */}
      <section id="squad" className="py-16 bg-dark relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle>MEET YOUR SUPER SQUAD</SectionTitle>
          <SectionSubtitle>Real Riders. Real Custom Builds.</SectionSubtitle>

          <div className="relative mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSquadIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                <div className="relative aspect-square glass-morphism hardware-border p-4">
                  <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 -z-10 blur-3xl opacity-50" />
                  <img 
                    src={squadMembers[currentSquadIndex].image} 
                    alt={squadMembers[currentSquadIndex].name} 
                    className="w-full h-full object-cover grayscale brightness-75"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-8 right-8 bg-primary/90 text-dark px-6 py-2 font-display text-xl tracking-widest">
                    {squadMembers[currentSquadIndex].location}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-primary">
                    <Star className="w-8 h-8 fill-primary" />
                    <span className="font-display text-2xl tracking-[0.4em]">VERIFIED RIDER</span>
                  </div>
                  <h3 className="font-display text-7xl md:text-8xl leading-none text-glow uppercase tracking-wider skew-x-custom">
                    {squadMembers[currentSquadIndex].name}
                  </h3>
                  <div className="relative">
                    <div className="text-primary/10 text-9xl font-display absolute -top-12 -left-8 select-none">"</div>
                    <p className="text-2xl md:text-3xl font-light text-gray-300 italic leading-relaxed relative z-10 pl-4 border-l-2 border-primary/30">
                      {squadMembers[currentSquadIndex].quote}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex flex-col md:flex-row gap-6 mt-12 items-center justify-between border-t border-white/5 pt-12">
              <div className="flex gap-4">
                <button 
                  onClick={prevSquad}
                  className="p-6 glass-morphism hardware-border hover:border-primary hover:text-primary transition-all active:scale-95"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button 
                  onClick={nextSquad}
                  className="p-6 glass-morphism hardware-border hover:border-primary hover:text-primary transition-all active:scale-95"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              {/* Timeline Navigation */}
              <div className="flex gap-3">
                {squadMembers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSquadIndex(i)}
                    className={`h-2 border border-primary/30 transition-all duration-500 rounded-none ${currentSquadIndex === i ? 'w-24 bg-primary' : 'w-8 bg-transparent hover:bg-primary/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox / Bike Details Modal */}
      <AnimatePresence>
        {selectedBike && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12 bg-dark/95 backdrop-blur-xl"
            onClick={() => { setSelectedBike(null); setIsZoomed(false); }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="max-w-6xl w-full bg-dark-alt overflow-hidden hardware-border shadow-2xl flex flex-col md:flex-row relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { setSelectedBike(null); setIsZoomed(false); }}
                className="absolute top-6 right-6 z-10 text-white/50 hover:text-primary transition-colors p-2"
              >
                <X className="w-8 h-8" />
              </button>

              <div 
                className="w-full md:w-3/5 aspect-video md:aspect-auto overflow-hidden relative group cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
                onMouseMove={handleMouseMove}
              >
                <motion.div
                  animate={{
                    scale: isZoomed ? 2.5 : 1,
                    x: isZoomed ? `${50 - mousePos.x}%` : 0,
                    y: isZoomed ? `${50 - mousePos.y}%` : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.5 }}
                  className="w-full h-full origin-center"
                >
                  <img 
                    src={selectedBike.image} 
                    alt={selectedBike.title} 
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                
                <div className="absolute bottom-6 left-6 pointer-events-none glass-morphism px-4 py-2 border border-white/10 uppercase font-display tracking-widest text-xs translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  {isZoomed ? 'Click to Exit Zoom' : 'Click to Inspect Details'}
                </div>
              </div>

              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-sm text-primary font-bold tracking-[0.3em] uppercase mb-2">{selectedBike.model}</div>
                <h2 className="font-display text-5xl md:text-6xl mb-6 text-glow">{selectedBike.title}</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  {selectedBike.details}
                </p>
                
                <div className="space-y-4 mb-10">
                  <h4 className="font-display text-xl tracking-widest text-white/80">CORE MODIFICATIONS</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBike.specs.map((spec: string, i: number) => (
                      <span key={i} className="bg-white/5 border border-white/10 px-3 py-1 text-xs text-primary font-mono tracking-tighter">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mb-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormPath(`Inquiry for ${selectedBike.title}`);
                      setSelectedBike(null);
                      scrollTo('connect');
                    }}
                    className="flex-1 py-4 bg-primary text-dark font-display text-xl tracking-widest hover:bg-accent transition-colors shadow-lg shadow-primary/20"
                  >
                    START A SIMILAR BUILD →
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleFavorite(selectedBike.id)}
                    className={`px-6 py-4 border-2 transition-all flex items-center justify-center ${favorites.includes(selectedBike.id) ? 'border-primary bg-primary/10 text-primary' : 'border-gray-700 text-gray-400 hover:border-primary'}`}
                  >
                    <Star className={`w-6 h-6 ${favorites.includes(selectedBike.id) ? 'fill-primary' : ''}`} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE: PROOF */}
      <section id="proof" className="py-12 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle>Ridden By Legends</SectionTitle>
          <SectionSubtitle>127 Custom Builds Delivered in 2024</SectionSubtitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4 opacity-50" />
                <div className="font-display text-5xl md:text-7xl text-primary mb-2 leading-none">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The HALO team brought my vision to life. This isn't just a bike, it's a work of art that turns heads everywhere.",
                author: "Marcus Chen",
                role: "S2 Custom Owner, LA"
              },
              {
                quote: "From first call to delivery, the process was seamless. My RX custom matches my aesthetic perfectly. Worth the investment.",
                author: "Sarah Rodriguez",
                role: "RX Racing Custom, Miami"
              },
              {
                quote: "I've owned 12 bikes. Nothing comes close to the craftsmanship of my SUPER73 custom. Pure excellence.",
                author: "James Thompson",
                role: "Full Custom Build, Seattle"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-dark-alt p-8 relative border-l-2 border-primary/30"
              >
                <Star className="w-5 h-5 text-accent mb-6" fill="currentColor" />
                <p className="text-lg italic text-gray-300 mb-8 leading-relaxed">"{t.quote}"</p>
                <div>
                  <div className="font-display text-xl text-primary">{t.author}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STAGE: FAQ */}
      <section id="faq" className="py-12 bg-dark-alt/30 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle>Questions? Answers.</SectionTitle>
          <SectionSubtitle>Everything you need to know about going custom</SectionSubtitle>

          <div className="space-y-2">
            {[
              { q: "How long does a custom build take?", a: "Full custom builds typically take 8-12 weeks from initial consultation to delivery. Custom packages are faster at 4-6 weeks. Limited edition drops ship within 2-3 weeks once released. We'll keep you updated with build progress photos throughout the process." },
              { q: "What's included in the warranty?", a: "All custom builds come with our standard 1-year warranty on frame, motor, and battery. Custom paint work is covered for 6 months against manufacturing defects. Extended warranty options available at checkout." },
              { q: "Do you offer financing options?", a: "Absolutely! We partner with Affirm and Klarna for flexible payment plans. Most customers qualify for 0% APR on builds over $5,000 with approved credit. Apply during checkout in under 2 minutes." },
              { q: "Can I visit the shop during my build?", a: "If you're in Southern California, yes! We offer scheduled studio tours at our Tustin facility by appointment. We'll send you build progress photos regardless of location, so you can watch your legend come to life from anywhere." }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* STAGE: FINAL ACTION */}
      <section id="action" className="min-h-[70vh] flex items-center justify-center text-center px-4 relative z-10 py-12">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative">
          <motion.div 
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block bg-primary text-dark px-8 py-2 font-display text-sm tracking-[0.2em] mb-8"
          >
            ⚠️ ONLY 8 SLOTS LEFT THIS QUARTER
          </motion.div>
          <h2 className="font-display text-6xl md:text-[8rem] leading-none mb-4 uppercase">THE ULTIMATE<br />LUXURY RIDE</h2>
          <p className="text-xl md:text-2xl font-light tracking-widest text-gray-400 mb-12 italic">Hand-built in California. Ridden Globally.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('connect')}
            className="cta-polygon bg-primary text-dark px-16 py-6 font-display text-2xl tracking-widest hover:bg-accent transition-all shadow-2xl shadow-primary/20"
          >
            RESERVE YOUR SPOT →
          </motion.button>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark/95 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-xl w-full bg-dark-alt border-2 border-primary p-8 md:p-16 text-center relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-primary hover:rotate-90 transition-transform p-2"
              >
                <X className="w-8 h-8" />
              </button>
              
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              
              <h2 className="font-display text-5xl mb-4 tracking-wide">YOU'RE IN!</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Welcome to the Super Squad, rider! Our HALO team will reach out within 24 hours to start your legendary build.
              </p>
              
              <p className="text-sm text-gray-500">
                Check your email for your custom lookbook and exclusive VIP perks.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-16 bg-dark text-center border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col items-center">
          <h3 className="font-display text-4xl mb-4 tracking-widest text-glow">FOLLOW US</h3>
          <div className="flex flex-wrap justify-center items-center mb-8">
            {[
              { icon: <Facebook className="w-6 h-6" />, label: 'Facebook' },
              { icon: <Twitter className="w-6 h-6" />, label: 'Twitter' },
              { icon: <Instagram className="w-6 h-6" />, label: 'Instagram' },
              { icon: <Youtube className="w-6 h-6" />, label: 'Youtube' },
              { icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              ), label: 'TikTok' }
            ].map((social, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border border-white/10 hover:border-primary hover:bg-primary/5 transition-all group"
                aria-label={social.label}
              >
                <div className="group-hover:text-primary transition-colors">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>

        <p className="font-display text-2xl tracking-widest text-primary mb-4">SUPER73 CUSTOMS</p>
        <p className="text-xs tracking-widest text-gray-600 uppercase">© 2024 SUPER73 INC. ALL RIGHTS RESERVED - RIDE LEGENDARY.</p>
      </footer>
    </div>
  );
}
