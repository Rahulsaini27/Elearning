
// import React, { useState } from 'react';
// // Consolidated Lucide-React imports from all sub-components
// import {
//   ArrowRight, Users, Clock, Award, MessageCircle,
//   Menu, X, BookOpen, Play, Mail, Phone, MapPin,
//   Star, Check, DollarSign
// } from 'lucide-react';
// import { useNavigate } from "react-router-dom";
// import Modal from './Modal'; // Adjust path if Modal.jsx is elsewhere
// import AdminLogin from '../Admin/AdminLogin';
// import ClientLogin from './ClientLogin';
// import ClientSignup from './ClientSignup';
// import ForgetPassword from './ForgetPassword';

// // --- Header Component Definition (formerly Header.tsx) ---
// const Header = ({ openModal }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <BookOpen className="h-8 w-8 text-blue-500" />
//             <span className="text-xl font-bold text-gray-900">LearnHub</span>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Courses</a>
//             <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">About</a>
//             <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Pricing</a>
//             <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Contact</a>
//           </nav>

//           {/* Desktop Auth Buttons - Now open modals */}
//           <div className="hidden md:flex items-center space-x-4">
//             <button
//               className="text-gray-600 hover:text-blue-500 transition-colors"
//               onClick={() => openModal("login")} // Opens login modal
//             >
//               Sign In
//             </button>

//             <button
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               onClick={() => openModal("signup")} // Opens signup modal
//             >
//               Sign Up
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <button
//             className="md:hidden"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t">
//             <div className="flex flex-col space-y-4">
//               <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Courses</a>
//               <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">About</a>
//               <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Pricing</a>
//               <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Contact</a>
//               <div className="flex flex-col space-y-2 pt-4 border-t">
//                 {/* Mobile auth buttons - Close menu and open modal */}
//                 <button className="text-gray-600 hover:text-blue-500 transition-colors text-left" onClick={() => { openModal("login"); setIsMenuOpen(false); }}>Sign In</button>
//                 <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors" onClick={() => { openModal("signup"); setIsMenuOpen(false); }}>
//                   Sign Up
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// const Hero = () => {
//   return (
//     <section className="bg-gray-50 py-12 lg:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
//           {/* Left Content */}
//           <div className="lg:col-span-6">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
//               Learn Anytime,{' '}
//               <span className="text-blue-500">Anywhere</span>
//             </h1>
//             <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
//               Access high-quality courses from industry experts and start learning today.
//               Build skills that matter with our comprehensive online learning platform.
//             </p>

//             <div className="mt-8 flex flex-col sm:flex-row gap-4">
//               <button className="group bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
//                 <span>Get Started</span>
//                 <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button className="group bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
//                 <Play className="h-5 w-5" />
//                 <span>Browse Courses</span>
//               </button>
//             </div>

//             <div className="mt-12 grid grid-cols-3 gap-8">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-gray-900">50K+</div>
//                 <div className="text-sm text-gray-600">Students</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-gray-900">200+</div>
//                 <div className="text-sm text-gray-600">Courses</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-gray-900">98%</div>
//                 <div className="text-sm text-gray-600">Success Rate</div>
//               </div>
//             </div>
//           </div>

//           {/* Right Illustration */}
//           <div className="mt-12 lg:mt-0 lg:col-span-6">
//             <div className="relative">
//               <img
//                 src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
//                 alt="Students learning online"
//                 className="w-full h-auto rounded-2xl shadow-2xl"
//               />
//               <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
//                     <Play className="h-6 w-6 text-white" />
//                   </div>
//                   <div>
//                     <div className="font-semibold text-gray-900">Live Session</div>
//                     <div className="text-sm text-gray-600">2,847 active learners</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// // --- End of Hero Component Definition ---

// // --- Features Component Definition (formerly Features.tsx) ---
// const Features = () => {
//   const features = [
//     {
//       icon: Users,
//       title: 'Expert-Led Courses',
//       description: 'Learn from industry professionals with real-world experience and proven track records.',
//     },
//     {
//       icon: Clock,
//       title: 'Flexible Learning',
//       description: 'Study at your own pace with lifetime access to course materials and mobile support.',
//     },
//     {
//       icon: Award,
//       title: 'Certificates of Completion',
//       description: 'Earn recognized certificates to showcase your skills and advance your career.',
//     },
//     {
//       icon: MessageCircle,
//       title: 'Community Support',
//       description: 'Join our vibrant community of learners and get help from peers and instructors.',
//     },
//   ];

//   return (
//     <section className="py-16 lg:py-24 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//             Why Learn With Us?
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Discover the features that make our platform the perfect choice for your learning journey
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="group bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
//             >
//               <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
//                 <feature.icon className="h-8 w-8 text-blue-500" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
//               <p className="text-gray-600 leading-relaxed">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
// // --- End of Features Component Definition ---

// // --- PopularCourses Component Definition (formerly PopularCourses.tsx) ---
// const PopularCourses = () => {
//   const courses = [
//     {
//       id: 1,
//       title: 'Complete Web Development Bootcamp',
//       instructor: 'Sarah Johnson',
//       rating: 4.9,
//       students: 12430,
//       duration: '24 hours',
//       price: '$89',
//       thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     },
//     {
//       id: 2,
//       title: 'Data Science & Machine Learning',
//       instructor: 'Dr. Michael Chen',
//       rating: 4.8,
//       students: 8920,
//       duration: '36 hours',
//       price: '$129',
//       thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     },
//     {
//       id: 3,
//       title: 'Digital Marketing Mastery',
//       instructor: 'Emma Rodriguez',
//       rating: 4.7,
//       students: 15670,
//       duration: '18 hours',
//       price: '$69',
//       thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     },
//     {
//       id: 4,
//       title: 'UI/UX Design Fundamentals',
//       instructor: 'Alex Thompson',
//       rating: 4.9,
//       students: 9840,
//       duration: '28 hours',
//       price: '$99',
//       thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     },
//     {
//       id: 5,
//       title: 'Python Programming Complete',
//       instructor: 'David Kumar',
//       rating: 4.8,
//       students: 11250,
//       duration: '32 hours',
//       price: '$79',
//       thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     },
//     {
//       id: 6,
//       title: 'Financial Analysis & Modeling',
//       instructor: 'Lisa Park',
//       rating: 4.6,
//       students: 6780,
//       duration: '22 hours',
//       price: '$109',
//       thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     },
//   ];

//   return (
//     <section className="py-16 lg:py-24 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//             Popular Courses
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Join thousands of students in our most loved courses
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {courses.map((course) => (
//             <div
//               key={course.id}
//               className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
//             >
//               <div className="relative overflow-hidden">
//                 <img
//                   src={course.thumbnail}
//                   alt={course.title}
//                   className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                   {course.price}
//                 </div>
//               </div>

//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
//                   {course.title}
//                 </h3>
//                 <p className="text-gray-600 mb-4">by {course.instructor}</p>

//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-1">
//                     <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                     <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
//                   </div>
//                   <div className="flex items-center space-x-4 text-sm text-gray-600">
//                     <div className="flex items-center space-x-1">
//                       <Users className="h-4 w-4" />
//                       <span>{course.students.toLocaleString()}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Clock className="h-4 w-4" />
//                       <span>{course.duration}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
//                   Enroll Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors">
//             View All Courses
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };
// // --- End of PopularCourses Component Definition ---

// // --- WhyChooseUs Component Definition (formerly WhyChooseUs.tsx) ---
// const WhyChooseUs = () => {
//   const benefits = [
//     {
//       icon: Users,
//       title: 'Trusted by 10,000+ learners',
//       description: 'Join our growing community of successful students worldwide',
//     },
//     {
//       icon: Clock,
//       title: '24/7 Access',
//       description: 'Learn on your schedule with unlimited access to all course materials',
//     },
//     {
//       icon: DollarSign,
//       title: 'Affordable Pricing',
//       description: 'High-quality education at prices that won\'t break the bank',
//     },
//   ];

//   return (
//     <section className="py-16 lg:py-24 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
//           {/* Image Side */}
//           <div className="mb-12 lg:mb-0">
//             <img
//               src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//               alt="Students collaborating"
//               className="w-full h-96 object-cover rounded-2xl shadow-2xl"
//             />
//           </div>

//           {/* Content Side */}
//           <div>
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
//               Why Choose <span className="text-blue-500">LearnHub</span>?
//             </h2>
//             <p className="text-lg text-gray-600 mb-8 leading-relaxed">
//               We're committed to providing the best learning experience with expert instructors,
//               flexible scheduling, and comprehensive support every step of the way.
//             </p>

//             <div className="space-y-6">
//               {benefits.map((benefit, index) => (
//                 <div key={index} className="flex items-start space-x-4">
//                   <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                     <benefit.icon className="h-6 w-6 text-blue-500" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
//                     <p className="text-gray-600">{benefit.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-8">
//               <button className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
//                 <span>Start Learning Today</span>
//                 <Check className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// // --- End of WhyChooseUs Component Definition ---

// // --- Testimonials Component Definition (formerly Testimonials.tsx) ---
// const Testimonials = () => {
//   const testimonials = [
//     {
//       id: 1,
//       name: 'Jessica Martinez',
//       role: 'Frontend Developer',
//       content: 'LearnHub transformed my career! The courses are comprehensive and the instructors are amazing. I landed my dream job within 3 months.',
//       rating: 5,
//       avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
//     },
//     {
//       id: 2,
//       name: 'Robert Kim',
//       role: 'Data Analyst',
//       content: 'The flexibility to learn at my own pace while working full-time was exactly what I needed. Highly recommend!',
//       rating: 5,
//       avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
//     },
//     {
//       id: 3,
//       name: 'Amanda Foster',
//       role: 'Marketing Manager',
//       content: 'The digital marketing course exceeded my expectations. The practical projects helped me apply what I learned immediately.',
//       rating: 5,
//       avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
//     },
//   ];

//   return (
//     <section className="py-16 lg:py-24 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//             What Our Students Say
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Real stories from learners who achieved their goals with LearnHub
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {testimonials.map((testimonial) => (
//             <div
//               key={testimonial.id}
//               className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <div className="flex items-center space-x-1 mb-4">
//                 {[...Array(testimonial.rating)].map((_, i) => (
//                   <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
//                 ))}
//               </div>

//               <p className="text-gray-600 mb-6 leading-relaxed italic">
//                 "{testimonial.content}"
//               </p>

//               <div className="flex items-center space-x-4">
//                 <img
//                   src={testimonial.avatar}
//                   alt={testimonial.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <div className="font-semibold text-gray-900">{testimonial.name}</div>
//                   <div className="text-sm text-gray-600">{testimonial.role}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
// // --- End of Testimonials Component Definition ---

// // --- CTAFooter Component Definition (formerly CTAFooter.tsx) ---
// const CTAFooter = () => {
//   return (
//     <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-500 to-blue-600">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
//           Ready to start your learning journey?
//         </h2>
//         <p className="text-xl text-blue-100 mb-8 leading-relaxed">
//           Join thousands of successful learners and unlock your potential today.
//           Start with a free trial and see the difference quality education makes.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           <button className="group bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
//             <span>Join Now</span>
//             <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//           </button>
//           <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-500 transition-colors">
//             Try Free Demo
//           </button>
//         </div>

//         <div className="mt-12 text-blue-100 text-sm">
//           <p>🔒 No credit card required • 📚 Access to 5 free courses • ✅ 30-day money-back guarantee</p>
//         </div>
//       </div>
//     </section>
//   );
// };
// // --- End of CTAFooter Component Definition ---

// // --- Footer Component Definition (formerly Footer.tsx) ---
// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Company Info */}
//           <div className="lg:col-span-1">
//             <div className="flex items-center space-x-2 mb-4">
//               <BookOpen className="h-8 w-8 text-blue-500" />
//               <span className="text-xl font-bold">LearnHub</span>
//             </div>
//             <p className="text-gray-300 mb-6 leading-relaxed">
//               Empowering learners worldwide with high-quality online education and expert-led courses.
//             </p>
//             <div className="space-y-2">
//               <div className="flex items-center space-x-2 text-gray-300">
//                 <Mail className="h-4 w-4" />
//                 <span>hello@learnhub.com</span>
//               </div>
//               <div className="flex items-center space-x-2 text-gray-300">
//                 <Phone className="h-4 w-4" />
//                 <span>+1 (555) 123-4567</span>
//               </div>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-3">
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Courses</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Instructors</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Support</h3>
//             <ul className="space-y-3">
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Support</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
//             </ul>
//           </div>

//           {/* Legal */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Legal</h3>
//             <ul className="space-y-3">
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
//               <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Refund Policy</a></li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-gray-700 mt-12 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-300 text-sm">
//               © 2025 LearnHub. All rights reserved.
//             </p>
//             <div className="flex space-x-6 mt-4 md:mt-0">
//               <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy</a>
//               <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Terms</a>
//               <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Cookies</a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// function ClientUI() {
//   // State to track which modal is currently active ('login', 'signup', 'forgot', 'adminLogin', or null)
//   const [activeModal, setActiveModal] = useState(null);

//   const openModal = (modalType) => setActiveModal(modalType);
//   const closeModal = () => setActiveModal(null);

//   // Function to render the correct form component based on activeModal state
//   const renderAuthForm = () => {
//     const commonProps = { onClose: closeModal, onSwitchForm: openModal };
//     switch (activeModal) {
//       case 'login':
//         return <ClientLogin {...commonProps} />;
//       case 'signup':
//         return <ClientSignup {...commonProps} />;
//       case 'forgot':
//         return <ForgetPassword {...commonProps} />;
//       case 'adminLogin':
//         return <AdminLogin {...commonProps} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       {/* Pass the openModal function to the Header */}
//       <Header openModal={openModal} />

//       <main>
//         <Hero />
//         <Features />
//         <PopularCourses />
//         <WhyChooseUs />
//         <Testimonials />
//         <CTAFooter />
//       </main>

//       <Footer />

//       {/* Render the Modal component conditionally */}
//       <Modal isOpen={activeModal !== null} onClose={closeModal}>
//         {renderAuthForm()} {/* Render the active auth form inside the modal */}
//       </Modal>
//     </div>
//   );
// }

// export default ClientUI;







import React, { useState } from 'react';
// Consolidated Lucide-React imports from all sub-components
import {
  ArrowRight, Users, Clock, Award, MessageCircle,
  Menu, X, BookOpen, Play, Mail, Phone, MapPin,
  Star, Check, DollarSign
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Modal from './Modal'; // Adjust path if Modal.jsx is elsewhere
import AdminLogin from '../Admin/AdminLogin';
import ClientLogin from './ClientLogin';
import ClientSignup from './ClientSignup';
import ForgetPassword from './ForgetPassword';

// --- Header Component Definition (formerly Header.tsx) ---
const Header = ({ openModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Courses</a>
            <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Contact</a>
          </nav>

          {/* Desktop Auth Buttons - Now open modals */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-blue-500 transition-colors"
              onClick={() => openModal("login")} // Opens login modal
            >
              Sign In
            </button>

            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => openModal("signup")} // Opens signup modal
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Courses</a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">Contact</a>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {/* Mobile auth buttons - Close menu and open modal */}
                <button className="text-gray-600 hover:text-blue-500 transition-colors text-left" onClick={() => { openModal("login"); setIsMenuOpen(false); }}>Sign In</button>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors" onClick={() => { openModal("signup"); setIsMenuOpen(false); }}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="bg-gray-50 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Learn Anytime,{' '}
              <span className="text-blue-500">Anywhere</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Access high-quality courses from industry experts and start learning today.
              Build skills that matter with our comprehensive online learning platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="group bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                <Play className="h-5 w-5" />
                <span>Browse Courses</span>
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                alt="Students learning online"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Live Session</div>
                    <div className="text-sm text-gray-600">2,847 active learners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// --- End of Hero Component Definition ---

// --- Features Component Definition (formerly Features.tsx) ---
const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience and proven track records.',
    },
    {
      icon: Clock,
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access to course materials and mobile support.',
    },
    {
      icon: Award,
      title: 'Certificates of Completion',
      description: 'Earn recognized certificates to showcase your skills and advance your career.',
    },
    {
      icon: MessageCircle,
      title: 'Community Support',
      description: 'Join our vibrant community of learners and get help from peers and instructors.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Learn With Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the features that make our platform the perfect choice for your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <feature.icon className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
// --- End of Features Component Definition ---

// --- PopularCourses Component Definition (formerly PopularCourses.tsx) ---
const PopularCourses = () => {
  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: 12430,
      duration: '24 hours',
      price: '$89',
      thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      title: 'Data Science & Machine Learning',
      instructor: 'Dr. Michael Chen',
      rating: 4.8,
      students: 8920,
      duration: '36 hours',
      price: '$129',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      instructor: 'Emma Rodriguez',
      rating: 4.7,
      students: 15670,
      duration: '18 hours',
      price: '$69',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 4,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Alex Thompson',
      rating: 4.9,
      students: 9840,
      duration: '28 hours',
      price: '$99',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 5,
      title: 'Python Programming Complete',
      instructor: 'David Kumar',
      rating: 4.8,
      students: 11250,
      duration: '32 hours',
      price: '$79',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 6,
      title: 'Financial Analysis & Modeling',
      instructor: 'Lisa Park',
      rating: 4.6,
      students: 6780,
      duration: '22 hours',
      price: '$109',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Popular Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students in our most loved courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {course.price}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">by {course.instructor}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
};
// --- End of PopularCourses Component Definition ---

// --- WhyChooseUs Component Definition (formerly WhyChooseUs.tsx) ---
const WhyChooseUs = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Trusted by 10,000+ learners',
      description: 'Join our growing community of successful students worldwide',
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Learn on your schedule with unlimited access to all course materials',
    },
    {
      icon: DollarSign,
      title: 'Affordable Pricing',
      description: 'High-quality education at prices that won\'t break the bank',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="mb-12 lg:mb-0">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Students collaborating"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>

          {/* Content Side */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-blue-500">LearnHub</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We're committed to providing the best learning experience with expert instructors,
              flexible scheduling, and comprehensive support every step of the way.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                <span>Start Learning Today</span>
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// --- End of WhyChooseUs Component Definition ---

// --- Testimonials Component Definition (formerly Testimonials.tsx) ---
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Jessica Martinez',
      role: 'Frontend Developer',
      content: 'LearnHub transformed my career! The courses are comprehensive and the instructors are amazing. I landed my dream job within 3 months.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 2,
      name: 'Robert Kim',
      role: 'Data Analyst',
      content: 'The flexibility to learn at my own pace while working full-time was exactly what I needed. Highly recommend!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
    },
    {
      id: 3,
      name: 'Amanda Foster',
      role: 'Marketing Manager',
      content: 'The digital marketing course exceeded my expectations. The practical projects helped me apply what I learned immediately.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from learners who achieved their goals with LearnHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
// --- End of Testimonials Component Definition ---

// --- CTAFooter Component Definition (formerly CTAFooter.tsx) ---
const CTAFooter = () => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-500 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to start your learning journey?
        </h2>
        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
          Join thousands of successful learners and unlock your potential today.
          Start with a free trial and see the difference quality education makes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
            <span>Join Now</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-500 transition-colors">
            Try Free Demo
          </button>
        </div>

        <div className="mt-12 text-blue-100 text-sm">
          <p>🔒 No credit card required • 📚 Access to 5 free courses • ✅ 30-day money-back guarantee</p>
        </div>
      </div>
    </section>
  );
};
// --- End of CTAFooter Component Definition ---

// --- Footer Component Definition (formerly Footer.tsx) ---
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">LearnHub</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering learners worldwide with high-quality online education and expert-led courses.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>hello@learnhub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Courses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Instructors</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 LearnHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function ClientUI() {
  // State to track which modal is currently active ('login', 'signup', 'forgot', 'adminLogin', or null)
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  // Function to render the correct form component based on activeModal state
  const renderAuthForm = () => {
    const commonProps = { onClose: closeModal, onSwitchForm: openModal };
    switch (activeModal) {
      case 'login':
        return <ClientLogin {...commonProps} />;
      case 'signup':
        return <ClientSignup {...commonProps} />;
      case 'forgot':
        return <ForgetPassword {...commonProps} />;
      case 'adminLogin':
        return <AdminLogin {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Pass the openModal function to the Header */}
      <Header openModal={openModal} />

      <main>
        <Hero />
        <Features />
        <PopularCourses />
        <WhyChooseUs />
        <Testimonials />
        <CTAFooter />
      </main>

      <Footer />

      {/* Render the Modal component conditionally */}
      <Modal isOpen={activeModal !== null} onClose={closeModal}>
        {renderAuthForm()} {/* Render the active auth form inside the modal */}
      </Modal>
    </div>
  );
}

export default ClientUI;