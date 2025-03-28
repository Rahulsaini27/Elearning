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
import GalaxyBackground from '../../Components/UI/galaxybackground';

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
    <div className="relative min-h-screen text-white flex flex-col overflow-x-hidden px-10">
      <GalaxyBackground />
      {/* Navbar Component */}
      <header className={`fixed top-0 px-10 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? " backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex-shrink-0">
              <img src="https://i.ibb.co/hRzkkDJV/Logo-white.png" alt="" className='max-h-[60px] max-w-[200px]' />
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="#courses" className="hover:text-[#198CFF] text-foreground/80 transition-colors duration-200">Courses</a></li>
                <li><a href="#instructors" className="hover:text-[#198CFF] text-foreground/80 transition-colors duration-200">Instructors</a></li>
                <li><a href="#testimonials" className="hover:text-[#198CFF] text-foreground/80 transition-colors duration-200">Testimonials</a></li>
              </ul>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="px-4 py-2 rounded-lg bg-[#198CFF] text-white hover:bg-[#198CFF]/90 transition-colors duration-200">Login</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-20 flex items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#210227] via-[#0d020f] to-[#220427]">
        <div className="container mx-auto px-4 py-12 sm:py-20 md:py-28 slide-in-section">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-on-scroll">
              <span className="tag mb-6 animate-fade-in px-3 rounded-4xl bg-purple-500 text-white">Transform Your Future</span>
            </div>
            <h1 className="animate-on-scroll text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">Elevate Your Skills with Premium Online Courses</h1>
            <p className="animate-on-scroll max-w-2xl mx-auto mb-10 text-xl text-gray-300 font-light">
              Join thousands of learners worldwide. Gain the skills you need for the future with our expertly crafted courses.
            </p>
            <div className="animate-on-scroll flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a href="#courses" className="px-8 py-3 rounded-lg bg-purple-600 text-white font-medium hover:shadow-lg hover:bg-purple-500 transition-all duration-300 w-full sm:w-auto">
                Browse Courses
              </a>
              <a href="#instructors" className="px-8 py-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                Meet Our Instructors <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="animate-on-scroll flex flex-wrap justify-center gap-8 text-sm text-white">
              <div className="flex items-center gap-2">
                <span>🚀 100+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👨‍🏫 Expert Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎓 Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📜 Certificate of Completion</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Course Categories Section */}
      <section id="courses" className="section-padding py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#210227] via-[#0d020f] to-[#220427]">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="tag bg-purple-500 text-white mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">Our Courses</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">Expand Your Knowledge</h2>
            <p className="text-xl text-gray-300 font-light">Discover courses crafted by industry experts to help you master new skills.</p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${activeTab === "all" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              All Courses
            </button>
            {categories.slice(0, 6).map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${activeTab === category ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
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
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleCourses.map((course) => (
              <div key={course.id} className="bg-white/10 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform border border-gray-700">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover rounded-md mb-4 transition-transform duration-500 hover:scale-105" />
                </div>
                <h3 className="text-xl font-semibold text-white hover:text-purple-400 transition-all duration-300">{course.title}</h3>
                <p className="text-gray-300 mt-2">{course.description}</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Star className="w-4 h-4" /> {course.rating.toFixed(1)}
                  </span>
                  <span className="text-blue-300 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {course.duration}
                  </span>
                  <span className="text-green-300 flex items-center gap-1">
                    <Users className="w-4 h-4" /> {course.students.toLocaleString()} students
                  </span>
                </div>
                <button className="mt-4 w-full bg-purple-600 py-2 rounded-md hover:bg-purple-500 transition-all duration-300">Enroll Now</button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white transition-all duration-300">
              View All Courses <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>


      {/* Featured Instructors Section */}
     
      <section id="instructors" className="section-padding py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#210227] via-[#0d020f] to-[#220427]">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="tag bg-purple-500 text-white mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">Our Instructors</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">Learn from Industry Experts</h2>
            <p className="text-xl text-gray-300 font-light">Our instructors are passionate professionals with years of real-world experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {instructors.map((instructor, index) => (
              <div
                key={index}
                className="bg-white/10 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform border border-gray-700"
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
                      <a href="#" className="p-2 rounded-full  hover:bg-[#198CFF] hover:text-[#198CFF] transition-all duration-200">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href="#" className="p-2 rounded-full  hover:bg-[#198CFF] hover:text-[#198CFF] transition-all duration-200">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href="#" className="p-2 rounded-full  hover:bg-[#198CFF] hover:text-[#198CFF] transition-all duration-200">
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
        </div>
      </section>
      {/* Testimonials Section */}
 



      <section id="testimonials" className="section-padding py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#210227] via-[#0d020f] to-[#220427]">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="tag bg-purple-500 text-white mb-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">What Our Students Say</h2>
            <p className="text-xl text-gray-300 font-light">Hear from our community of learners who have transformed their lives through our platform.</p>
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
              <div className="flex justify-center items-center gap-4 mt-8 lg:hidden">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full  hover:bg-[#198CFF] hover:text-[#198CFF] transition-colors duration-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <span
                    key={index}
                    className={`block h-2 w-2 rounded-full transition-all duration-300 ${index === visibleTestimonials ? "bg-[#198CFF] w-6" : ""
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full  hover:bg-[#198CFF] hover:text-[#198CFF] transition-colors duration-300"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#210227] via-[#0d020f] to-[#220427] border-t border-gray-700 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <img src="https://www.requingroup.com/logo.png" alt="Logo" className='max-h-[70px] max-w-[200px] mb-4' />
              <p className="hover:text-purple-400 transition-colors duration-200">Empowering learners worldwide with premium online education and transformative learning experiences.</p>
              <div className="flex space-x-3 mt-4">
                {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, index) => (
                  <a key={index} href="#" className="p-2 rounded-full bg-gray-800 hover:bg-purple-500 transition-all duration-200">
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Explore</h4>
              <ul className="space-y-3">
                {["All Courses", "Instructors", "Pricing Plans", "Career Paths", "Become an Instructor"].map((item, index) => (
                  <li key={index}><a href="#" className="hover:text-purple-400 transition-colors duration-200">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
              <ul className="space-y-3">
                {["Web Development", "Data Science", "Mobile Development", "UX/UI Design", "Business & Marketing"].map((item, index) => (
                  <li key={index}><a href="#" className="hover:text-purple-400 transition-colors duration-200">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-4">
                {[{ icon: MapPin, text: "1234 Tech Avenue, San Francisco, CA 94107" }, { icon: Phone, text: "+1 (555) 123-4567" }, { icon: Mail, text: "support@learnflow.com" }].map(({ icon: Icon, text }, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} LearnFlow. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 text-sm">
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item, index) => (
                <a key={index} href="#" className="hover:text-purple-400 transition-colors duration-200">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientUI;
