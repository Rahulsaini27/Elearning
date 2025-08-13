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
    const [selectedTaskIndices, setSelectedTaskIndices] = useState(new Set()); // Use Set for efficient lookup
    const [assignmentTitle, setAssignmentTitle] = useState('');

    const [loadingAI, setLoadingAI] = useState(false);
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [aiError, setAiError] = useState(null);

    const handleGenerateTasks = async () => {
        if (!topicInput.trim()) {
            Toast.fire({ icon: 'warning', title: 'Please enter a topic.' });
            return;
        }

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
                setAssignmentTitle(`${topicInput.trim()} Assignment`); // Suggest a title
                Toast.fire({ icon: 'success', title: 'Tasks generated successfully!' });
            } else {
                setAiError(response.data.message || 'Failed to generate tasks. Please try again.');
                Toast.fire({ icon: 'error', title: 'Task generation failed' });
            }
        } catch (error) {
            console.error('Error generating AI tasks:', error);
            setAiError(error.response?.data?.message || 'An unexpected error occurred while contacting AI.');
            Toast.fire({ icon: 'error', title: 'AI generation error' });
        } finally {
            setLoadingAI(false);
        }
    };

    const toggleTaskSelection = (index) => {
        setSelectedTaskIndices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleGeneratePdf = async () => {
        const selectedTasks = Array.from(selectedTaskIndices).map(index => generatedTasks[index]);

        if (!assignmentTitle.trim()) {
            Toast.fire({ icon: 'warning', title: 'Please enter a title for the PDF.' });
            return;
        }
        if (selectedTasks.length === 0) {
            Toast.fire({ icon: 'warning', title: 'Please select at least one task to generate the PDF.' });
            return;
        }

        setLoadingPDF(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}${API_URL}/assignments/admin/generate-ai-pdf`,
                { assignmentTitle: assignmentTitle.trim(), selectedTasks },
                {
                    headers: { Authorization: `Bearer ${admintoken}` },
                    responseType: 'blob', // Important for PDF download
                }
            );

            // Create a Blob from the response data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${assignmentTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Assignment.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            Toast.fire({ icon: 'success', title: 'PDF generated and download started!' });

        } catch (error) {
            console.error('Error generating PDF:', error);
            Toast.fire({ icon: 'error', title: 'Failed to generate PDF. Please try again.' });
        } finally {
            setLoadingPDF(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-3 border-slate-200 flex items-center">
                <Lightbulb className="mr-3 text-indigo-600" size={28} /> Generate New Assignment
            </h1>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">1. Define Assignment Topic</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">
                            Enter Topic (e.g., "HTML basic tags", "JavaScript loops", "CSS Flexbox properties")
                        </label>
                        <input
                            type="text"
                            id="topic"
                            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            placeholder="e.g., Functions in Python"
                            disabled={loadingAI}
                        />
                    </div>
                    <button
                        onClick={handleGenerateTasks}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={loadingAI || !topicInput.trim()}
                    >
                        {loadingAI ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Lightbulb size={20} /> Generate Tasks
                            </>
                        )}
                    </button>
                </div>
                {aiError && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
                        <XCircle size={20} /> {aiError}
                    </div>
                )}
            </div>

            {generatedTasks.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">2. Select Tasks for PDF</h2>
                    <input
                        type="text"
                        className="w-full p-2 mb-4 border border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                        placeholder="Assignment Title (e.g., HTML Basics Homework)"
                        value={assignmentTitle}
                        onChange={(e) => setAssignmentTitle(e.target.value)}
                    />
                    <ul className="space-y-3">
                        {generatedTasks.map((task, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => toggleTaskSelection(index)}
                            >
                                {selectedTaskIndices.has(index) ? (
                                    <CheckSquare size={20} className="text-emerald-600" />
                                ) : (
                                    <Square size={20} className="text-slate-400" />
                                )}
                                <span className="text-slate-700">{task}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleGeneratePdf}
                            className="px-5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={loadingPDF || selectedTaskIndices.size === 0 || !assignmentTitle.trim()}
                        >
                            {loadingPDF ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Generating PDF...
                                </>
                            ) : (
                                <>
                                    <Download size={20} /> Generate PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {generatedTasks.length === 0 && !loadingAI && !aiError && topicInput.trim() && (
                 <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 text-center">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No tasks generated yet. Enter a topic and click "Generate Tasks".</p>
                </div>
            )}
        </div>
    );
};

export default AdminGenerateAssignment;