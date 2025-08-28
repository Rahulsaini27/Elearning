// Pages/Admin/AdminChatPage.jsx
import React from 'react';
import ConversationList from '../../Components/Client/ConversationList';
import ChatWindow from '../../Components/Client/ChatWindow';

const AdminChatPage = () => {
    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <ConversationList />
            <ChatWindow />
        </div>
    );
};

export default AdminChatPage;