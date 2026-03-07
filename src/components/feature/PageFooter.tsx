import { useTenant } from '../../contexts/TenantContext';
import type { ContactItem } from '../../services/guestGuideService';

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

function buildContactHref(contact: ContactItem): string | null {
  const value = contact.value.trim();

  switch (contact.contact_type) {
    case 'phone':
      return `tel:${normalizePhone(value)}`;
    case 'whatsapp':
      return `https://wa.me/${normalizePhone(value).replace(/^\+/, '')}`;
    case 'email':
      return `mailto:${value}`;
    case 'instagram':
    case 'facebook':
    case 'website':
    case 'maps':
      return value.startsWith('http') ? value : `https://${value}`;
    default:
      return value.startsWith('http') ? value : null;
  }
}

function contactLabel(contact: ContactItem): string {
  return contact.description?.trim() || contact.name;
}

const PageFooter = () => {
  const { config } = useTenant();
  const contacts = (config?.contacts || []).slice(0, 4);

  return (
    <footer className="w-full bg-white/95 backdrop-blur-md border-t border-white/30 mt-8 py-6 shadow-xl relative z-10">
      <div className="px-4 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-blue-600 mb-2">{config?.title || 'Guest Guide'}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {config?.subtitle || 'Hospitality information'}
          </p>
        </div>

        {contacts.length > 0 && (
          <div className="mb-4 max-w-sm mx-auto grid gap-2">
            {contacts.map((contact) => {
              const href = buildContactHref(contact);
              const content = (
                <>
                  <span className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <i className={`${contact.icon || 'ri-contacts-line'} text-base`} />
                  </span>
                  <span className="text-left min-w-0">
                    <span className="block text-sm font-semibold text-gray-800 truncate">{contact.name}</span>
                    <span className="block text-xs text-gray-500 truncate">{contactLabel(contact)}</span>
                  </span>
                </>
              );

              if (!href) {
                return (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-200 bg-white/70"
                  >
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={contact.id}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-200 bg-white/70 hover:bg-white transition-colors"
                >
                  {content}
                </a>
              );
            })}
          </div>
        )}

        <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
          © 2026 Host Connect
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
