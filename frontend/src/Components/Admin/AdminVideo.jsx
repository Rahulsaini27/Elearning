// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { AlertContext } from "../../Context/AlertContext";
// import Swal from "sweetalert2";
// import ProjectContext from "../../Context/ProjectContext";

// import { format } from "date-fns";
// import { Play, Trash2, ChevronDown, ChevronUp, Eye, PlayCircle, BookOpen, Upload, FileX, Calendar, FileText, VideoIcon, Check, Loader2 } from 'lucide-react';

// import '@vidstack/react/player/styles/default/theme.css';
// import '@vidstack/react/player/styles/default/layouts/video.css';
// import { MediaPlayer, MediaProvider } from '@vidstack/react';
// import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';


// export default function AdminVideo() {
//   const { Toast } = useContext(AlertContext);
//   const [videoLoading, setVideoLoading] = useState(false);
//   const [videoImages, setVideoImages] = useState({}); // Stores images per video
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL, course, videos, fetchVideos } = useContext(ProjectContext)



//   const admintoken = localStorage.getItem("admintoken");


//   // Fetch images for videos
//   useEffect(() => {
//     const fetchImages = async () => {
//       const images = {};
//       for (const video of videos) {
//         try {
//           const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(video.title)}.png`;
//           images[video.title] = imageUrl;
//         } catch (error) {
//           console.error("Error fetching image:", error);
//         }
//       }
//       setVideoImages(images);
//     };
//     if (videos.length > 0) fetchImages();
//   }, [videos]);



//   const handlePlayVideo = async (filename) => {
//     setVideoLoading(true);
//     try {
//       const videoUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(filename)}.mp4`;
//       setSelectedVideo(videoUrl);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching video:", error);
//       Toast.fire({ icon: "error", title: "Error loading video" });
//     } finally {
//       setVideoLoading(false);
//     }

//   };

//   const handleVideoDelete = async (_id, title, courseId) => {
//     try {
//       // 🔹 Show confirmation alert before deleting
//       Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!"
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           try {
//             // 🔹 Perform the delete request
//             const response = await axios.delete(`${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/delete-video/${_id}`, {
//               params: { title, courseId },

//               headers: {
//                 "Authorization": `Bearer ${admintoken}`,
//                 "Content-Type": "application/json"
//               }
//             });

//             console.log(response.data.message);
//             fetchVideos(); // ✅ Refresh video list after deletion

//             // 🔹 Show success message after deletion
//             Swal.fire({
//               title: "Deleted!",
//               text: "Your file has been deleted.",
//               icon: "success"
//             });

//           } catch (error) {
//             console.error("Error deleting video:", error.response?.data?.message || error.message);
//             Swal.fire({
//               title: "Error",
//               text: "Something went wrong!",
//               icon: "error"
//             });
//           }
//         }
//       });

//     } catch (error) {
//       console.error("Error initializing delete process:", error.message);
//     }
//   };



//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [uploadModalOpen, setUploadModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [assignmentFile, setAssignmentFile] = useState(null);
//   const [assignmentDescription, setAssignmentDescription] = useState("");
//   const [assignmentDueDate, setAssignmentDueDate] = useState("");

//   const handleAssignmentChange = (e) => {
//     setAssignmentFile(e.target.files[0]);
//   };

//   const handleVideoChange = (e) => {
//     setVideoFile(e.target.files[0]);
//   };

//   const handleThumbnailChange = (e) => {
//     setThumbnailFile(e.target.files[0]);
//   };

//   const closeUploadModal = () => {
//     if (!loading) {
//       setUploadModalOpen(false);
//     }
//   };

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setVideoFile(null);
//     setThumbnailFile(null);
//     setSelectedCourse("");
//   };
//   const handleUpload = async (e) => {
//     e.preventDefault();

//     // ✅ Validate video format
//     if (videoFile && videoFile.type !== "video/mp4") {
//       Toast.fire({ icon: "error", title: "Invalid video type. Only MP4 is allowed." });
//       return;
//     }

//     // ✅ Validate thumbnail format
//     if (thumbnailFile && thumbnailFile.type !== "image/png") {
//       Toast.fire({ icon: "error", title: "Invalid thumbnail type. Only PNG is allowed." });
//       return;
//     }

//     // ✅ Validate assignment format if provided
//     if (assignmentFile && assignmentFile.type !== "application/pdf") {
//       Toast.fire({ icon: "error", title: "Invalid assignment type. Only PDF is allowed." });
//       return;
//     }

//     // ✅ Check required fields
//     if (!title || !description || !videoFile || !thumbnailFile || !selectedCourse) {
//       Toast.fire({ icon: "error", title: "All required fields must be filled!" });
//       return;
//     }

//     setLoading(true);

//     try {
//       // 🔹 Step 1: Request signed URLs from backend
//       const { data } = await axios.post(
//         `${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/generate-upload-urls`,
//         {
//           title,
//           videoType: videoFile.type,
//           thumbnailType: thumbnailFile.type,
//           assignmentType: assignmentFile ? assignmentFile.type : null, // Optional
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${admintoken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // 🔹 Step 2: Upload files to S3
//       const uploadPromises = [
//         axios.put(data.video.url, videoFile, { headers: { "Content-Type": videoFile.type } }),
//         axios.put(data.thumbnail.url, thumbnailFile, { headers: { "Content-Type": thumbnailFile.type } }),
//       ];
//       if (assignmentFile && data.assignment) {
//         uploadPromises.push(
//           axios.put(data.assignment.url, assignmentFile, { headers: { "Content-Type": assignmentFile.type } })
//         );
//       }
//       console.log(uploadPromises);
//       await Promise.all(uploadPromises);

//       // 🔹 Step 3: Save video & assignment details in DB
//       await axios.post(
//         `${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/save`,
//         {
//           title,
//           description,
//           courseId: selectedCourse,
//           videoUrl: `https://your-bucket-name.s3.amazonaws.com/webdev/${data.video.filename}`,
//           thumbnailUrl: `https://your-bucket-name.s3.amazonaws.com/webdev/${data.thumbnail.filename}`,
//           assignmentUrl:
//             assignmentFile && data.assignment
//               ? `https://your-bucket-name.s3.amazonaws.com/webdev/${data.assignment.filename}`
//               : null,
//           assignmentDescription: assignmentDescription || "",
//           assignmentDueDate: assignmentDueDate || null,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${admintoken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       Toast.fire({ icon: "success", title: "Video & Assignment uploaded successfully!" });
//       resetForm();
//       fetchVideos();
//       setUploadModalOpen(false);
//     } catch (error) {
//       console.error("Error uploading:", error);
//       Toast.fire({ icon: "error", title: "Upload failed!" });
//     } finally {
//       setLoading(false);
//     }
//   };




//   useEffect(() => {
//     if (uploadModalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       document.body.style.overflow = "auto"; // Cleanup when component unmounts
//     };
//   }, [uploadModalOpen]);








//   const [expandedRows, setExpandedRows] = useState({});

//   // Toggle expanded state for a video
//   const toggleRowExpand = (videoId) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [videoId]: !prev[videoId]
//     }));
//   };

//   // Function to truncate description text
//   const truncateText = (text, maxLength = 150) => {
//     if (!text) return "N/A";
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + "...";
//   };
//   return (
//     <>
//       <div className="min-h-screen bg-[#F0F6F6]">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-black relative">
//             All Videos ({videos.length})
//           </h2>

//           {/* Upload Video Button */}
//           <div
//             onClick={() => setUploadModalOpen(true)}
//             className="px-4 cursor-pointer py-2 text-white bg-[#4ecdc4] hover:bg-[#45b7aa] transition duration-300 rounded-3xl flex items-center gap-2 transform hover:scale-105"
//           >
//             <Upload size={18} />
//             Upload Video
//           </div>
//         </div>

//         {/* Video Cards Grid */}
//         <div className="w-full bg-[#F0F6F6] rounded-lg shadow-md">
//           {/* Mobile View (< 768px) - Card-based layout */}
//           <div className="md:hidden">
//             {videos.length > 0 ? (
//               videos.map((video, index) => (
//                 <div key={video._id} className="border-b border-gray-200 p-4 hover:bg-[#e0f4f4] transition-all duration-300">
//                   <div className="flex items-start gap-3">
//                     <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md group">
//                       <img
//                         src={videoImages[video.title]}
//                         alt={video.title}
//                         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                       />
//                       <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                         <PlayCircle size={24} className="text-white" />
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-start">
//                         <h3 className="font-medium text-gray-900 break-words pr-2">{video.title}</h3>
//                         <button
//                           onClick={() => toggleRowExpand(video._id)}
//                           className="p-1 rounded-full hover:bg-[#e0f4f4] flex-shrink-0 mt-1"
//                         >
//                           {expandedRows[video._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                         </button>
//                       </div>
//                       <p className="text-sm text-gray-500 flex items-center gap-1">
//                         <BookOpen size={14} />
//                         {video?.course?.title || "No course"}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
//                         <Calendar size={12} />
//                         {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "N/A"}
//                       </p>
//                     </div>
//                   </div>

//                   {expandedRows[video._id] && (
//                     <div className="mt-3 pl-2 animate-fadeIn overflow-hidden">
//                       <div className="bg-white bg-opacity-50 p-3 rounded-lg border-l-4 border-[#4ecdc4] shadow-sm">
//                         <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
//                           <FileText size={14} />
//                           Description:
//                         </h4>
//                         <p className="text-sm text-gray-600 break-words whitespace-pre-line mb-4">
//                           {video.description || "No description available."}
//                         </p>
//                       </div>

//                       <div className="flex gap-3 pt-2 mt-3">
//                         <button
//                           onClick={() => handlePlayVideo(video.title)}
//                           className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md text-sm hover:bg-purple-200 transition-all hover:shadow-md"
//                         >
//                           <Play size={16} />
//                           Watch
//                         </button>

//                         <button
//                           onClick={() => handleVideoDelete(video._id, video.title, video.course)}
//                           className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 transition-all hover:shadow-md"
//                         >
//                           <Trash2 size={16} />
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-12">
//                 <FileX size={48} className="mx-auto mb-4 text-gray-300" />
//                 <p className="text-gray-500">No videos uploaded yet.</p>
//               </div>
//             )}
//           </div>

//           {/* Tablet and Desktop View (≥ 768px) - Table layout */}
//           <div className="hidden md:block overflow-hidden rounded-xl">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-[#e0f4f4]">
//                   <tr>
//                     <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-12 border-b-2 border-[#4ecdc4]">#</th>
//                     <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20 border-b-2 border-[#4ecdc4]">Media</th>
//                     <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b-2 border-[#4ecdc4]">Video Details</th>
//                     <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-[#4ecdc4]">Description</th>
//                     <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-32 border-b-2 border-[#4ecdc4]">Date</th>
//                     <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider w-24 border-b-2 border-[#4ecdc4]">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-[#F0F6F6] divide-y divide-gray-200">
//                   {videos?.length > 0 ? (
//                     videos?.map((video, index) => (
//                       <tr key={video._id} className="hover:bg-[#e0f4f4] transition-colors duration-300">
//                         {/* Number */}
//                         <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                           {index + 1}
//                         </td>

//                         {/* Thumbnail */}
//                         <td className="px-3 py-4 whitespace-nowrap">
//                           <div className="relative w-16 h-16 overflow-hidden rounded-md group">
//                             <img
//                               src={videoImages[video.title]}
//                               alt={video.title}
//                               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                             />
//                             <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                               <PlayCircle size={24} className="text-white" />
//                             </div>
//                           </div>
//                         </td>

//                         {/* Title and Course */}
//                         <td className="px-3 py-4">
//                           <div className="flex flex-col">
//                             <h3 className="text-sm font-medium text-gray-900 break-words">
//                               {video.title}
//                             </h3>
//                             <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
//                               <BookOpen size={14} />
//                               {video?.course?.title || "N/A"}
//                             </p>
//                             <p className="text-sm text-gray-500 mt-1 lg:hidden">
//                               {truncateText(video.description, 100)}
//                             </p>
//                           </div>
//                         </td>

//                         {/* Description (hidden on medium screens) */}
//                         <td className="px-3 py-4 whitespace-normal hidden lg:table-cell">
//                           <div className="max-w-md relative">
//                             <div className={`transition-all duration-500 ${expandedRows[video._id] ? 'opacity-0 h-0' : 'opacity-100'}`}>
//                               <p className="text-sm text-gray-600 break-words line-clamp-3  bg-opacity-50 p-2 rounded-lg">
//                                 {truncateText(video.description, 200)}
//                               </p>
//                               {video.description && video.description.length > 200 && (
//                                 <button
//                                   onClick={() => toggleRowExpand(video._id)}
//                                   className="text-xs text-[#4ecdc4] hover:text-[#45b7aa] mt-1 flex items-center transition-all hover:pl-1"
//                                 >
//                                   <ChevronDown size={16} className="mr-1 transition-transform duration-300 transform hover:translate-y-1" />
//                                   Show more
//                                 </button>
//                               )}
//                             </div>

//                             {expandedRows[video._id] && (
//                               <div className="animate-slideDown  bg-opacity-50 p-3 rounded-lg border-l-4 border-[#4ecdc4] shadow-sm">
//                                 <p className="text-sm text-gray-600 break-words">
//                                   {video.description}
//                                 </p>
//                                 <button
//                                   onClick={() => toggleRowExpand(video._id)}
//                                   className="text-xs text-[#4ecdc4] hover:text-[#45b7aa] mt-2 flex items-center transition-all hover:pl-1"
//                                 >
//                                   <ChevronUp size={16} className="mr-1 transition-transform duration-300 transform hover:-translate-y-1" />
//                                   Show less
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </td>

//                         {/* Date */}
//                         <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
//                           <div className="flex items-center gap-1">
//                             <Calendar size={14} />
//                             {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "N/A"}
//                           </div>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-3 py-4 whitespace-nowrap">
//                           <div className="flex items-center justify-center space-x-3">
//                             <button
//                               onClick={() => handlePlayVideo(video.title)}
//                               className="text-[#4ecdc4] hover:text-[#45b7aa] transition-all duration-300 transform hover:scale-110 hover:rotate-12"
//                               title="Play video"
//                             >
//                               <Play size={22} />
//                             </button>
//                             <button
//                               onClick={() => handleVideoDelete(video._id, video.title, video.course)}
//                               className="text-red-600 hover:text-red-800 transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
//                               title="Delete video"
//                             >
//                               <Trash2 size={22} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="px-3 py-12 text-center text-gray-500">
//                         <FileX size={48} className="mx-auto mb-4 text-gray-300" />
//                         <p>No videos uploaded yet.</p>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* upload model  */}
//       {/* {uploadModalOpen && (
//         <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
//           <div className="w-full max-w-xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
//             <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
//               <h2 className="text-2xl font-bold text-[#2c3e50]">Upload Video</h2>
//               <button
//                 className="text-[#4ecdc4] cursor-pointer hover:text-[#45b7aa] transition"
//                 onClick={closeUploadModal}
//                 disabled={loading}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <form className="space-y-4" onSubmit={handleUpload}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="video" className="block text-sm font-medium text-[#2c3e50]">Video File</label>
//                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-[#4ecdc4]/30 rounded-md shadow-sm">
//                     <div className="space-y-1 text-center">
//                       <svg
//                         className="mx-auto h-12 w-12 text-[#2c3e50]/50"
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                         aria-hidden="true"
//                       >
//                         <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
//                       </svg>
//                       <div className="flex text-sm text-[#2c3e50]">
//                         <label
//                           htmlFor="video"
//                           className="relative cursor-pointer rounded-md font-medium text-[#4ecdc4] hover:text-[#45b7aa] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#4ecdc4]"
//                         >
//                           <span>Upload a file</span>
//                           <input
//                             id="video"
//                             name="video"
//                             type="file"
//                             className="sr-only"
//                             accept="video/*"
//                             onChange={handleVideoChange}
//                           />
//                         </label>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-[#2c3e50]/70">MP4 files only</p>
//                     </div>
//                   </div>
//                   {videoFile ? (
//                     <p className="text-[#4ecdc4] mt-2">Selected</p>
//                   ) : (
//                     <p className="text-[#2c3e50]/70 mt-2">Not Selected</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="thumbnail" className="block text-sm font-medium text-[#2c3e50]">Thumbnail Photo</label>
//                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-[#4ecdc4]/30 rounded-md shadow-sm">
//                     <div className="space-y-1 text-center">
//                       <svg
//                         className="mx-auto h-12 w-12 text-[#2c3e50]/50"
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                         aria-hidden="true"
//                       >
//                         <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
//                       </svg>
//                       <div className="flex text-sm text-[#2c3e50]">
//                         <label
//                           htmlFor="thumbnail"
//                           className="relative cursor-pointer rounded-md font-medium text-[#4ecdc4] hover:text-[#45b7aa] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#4ecdc4]"
//                         >
//                           <span>Upload a file</span>
//                           <input
//                             id="thumbnail"
//                             name="thumbnail"
//                             type="file"
//                             className="sr-only"
//                             accept="image/*"
//                             onChange={handleThumbnailChange}
//                           />
//                         </label>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-[#2c3e50]/70">PNG files only</p>
//                     </div>
//                   </div>
//                   {thumbnailFile ? (
//                     <p className="text-[#4ecdc4] mt-2">Selected</p>
//                   ) : (
//                     <p className="text-[#2c3e50]/70 mt-2">Not Selected</p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-[#2c3e50]">Title</label>
//                   <input
//                     id="title"
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="course" className="block text-sm font-medium text-[#2c3e50]">Select Course</label>
//                   <select
//                     id="course"
//                     value={selectedCourse}
//                     onChange={(e) => setSelectedCourse(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
//                   >
//                     <option value="">Select Course</option>
//                     {course.map(course => (
//                       <option key={course._id} value={course._id}>{course.title}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-[#2c3e50]">Description</label>
//                 <textarea
//                   id="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`mt-4 bg-[#4ecdc4] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   {loading ? "Uploading..." : "Upload Video"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )} */}

//       {uploadModalOpen && (
//         <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
//           <div className="w-full max-w-[52rem] bg-white rounded-lg shadow-lg p-6 relative"> {/* Increased max-w for 3 columns */}
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200">
//               <h2 className="text-2xl font-bold text-slate-800">Upload Video & Assignment</h2>
//               <button
//                 className="text-slate-500 cursor-pointer hover:text-slate-700 transition"
//                 onClick={closeUploadModal}
//                 disabled={loading}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <form className="space-y-4" onSubmit={handleUpload}>

//               {/* File Input Group: Video, Thumbnail, Assignment (3 in a row on md) */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Changed to md:grid-cols-3 */}
//                 {/* Video File Input */}
//                 <div>
//                   <label htmlFor="video" className="block text-sm font-medium text-slate-700">Video File (MP4)</label>
//                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-slate-300 rounded-md shadow-sm">
//                     <div className="space-y-1 text-center">
//                       <VideoIcon className="mx-auto h-12 w-12 text-slate-400" />
//                       <div className="flex text-sm text-slate-700">
//                         <label
//                           htmlFor="video"
//                           className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
//                         >
//                           <span>Upload a file</span>
//                           <input
//                             id="video"
//                             name="video"
//                             type="file"
//                             className="sr-only"
//                             accept="video/mp4"
//                             onChange={handleVideoChange}
//                             required
//                           />
//                         </label>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-slate-500">MP4 files only</p>
//                     </div>
//                   </div>
//                   {videoFile ? (
//                     <p className="text-emerald-600 mt-2 flex items-center gap-1"><Check size={16} /> Selected: {videoFile.name}</p>
//                   ) : (
//                     <p className="text-slate-500 mt-2 flex items-center gap-1"><FileX size={16} /> Not Selected</p>
//                   )}
//                 </div>

//                 {/* Thumbnail Photo Input */}
//                 <div>
//                   <label htmlFor="thumbnail" className="block text-sm font-medium text-slate-700">Thumbnail Photo (PNG/JPG/GIF/WEBP)</label>
//                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-slate-300 rounded-md shadow-sm">
//                     <div className="space-y-1 text-center">
//                       <svg
//                         className="mx-auto h-12 w-12 text-slate-400"
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                         aria-hidden="true"
//                       >
//                         <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
//                       </svg>
//                       <div className="flex text-sm text-slate-700">
//                         <label
//                           htmlFor="thumbnail"
//                           className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
//                         >
//                           <span>Upload a file</span>
//                           <input
//                             id="thumbnail"
//                             name="thumbnail"
//                             type="file"
//                             className="sr-only"
//                             accept="image/*"
//                             onChange={handleThumbnailChange}
//                             required
//                           />
//                         </label>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-slate-500">PNG, JPG, GIF, WEBP files</p>
//                     </div>
//                   </div>
//                   {thumbnailFile ? (
//                     <p className="text-emerald-600 mt-2 flex items-center gap-1"><Check size={16} /> Selected: {thumbnailFile.name}</p>
//                   ) : (
//                     <p className="text-slate-500 mt-2 flex items-center gap-1"><FileX size={16} /> Not Selected</p>
//                   )}
//                 </div>

//                 {/* Assignment File Input (Optional) - Now fits in the 3-column grid */}
//                 <div> {/* Removed col-span-full */}
//                   <label htmlFor="assignmentFile" className="block text-sm font-medium text-slate-700">Assignment File (PDF - Optional)</label>
//                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-slate-300 rounded-md shadow-sm">
//                     <div className="space-y-1 text-center">
//                       <FileText className="mx-auto h-12 w-12 text-slate-400" />
//                       <div className="flex text-sm text-slate-700">
//                         <label
//                           htmlFor="assignmentFile"
//                           className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
//                         >
//                           <span>Upload a file</span>
//                           <input
//                             id="assignmentFile"
//                             name="assignmentFile"
//                             type="file"
//                             className="sr-only"
//                             accept="application/pdf"
//                             onChange={handleAssignmentChange} // New handler
//                           />
//                         </label>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-slate-500">PDF files only</p>
//                     </div>
//                   </div>
//                   {assignmentFile ? (
//                     <p className="text-emerald-600 mt-2 flex items-center gap-1"><Check size={16} /> Selected: {assignmentFile.name}</p>
//                   ) : (
//                     <p className="text-slate-500 mt-2 flex items-center gap-1"><FileX size={16} /> Not Selected</p>
//                   )}
//                 </div>
//               </div> {/* End of File Input Group */}

//               {/* Assignment Description & Due Date (2 in a row on md) */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* NEW separate grid for assignment details */}
//                 <div>
//                   <label htmlFor="assignmentDescription" className="block text-sm font-medium text-slate-700">Assignment Description (Optional)</label>
//                   <textarea
//                     id="assignmentDescription"
//                     value={assignmentDescription}
//                     onChange={(e) => setAssignmentDescription(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                     rows="3"
//                     placeholder="e.g., Solve problems 1-5 from Chapter 3, due Friday."
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="assignmentDueDate" className="block text-sm font-medium text-slate-700">Due Date (Optional)</label>
//                   <input
//                     id="assignmentDueDate"
//                     type="date"
//                     value={assignmentDueDate}
//                     onChange={(e) => setAssignmentDueDate(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div> {/* End of Assignment Description & Due Date Group */}

//               {/* Video Title & Course Selection (already 2 in a row) */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-slate-700">Video Title</label>
//                   <input
//                     id="title"
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="course" className="block text-sm font-medium text-slate-700">Select Course</label>
//                   <select
//                     id="course"
//                     value={selectedCourse}
//                     onChange={(e) => setSelectedCourse(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                     required
//                   >
//                     <option value="">Select Course</option>
//                     {course.map(course => (
//                       <option key={course._id} value={course._id}>{course.title}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Video Description - always full width */}
//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-slate-700">Video Description</label>
//                 <textarea
//                   id="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   required
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
//                     } flex items-center justify-center gap-2`}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 size={18} className="animate-spin" /> Uploading...
//                     </>
//                   ) : (
//                     "Upload Video & Assignment"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}


//       {/* Video Modal */}
//       {
//         isModalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md bg-opacity-75 z-50">
//             <div className="relative bg-[#F0F6F6] p-4 rounded-lg w-full max-w-3xl">
//               <button className="absolute z-50 top-3 right-3 text-black text-2xl font-bold bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-full w-8 h-8 flex items-center justify-center"
//                 onClick={() => {
//                   setIsModalOpen(false);
//                   setSelectedVideo(null);
//                 }}
//               > ✕
//               </button>
//               <div className="relative">

//                 <MediaPlayer title="Video Player" src={selectedVideo}>
//                   <MediaProvider />
//                   <DefaultVideoLayout icons={defaultLayoutIcons} />
//                 </MediaPlayer>

//                 <img
//                   src="/logo.png"

//                   className="absolute top-5 right-5 w-20 opacity-50"
//                   alt="Watermark"
//                 />
//               </div>
//             </div>
//           </div>
//         )
//       }
//     </>
//   );
// }





import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";

import { format } from "date-fns";
import { Play, Trash2, ChevronDown, ChevronUp, Eye, PlayCircle, BookOpen, Upload, FileX, Calendar, FileText, VideoIcon, Check, Loader2 } from 'lucide-react';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';


export default function AdminVideo() {
  const { Toast } = useContext(AlertContext);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoImages, setVideoImages] = useState({}); // Stores images per video
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL, course, videos, fetchVideos } = useContext(ProjectContext)



  const admintoken = localStorage.getItem("admintoken");


  // Fetch images for videos
  useEffect(() => {
    const fetchImages = async () => {
      const images = {};
      for (const video of videos) {
        try {
          const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(video.title)}.png`;
          images[video.title] = imageUrl;
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
      setVideoImages(images);
    };
    if (videos.length > 0) fetchImages();
  }, [videos]);



  const handlePlayVideo = async (filename) => {
    setVideoLoading(true);
    try {
      const videoUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(filename)}.mp4`;
      setSelectedVideo(videoUrl);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching video:", error);
      Toast.fire({ icon: "error", title: "Error loading video" });
    } finally {
      setVideoLoading(false);
    }

  };

  const handleVideoDelete = async (_id, title, courseId) => {
    try {
      // 🔹 Show confirmation alert before deleting
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // 🔹 Perform the delete request
            const response = await axios.delete(`${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/delete-video/${_id}`, {
              params: { title, courseId },

              headers: {
                "Authorization": `Bearer ${admintoken}`,
                "Content-Type": "application/json"
              }
            });

            console.log(response.data.message);
            fetchVideos(); // ✅ Refresh video list after deletion

            // 🔹 Show success message after deletion
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });

          } catch (error) {
            console.error("Error deleting video:", error.response?.data?.message || error.message);
            Swal.fire({
              title: "Error",
              text: "Something went wrong!",
              icon: "error"
            });
          }
        }
      });

    } catch (error) {
      console.error("Error initializing delete process:", error.message);
    }
  };



  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");

  const handleAssignmentChange = (e) => {
    setAssignmentFile(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const closeUploadModal = () => {
    if (!loading) {
      setUploadModalOpen(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbnailFile(null);
    setSelectedCourse("");
  };
  const handleUpload = async (e) => {
    e.preventDefault();

    // ✅ Validate video format
    if (videoFile && videoFile.type !== "video/mp4") {
      Toast.fire({ icon: "error", title: "Invalid video type. Only MP4 is allowed." });
      return;
    }

    // ✅ Validate thumbnail format
    if (thumbnailFile && thumbnailFile.type !== "image/png") {
      Toast.fire({ icon: "error", title: "Invalid thumbnail type. Only PNG is allowed." });
      return;
    }

    // ✅ Validate assignment format if provided
    if (assignmentFile && assignmentFile.type !== "application/pdf") {
      Toast.fire({ icon: "error", title: "Invalid assignment type. Only PDF is allowed." });
      return;
    }

    // ✅ Check required fields
    if (!title || !description || !videoFile || !thumbnailFile || !selectedCourse) {
      Toast.fire({ icon: "error", title: "All required fields must be filled!" });
      return;
    }

    setLoading(true);

    try {
      // 🔹 Step 1: Request signed URLs from backend
      const { data } = await axios.post(
        `${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/generate-upload-urls`,
        {
          title,
          videoType: videoFile.type,
          thumbnailType: thumbnailFile.type,
          assignmentType: assignmentFile ? assignmentFile.type : null, // Optional
        },
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // 🔹 Step 2: Upload files to S3
      const uploadPromises = [
        axios.put(data.video.url, videoFile, { headers: { "Content-Type": videoFile.type } }),
        axios.put(data.thumbnail.url, thumbnailFile, { headers: { "Content-Type": thumbnailFile.type } }),
      ];
      if (assignmentFile && data.assignment) {
        uploadPromises.push(
          axios.put(data.assignment.url, assignmentFile, { headers: { "Content-Type": assignmentFile.type } })
        );
      }
      console.log(uploadPromises);
      await Promise.all(uploadPromises);

      // 🔹 Step 3: Save video & assignment details in DB
      await axios.post(
        `${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/save`,
        {
          title,
          description,
          courseId: selectedCourse,
          videoUrl: `https://your-bucket-name.s3.amazonaws.com/webdev/${data.video.filename}`,
          thumbnailUrl: `https://your-bucket-name.s3.amazonaws.com/webdev/${data.thumbnail.filename}`,
          assignmentUrl:
            assignmentFile && data.assignment
              ? `https://your-bucket-name.s3.amazonaws.com/webdev/${data.assignment.filename}`
              : null,
          assignmentDescription: assignmentDescription || "",
          assignmentDueDate: assignmentDueDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      Toast.fire({ icon: "success", title: "Video & Assignment uploaded successfully!" });
      resetForm();
      fetchVideos();
      setUploadModalOpen(false);
    } catch (error) {
      console.error("Error uploading:", error);
      Toast.fire({ icon: "error", title: "Upload failed!" });
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    if (uploadModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup when component unmounts
    };
  }, [uploadModalOpen]);








  const [expandedRows, setExpandedRows] = useState({});

  // Toggle expanded state for a video
  const toggleRowExpand = (videoId) => {
    setExpandedRows(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  // Function to truncate description text
  const truncateText = (text, maxLength = 150) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  return (
    <>
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 relative">
            All Videos ({videos.length})
          </h2>

          {/* Upload Video Button */}
          <div
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full flex items-center gap-2 transform hover:scale-105 shadow-md cursor-pointer"
          >
            <Upload size={18} />
            Upload Video
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Mobile View (< 768px) - Card-based layout */}
          <div className="md:hidden">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <div key={video._id} className="border-b border-slate-200 p-4 hover:bg-slate-50 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md group">
                      <img
                        src={videoImages[video.title]}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <PlayCircle size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-slate-900 break-words pr-2">{video.title}</h3>
                        <button
                          onClick={() => toggleRowExpand(video._id)}
                          className="p-1 rounded-full text-slate-500 hover:bg-slate-100 flex-shrink-0 mt-1"
                        >
                          {expandedRows[video._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <BookOpen size={14} className="text-slate-500" />
                        {video?.course?.title || "No course"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>

                  {expandedRows[video._id] && (
                    <div className="mt-3 pl-2 animate-fadeIn overflow-hidden">
                      <div className="bg-slate-50 bg-opacity-70 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                        <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                          <FileText size={14} className="text-slate-500" />
                          Description:
                        </h4>
                        <p className="text-sm text-slate-600 break-words whitespace-pre-line mb-4">
                          {video.description || "No description available."}
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2 mt-3">
                        <button
                          onClick={() => handlePlayVideo(video.title)}
                          className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-200 transition-all hover:shadow-md"
                        >
                          <Play size={16} />
                          Watch
                        </button>

                        <button
                          onClick={() => handleVideoDelete(video._id, video.title, video.course)}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 transition-all hover:shadow-md"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileX size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">No videos uploaded yet.</p>
              </div>
            )}
          </div>

          {/* Tablet and Desktop View (≥ 768px) - Table layout */}
          <div className="hidden md:block overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-12 border-b-2 border-indigo-600">#</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-20 border-b-2 border-indigo-600">Media</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider border-b-2 border-indigo-600">Video Details</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-indigo-600">Description</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32 border-b-2 border-indigo-600">Date</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {videos?.length > 0 ? (
                    videos?.map((video, index) => (
                      <tr key={video._id} className="hover:bg-slate-50 transition-colors duration-300">
                        {/* Number */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-center">
                          {index + 1}
                        </td>

                        {/* Thumbnail */}
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="relative w-16 h-16 overflow-hidden rounded-md group">
                            <img
                              src={videoImages[video.title]}
                              alt={video.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <PlayCircle size={24} className="text-white" />
                            </div>
                          </div>
                        </td>

                        {/* Title and Course */}
                        <td className="px-3 py-4">
                          <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-slate-900 break-words">
                              {video.title}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                              <BookOpen size={14} className="text-slate-500" />
                              {video?.course?.title || "N/A"}
                            </p>
                            <p className="text-sm text-slate-600 mt-1 lg:hidden">
                              {truncateText(video.description, 100)}
                            </p>
                          </div>
                        </td>

                        {/* Description (hidden on medium screens) */}
                        <td className="px-3 py-4 whitespace-normal hidden lg:table-cell">
                          <div className="max-w-md relative">
                            <div className={`transition-all duration-500 ${expandedRows[video._id] ? 'opacity-0 h-0' : 'opacity-100'}`}>
                              <p className="text-sm text-slate-600 break-words line-clamp-3  bg-slate-50 p-2 rounded-lg">
                                {truncateText(video.description, 200)}
                              </p>
                              {video.description && video.description.length > 200 && (
                                <button
                                  onClick={() => toggleRowExpand(video._id)}
                                  className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 flex items-center transition-all hover:pl-1"
                                >
                                  <ChevronDown size={16} className="mr-1 transition-transform duration-300 transform hover:translate-y-1" />
                                  Show more
                                </button>
                              )}
                            </div>

                            {expandedRows[video._id] && (
                              <div className="animate-slideDown  bg-slate-50 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                                <p className="text-sm text-slate-600 break-words">
                                  {video.description}
                                </p>
                                <button
                                  onClick={() => toggleRowExpand(video._id)}
                                  className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 flex items-center transition-all hover:pl-1"
                                >
                                  <ChevronUp size={16} className="mr-1 transition-transform duration-300 transform hover:-translate-y-1" />
                                  Show less
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-slate-400" />
                            {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "N/A"}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handlePlayVideo(video.title)}
                              className="text-indigo-600 hover:text-indigo-700 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                              title="Play video"
                            >
                              <Play size={22} />
                            </button>
                            <button
                              onClick={() => handleVideoDelete(video._id, video.title, video.course)}
                              className="text-red-600 hover:text-red-700 transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
                              title="Delete video"
                            >
                              <Trash2 size={22} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-3 py-12 text-center text-slate-500">
                        <FileX size={48} className="mx-auto mb-4 text-slate-300" />
                        <p>No videos uploaded yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      {/* upload model  */}
      {/* {uploadModalOpen && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Upload Video</h2>
              <button
                className="text-[#4ecdc4] cursor-pointer hover:text-[#45b7aa] transition"
                onClick={closeUploadModal}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleUpload}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="video" className="block text-sm font-medium text-[#2c3e50]">Video File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-[#4ecdc4]/30 rounded-md shadow-sm">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-[#2c3e50]/50"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
                      </svg>
                      <div className="flex text-sm text-[#2c3e50]">
                        <label
                          htmlFor="video"
                          className="relative cursor-pointer rounded-md font-medium text-[#4ecdc4] hover:text-[#45b7aa] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#4ecdc4]"
                        >
                          <span>Upload a file</span>
                          <input
                            id="video"
                            name="video"
                            type="file"
                            className="sr-only"
                            accept="video/*"
                            onChange={handleVideoChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-[#2c3e50]/70">MP4 files only</p>
                    </div>
                  </div>
                  {videoFile ? (
                    <p className="text-[#4ecdc4] mt-2">Selected</p>
                  ) : (
                    <p className="text-[#2c3e50]/70 mt-2">Not Selected</p>
                  )}
                </div>

                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-[#2c3e50]">Thumbnail Photo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-[#4ecdc4]/30 rounded-md shadow-sm">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-[#2c3e50]/50"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
                      </svg>
                      <div className="flex text-sm text-[#2c3e50]">
                        <label
                          htmlFor="thumbnail"
                          className="relative cursor-pointer rounded-md font-medium text-[#4ecdc4] hover:text-[#45b7aa] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#4ecdc4]"
                        >
                          <span>Upload a file</span>
                          <input
                            id="thumbnail"
                            name="thumbnail"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-[#2c3e50]/70">PNG files only</p>
                    </div>
                  </div>
                  {thumbnailFile ? (
                    <p className="text-[#4ecdc4] mt-2">Selected</p>
                  ) : (
                    <p className="text-[#2c3e50]/70 mt-2">Not Selected</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#2c3e50]">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-[#2c3e50]">Select Course</label>
                  <select
                    id="course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  >
                    <option value="">Select Course</option>
                    {course.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#2c3e50]">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 bg-[#4ecdc4] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Uploading..." : "Upload Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      {uploadModalOpen && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-[52rem] bg-white rounded-lg shadow-lg p-6 relative"> {/* Increased max-w for 3 columns */}
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Upload Video & Assignment</h2>
              <button
                className="text-slate-500 cursor-pointer hover:text-slate-700 transition"
                onClick={closeUploadModal}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleUpload}>

              {/* File Input Group: Video, Thumbnail, Assignment (3 in a row on md) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Changed to md:grid-cols-3 */}
                {/* Video File Input */}
                <div>
                  <label htmlFor="video" className="block text-sm font-medium text-slate-700">Video File (MP4)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-slate-300 rounded-md shadow-sm">
                    <div className="space-y-1 text-center">
                      <VideoIcon className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-700">
                        <label
                          htmlFor="video"
                          className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="video"
                            name="video"
                            type="file"
                            className="sr-only"
                            accept="video/mp4"
                            onChange={handleVideoChange}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">MP4 files only</p>
                    </div>
                  </div>
                  {videoFile ? (
                    <p className="text-emerald-600 mt-2 flex items-center gap-1"><Check size={16} /> Selected: {videoFile.name}</p>
                  ) : (
                    <p className="text-slate-500 mt-2 flex items-center gap-1"><FileX size={16} /> Not Selected</p>
                  )}
                </div>

                {/* Thumbnail Photo Input */}
                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-slate-700">Thumbnail Photo (PNG/JPG/GIF/WEBP)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-slate-300 rounded-md shadow-sm">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-slate-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
                      </svg>
                      <div className="flex text-sm text-slate-700">
                        <label
                          htmlFor="thumbnail"
                          className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="thumbnail"
                            name="thumbnail"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF, WEBP files</p>
                    </div>
                  </div>
                  {thumbnailFile ? (
                    <p className="text-emerald-600 mt-2 flex items-center gap-1"><Check size={16} /> Selected: {thumbnailFile.name}</p>
                  ) : (
                    <p className="text-slate-500 mt-2 flex items-center gap-1"><FileX size={16} /> Not Selected</p>
                  )}
                </div>

                {/* Assignment File Input (Optional) - Now fits in the 3-column grid */}
                <div> {/* Removed col-span-full */}
                  <label htmlFor="assignmentFile" className="block text-sm font-medium text-slate-700">Assignment File (PDF - Optional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border border-slate-300 rounded-md shadow-sm">
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-700">
                        <label
                          htmlFor="assignmentFile"
                          className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="assignmentFile"
                            name="assignmentFile"
                            type="file"
                            className="sr-only"
                            accept="application/pdf"
                            onChange={handleAssignmentChange} // New handler
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PDF files only</p>
                    </div>
                  </div>
                  {assignmentFile ? (
                    <p className="text-emerald-600 mt-2 flex items-center gap-1"><Check size={16} /> Selected: {assignmentFile.name}</p>
                  ) : (
                    <p className="text-slate-500 mt-2 flex items-center gap-1"><FileX size={16} /> Not Selected</p>
                  )}
                </div>
              </div> {/* End of File Input Group */}

              {/* Assignment Description & Due Date (2 in a row on md) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* NEW separate grid for assignment details */}
                <div>
                  <label htmlFor="assignmentDescription" className="block text-sm font-medium text-slate-700">Assignment Description (Optional)</label>
                  <textarea
                    id="assignmentDescription"
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                    rows="3"
                    placeholder="e.g., Solve problems 1-5 from Chapter 3, due Friday."
                  />
                </div>
                <div>
                  <label htmlFor="assignmentDueDate" className="block text-sm font-medium text-slate-700">Due Date (Optional)</label>
                  <input
                    id="assignmentDueDate"
                    type="date"
                    value={assignmentDueDate}
                    onChange={(e) => setAssignmentDueDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div> {/* End of Assignment Description & Due Date Group */}

              {/* Video Title & Course Selection (already 2 in a row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700">Video Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-slate-700">Select Course</label>
                  <select
                    id="course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                    required
                  >
                    <option value="">Select Course</option>
                    {course.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video Description - always full width */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Video Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
                    } flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    "Upload Video & Assignment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Video Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md bg-opacity-75 z-50">
            <div className="relative bg-white p-4 rounded-lg w-full max-w-3xl">
              <button className="absolute z-50 top-3 right-3 text-slate-700 text-2xl font-bold bg-slate-200 hover:bg-slate-300 cursor-pointer rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedVideo(null);
                }}
              > ✕
              </button>
              <div className="relative">

                <MediaPlayer title="Video Player" src={selectedVideo}>
                  <MediaProvider />
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>

                <img
                  src="/logo.png"

                  className="absolute top-5 right-5 w-20 opacity-50"
                  alt="Watermark"
                />
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
