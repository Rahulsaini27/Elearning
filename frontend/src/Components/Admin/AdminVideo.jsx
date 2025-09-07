import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";

import { format } from "date-fns";
import { Play, Trash2, ChevronDown, ChevronUp, Eye, PlayCircle, BookOpen, Upload, FileX, Calendar, FileText, VideoIcon, Check, Loader2, X as CloseIcon } from 'lucide-react';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';


export default function AdminVideo() {
  const { Toast } = useContext(AlertContext);
  const [videoLoading, setVideoLoading] =  useState(false);
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
        confirmButtonColor: "#3B82F6", // blue-500
        cancelButtonColor: "#EF4444", // red-500
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
    setAssignmentFile(null);
    setAssignmentDescription("");
    setAssignmentDueDate("");
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

  const toggleRowExpand = (videoId) => {
    setExpandedRows(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            All Videos <span className="text-lg font-normal text-gray-500">({videos.length})</span>
          </h2>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Upload size={18} />
            <span>Upload Video</span>
          </button>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Mobile View */}
          <div className="md:hidden">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video._id} className="border-b border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg group">
                      <img
                        src={videoImages[video.title]}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <PlayCircle size={32} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 break-words pr-2">{video.title}</h3>
                        <button
                          onClick={() => toggleRowExpand(video._id)}
                          className="p-1 rounded-full text-gray-500 hover:bg-gray-100 flex-shrink-0"
                        >
                          {expandedRows[video._id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                        <BookOpen size={14} className="text-gray-500" />
                        {video?.course?.title || "No course"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>

                  {expandedRows[video._id] && (
                    <div className="mt-4 pl-1 animate-fadeIn">
                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                          <FileText size={14} /> Description:
                        </h4>
                        <p className="text-sm text-gray-600 break-words whitespace-pre-line mb-4">
                          {video.description || "No description available."}
                        </p>
                      </div>
                      <div className="flex gap-3 pt-3 mt-3">
                        <button
                          onClick={() => handlePlayVideo(video.title)}
                          className="flex items-center gap-1.5 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
                        >
                          <Play size={16} /> Watch
                        </button>
                        <button
                          onClick={() => handleVideoDelete(video._id, video.title, video.course)}
                          className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <FileX size={52} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No videos uploaded yet.</p>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-12 border-b-2 border-blue-500">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-24 border-b-2 border-blue-500">Media</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-blue-500">Video Details</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-blue-500">Description</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-36 border-b-2 border-blue-500">Date</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-28 border-b-2 border-blue-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {videos?.length > 0 ? (
                    videos?.map((video, index) => (
                      <tr key={video._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-4 text-sm text-gray-600 text-center">{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="relative w-20 h-20 overflow-hidden rounded-lg group">
                            <img src={videoImages[video.title]} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <PlayCircle size={28} className="text-white" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <h3 className="text-md font-bold text-gray-800 break-words">{video.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5">
                              <BookOpen size={14} className="text-gray-500" /> {video?.course?.title || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 lg:hidden">{truncateText(video.description, 100)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-normal hidden lg:table-cell">
                          <div className="max-w-md relative">
                            {expandedRows[video._id] ? (
                              <div className="animate-slideDown bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
                                <p className="text-sm text-gray-700 break-words">{video.description}</p>
                                <button onClick={() => toggleRowExpand(video._id)} className="text-xs text-blue-500 hover:text-blue-600 mt-2 flex items-center">
                                  <ChevronUp size={16} className="mr-1" /> Show less
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600 break-words line-clamp-3">{truncateText(video.description, 200)}</p>
                                {video.description && video.description.length > 200 && (
                                  <button onClick={() => toggleRowExpand(video._id)} className="text-xs text-blue-500 hover:text-blue-600 mt-1 flex items-center">
                                    <ChevronDown size={16} className="mr-1" /> Show more
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-4">
                            <button onClick={() => handlePlayVideo(video.title)} className="text-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-125" title="Play video">
                              <Play size={22} />
                            </button>
                            <button onClick={() => handleVideoDelete(video._id, video.title, video.course)} className="text-red-500 hover:text-red-600 transition-all duration-300 transform hover:scale-125" title="Delete video">
                              <Trash2 size={22} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-3 py-16 text-center text-gray-500">
                        <FileX size={52} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">No videos uploaded yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {uploadModalOpen && (
        <div className="fixed z-[500] inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-[52rem] bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Upload Video & Assignment</h2>
              <button className="text-gray-500 cursor-pointer hover:text-gray-800 transition" onClick={closeUploadModal} disabled={loading}>
                <CloseIcon size={24} />
              </button>
            </div>
            <form className="space-y-6" onSubmit={handleUpload}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Video File Input */}
                <div>
                  <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">Video File (MP4)</label>
                  <div className="mt-1 flex justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="video" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input id="video" name="video" type="file" className="sr-only" accept="video/mp4" onChange={handleVideoChange} required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">MP4 files only</p>
                    </div>
                  </div>
                  {videoFile ? (
                    <p className="text-green-600 mt-2 flex items-center gap-1.5 text-sm"><Check size={16} /> Selected: {videoFile.name}</p>
                  ) : (
                    <p className="text-gray-500 mt-2 flex items-center gap-1.5 text-sm"><FileX size={16} /> Not Selected</p>
                  )}
                </div>

                {/* Thumbnail Photo Input */}
                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Photo (PNG)</label>
                  <div className="mt-1 flex justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4v12" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="thumbnail" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input id="thumbnail" name="thumbnail" type="file" className="sr-only" accept="image/png" onChange={handleThumbnailChange} required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG files only</p>
                    </div>
                  </div>
                  {thumbnailFile ? (
                    <p className="text-green-600 mt-2 flex items-center gap-1.5 text-sm"><Check size={16} /> Selected: {thumbnailFile.name}</p>
                  ) : (
                    <p className="text-gray-500 mt-2 flex items-center gap-1.5 text-sm"><FileX size={16} /> Not Selected</p>
                  )}
                </div>

                {/* Assignment File Input */}
                <div>
                  <label htmlFor="assignmentFile" className="block text-sm font-medium text-gray-700 mb-1">Assignment (PDF - Optional)</label>
                  <div className="mt-1 flex justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="assignmentFile" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input id="assignmentFile" name="assignmentFile" type="file" className="sr-only" accept="application/pdf" onChange={handleAssignmentChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF files only</p>
                    </div>
                  </div>
                  {assignmentFile ? (
                    <p className="text-green-600 mt-2 flex items-center gap-1.5 text-sm"><Check size={16} /> Selected: {assignmentFile.name}</p>
                  ) : (
                    <p className="text-gray-500 mt-2 flex items-center gap-1.5 text-sm"><FileX size={16} /> Not Selected</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Video Title</label>
                  <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required />
                </div>
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700">Select Course</label>
                  <select id="course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required >
                    <option value="">Select Course</option>
                    {course.map(c => (<option key={c._id} value={c._id}>{c.title}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Video Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="assignmentDescription" className="block text-sm font-medium text-gray-700">Assignment Description (Optional)</label>
                  <textarea id="assignmentDescription" value={assignmentDescription} onChange={(e) => setAssignmentDescription(e.target.value)} rows="3" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" placeholder="e.g., Solve problems 1-5..." />
                </div>
                <div>
                  <label htmlFor="assignmentDueDate" className="block text-sm font-medium text-gray-700">Due Date (Optional)</label>
                  <input id="assignmentDueDate" type="date" value={assignmentDueDate} onChange={(e) => setAssignmentDueDate(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className={`bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold`}>
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> Uploading...</>
                  ) : "Upload Video & Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 p-4">
          <div className="relative bg-white p-2 rounded-lg w-full max-w-4xl shadow-2xl">
            <button className="absolute z-50 top-3 right-3 text-gray-600 hover:text-black transition-colors bg-white/70 hover:bg-white cursor-pointer rounded-full w-8 h-8 flex items-center justify-center" onClick={() => { setIsModalOpen(false); setSelectedVideo(null); }}>
              <CloseIcon size={20} />
            </button>
            <MediaPlayer title="Video Player" src={selectedVideo}>
              <MediaProvider />
              <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
          </div>
        </div>
      )}
    </>
  );
}