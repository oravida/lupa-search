import { Link } from "wouter";
import logoUrl from "@assets/LUPA_001_1771857307394.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-t-lupa-orange/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-start">
          {/* Column 1 */}
          <div className="flex flex-col items-start -mt-2">
            <img 
              src={logoUrl} 
              alt="Lupa Pesquisas e Projetos Logo" 
              className="h-14 w-auto mb-3 grayscale hover:grayscale-0 transition-all duration-500"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.onerror = null;
                t.src = "https://placehold.co/200x80?text=Lupa+Pesquisas";
              }}
            />
            <p className="text-lupa-gray-dark font-serif text-base leading-snug">
              "Clareza estratégica começa com leitura de cenário."
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-serif font-bold text-lupa-graphite mb-6 text-xl">Contato</h4>
            <div className="space-y-3 text-lupa-gray-dark">
              <p>
                <a href="mailto:leandro@lupapesquisas.com.br" className="hover:text-lupa-orange transition-colors" data-testid="link-email">
                  leandro@lupapesquisas.com.br
                </a>
              </p>
              <p>
                <a href="https://wa.me/5531984818662" className="hover:text-lupa-orange transition-colors" target="_blank" rel="noreferrer" data-testid="link-whatsapp">
                  WhatsApp: (31) 98481-8662
                </a>
              </p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="md:col-span-1">
            <h4 className="font-serif font-bold text-lupa-graphite mb-6 text-xl">Atuação em todo o território nacional</h4>
            <p className="text-lupa-gray-dark">
              <a href="https://www.lupapesquisas.com.br" className="hover:text-lupa-orange transition-colors text-sm" target="_blank" rel="noreferrer" data-testid="link-website">
                www.lupapesquisas.com.br
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Lupa Pesquisas e Projetos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
