import { Link } from 'react-router-dom';

export interface ShortcutItem {
  icon: string;
  label: string;
  to?: string;
  href?: string;
  color: string;
  borderColor: string;
  iconColor: string;
}

interface QuickShortcutsProps {
  items: ShortcutItem[];
}

const QuickShortcuts = ({ items }: QuickShortcutsProps) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8 px-4">
      {items.map((item, index) => {
        const iconEl = (
          <div 
            className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center border ${item.borderColor} group-hover:scale-105 group-hover:shadow-lg transition-all duration-300`}
          >
            <i className={`${item.icon} ${item.iconColor} text-xl`}></i>
          </div>
        );

        if (item.href) {
          return (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group min-w-[52px] min-h-[52px]"
              title={item.label}
              aria-label={item.label}
            >
              {iconEl}
            </a>
          );
        }

        return (
          <Link
            key={index}
            to={item.to || '#'}
            className="relative flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group min-w-[52px] min-h-[52px]"
            title={item.label}
            aria-label={item.label}
          >
            {iconEl}
          </Link>
        );
      })}
    </div>
  );
};

export default QuickShortcuts;
