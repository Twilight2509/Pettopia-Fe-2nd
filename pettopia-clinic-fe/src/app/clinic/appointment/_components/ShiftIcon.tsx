import { Clock, Sun, Sunset, Moon } from 'lucide-react';

export const getShiftIcon = (shift: string) => {
    switch (shift?.toLowerCase()) {
        case 'morning': return <Sun className="w-5 h-5" />;
        case 'afternoon': return <Sunset className="w-5 h-5" />;
        case 'evening': return <Moon className="w-5 h-5" />;
        default: return <Clock className="w-5 h-5" />;
    }
};
