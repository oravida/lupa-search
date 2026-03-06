import logoUrl from "@assets/LUPA_001_1771857307394.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-t-lupa-orange/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 mb-12">

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src={logoUrl}
              alt="Lupa Pesquisas e Projetos Logo"
              className="h-16 w-auto mb-4 transition-all duration-500"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.onerror = null;
                t.src = "https://placehold.co/200x80?text=Lupa+Pesquisas";
              }}
            />
            <p className="text-lupa-gray-dark font-serif text-xl md:text-2xl leading-snug max-w-sm">
              "Clareza estratégica começa com leitura de cenário."
            </p>
          </div>

          <div className="flex items-center md:items-end justify-center md:justify-end">
            <p className="text-lupa-graphite font-serif font-bold text-xl md:text-2xl text-center md:text-right">
              Atuação em todo o território nacional
            </p>
          </div>

        </div>

        <div className="border-t border-gray-100 pt-8 flex justify-center md:justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Lupa Pesquisas e Projetos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
