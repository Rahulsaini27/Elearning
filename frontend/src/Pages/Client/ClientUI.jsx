import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  ArrowRight,
  MailIcon,
  Star,
  Clock,
  Users,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientUI = () => {
  // State
  const [activeTab, setActiveTab] = useState("all");
  const [visibleTestimonials, setVisibleTestimonials] = useState(0);
  // const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Data
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React, Node and more. Build real-world projects and deploy them to the web.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      category: "Web Development",
      price: 89.99,
      rating: 4.8,
      duration: "12 weeks",
      students: 12450,
      instructor: "Alex Morgan"
    },
    {
      id: 2,
      title: "Data Science Masterclass: Python & R",
      description: "Master the tools and techniques used by data scientists at top tech companies.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      category: "Data Science",
      price: 94.99,
      rating: 4.9,
      duration: "10 weeks",
      students: 8320,
      instructor: "Sarah Chen"
    },
    {
      id: 3,
      title: "UX/UI Design: From Wireframe to Prototype",
      description: "Create beautiful, intuitive designs that users love. Learn industry-standard tools and design systems.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      category: "Design",
      price: 79.99,
      rating: 4.7,
      duration: "8 weeks",
      students: 5690,
      instructor: "Michael Johnson"
    },
    {
      id: 4,
      title: "iOS App Development with Swift",
      description: "Build iOS apps from scratch. Learn Swift programming and create your own App Store-ready applications.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      category: "Mobile Development",
      price: 99.99,
      rating: 4.8,
      duration: "14 weeks",
      students: 4325,
      instructor: "Emily Zhang"
    },
    {
      id: 5,
      title: "Machine Learning Engineering",
      description: "From algorithms to deployment, learn to build production-ready machine learning systems.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      category: "AI & Machine Learning",
      price: 119.99,
      rating: 4.9,
      duration: "16 weeks",
      students: 3865,
      instructor: "David Wilson"
    },
    {
      id: 6,
      title: "Digital Marketing Strategy",
      description: "Learn to create and execute comprehensive digital marketing strategies that drive growth.",
      image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      category: "Marketing",
      price: 69.99,
      rating: 4.6,
      duration: "6 weeks",
      students: 7890,
      instructor: "Jessica Miller"
    }
  ];

  const testimonials = [
    {
      quote: "The web development course completely transformed my career. I went from knowing almost nothing about coding to landing a job as a frontend developer in just 6 months.",
      name: "David Kim",
      title: "Frontend Developer at TechCorp",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      rating: 5
    },
    {
      quote: "The instructors are incredible - they explain complex concepts in a way that's easy to understand and are always available to answer questions.",
      name: "Emma Rodriguez",
      title: "Data Analyst",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      rating: 4
    },
    {
      quote: "The UX/UI design course helped me transition from graphic design to product design. The projects were practical and relevant to what companies are looking for.",
      name: "James Anderson",
      title: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      rating: 5
    }
  ];

  const categories = [
    "Web Development",
    "Data Science",
    "Design",
    "Mobile Development",
    "AI & Machine Learning",
    "Marketing",
    "Business",
    "Photography"
  ];



  const instructors = [
    {
      name: "Alex Morgan",
      title: "Web Development Expert",
      bio: "Former Google engineer with 10+ years of experience building robust applications. Specializes in React and Node.js.",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      courses: 12,
      students: 45680,
      rating: 4.9
    },
    {
      name: "Sarah Chen",
      title: "Data Science Instructor",
      bio: "PhD in Machine Learning with a passion for making complex concepts accessible to everyone.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
      courses: 8,
      students: 31245,
      rating: 4.8
    },
    {
      name: "Michael Johnson",
      title: "UX/UI Design Professional",
      bio: "Award-winning designer with experience at top tech companies. Focused on creating beautiful, functional interfaces.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      courses: 5,
      students: 23420,
      rating: 4.7
    }
  ];

  // Effects
  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleTestimonials(0);
      } else if (width < 1024) {
        setVisibleTestimonials(1);
      } else {
        setVisibleTestimonials(0);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
  const visibleCourses = activeTab === "all"
    ? courses
    : courses.filter(course => course.category === activeTab);

  // const handleSubscribe = (e) => {
  //   e.preventDefault();
  //   alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
  //   setEmail("");
  // };

  const nextTestimonial = () => {
    setVisibleTestimonials((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setVisibleTestimonials((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden px-10">
      {/* Navbar Component */}
      <header className={`fixed top-0 px-10 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
        }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex-shrink-0">

              <img src="https://www.requingroup.com/logo.png" alt="" className='max-h-[60px] max-w-[200px]' />

            </div>

            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#courses" className="hover:text-[#198CFF] text-foreground/80 transition-colors duration-200">Courses</a></li>
                <li><a href="#instructors" className="hover:text-[#198CFF] text-foreground/80 transition-colors duration-200">Instructors</a></li>
                <li><a href="#testimonials" className="hover:text-[#198CFF] text-foreground/80 transition-colors duration-200">Testimonials</a></li>
                <li><a href="#pricing" className="hover:text-[#198CFF] text-foreground/80 transition-colors duration-200">Pricing</a></li>
              </ul>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-foreground/80 hover:text-[#198CFF] transition-colors duration-200">
                <ChevronRight className="w-5 h-5" />
              </a>
              <Link to={"/login"} className="px-4 py-2  text-white rounded-lg bg-[#198CFF] text-white hover:bg-[#198CFF]/90 transition-colors duration-200">
                Login
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden bg-[#FFFFFF] border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"
          }`}>
          <div className="px-4 pt-3 pb-6 space-y-3">
            <a href="#courses" className="block py-2 hover:text-[#198CFF] transition-colors duration-200">Courses</a>
            <a href="#instructors" className="block py-2 hover:text-[#198CFF] transition-colors duration-200">Instructors</a>
            <a href="#testimonials" className="block py-2 hover:text-[#198CFF] transition-colors duration-200">Testimonials</a>
            <a href="#pricing" className="block py-2 hover:text-[#198CFF] transition-colors duration-200">Pricing</a>
            <div className="pt-2 flex items-center justify-between">

              <Link to={"/login"} className="px-4  py-2 rounded-lg bg-[#198CFF] text-white hover:bg-[#198CFF]/90 transition-colors duration-200" >
                Login
              </Link>

              <a href="#" className="text-foreground/80 hover:text-[#198CFF] transition-colors duration-200">
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-20 flex items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-background/95">
        <div className="container mx-auto px-4 py-12 sm:py-20 md:py-28 slide-in-section">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-on-scroll ">
              <span className="tag   mb-6 animate-fade-in px-2 rounded-4xl bg-[#e5f1fc] text-[#198CFF]">Transform Your Future</span>
            </div>

            <h1 className="animate-on-scroll  heading-1 mb-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
              Elevate Your Skills with Premium Online Courses
            </h1>

            <p className="animate-on-scroll  subtitle max-w-2xl mx-auto mb-10 text-xl text-[#198CFF] font-normal">
              Join thousands of learners from around the world. Gain the skills you need for the future with our expertly crafted courses.
            </p>

            <div className="animate-on-scroll  flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#courses"
                className="px-8 py-3 rounded-lg bg-[#198CFF]  text-white font-medium hover:shadow-lg hover:bg-[#198CFF]/90 transition-all duration-300 w-full sm:w-auto"
              >
                Browse Courses
              </a>
              <a
                href="#instructors"
                className="px-8 py-3 rounded-lg bg-[#F4F4F5] text-foreground font-medium hover:bg-[#F4F4F5]/80 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Meet Our Instructors <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="animate-on-scroll  flex flex-wrap justify-center gap-8 text-sm text-[#198CFF]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#198CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>100+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#198CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#198CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#198CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Certificate of Completion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section id="courses" className="section-padding py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="tag bg-[#198CFF]/10 text-[#198CFF] mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">Our Courses</span>
            <h2 className="heading-2 mb-4 text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">Expand Your Knowledge</h2>
            <p className="subtitle text-xl text-[#198CFF] font-normal">Discover courses crafted by industry experts to help you master new skills.</p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium  cursor-pointer transition-all duration-300 ${activeTab === "all" ? "bg-[#198CFF] text-white" : "bg-[#F4F4F5] text-foreground/80 hover:bg-[#F4F4F5]/70"
                }`}
            >
              All Courses
            </button>
            {categories.slice(0, 6).map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(category)}
                className={`px-4 py-2 rounded-full text-sm cursor-pointer font-medium transition-all duration-300 ${activeTab === category ? "bg-[#198CFF] text-white" : "bg-[#F4F4F5] text-foreground/80 hover:bg-[#F4F4F5]/70"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-full px-4 py-3 pl-12 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-[#198CFF] transition-all duration-300"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#198CFF]" />
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleCourses.map((course) => (
              <div key={course.id} className="  rounded-2xl  border-gray-200 overflow-hidden border  shadow-sm transition-all duration-500 hover:shadow-lg hover:translate-y-[-4px]">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div className="absolute inset-0 bg-[#F4F4F5] animate-pulse" />
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    onLoad={(e) => (e.target).previousElementSibling?.classList.add('hidden')}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="tag bg-[#198CFF]/90 text-white backdrop-blur-sm inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="heading-3 line-clamp-2 hover:text-[#198CFF] transition-colors duration-200 text-2xl sm:text-3xl font-semibold leading-tight">
                      {course.title}
                    </h3>
                  </div>

                  <p className="body-text mb-4 line-clamp-2 text-base text-foreground/80 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{course.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[#198CFF]">•</span>
                    <div className="flex items-center gap-1 text-[#198CFF]">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <span className="text-[#198CFF]">•</span>
                    <div className="flex items-center gap-1 text-[#198CFF]">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <p className="text-sm text-[#198CFF]">Instructor: <span className="font-medium text-foreground">{course.instructor}</span></p>
                    <p className="text-lg font-semibold">${course.price.toFixed(2)}</p>
                  </div>

                  <button className="w-full mt-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-white cursor-pointer">
                    Enroll Now <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-[#198CFF] hover:text-white bg-[#F4F4F5]  transition-all duration-300"
            >
              View All Courses <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Instructors Section */}
      <section id="instructors" className="section-padding bg-[#F4F4F5]/30 py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="tag bg-[#198CFF]/10 text-[#198CFF] mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">Our Instructors</span>
            <h2 className="heading-2 mb-4 text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">Learn from Industry Experts</h2>
            <p className="subtitle text-xl text-[#198CFF] font-normal">Our instructors are passionate professionals with years of real-world experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{instructor.name}</h3>
                  <p className="text-white font-medium text-sm mb-3">{instructor.title}</p>
                  <p className="body-text mb-4 text-base text-foreground/80 leading-relaxed">{instructor.bio}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xl font-semibold">{instructor.courses}</p>
                      <p className="text-xs text-[#198CFF]">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold">{(instructor.students / 1000).toFixed(1)}k</p>
                      <p className="text-xs text-[#198CFF]">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold">{instructor.rating}</p>
                      <p className="text-xs text-[#198CFF]">Rating</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <a href="#" className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-[#198CFF] transition-all duration-200">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href="#" className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-[#198CFF] transition-all duration-200">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href="#" className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-[#198CFF] transition-all duration-200">
                        <Globe className="w-4 h-4" />
                      </a>
                    </div>

                    <a href="#" className="text-sm font-medium text-white hover:underline flex items-center gap-1">
                      View Profile <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-[#198CFF] transition-colors duration-300"
            >
              View All Instructors <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-[#FFFFFF] py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="tag bg-[#198CFF]/10 text-[#198CFF] mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">Testimonials</span>
            <h2 className="heading-2 mb-4 text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">What Our Students Say</h2>
            <p className="subtitle text-xl text-[#198CFF] font-normal">Hear from our community of learners who have transformed their lives through our platform.</p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-500 ${index === visibleTestimonials || index === visibleTestimonials + 1 || index === visibleTestimonials + 2
                    ? "opacity-100 translate-x-0"
                    : " -translate-x-full hidden lg:block"
                    }`}
                >
                  <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-3">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-[#198CFF]">{testimonial.title}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"}`} />
                        ))}
                      </div>
                    </div>

                    <blockquote className="flex-1">
                      <p className="body-text italic text-base text-foreground/80 leading-relaxed">"{testimonial.quote}"</p>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Testimonial Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8 lg:hidden">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-[#198CFF] transition-colors duration-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <span
                    key={index}
                    className={`block h-2 w-2 rounded-full transition-all duration-300 ${index === visibleTestimonials ? "bg-[#198CFF] w-6" : "bg-[#F4F4F5]"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-[#198CFF] transition-colors duration-300"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}


      {/* Newsletter Section */}
      {/* <section className="section-padding bg-[#FFFFFF] py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-10 shadow-sm overflow-hidden relative bg-white/70 backdrop-blur-xl border border-white/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70"></div>
            <div className="relative z-10">
              <span className="tag bg-[#198CFF]/10 text-white mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">Stay Updated</span>
              <h2 className="heading-2 mb-4 text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">Join Our Newsletter</h2>
              <p className="subtitle mb-8 text-xl text-[#198CFF] font-normal">Get the latest updates, course releases, and learning tips delivered to your inbox.</p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300"
                  />
                  <MailIcon className="absolute left-3 top-3.5 w-4 h-4 text-[#198CFF]" />
                </div>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#198CFF] text-white hover:bg-[#198CFF]/90 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="text-xs text-[#198CFF] mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates from us.</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-[#F9F9FA] border-t border-gray-200">
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
            <img src="https://www.requingroup.com/logo.png" alt="" className='max-h-[70px] max-w-[200px]' />
              {/* <h3 className="text-xl font-semibold mb-4">Learn<span className="text-white">Flow</span></h3> */}
              <p className="hover:text-[#198CFF] text-black mb-6">Empowering learners worldwide with premium online education and transformative learning experiences.</p>
              <div className="flex space-x-3">
                <a href="#" className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-white transition-colors duration-200">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-white transition-colors duration-200">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-white transition-colors duration-200">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-white transition-colors duration-200">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#198CFF] hover:text-white transition-colors duration-200">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-4">Explore</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-black  hover:text-[#198CFF] transition-colors duration-200">All Courses</a></li>
                <li><a href="#" className="text-black hover:text-[#198CFF] transition-colors duration-200">Instructors</a></li>
                <li><a href="#" className="text-black hover:text-[#198CFF] transition-colors duration-200">Pricing Plans</a></li>
                <li><a href="#" className="text-black hover:text-[#198CFF] transition-colors duration-200">Career Paths</a></li>
                <li><a href="#" className="text-black hover:text-[#198CFF] transition-colors duration-200">Become an Instructor</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-4">Categories</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-[#198CFF] text-black mb-6 transition-colors duration-200">Web Development</a></li>
                <li><a href="#" className="hover:text-[#198CFF] text-black mb-6 transition-colors duration-200">Data Science</a></li>
                <li><a href="#" className="hover:text-[#198CFF] text-black mb-6 transition-colors duration-200">Mobile Development</a></li>
                <li><a href="#" className="hover:text-[#198CFF] text-black mb-6 transition-colors duration-200">UX/UI Design</a></li>
                <li><a href="#" className="hover:text-[#198CFF] text-black mb-6 transition-colors duration-200">Business & Marketing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-4">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span className=" text-black">1234 Tech Avenue, San Francisco, CA 94107</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-white shrink-0" />
                  <span className=" text-black">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-white shrink-0" />
                  <span className=" text-black">support@learnflow.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[#198CFF] mb-4 md:mb-0">
              © {new Date().getFullYear()} LearnFlow. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#" className="hover:text-[#198CFF] text-black mb-6 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-[#198CFF] text-black mb-6 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-[#198CFF] text-black mb-6 transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientUI;
