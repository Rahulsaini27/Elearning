import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import ProjectContext from '../../Context/ProjectContext';

function Coursevideo() {
    const { courseId } = useParams();
    const [videos, setVideos] = useState([]);
    const [videoImages, setVideoImages] = useState({});
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoLoading, setVideoLoading] = useState(false);

    const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL } = useContext(ProjectContext);
    const admintoken = localStorage.getItem('admintoken');
    useEffect(() => {
        if (courseId) {
            axios.get(
                `${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/course/${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${admintoken}`, // ✅ Properly set Authorization header
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(response => {
                    setVideos(response.data.videos);
                    if (response.data.videos && response.data.videos.length > 0) {
                        handlePlayVideo(response.data.videos[0].title);
                    }
                })
                .catch(error => {
                    console.error("Error fetching videos:", error);
                });
        }
    }, [courseId]);

    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            await Promise.all(videos.map(async (video) => {
                try {
                    const imageUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-image-url?filename=${encodeURIComponent(video.title)}.png`;
                    images[video.title] = imageUrl;
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            }));
            setVideoImages(images);
        };

        if (videos.length > 0) fetchImages();
    }, [videos]);

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

    return (
        <div className="min-h-screen bg-[#f0f6f6] text-[#2c3e50]">
            <div className="container mx-auto px-4 py-8">
                {/* Navigation */}
                <div className="mb-6">
                    <Link to="#" className="inline-flex items-center text-[#4ecdc4] hover:text-[#45b7aa] transition-colors">
                        <ChevronLeft className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Video Player Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div className="relative overflow-hidden">
                            <MediaPlayer
                                className="w-full aspect-video"
                                title={videos[currentIndex]?.title || "Course Video"}
                                src={selectedVideo || ""}
                            >
                                <MediaProvider />
                                <DefaultVideoLayout icons={defaultLayoutIcons} />
                            </MediaPlayer>
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
                                    text-[#2c3e50] 
                                    bg-[#4ecdc4]/10 
                                    hover:bg-[#4ecdc4]/20 
                                    rounded-lg 
                                    transition-colors 
                                    disabled:opacity-50 
                                    disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="mr-2" />
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex >= videos.length - 1}
                                className="flex items-center px-4 py-2 
                                    text-[#2c3e50] 
                                    bg-[#4ecdc4]/10 
                                    hover:bg-[#4ecdc4]/20 
                                    rounded-lg 
                                    transition-colors 
                                    disabled:opacity-50 
                                    disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight className="ml-2" />
                            </button>
                        </div>

                        {/* Video Information */}
                        {videos[currentIndex] && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#f0f6f6]">
                                <h2 className="text-2xl font-bold text-[#2c3e50] mb-3">{videos[currentIndex].title}</h2>
                                <p className="text-[#7f8c8d]">{videos[currentIndex].description}</p>
                            </div>
                        )}
                    </div>

                    {/* Course Content Sidebar */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#f0f6f6] h-fit">
                        <h3 className="text-xl font-semibold text-[#2c3e50] mb-6 border-b pb-3">Course Content</h3>
                        <div className="space-y-4">
                            {videos.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handlePlayVideo(item.title)}
                                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 
                                        ${currentIndex === index
                                            ? "bg-[#4ecdc4]/10 ring-2 ring-[#4ecdc4]"
                                            : "hover:bg-[#f0f6f6]"
                                        }`}
                                >
                                    <img
                                        src={videoImages[item.title] || "https://via.placeholder.com/100"}
                                        alt={`Thumbnail of ${item.title}`}
                                        className="w-20 h-20 object-cover rounded-lg mr-4 shadow-md"
                                    />
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-[#2c3e50]">{item.title}</h4>
                                        <div className="flex items-center text-[#7f8c8d] text-sm mt-1">
                                            <PlayCircle className="w-4 h-4 mr-2 text-[#4ecdc4]" />
                                            Video Lesson
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Coursevideo;