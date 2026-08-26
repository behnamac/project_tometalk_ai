'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoadingOverlay = () => {
    const { t } = useTranslation();

    return (
        <div className="loading-wrapper">
            <div className="loading-shadow-wrapper shadow-soft-lg">
                <div className="loading-shadow">
                    <Loader2 className="loading-animation w-12 h-12 text-[#c8553d]" />
                    <h2 className="loading-title">{t('loading.title')}</h2>
                    <p className="loading-description text-center max-w-xs">
                        {t('loading.description')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
