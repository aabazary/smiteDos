'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
    const pathname = usePathname();
    
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Random God', path: '/random-god' },
        { name: 'Team Generator', path: '/team-generator' },
    ];

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="text-xl font-bold">Smite 2 Companion</div>
                <div className="flex space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`hover:text-gray-300 transition-colors ${
                                pathname === item.path ? 'text-blue-400' : ''
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 