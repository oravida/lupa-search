import { motion, Variants } from "framer-motion";
import { Link } from "wouter";
import { Calendar, Users, Building2 } from "lucide-react";

export default function About() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="w-full bg-white">
      {/* Seção 1 — Sobre a Lupa */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="text-lupa-orange text-sm font-bold tracking-widest uppercase mb-6 block">Sobre Nós</span>
            <h1 className="text-4xl md:text-5xl font-bold text-lupa-graphite mb-10 leading-tight">
              Enxergar além do óbvio é o que nos move.
            </h1>
            
            <div className="text-xl text-lupa-gray-dark leading-relaxed space-y-6 text-left border-l-4 border-lupa-orange pl-8 bg-orange-50/30 py-8 pr-8">
              <p>
                A Lupa nasceu da necessidade de ir fundo. De olhar o que passa despercebido. De entender que território não é estatística, comportamento coletivo não cabe em planilha e dados sozinhos não orientam ninguém.
              </p>
              <p>
                Desde 2010, transformamos pesquisa em direção estratégica para campanhas eleitorais, gestões públicas e decisões de mercado que exigem diagnóstico real.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pt-12 border-t border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-50 text-lupa-orange rounded-full mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-lupa-graphite mb-2">+20 anos</h3>
                <p className="text-lupa-gray-dark italic font-serif font-bold">de atuação em pesquisa</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-50 text-lupa-orange rounded-full mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-lupa-graphite mb-2">+60</h3>
                <p className="text-lupa-gray-dark italic font-serif font-bold">pesquisas eleitorais realizadas</p>
              </div>
              <div className="flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-50 text-lupa-orange rounded-full mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-lupa-graphite mb-2">+60</h3>
                <p className="text-lupa-gray-dark italic font-serif font-bold">pesquisas empresariais</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção 2 — O Fundador */}
      <section className="py-24 bg-[#f5f5f5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-[3/4] bg-white rounded-lg overflow-hidden relative shadow-xl flex items-center justify-center p-8"
            >
              <img 
                src="/attached_assets/logo_lupa.jpeg" 
                alt="Lupa Pesquisas e Projetos Logo" 
                className="w-full h-auto object-contain"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = "https://placehold.co/400x600?text=Lupa+Logo";
                }}
              />
              <div className="absolute inset-0 border-4 border-lupa-orange/10 rounded-lg m-4 pointer-events-none"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-lupa-orange text-sm font-bold tracking-widest uppercase mb-4 block">Fundador</span>
              <h2 className="text-4xl font-serif font-bold text-lupa-graphite mb-2">Leandro Araújo</h2>
              <p className="text-lg text-lupa-gray-dark italic font-serif mb-8">Psicólogo · Pesquisador · Estrategista</p>
              
              <div className="space-y-6 text-lupa-graphite leading-relaxed">
                <p>
                  Formado em Psicologia pela UFMG (2002), Leandro iniciou sua trajetória em diagnósticos comunitários para grandes projetos de infraestrutura, com financiamento do Banco Mundial.
                </p>
                <p>
                  Em 2010, ingressa no universo das pesquisas de opinião pública. Em um diagnóstico para a Secretaria de Turismo de Alagoas, uma cliente disse que lema permitia <strong>"enxergar o território com uma lupa"</strong>. Assim nasce o nome da empresa.
                </p>
              </div>

              <div className="mt-12">
                <Link href="/">
                  <a className="inline-flex items-center gap-2 text-lupa-orange font-bold hover:text-orange-600 transition-colors group">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Voltar para a página inicial
                  </a>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
