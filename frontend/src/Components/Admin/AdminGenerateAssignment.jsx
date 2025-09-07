import React, { useContext, useState } from 'react';
import axios from 'axios';
import ProjectContext from '../../Context/ProjectContext';
import { AlertContext } from '../../Context/AlertContext';
import { Lightbulb, FileText, Download, Loader2, CheckSquare, Square, XCircle } from 'lucide-react';

const AdminGenerateAssignment = () => {
    const { API_BASE_URL, API_URL } = useContext(ProjectContext);
    const { Toast } = useContext(AlertContext);
    const admintoken = localStorage.getItem("admintoken");

    const [topicInput, setTopicInput] = useState('');
    const [generatedTasks, setGeneratedTasks] = useState([]);
    const [selectedTaskIndices, setSelectedTaskIndices] = useState(new Set());
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [aiError, setAiError] = useState(null);

    const handleGenerateTasks = async () => {
        if (!topicInput.trim()) return Toast.fire({ icon: 'warning', title: 'Please enter a topic.' });

        setLoadingAI(true);
        setAiError(null);
        setGeneratedTasks([]);
        setSelectedTaskIndices(new Set());
        setAssignmentTitle('');

        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_URL}/assignments/admin/generate-ai-tasks`,
                { topic: topicInput },
                { headers: { Authorization: `Bearer ${admintoken}` } }
            );

            if (response.data.success && response.data.tasks.length > 0) {
                setGeneratedTasks(response.data.tasks);
                setAssignmentTitle(`${topicInput.trim()} Assignment`);
                Toast.fire({ icon: 'success', title: 'Tasks generated successfully!' });
            } else {
                setAiError(response.data.message || 'Failed to generate tasks. Please try again.');
                Toast.fire({ icon: 'error', title: 'Task generation failed' });
            }
        } catch (error) {
            setAiError(error.response?.data?.message || 'An unexpected error occurred.');
            Toast.fire({ icon: 'error', title: 'AI generation error' });
        } finally {
            setLoadingAI(false);
        }
    };

    const toggleTaskSelection = (index) => {
        setSelectedTaskIndices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) newSet.delete(index);
            else newSet.add(index);
            return newSet;
        });
    };

    const handleGeneratePdf = async () => {
        const selectedTasks = Array.from(selectedTaskIndices).map(index => generatedTasks[index]);
        if (!assignmentTitle.trim()) return Toast.fire({ icon: 'warning', title: 'Please enter a title.' });
        if (selectedTasks.length === 0) return Toast.fire({ icon: 'warning', title: 'Please select at least one task.' });

        setLoadingPDF(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_URL}/assignments/admin/generate-ai-pdf`,
                { assignmentTitle: assignmentTitle.trim(), selectedTasks },
                { headers: { Authorization: `Bearer ${admintoken}` }, responseType: 'blob' }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${assignmentTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Assignment.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            Toast.fire({ icon: 'success', title: 'PDF download started!' });
        } catch (error) {
            Toast.fire({ icon: 'error', title: 'Failed to generate PDF.' });
        } finally {
            setLoadingPDF(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Lightbulb className="mr-3 text-blue-500" size={28} /> Generate New Assignment
            </h1>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">1. Define Assignment Topic</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter Topic (e.g., "JavaScript loops", "CSS Flexbox")
                        </label>
                        <input
                            type="text"
                            id="topic"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            placeholder="e.g., Functions in Python"
                            disabled={loadingAI}
                        />
                    </div>
                    <button
                        onClick={handleGenerateTasks}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
                        disabled={loadingAI || !topicInput.trim()}
                    >
                        {loadingAI ? <><Loader2 size={20} className="animate-spin" /> Generating...</> : <><Lightbulb size={20} /> Generate Tasks</>}
                    </button>
                </div>
                {aiError && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                        <XCircle size={20} /> {aiError}
                    </div>
                )}
            </div>

            {generatedTasks.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">2. Select Tasks & Generate PDF</h2>
                    <input
                        type="text"
                        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        placeholder="Assignment Title (e.g., HTML Basics Homework)"
                        value={assignmentTitle}
                        onChange={(e) => setAssignmentTitle(e.target.value)}
                    />
                    <ul className="space-y-3">
                        {generatedTasks.map((task, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => toggleTaskSelection(index)}
                            >
                                {selectedTaskIndices.has(index) ? <CheckSquare size={20} className="text-green-600" /> : <Square size={20} className="text-gray-400" />}
                                <span className="text-gray-700">{task}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-8">
                        <button
                            onClick={handleGeneratePdf}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
                            disabled={loadingPDF || selectedTaskIndices.size === 0 || !assignmentTitle.trim()}
                        >
                            {loadingPDF ? <><Loader2 size={20} className="animate-spin" /> Generating PDF...</> : <><Download size={20} /> Generate PDF</>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGenerateAssignment;
