import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <style>{`
                .theme-toggle {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-sm, 8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-hover, rgba(255, 255, 255, 0.08));
                    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
                    cursor: pointer;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    color: var(--text-secondary, #94a3b8);
                }
                .theme-toggle:hover {
                    background: var(--accent-subtle, rgba(99, 102, 241, 0.1));
                    border-color: var(--accent-border, rgba(99, 102, 241, 0.4));
                    color: var(--accent-light, #818cf8);
                    transform: rotate(15deg);
                }
            `}</style>
        </>
    );
};
