import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { ChevronLeft, ChevronRight, PlayCircle, AlertCircle, CloudSnow, DownloadCloud, UploadCloud, BookOpen, Check, X, Loader2, Users, Clock, Award, Play, Star } from 'lucide-react';
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
    const [downloadingAssignment, setDownloadingAssignment] = useState(false);

    const token = localStorage.getItem("token");

    // --- IMPORTANT: Log token to debug "No token, authorization denied" ---
    useEffect(() => {
        console.log("LearningVideo.jsx: Token from localStorage:", token);
        if (!token) {
            Toast.fire({
                icon: "warning",
                title: "You are not logged in or your session expired. Please log in again.",
            });
        }
    }, [token, Toast]);

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
                    submissionUrl: finalUrl,
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

    // Handle downloading the assignment (using presigned URL)
    const handleDownloadAssignment = async (assignmentUrl) => {
        if (!token) {
            Toast.fire({ icon: "error", title: "You must be logged in to download assignments." });
            return;
        }
        if (downloadingAssignment) return;

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
        if (courseId && userId && token) {
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
        }
    }, [courseId, userId, token, API_BASE_URL, API_URL, SECURE_VIDEO_BASE_URL, Toast]);

    // Fetch images for videos
    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            await Promise.all(videos.map(async (video) => {
                const thumbnailUrlPart = video.thumbnailUrl.split('/').pop();
                try {
                    const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(thumbnailUrlPart)}`;
                    images[video.title] = imageUrl;
                } catch (error) {
                    console.error("Error fetching image:", error);
                    images[video.title] = "https://via.placeholder.com/100";
                }
            }));
            setVideoImages(images);
        };

        if (videos.length > 0) fetchImages();
    }, [videos, API_BASE_URL, API_URL, VIDEO_BASE_URL]);

    const handlePlayVideo = async (filename) => {
        setVideoLoading(true);
        try {
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
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-4 text-gray-700 font-medium text-lg">Loading course videos...</p>
            </div>
        );
    }

    // No videos available UI
    if (videos.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Navigation Header */}
                    <div className="mb-8">
                        <Link 
                            to="/client/course" 
                            className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors font-medium"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span>Back to My Courses</span>
                        </Link>
                    </div>

                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="w-12 h-12 text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Videos Available</h2>
                        <p className="text-lg text-gray-600 max-w-md text-center leading-relaxed">
                            Videos for this course have not been uploaded yet. Please check back later or contact support for more information.
                        </p>
                        <button className="mt-8 bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main render with videos
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Navigation */}
                <div className="mb-8">
                    <Link 
                        to="/client/course" 
                        className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors font-medium group"
                    >
                        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to My Courses</span>
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Player Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Video Player Card */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {videoLoading ? (
                                <div className="flex flex-col items-center justify-center w-full aspect-video bg-gray-100">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                                    <p className="mt-4 text-gray-700 font-medium">Loading video...</p>
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
                        </div>

                        {/* Video Navigation */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex <= 0}
                                className="group bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                                <span>Previous</span>
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex >= videos.length - 1}
                                className="group bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <span>Next</span>
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Video Information Card */}
                        {videos[currentIndex] && (
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{videos[currentIndex].title}</h1>
                                        <div className="flex items-center space-x-4 text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Play className="h-4 w-4" />
                                                <span>Video Lesson</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>Duration varies</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <PlayCircle className="h-8 w-8 text-blue-500" />
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-lg">{videos[currentIndex].description}</p>
                            </div>
                        )}

                        {/* Assignment Section */}
                        {videos[currentIndex]?.assignment && (
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Assignment</h3>
                                        <p className="text-gray-600">{videos[currentIndex].assignment.title}</p>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                                    {videos[currentIndex].assignment.description || "Complete this assignment to demonstrate your understanding of the concepts covered in this lesson."}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 items-center">
                                    {/* Download Assignment Button */}
                                    <button
                                        onClick={() => handleDownloadAssignment(videos[currentIndex].assignment.assignmentUrl)}
                                        disabled={downloadingAssignment}
                                        className="group bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        {downloadingAssignment ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Preparing Download...</span>
                                            </>
                                        ) : (
                                            <>
                                                <DownloadCloud className="h-5 w-5" />
                                                <span>Download Assignment</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Submission Status + Submit Button */}
                                    {videos[currentIndex]?.assignment?.submissionStatus ? (
                                        videos[currentIndex].assignment.submissionStatus.submitted ? (
                                            <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-3 flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Check className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <span className="text-green-700 font-semibold">Assignment Submitted</span>
                                                    {videos[currentIndex].assignment.submissionStatus.submissionDetails && (
                                                        <p className="text-sm text-green-600">
                                                            Submitted on {new Date(videos[currentIndex].assignment.submissionStatus.submissionDetails.submittedAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowSubmissionModal(true)}
                                                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                                            >
                                                <UploadCloud className="h-5 w-5" />
                                                <span>Submit Assignment</span>
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={() => setShowSubmissionModal(true)}
                                            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                                        >
                                            <UploadCloud className="h-5 w-5" />
                                            <span>Submit Assignment</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Course Content Sidebar */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-200">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Course Content</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {videos.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePlayVideo(item.title)}
                                    className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                                        currentIndex === index
                                            ? "bg-blue-50 border-blue-200 shadow-md"
                                            : "hover:bg-gray-50 border-transparent hover:border-gray-200 hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <img
                                                src={videoImages[item.title] || "https://via.placeholder.com/80"}
                                                alt={`Thumbnail of ${item.title}`}
                                                className="w-20 h-20 object-cover rounded-lg shadow-md"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-6 h-6 text-white" />
                                            </div>
                                            {currentIndex === index && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <Play className="w-3 h-3 text-white fill-current" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-semibold text-sm leading-tight mb-2 ${
                                                currentIndex === index ? "text-blue-900" : "text-gray-900"
                                            }`}>
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <PlayCircle className="w-3 h-3" />
                                                    <span>Video</span>
                                                </div>
                                                {item.assignment && (
                                                    <div className="flex items-center space-x-1">
                                                        <BookOpen className="w-3 h-3 text-orange-500" />
                                                        <span className="text-orange-600">Assignment</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Course Stats */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">{videos.length}</div>
                                    <div className="text-xs text-gray-600">Lessons</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">{Math.round(currentIndex / videos.length * 100)}%</div>
                                    <div className="text-xs text-gray-600">Complete</div>
                                </div>
                            </div>
                            <div className="mt-4 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentIndex + 1) / videos.length * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Submission Modal */}
            {showSubmissionModal && videos[currentIndex]?.assignment && (
                <div className="fixed inset-0 z-50 bg-black/80 bg-opacity-10 flex justify-center items-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <UploadCloud className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Submit Assignment</h2>
                                    <p className="text-sm text-gray-600">{videos[currentIndex].assignment.title}</p>
                                </div>
                            </div>
                            <button
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                onClick={() => setShowSubmissionModal(false)}
                                disabled={submissionLoading}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitAssignment} className="space-y-6">
                            <div>
                                <label htmlFor="submissionFile" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Upload Your Completed Assignment
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
                                    <input
                                        id="submissionFile"
                                        type="file"
                                        accept="application/pdf,application/zip"
                                        onChange={handleSubmissionFileChange}
                                        className="hidden"
                                        required
                                    />
                                    <label htmlFor="submissionFile" className="cursor-pointer">
                                        <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500">PDF or ZIP files only</p>
                                    </label>
                                </div>
                                {submissionFile && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                                        <Check className="h-5 w-5 text-green-600" />
                                        <span className="text-sm text-green-700 font-medium">{submissionFile.name}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="submissionComments" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Comments (Optional)
                                </label>
                                <textarea
                                    id="submissionComments"
                                    value={submissionComments}
                                    onChange={(e) => setSubmissionComments(e.target.value)}
                                    rows="4"
                                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="Add any comments or notes for your instructor..."
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmissionModal(false)}
                                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                    disabled={submissionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submissionLoading}
                                    className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {submissionLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-5 w-5" />
                                            <span>Submit Assignment</span>
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