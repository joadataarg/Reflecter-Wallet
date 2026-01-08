'use client';

import React, { useState } from 'react';
import { Twitter, Send, MessageSquare } from 'lucide-react';
import { useRewards } from '@/lib/hooks/useRewards';

interface SocialShareButtonProps {
    platform: 'TWITTER' | 'DISCORD' | 'TELEGRAM';
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({ platform }) => {
    const { trackSocialShare, referralCode } = useRewards();
    const [sharing, setSharing] = useState(false);

    const getPlatformStyles = () => {
        switch (platform) {
            case 'TWITTER': return 'hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] border-[#1DA1F2]/10';
            case 'DISCORD': return 'hover:bg-[#5865F2]/20 hover:text-[#5865F2] border-[#5865F2]/10';
            case 'TELEGRAM': return 'hover:bg-[#0088cc]/20 hover:text-[#0088cc] border-[#0088cc]/10';
        }
    };

    const getIcon = () => {
        switch (platform) {
            case 'TWITTER': return <Twitter size={14} />;
            case 'DISCORD': return <MessageSquare size={14} />;
            case 'TELEGRAM': return <Send size={14} />;
        }
    };

    const handleShare = async () => {
        setSharing(true);
        const shareUrl = `https://reflecter.app/join?ref=${referralCode}`;
        const text = `¡Únete a Reflecter Wallet y eleva tu experiencia en Starknet! Usa mi código: ${referralCode}`;

        let url = '';
        if (platform === 'TWITTER') {
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        } else if (platform === 'TELEGRAM') {
            url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        }

        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }

        // Simulación de validación post-compartir
        setTimeout(async () => {
            await trackSocialShare(platform, shareUrl);
            setSharing(false);
        }, 3000);
    };

    return (
        <button
            onClick={handleShare}
            disabled={sharing}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 bg-white/5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${getPlatformStyles()} disabled:opacity-50`}
        >
            {getIcon()}
            {sharing ? 'Verificando...' : platform}
        </button>
    );
};
