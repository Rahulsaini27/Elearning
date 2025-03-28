import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";

import { format } from "date-fns";
import { Play, Trash2, ChevronDown, ChevronUp, Eye } from 'lucide-react';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';


export default function AdminVideo() {
  const { Toast } = useContext(AlertContext);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videoImages, setVideoImages] = useState({}); // Stores images per video
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL, course } = useContext(ProjectContext)

  const admintoken = localStorage.getItem("admintoken");


  const fetchVideos = async () => {
    try {
      const response = await axios.get(API_BASE_URL + API_URL + VIDEO_BASE_URL + "/all-video", {
        headers: {
          "Authorization": `Bearer ${admintoken}`,
          "Content-Type": "application/json"
        }
      });
      setVideos(response.data.videos);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [])


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

    // ✅ Validate MP4 format
    if (videoFile && videoFile.type !== "video/mp4") {
      Toast.fire({ icon: "error", title: "Invalid video type. Please upload a only MP4 file." });
      return;
    }


    if (thumbnailFile && thumbnailFile.type !== "image/png") {
      Toast.fire({ icon: "error", title: "Invalid image type. Please upload a only PNG file." });
      return;
    }

    if (!title || !description || !videoFile || !thumbnailFile || !selectedCourse) {
      Toast.fire({ icon: "error", title: "All fields are required!" });
      return;
    }

    setLoading(true);

    try {
      // 🔹 Step 1: Request upload URLs from backend
      const { data } = await axios.post(`${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/generate-upload-urls`, {
        title,
        videoType: videoFile.type,
        thumbnailType: thumbnailFile.type
      }, {
        headers: {
          Authorization: `Bearer ${admintoken}`, // ✅ Added Authorization header
          "Content-Type": "application/json"
        }
      }

      );
      // 🔹 Step 2: Upload video & thumbnail to the generated URLs
      await Promise.all([
        axios.put(data.video.url, videoFile, { headers: { "Content-Type": videoFile.type } }),
        axios.put(data.thumbnail.url, thumbnailFile, { headers: { "Content-Type": thumbnailFile.type } })
      ]);

      // 🔹 Step 3: Save video details in the database
      await axios.post(`${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/save`, {
        title,
        description,
        courseId: selectedCourse,
        videoUrl: `https://your-bucket-name.s3.amazonaws.com/webdev/${data.video.filename}`,
        thumbnailUrl: `https://your-bucket-name.s3.amazonaws.com/webdev/${data.thumbnail.filename}`,
      },
        {
          headers: {
            Authorization: `Bearer ${admintoken}`, // ✅ Added Authorization header
            "Content-Type": "application/json"
          }
        }
      );

      Toast.fire({ icon: "success", title: "Video uploaded successfully!" });
      resetForm();
      fetchVideos();
      setUploadModalOpen(false);
    } catch (error) {
      console.error("Error uploading video:", error);
      Toast.fire({ icon: "error", title: "Failed to upload video" });

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
      <div className=" min-h-screen bg-[#F0F6F6] ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">
            All Videos ({videos.length})
          </h2>

          {/* Upload Video Button */}
          <div onClick={() => setUploadModalOpen(true)}
            className="px-4 cursor-pointer py-2 text-white bg-[#4ecdc4] hover:bg-[#45b7aa]  transition duration-300 rounded-3xl "
          >
            Upload Video
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="w-full bg-[#F0F6F6] rounded-lg shadow-md">
          {/* Mobile View (< 768px) - Card-based layout */}
          <div className="md:hidden">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <div key={video._id} className="border-b border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={videoImages[video.title]}
                      alt={video.title}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 break-words pr-2">{video.title}</h3>
                        <button
                          onClick={() => toggleRowExpand(video._id)}
                          className="p-1 rounded-full hover:bg-[#e0f4f4] flex-shrink-0 mt-1"
                        >
                          {expandedRows[video._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {video?.course?.title || "No course"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>

                  {expandedRows[video._id] && (
                    <div className="mt-3 pl-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                      <p className="text-sm text-gray-600 break-words whitespace-pre-line mb-4">
                        {video.description || "No description available."}
                      </p>

                      <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handlePlayVideo(video.title)}
                          className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md text-sm hover:bg-purple-200 transition-colors"
                        >
                          <Play size={16} />
                          Watch
                        </button>

                        <button
                          onClick={() => handleVideoDelete(video._id, video.title, video.course)}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 transition-colors"
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
                <p className="text-gray-500">No videos uploaded yet.</p>
              </div>
            )}
          </div>

          {/* Tablet and Desktop View (≥ 768px) - Table layout */}
          <div className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[#e0e0e0] divide-y divide-gray-200">
                <thead className="bg-[#F0F6F6] ">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Media</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video Details</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Date</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#F0F6F6] divide-y divide-gray-200">
                  {videos?.length > 0 ? (
                    videos?.map((video, index) => (
                      <tr key={video._id} className="hover:bg-[#e0f4f4]  transition-colors">
                        {/* Number */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {index + 1}
                        </td>

                        {/* Thumbnail */}
                        <td className="px-3 py-4 whitespace-nowrap">
                          <img
                            src={videoImages[video.title]}
                            alt={video.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>

                        {/* Title and Course */}
                        <td className="px-3 py-4">
                          <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-gray-900 break-words">
                              {video.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Course: {video?.course?.title || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 lg:hidden">
                              {truncateText(video.description, 100)}
                            </p>
                          </div>
                        </td>

                        {/* Description (hidden on medium screens) */}
                        <td className="px-3 py-4 whitespace-normal hidden lg:table-cell">
                          <div className="max-w-md">
                            <p className="text-sm text-gray-600 break-words line-clamp-3">
                              {truncateText(video.description, 200)}
                            </p>
                            {video.description && video.description.length > 200 && (
                              <button
                                onClick={() => toggleRowExpand(video._id)}
                                className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                              >
                                {expandedRows[video._id] ? (
                                  <>
                                    <ChevronUp size={14} className="mr-1" /> Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={14} className="mr-1" /> Show more
                                  </>
                                )}
                              </button>
                            )}
                            {expandedRows[video._id] && (
                              <p className="text-sm text-gray-600 break-words mt-2  p-3 rounded-md">
                                {video.description}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handlePlayVideo(video.title)}
                              className="text-[#4ecdc4] hover:text-[#45b7aa] transition-colors"
                              title="Play video"
                            >
                              <Play size={22} />
                            </button>
                            <button
                              onClick={() => handleVideoDelete(video._id, video.title, video.course)}
                              className="text-red-600 hover:text-red-800 transition-colors"
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
                      <td colSpan="6" className="px-3 py-8 text-center text-gray-500">
                        No videos uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div >
      {/* upload model  */}
      {uploadModalOpen && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-3xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Upload Video</h2>
              <button
                className="text-[#4ecdc4] hover:text-[#45b7aa] transition"
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
                  className={`mt-4 bg-[#4ecdc4] text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Uploading..." : "Upload Video"}
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
            <div className="relative bg-[#F0F6F6] p-4 rounded-lg w-full max-w-3xl">
              <button className="absolute z-50 top-3 right-3 text-black text-2xl font-bold bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-full w-8 h-8 flex items-center justify-center"
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





