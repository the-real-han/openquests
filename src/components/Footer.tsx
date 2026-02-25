export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-8 pb-6 px-4 text-center">
            <div className="container mx-auto max-w-4xl">
                {/* Divider */}
                <div className="border-t border-white/20 mb-4 md:w-[60%] w-[90%] mx-auto" />

                {/* Links */}
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
                    <a
                        href="https://github.com/the-real-han/openquests/blob/master/PRIVACY.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-sm transition-colors font-pixel"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="https://github.com/the-real-han/openquests/blob/master/TERMS.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-sm transition-colors font-pixel"
                    >
                        Terms &amp; Conditions
                    </a>
                    <a
                        href="https://github.com/the-real-han/openquests"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-sm transition-colors font-pixel"
                    >
                        GitHub
                    </a>
                </nav>

                {/* Copyright */}
                <p className="text-white/40 text-xs font-pixel">
                    &copy; {year} OpenQuests. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
