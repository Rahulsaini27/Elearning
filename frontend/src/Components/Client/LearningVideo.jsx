



// import React, { useContext, useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';

// import '@vidstack/react/player/styles/default/theme.css';
// import '@vidstack/react/player/styles/default/layouts/video.css';
// import { MediaPlayer, MediaProvider } from '@vidstack/react';
// import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
// import { ChevronLeft, ChevronRight, PlayCircle, AlertCircle, CloudSnow, DownloadCloud, UploadCloud, BookOpen, Check, X, Loader2 } from 'lucide-react';
// import ProjectContext from '../../Context/ProjectContext';
// import { AlertContext } from '../../Context/AlertContext';

// function LearningVideo() {
//     const { courseId } = useParams();
//     const [videos, setVideos] = useState([]);
//     const [videoImages, setVideoImages] = useState({});
//     const [selectedVideo, setSelectedVideo] = useState(null);
//     const [videoLoading, setVideoLoading] = useState(false);
//     const [allvideoLoading, setAllVideoLoading] = useState(true);
//     const userId = localStorage.getItem("userId");
//     const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL } = useContext(ProjectContext);

//     const { Toast } = useContext(AlertContext);
//     const [showSubmissionModal, setShowSubmissionModal] = useState(false);
//     const [submissionFile, setSubmissionFile] = useState(null);
//     const [submissionComments, setSubmissionComments] = useState("");
//     const [submissionLoading, setSubmissionLoading] = useState(false);
//     const [downloadingAssignment, setDownloadingAssignment] = useState(false); // NEW State

//     const token = localStorage.getItem("token");

//     // --- IMPORTANT: Log token to debug "No token, authorization denied" ---
//     useEffect(() => {
//         console.log("LearningVideo.jsx: Token from localStorage:", token);
//         if (!token) {
//             Toast.fire({
//                 icon: "warning",
//                 title: "You are not logged in or your session expired. Please log in again.",
//             });
//             // Optionally, redirect to login page here:
//             // navigate('/login'); // Assuming you have `useNavigate` from react-router-dom
//         }
//     }, [token, Toast]);
//     // --- END IMPORTANT ---


//     const handleSubmissionFileChange = (e) => {
//         setSubmissionFile(e.target.files[0]);
//     };

//     // Handle assignment submission (unchanged logic)
//     const handleSubmitAssignment = async (e) => {
//         e.preventDefault();

//         if (!submissionFile) {
//             Toast.fire({ icon: "error", title: "Please select an assignment file to submit." });
//             return;
//         }

//         const allowedTypes = ["application/pdf", "application/zip"];
//         if (!allowedTypes.includes(submissionFile.type)) {
//             Toast.fire({ icon: "error", title: "Invalid file type. Please upload a PDF or ZIP file." });
//             return;
//         }

//         if (!videos[currentIndex]?.assignment?._id) {
//             Toast.fire({ icon: "error", title: "No assignment found for this video to submit against." });
//             return;
//         }

//         setSubmissionLoading(true);
//         try {
//             // Step 1: Generate presigned URL & final URL from backend
//             const { data: { uploadUrl, finalUrl } } = await axios.post(
//                 `${API_BASE_URL}${API_URL}/assignments/submit/generate-url`,
//                 {
//                     assignmentId: videos[currentIndex].assignment._id,
//                     submissionFileType: submissionFile.type,
//                 },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             // Step 2: Upload file to S3
//             await axios.put(uploadUrl, submissionFile, {
//                 headers: { "Content-Type": submissionFile.type },
//             });

//             // Step 3: Save submission in DB
//             await axios.post(
//                 `${API_BASE_URL}${API_URL}/assignments/submit/save`,
//                 {
//                     assignmentId: videos[currentIndex].assignment._id,
//                     submissionUrl: finalUrl, // ✅ Directly use backend-provided URL
//                     submissionText: submissionComments,
//                 },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             Toast.fire({ icon: "success", title: "Assignment submitted successfully!" });
//             setSubmissionFile(null);
//             setSubmissionComments("");
//             setShowSubmissionModal(false);
//         } catch (error) {
//             console.error("Error submitting assignment:", error);
//             Toast.fire({
//                 icon: "error",
//                 title: "Failed to submit assignment",
//                 text: error.response?.data?.message || error.message,
//             });
//         } finally {
//             setSubmissionLoading(false);
//         }
//     };


//     // NEW: Handle downloading the assignment (using presigned URL)
//     const handleDownloadAssignment = async (assignmentUrl) => {
//         if (!token) {
//             Toast.fire({ icon: "error", title: "You must be logged in to download assignments." });
//             return;
//         }
//         if (downloadingAssignment) return; // Prevent multiple clicks

//         setDownloadingAssignment(true);
//         try {
//             const response = await axios.get(
//                 `${API_BASE_URL}${API_URL}/assignments/generate-assignment-download-url`,
//                 {
//                     params: { assignmentUrl: assignmentUrl },
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             if (response.data.success && response.data.downloadUrl) {
//                 // Open the presigned URL in a new tab/window, which will trigger download
//                 window.open(response.data.downloadUrl, '_blank');
//             } else {
//                 Toast.fire({ icon: "error", title: "Failed to get download link." });
//             }
//         } catch (error) {
//             console.error("Error generating assignment download URL:", error);
//             Toast.fire({
//                 icon: "error",
//                 title: "Failed to download assignment",
//                 text: error.response?.data?.message || error.message,
//             });
//         } finally {
//             setDownloadingAssignment(false);
//         }
//     };


//     // Fetch videos
//     useEffect(() => {
//         setAllVideoLoading(true);
//         if (courseId && userId && token) { // Ensure token is present before fetching videos
//             axios.get(`${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/course/${courseId}/${userId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             })
//                 .then(response => {
//                     setVideos(response.data.videos);
//                     if (response.data.videos && response.data.videos.length > 0) {
//                         handlePlayVideo(response.data.videos[0].title);
//                     }
//                     setAllVideoLoading(false);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching videos:", error);
//                     setAllVideoLoading(false);
//                     Toast.fire({
//                         icon: "error",
//                         title: "Failed to load course videos.",
//                         text: error.response?.data?.message || error.message,
//                     });
//                 });
//         } else if (!token) {
//             setAllVideoLoading(false);
//             // Error already logged by the useEffect at the top
//         }
//     }, [courseId, userId, token, API_BASE_URL, API_URL, SECURE_VIDEO_BASE_URL, Toast]); // Add Toast to dependencies

//     // Fetch images for videos
//     useEffect(() => {
//         const fetchImages = async () => {
//             const images = {};
//             // Using a simple image path for thumbnails, adjust if needed
//             await Promise.all(videos.map(async (video) => {
//                 const thumbnailUrlPart = video.thumbnailUrl.split('/').pop();
//                 try {
//                     const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(thumbnailUrlPart)}`;
//                     images[video.title] = imageUrl;
//                 } catch (error) {
//                     console.error("Error fetching image:", error);
//                     images[video.title] = "https://via.placeholder.com/100"; // Fallback image
//                 }
//             }));
//             setVideoImages(images);
//         };

//         if (videos.length > 0) fetchImages();
//     }, [videos, API_BASE_URL, API_URL, VIDEO_BASE_URL]);

//     const handlePlayVideo = async (filename) => {
//         setVideoLoading(true);
//         try {
//             // Note: videoUrl here is just for local state, actual player gets URL from S3 via backend
//             const videoUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(filename)}.mp4`;
//             setSelectedVideo(videoUrl);
//         } catch (error) {
//             console.error("Error fetching video:", error);
//         } finally {
//             setVideoLoading(false);
//         }
//     };
//     // Auto-play video when selectedVideo updates
//     useEffect(() => {
//         const videoElement = document.querySelector("video");
//         if (videoElement) {
//             videoElement.load();
//             videoElement.play().catch(error => console.error("Auto-play failed:", error));
//         }
//     }, [selectedVideo]);

//     const currentIndex = videos.findIndex(video =>
//         `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(video.title)}.mp4` === selectedVideo
//     );

//     const handlePrevious = () => {
//         if (currentIndex > 0) {
//             handlePlayVideo(videos[currentIndex - 1].title);
//         }
//     };

//     const handleNext = () => {
//         if (currentIndex < videos.length - 1) {
//             handlePlayVideo(videos[currentIndex + 1].title);
//         }
//     };

//     // Loading state
//     if (allvideoLoading) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen bg-[#f0f6f6]">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4ecdc4]"></div>
//                 <p className="mt-4 text-[#2c3e50] font-medium">Loading course videos...</p>
//             </div>
//         );
//     }

//     // No videos available UI
//     if (videos.length === 0) {
//         return (
//             <div className="min-h-screen bg-[#f0f6f6] text-[#2c3e50]">
//                 <div className="container mx-auto px-4 py-8">
//                     {/* Navigation */}
//                     <div className="mb-6">
//                         <Link to="#" className="inline-flex items-center text-[#4ecdc4] hover:text-[#45b7aa] transition-colors">
//                             <ChevronLeft className="mr-2" />
//                             Back to Dashboard
//                         </Link>
//                     </div>

//                     <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg p-8 text-center">
//                         <AlertCircle className="w-16 h-16 text-[#4ecdc4] mb-4" />
//                         <h2 className="text-2xl font-bold text-[#2c3e50] mb-3">No Videos Available</h2>
//                         <p className="text-[#7f8c8d] max-w-md">Videos for this course have not been uploaded yet. Please check back later or contact support for more information.</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // Main render with videos
//     return (
//         <div className="min-h-screen bg-[#f0f6f6] text-[#2c3e50]">
//             <div className="container mx-auto px-4 py-8">
//                 {/* Navigation */}
//                 <div className="mb-6">
//                     <Link to="#" className="inline-flex items-center text-[#4ecdc4] hover:text-[#45b7aa] transition-colors">
//                         <ChevronLeft className="mr-2" />
//                         Back to Dashboard
//                     </Link>
//                 </div>

//                 {/* Main Content */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Video Player Column */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Video Player */}
//                         <div className="relative overflow-hidden">
//                             {videoLoading ? (
//                                 <div className="flex flex-col items-center justify-center w-full aspect-video bg-[#e0f0f0] rounded-lg">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#4ecdc4]"></div>
//                                     <p className="mt-4 text-[#2c3e50] font-medium">Loading video...</p>
//                                 </div>
//                             ) : (
//                                 <MediaPlayer
//                                     className="w-full aspect-video"
//                                     title={videos[currentIndex]?.title || "Course Video"}
//                                     playsInline
//                                     onError={(e) => console.error("Video error:", e)}
//                                     poster={videos[currentIndex]?.thumbnail || ""}
//                                     src={selectedVideo || ""}
//                                 >
//                                     <MediaProvider />
//                                     <DefaultVideoLayout icons={defaultLayoutIcons} />
//                                 </MediaPlayer>
//                             )}
//                             <img
//                                 src="/logo.png"
//                                 className="absolute top-4 right-4 w-16 opacity-40"
//                                 alt="Watermark"
//                             />
//                         </div>

//                         {/* Navigation Buttons */}
//                         <div className="flex justify-between items-center">
//                             <button
//                                 onClick={handlePrevious}
//                                 disabled={currentIndex <= 0}
//                                 className="flex items-center px-4 py-2 
//                                     text-[#2c3e50] 
//                                     bg-[#4ecdc4]/10 
//                                     hover:bg-[#4ecdc4]/20 
//                                     rounded-lg 
//                                     transition-colors 
//                                     disabled:opacity-50 
//                                     disabled:cursor-not-allowed"
//                             >
//                                 <ChevronLeft className="mr-2" />
//                                 Previous
//                             </button>
//                             <button
//                                 onClick={handleNext}
//                                 disabled={currentIndex >= videos.length - 1}
//                                 className="flex items-center px-4 py-2 
//                                     text-[#2c3e50] 
//                                     bg-[#4ecdc4]/10 
//                                     hover:bg-[#4ecdc4]/20 
//                                     rounded-lg 
//                                     transition-colors 
//                                     disabled:opacity-50 
//                                     disabled:cursor-not-allowed"
//                             >
//                                 Next
//                                 <ChevronRight className="ml-2" />
//                             </button>
//                         </div>

//                         {/* Video Information */}
//                         {videos[currentIndex] && (
//                             <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#f0f6f6]">
//                                 <h2 className="text-2xl font-bold text-[#2c3e50] mb-3">{videos[currentIndex].title}</h2>
//                                 <p className="text-[#7f8c8d]">{videos[currentIndex].description}</p>
//                             </div>
//                         )}

//                         {videos[currentIndex]?.assignment && (
//                             <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#f0f6f6]">
//                                 <h3 className="text-xl font-bold text-[#2c3e50] mb-3 flex items-center">
//                                     <BookOpen className="mr-2 text-[#4ecdc4]" /> Assignment: {videos[currentIndex].assignment.title}
//                                 </h3>
//                                 <p className="text-[#7f8c8d] mb-4">
//                                     {videos[currentIndex].assignment.description || "No description provided."}
//                                 </p>
                                
//                                 <div className="flex flex-wrap gap-4 items-center">
//                                     {/* Download Assignment Button (now uses onClick to fetch presigned URL) */}
//                                     <button
//                                         onClick={() => handleDownloadAssignment(videos[currentIndex].assignment.assignmentUrl)}
//                                         disabled={downloadingAssignment}
//                                         className="inline-flex items-center px-5 py-2.5 bg-[#4ecdc4] text-white rounded-lg shadow-md hover:bg-[#3bb3aa] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         {downloadingAssignment ? (
//                                             <>
//                                                 <Loader2 size={20} className="mr-2 animate-spin" /> Preparing Download...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <DownloadCloud size={20} className="mr-2" /> Download Assignment
//                                             </>
//                                         )}
//                                     </button>

//                                     {/* Submission Status + Submit Button */}
//                                     {videos[currentIndex]?.assignment?.submissionStatus ? (
//                                         videos[currentIndex].assignment.submissionStatus.submitted ? (
//                                             <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
//                                                 <span className="inline-flex items-center text-green-700 font-semibold">
//                                                     ✅ Submitted
//                                                 </span>
//                                                 {videos[currentIndex].assignment.submissionStatus.submissionDetails && (
//                                                     <span className="text-sm text-gray-600">
//                                                         Submitted on{" "}
//                                                         {new Date(
//                                                             videos[currentIndex].assignment.submissionStatus.submissionDetails.submittedAt
//                                                         ).toLocaleDateString()}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         ) : (
//                                             <button
//                                                 onClick={() => setShowSubmissionModal(true)}
//                                                 className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
//                                             >
//                                                 <UploadCloud size={20} className="mr-2" /> Submit Assignment
//                                             </button>
//                                         )
//                                     ) : (
//                                         <button
//                                             onClick={() => setShowSubmissionModal(true)}
//                                             className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
//                                         >
//                                             <UploadCloud size={20} className="mr-2" /> Submit My Assignment
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                     </div>

//                     {/* Course Content Sidebar */}
//                     <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#f0f6f6] h-fit">
//                         <h3 className="text-xl font-semibold text-[#2c3e50] mb-6 border-b pb-3">Course Content</h3>
//                         <div className="space-y-4">
//                             {videos.map((item, index) => (
//                                 <div
//                                     key={index}
//                                     onClick={() => handlePlayVideo(item.title)}
//                                     className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 
//                                         ${currentIndex === index
//                                             ? "bg-[#4ecdc4]/10 ring-2 ring-[#4ecdc4]"
//                                             : "hover:bg-[#f0f6f6]"
//                                         }`}
//                                 >
//                                     <img
//                                         src={videoImages[item.title] || "https://via.placeholder.com/100"}
//                                         alt={`Thumbnail of ${item.title}`}
//                                         className="w-20 h-20 object-cover rounded-lg mr-4 shadow-md"
//                                     />
//                                     <div className="flex-grow">
//                                         <h4 className="font-medium text-[#2c3e50]">{item.title}</h4>
//                                         <div className="flex items-center text-[#7f8c8d] text-sm mt-1">
//                                             <PlayCircle className="w-4 h-4 mr-2 text-[#4ecdc4]" />
//                                             Video Lesson
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}




//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {showSubmissionModal && videos[currentIndex]?.assignment && (
//                 <div className="fixed z-[600] inset-0 bg-black/60 flex justify-center items-center p-4">
//                     <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
//                         <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-3 border-slate-200">
//                             Submit Assignment: <span className="text-indigo-600">{videos[currentIndex].assignment.title}</span>
//                         </h2>
//                         <button
//                             className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition"
//                             onClick={() => setShowSubmissionModal(false)}
//                             disabled={submissionLoading}
//                         >
//                             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>

//                         <form onSubmit={handleSubmitAssignment} className="space-y-4">
//                             <div>
//                                 <label htmlFor="submissionFile" className="block text-sm font-medium text-slate-700 mb-1">Upload Your Completed PDF</label>
//                                 <input
//                                     id="submissionFile"
//                                     type="file"
//                                     accept="application/pdf,application/zip" // --- MODIFIED ACCEPT ATTRIBUTE ---
//                                     onChange={handleSubmissionFileChange}
//                                     className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                                     required
//                                 />
//                                 {submissionFile ? (
//                                     <p className="text-emerald-600 mt-2 flex items-center gap-1"><Check size={16} /> Selected: {submissionFile.name}</p>
//                                 ) : (
//                                     <p className="text-slate-500 mt-2 flex items-center gap-1"><X size={16} /> No file selected</p>
//                                 )}
//                             </div>
//                             <div>
//                                 <label htmlFor="submissionComments" className="block text-sm font-medium text-slate-700 mb-1">Comments (Optional)</label>
//                                 <textarea
//                                     id="submissionComments"
//                                     value={submissionComments}
//                                     onChange={(e) => setSubmissionComments(e.target.value)}
//                                     rows="3"
//                                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                                     placeholder="Add any comments or notes for your instructor..."
//                                 />
//                             </div>
//                             <div className="flex justify-end">
//                                 <button
//                                     type="submit"
//                                     disabled={submissionLoading}
//                                     className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                                 >
//                                     {submissionLoading ? (
//                                         <>
//                                             <Loader2 size={18} className="animate-spin" /> Submitting...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <UploadCloud size={18} /> Submit
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default LearningVideo;




import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { ChevronLeft, ChevronRight, PlayCircle, AlertCircle, CloudSnow, DownloadCloud, UploadCloud, BookOpen, Check, X, Loader2 } from 'lucide-react';
import ProjectContext from '../../Context/ProjectContext';
import { AlertContext } from '../../Context/AlertContext';

function LearningVideo() {
    const { courseId } = useParams();
    const [videos, setVideos] = useState([]);
    const [videoImages, setVideoImages] = useState({});
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoLoading, setVideoLoading] = useState(false);
    const [allvideoLoading, setAllVideoLoading] = useState(true);
    const userId = localStorage.getItem("userId");
    const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL } = useContext(ProjectContext);

    const { Toast } = useContext(AlertContext);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submissionComments, setSubmissionComments] = useState("");
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [downloadingAssignment, setDownloadingAssignment] = useState(false); // NEW State

    const token = localStorage.getItem("token");

    // --- IMPORTANT: Log token to debug "No token, authorization denied" ---
    useEffect(() => {
        console.log("LearningVideo.jsx: Token from localStorage:", token);
        if (!token) {
            Toast.fire({
                icon: "warning",
                title: "You are not logged in or your session expired. Please log in again.",
            });
            // Optionally, redirect to login page here:
            // navigate('/login'); // Assuming you have `useNavigate` from react-router-dom
        }
    }, [token, Toast]);
    // --- END IMPORTANT ---


    const handleSubmissionFileChange = (e) => {
        setSubmissionFile(e.target.files[0]);
    };

    // Handle assignment submission (unchanged logic)
    const handleSubmitAssignment = async (e) => {
        e.preventDefault();

        if (!submissionFile) {
            Toast.fire({ icon: "error", title: "Please select an assignment file to submit." });
            return;
        }

        const allowedTypes = ["application/pdf", "application/zip"];
        if (!allowedTypes.includes(submissionFile.type)) {
            Toast.fire({ icon: "error", title: "Invalid file type. Please upload a PDF or ZIP file." });
            return;
        }

        if (!videos[currentIndex]?.assignment?._id) {
            Toast.fire({ icon: "error", title: "No assignment found for this video to submit against." });
            return;
        }

        setSubmissionLoading(true);
        try {
            // Step 1: Generate presigned URL & final URL from backend
            const { data: { uploadUrl, finalUrl } } = await axios.post(
                `${API_BASE_URL}${API_URL}/assignments/submit/generate-url`,
                {
                    assignmentId: videos[currentIndex].assignment._id,
                    submissionFileType: submissionFile.type,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Step 2: Upload file to S3
            await axios.put(uploadUrl, submissionFile, {
                headers: { "Content-Type": submissionFile.type },
            });

            // Step 3: Save submission in DB
            await axios.post(
                `${API_BASE_URL}${API_URL}/assignments/submit/save`,
                {
                    assignmentId: videos[currentIndex].assignment._id,
                    submissionUrl: finalUrl, // ✅ Directly use backend-provided URL
                    submissionText: submissionComments,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Toast.fire({ icon: "success", title: "Assignment submitted successfully!" });
            setSubmissionFile(null);
            setSubmissionComments("");
            setShowSubmissionModal(false);
        } catch (error) {
            console.error("Error submitting assignment:", error);
            Toast.fire({
                icon: "error",
                title: "Failed to submit assignment",
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setSubmissionLoading(false);
        }
    };


    // NEW: Handle downloading the assignment (using presigned URL)
    const handleDownloadAssignment = async (assignmentUrl) => {
        if (!token) {
            Toast.fire({ icon: "error", title: "You must be logged in to download assignments." });
            return;
        }
        if (downloadingAssignment) return; // Prevent multiple clicks

        setDownloadingAssignment(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_URL}/assignments/generate-assignment-download-url`,
                {
                    params: { assignmentUrl: assignmentUrl },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success && response.data.downloadUrl) {
                // Open the presigned URL in a new tab/window, which will trigger download
                window.open(response.data.downloadUrl, '_blank');
            } else {
                Toast.fire({ icon: "error", title: "Failed to get download link." });
            }
        } catch (error) {
            console.error("Error generating assignment download URL:", error);
            Toast.fire({
                icon: "error",
                title: "Failed to download assignment",
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setDownloadingAssignment(false);
        }
    };


    // Fetch videos
    useEffect(() => {
        setAllVideoLoading(true);
        if (courseId && userId && token) { // Ensure token is present before fetching videos
            axios.get(`${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/course/${courseId}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    setVideos(response.data.videos);
                    if (response.data.videos && response.data.videos.length > 0) {
                        handlePlayVideo(response.data.videos[0].title);
                    }
                    setAllVideoLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching videos:", error);
                    setAllVideoLoading(false);
                    Toast.fire({
                        icon: "error",
                        title: "Failed to load course videos.",
                        text: error.response?.data?.message || error.message,
                    });
                });
        } else if (!token) {
            setAllVideoLoading(false);
            // Error already logged by the useEffect at the top
        }
    }, [courseId, userId, token, API_BASE_URL, API_URL, SECURE_VIDEO_BASE_URL, Toast]); // Add Toast to dependencies

    // Fetch images for videos
    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            // Using a simple image path for thumbnails, adjust if needed
            await Promise.all(videos.map(async (video) => {
                const thumbnailUrlPart = video.thumbnailUrl.split('/').pop();
                try {
                    const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(thumbnailUrlPart)}`;
                    images[video.title] = imageUrl;
                } catch (error) {
                    console.error("Error fetching image:", error);
                    images[video.title] = "https://via.placeholder.com/100"; // Fallback image
                }
            }));
            setVideoImages(images);
        };

        if (videos.length > 0) fetchImages();
    }, [videos, API_BASE_URL, API_URL, VIDEO_BASE_URL]);

    const handlePlayVideo = async (filename) => {
        setVideoLoading(true);
        try {
            // Note: videoUrl here is just for local state, actual player gets URL from S3 via backend
            const videoUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(filename)}.mp4`;
            setSelectedVideo(videoUrl);
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            setVideoLoading(false);
        }
    };
    // Auto-play video when selectedVideo updates
    useEffect(() => {
        const videoElement = document.querySelector("video");
        if (videoElement) {
            videoElement.load();
            videoElement.play().catch(error => console.error("Auto-play failed:", error));
        }
    }, [selectedVideo]);

    const currentIndex = videos.findIndex(video =>
        `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(video.title)}.mp4` === selectedVideo
    );

    const handlePrevious = () => {
        if (currentIndex > 0) {
            handlePlayVideo(videos[currentIndex - 1].title);
        }
    };

    const handleNext = () => {
        if (currentIndex < videos.length - 1) {
            handlePlayVideo(videos[currentIndex + 1].title);
        }
    };

    // Loading state
    if (allvideoLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="mt-4 text-slate-700 font-medium">Loading course videos...</p>
            </div>
        );
    }

    // No videos available UI
    if (videos.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <div className="container mx-auto px-4 py-8">
                    {/* Navigation */}
                    <div className="mb-6">
                        <Link to="/client/course" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors">
                            <ChevronLeft className="mr-2" />
                            Back to My Courses
                        </Link>
                    </div>

                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-indigo-600 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">No Videos Available</h2>
                        <p className="text-slate-600 max-w-md">Videos for this course have not been uploaded yet. Please check back later or contact support for more information.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Main render with videos
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <div className="container mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="mb-6">
                    <Link to="/client/course" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors">
                        <ChevronLeft className="mr-2" />
                        Back to My Courses
                    </Link>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Player Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div className="relative overflow-hidden rounded-xl shadow-md border border-slate-200">
                            {videoLoading ? (
                                <div className="flex flex-col items-center justify-center w-full aspect-video bg-slate-100 rounded-lg">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                                    <p className="mt-4 text-slate-700 font-medium">Loading video...</p>
                                </div>
                            ) : (
                                <MediaPlayer
                                    className="w-full aspect-video"
                                    title={videos[currentIndex]?.title || "Course Video"}
                                    playsInline
                                    onError={(e) => console.error("Video error:", e)}
                                    poster={videos[currentIndex]?.thumbnail || ""}
                                    src={selectedVideo || ""}
                                >
                                    <MediaProvider />
                                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                                </MediaPlayer>
                            )}
                            <img
                                src="/logo.png"
                                className="absolute top-4 right-4 w-16 opacity-40"
                                alt="Watermark"
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex <= 0}
                                className="flex items-center px-4 py-2 
                                    text-slate-700 
                                    bg-slate-100 
                                    hover:bg-slate-200 
                                    rounded-lg 
                                    transition-colors 
                                    disabled:opacity-50 
                                    disabled:cursor-not-allowed font-medium"
                            >
                                <ChevronLeft className="mr-2" />
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex >= videos.length - 1}
                                className="flex items-center px-4 py-2 
                                    text-slate-700 
                                    bg-slate-100 
                                    hover:bg-slate-200 
                                    rounded-lg 
                                    transition-colors 
                                    disabled:opacity-50 
                                    disabled:cursor-not-allowed font-medium"
                            >
                                Next
                                <ChevronRight className="ml-2" />
                            </button>
                        </div>

                        {/* Video Information */}
                        {videos[currentIndex] && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                                <h2 className="text-2xl font-bold text-slate-800 mb-3">{videos[currentIndex].title}</h2>
                                <p className="text-slate-600">{videos[currentIndex].description}</p>
                            </div>
                        )}

                        {videos[currentIndex]?.assignment && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                                    <BookOpen className="mr-2 text-indigo-600" /> Assignment: {videos[currentIndex].assignment.title}
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    {videos[currentIndex].assignment.description || "No description provided."}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 items-center">
                                    {/* Download Assignment Button (now uses onClick to fetch presigned URL) */}
                                    <button
                                        onClick={() => handleDownloadAssignment(videos[currentIndex].assignment.assignmentUrl)}
                                        disabled={downloadingAssignment}
                                        className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloadingAssignment ? (
                                            <>
                                                <Loader2 size={20} className="mr-2 animate-spin" /> Preparing Download...
                                            </>
                                        ) : (
                                            <>
                                                <DownloadCloud size={20} className="mr-2" /> Download Assignment
                                            </>
                                        )}
                                    </button>

                                    {/* Submission Status + Submit Button */}
                                    {videos[currentIndex]?.assignment?.submissionStatus ? (
                                        videos[currentIndex].assignment.submissionStatus.submitted ? (
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                                                <span className="inline-flex items-center text-emerald-700 font-semibold">
                                                    ✅ Submitted
                                                </span>
                                                {videos[currentIndex].assignment.submissionStatus.submissionDetails && (
                                                    <span className="text-sm text-slate-600">
                                                        Submitted on{" "}
                                                        {new Date(
                                                            videos[currentIndex].assignment.submissionStatus.submissionDetails.submittedAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowSubmissionModal(true)}
                                                className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
                                            >
                                                <UploadCloud size={20} className="mr-2" /> Submit Assignment
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={() => setShowSubmissionModal(true)}
                                            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200"
                                        >
                                            <UploadCloud size={20} className="mr-2" /> Submit My Assignment
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Course Content Sidebar */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 h-fit">
                        <h3 className="text-xl font-semibold text-slate-800 mb-6 border-b pb-3 border-slate-200">Course Content</h3>
                        <div className="space-y-4">
                            {videos.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePlayVideo(item.title)}
                                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 
                                        ${currentIndex === index
                                            ? "bg-indigo-500/10 ring-2 ring-indigo-500"
                                            : "hover:bg-slate-50"
                                        }`}
                                >
                                    <img
                                        src={videoImages[item.title] || "https://via.placeholder.com/100"}
                                        alt={`Thumbnail of ${item.title}`}
                                        className="w-20 h-20 object-cover rounded-lg mr-4 shadow-md"
                                    />
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-slate-800">{item.title}</h4>
                                        <div className="flex items-center text-slate-600 text-sm mt-1">
                                            <PlayCircle className="w-4 h-4 mr-2 text-indigo-600" />
                                            Video Lesson
                                        </div>
                                    </div>
                                </div>
                            ))}




                        </div>
                    </div>
                </div>
            </div>

            {showSubmissionModal && videos[currentIndex]?.assignment && (
                <div className="fixed z-[600] inset-0 bg-black/60 flex justify-center items-center p-4">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-3 border-slate-200">
                            Submit Assignment: <span className="text-indigo-600">{videos[currentIndex].assignment.title}</span>
                        </h2>
                        <button
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition"
                            onClick={() => setShowSubmissionModal(false)}
                            disabled={submissionLoading}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <form onSubmit={handleSubmitAssignment} className="space-y-4">
                            <div>
                                <label htmlFor="submissionFile" className="block text-sm font-medium text-slate-700 mb-1">Upload Your Completed PDF</label>
                                <input
                                    id="submissionFile"
                                    type="file"
                                    accept="application/pdf,application/zip" // --- MODIFIED ACCEPT ATTRIBUTE ---
                                    onChange={handleSubmissionFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    required
                                />
                                {submissionFile ? (
                                    <p className="text-emerald-600 mt-2 flex items-center gap-1"><Check size={16} /> Selected: {submissionFile.name}</p>
                                ) : (
                                    <p className="text-slate-500 mt-2 flex items-center gap-1"><X size={16} /> No file selected</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="submissionComments" className="block text-sm font-medium text-slate-700 mb-1">Comments (Optional)</label>
                                <textarea
                                    id="submissionComments"
                                    value={submissionComments}
                                    onChange={(e) => setSubmissionComments(e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                                    placeholder="Add any comments or notes for your instructor..."
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submissionLoading}
                                    className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {submissionLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={18} /> Submit
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LearningVideo;