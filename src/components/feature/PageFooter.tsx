import { useTenant } from '../../contexts/TenantContext';

const PageFooter = () => {
  const { config } = useTenant();

  return (
    <footer className="w-full bg-white/95 backdrop-blur-md border-t border-white/30 mt-8 py-6 shadow-xl relative z-10">
      <div className="px-4 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-blue-600 mb-2">{config?.title || 'Guest Guide'}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {config?.subtitle || 'Hospedagem Premium'}
          </p>
        </div>
        <div className="mb-4 max-w-xs mx-auto">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <a
              href="https://wa.me/5549984252023"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-green-600 transition-colors"
            >
              <i className="ri-whatsapp-line text-lg w-5 h-5 flex items-center justify-center"></i>
              <span className="text-xs">WhatsApp</span>
            </a>
            <a
              href="https://instagram.com/urubiciparkhotel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <i className="ri-instagram-line text-lg w-5 h-5 flex items-center justify-center"></i>
              <span className="text-xs">Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/urubiciparkhotel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <i className="ri-facebook-line text-lg w-5 h-5 flex items-center justify-center"></i>
              <span className="text-xs">Facebook</span>
            </a>
            <a
              href="mailto:contato@urubiciparkhotel.com.br"
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <i className="ri-mail-line text-lg w-5 h-5 flex items-center justify-center"></i>
              <span className="text-xs">E-mail</span>
            </a>
          </div>
        </div>
        <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
          © 2026 Host Connect
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
