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
    const { API_BASE_URL, API_URL, VIDEO_BASE_URL, SECURE_VIDEO_BASE_URL } = useContext(ProjectContext);
    const admintoken = localStorage.getItem('admintoken');

    useEffect(() => {
        if (courseId) {
            axios.get(`${API_BASE_URL}${API_URL}${SECURE_VIDEO_BASE_URL}/course/${courseId}`, { headers: { Authorization: `Bearer ${admintoken}` } })
                .then(response => {
                    setVideos(response.data.videos);
                    if (response.data.videos?.length > 0) {
                        handlePlayVideo(response.data.videos[0].title);
                    }
                })
                .catch(error => console.error("Error fetching videos:", error));
        }
    }, [courseId, API_BASE_URL, API_URL, SECURE_VIDEO_BASE_URL, admintoken]);

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
    }, [videos, API_BASE_URL, API_URL, VIDEO_BASE_URL]);

    const handlePlayVideo = async (filename) => {
        try {
            const videoUrl = `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(filename)}.mp4`;
            setSelectedVideo(videoUrl);
        } catch (error) {
            console.error("Error fetching video:", error);
        }
    };

    const currentIndex = videos.findIndex(video =>
        `${API_BASE_URL}${API_URL}${VIDEO_BASE_URL}/get-video-url?filename=${encodeURIComponent(video.title)}.mp4` === selectedVideo
    );

    const handlePrevious = () => currentIndex > 0 && handlePlayVideo(videos[currentIndex - 1].title);
    const handleNext = () => currentIndex < videos.length - 1 && handlePlayVideo(videos[currentIndex + 1].title);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link to="/admin/admin-course" className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium">
                        <ChevronLeft className="mr-2" size={18} />
                        Back to All Courses
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative overflow-hidden rounded-2xl shadow-lg">
                            <MediaPlayer className="w-full aspect-video" title={videos[currentIndex]?.title} src={selectedVideo || ""}>
                                <MediaProvider />
                                <DefaultVideoLayout icons={defaultLayoutIcons} />
                            </MediaPlayer>
                        </div>

                        <div className="flex justify-between items-center">
                            <button onClick={handlePrevious} disabled={currentIndex <= 0} className="flex items-center px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 font-medium shadow-md">
                                <ChevronLeft className="mr-2" /> Previous
                            </button>
                            <button onClick={handleNext} disabled={currentIndex >= videos.length - 1} className="flex items-center px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 font-medium shadow-md">
                                Next <ChevronRight className="ml-2" />
                            </button>
                        </div>

                        {videos[currentIndex] && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{videos[currentIndex].title}</h2>
                                <p className="text-gray-600">{videos[currentIndex].description}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">Course Content</h3>
                        <div className="space-y-4">
                            {videos.map((item, index) => (
                                <div key={index} onClick={() => handlePlayVideo(item.title)}
                                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${currentIndex === index ? "bg-blue-50 ring-2 ring-blue-500" : "hover:bg-gray-100"}`}>
                                    <img src={videoImages[item.title]} alt={item.title} className="w-24 h-16 object-cover rounded-lg mr-4 bg-gray-200" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                        <div className="flex items-center text-gray-500 text-sm mt-1"><PlayCircle className="w-4 h-4 mr-1.5 text-blue-500" /> Video</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Coursevideo;