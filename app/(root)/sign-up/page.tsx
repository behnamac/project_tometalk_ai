import Image from 'next/image';
import Link from 'next/link';
import { getServerTranslation } from '@/lib/i18n/server';

const SignUpPage = async () => {
    const { t } = await getServerTranslation();

    return (
        <div className="login-dark flex min-h-screen">
            <div className="login-visual-panel hidden md:flex">
                <div className="login-glow-1" />
                <div className="login-glow-2" />
                <div className="login-particle login-particle-1" />
                <div className="login-particle login-particle-2" />
                <div className="login-particle login-particle-3" />
                <div className="login-particle login-particle-4" />

                <div className="login-book-wrap">
                    <div className="login-book">
                        <div className="login-book-cover" />
                        <div className="login-book-spine" />
                        <div className="login-book-line-1" />
                        <div className="login-book-line-2" />
                        <div className="login-book-line-3" />
                    </div>
                </div>
            </div>

            <div className="login-form-panel">
                <div className="login-card">
                    <Image src="/assets/logo.png" alt="TomeTalk" width={32} height={32} className="login-logo" />
                    <h1 className="login-title">{t('signUp.title')}</h1>
                    <p className="login-subtitle">{t('signUp.subtitle')}</p>

                    <a
                        href="mailto:hello@behnamsepehri.nl?subject=Bookified%20access%20request"
                        className="login-btn-primary flex items-center justify-center no-underline"
                    >
                        <span className="login-btn-sweep" />
                        <span className="login-btn-text">{t('signUp.emailCta')}</span>
                    </a>

                    <p className="login-footer-text">
                        {t('signUp.footer')}{' '}
                        <Link href="/sign-in" className="login-link">
                            {t('signUp.signInLink')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
