// Pages/Client/ClientChatPage.jsx
import React from 'react';
import ConversationList from '../../Components/Client/ConversationList';
import ChatWindow from '../../Components/Client/ChatWindow';

const ClientChatPage = () => {
    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <ConversationList />
            <ChatWindow />
        </div>
    );
};

export default ClientChatPage;