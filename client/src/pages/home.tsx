import presentationPage8 from "@assets/Apresentação_LUPA-1-12-8_page-0001_1772589644352.jpg";
import presentationPage9 from "@assets/Apresentação_LUPA-1-12-9_page-0001_1772589698087.jpg";
import maxqdaImage from "@assets/targeted_element_1772589701320.png";
import legendImage from "@assets/targeted_element_1772589995688.png";
import metodologiaGeoVoto from "@assets/Apresentação_LUPA-1-12-8_page-0001_1772590317827.jpg";
import { motion, Variants } from "framer-motion";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Users, Building2, Leaf, Target, Brain, MapPin, Map, LineChart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

const formSchema = z.object({
  empresa: z.string().min(2, "Nome é obrigatório"),
  responsavel: z.string().min(2, "Responsável é obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  area: z.string().min(1, "Selecione uma área"),
  demanda: z.string().min(10, "Descreva sua demanda brevemente"),
});

export default function Home() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresa: "",
      responsavel: "",
      telefone: "",
      email: "",
      area: "",
      demanda: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar");
      }

      toast({
        title: "Sucesso!",
        description: "Solicitação enviada com sucesso! Entraremos em contato em breve.",
        duration: 5000,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um problema ao enviar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scrollToForm = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  // Maps and Charts initialization
  const mapaEleitoralRef = useRef<HTMLDivElement>(null);
  const mapaAmbientalRef = useRef<HTMLDivElement>(null);
  const chartEleitoralRef = useRef<HTMLCanvasElement>(null);
  const chartEmpresarialRef = useRef<HTMLCanvasElement>(null);
  const chartAmbientalRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if scripts are loaded
    if (typeof window === 'undefined' || !(window as any).L || !(window as any).Chart) return;
    
    const L = (window as any).L;
    const Chart = (window as any).Chart;

    // --- BLOCO 1: ELEITORAL ---
    if (mapaEleitoralRef.current && !mapaEleitoralRef.current.hasChildNodes()) {
      const mapaEleitoral = L.map(mapaEleitoralRef.current, {
        center: [-14.2350, -51.9253],
        zoom: 4,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 6
      }).addTo(mapaEleitoral);

      const estadosAtuacao = [
        { nome: "Ceará", lat: -5.4984, lng: -39.3206 },
        { nome: "Bahia", lat: -12.5797, lng: -41.7007 },
        { nome: "Sergipe", lat: -10.5741, lng: -37.3857 },
        { nome: "Minas Gerais", lat: -18.5122, lng: -44.5550 },
        { nome: "Goiás", lat: -15.8270, lng: -49.8362 },
        { nome: "Amapá", lat: -1.4102, lng: -51.7700 },
        { nome: "Acre", lat: -9.0238, lng: -70.8120 },
        { nome: "Alagoas", lat: -9.5713, lng: -36.7819 }
      ];

      estadosAtuacao.forEach((estado: any) => {
        L.circleMarker([estado.lat, estado.lng], {
          radius: 14,
          fillColor: '#faa749',
          color: '#e08830',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85
        }).addTo(mapaEleitoral)
          .bindTooltip(`<strong>${estado.nome}</strong>`, {
            permanent: false,
            direction: 'top',
            className: 'lupa-tooltip'
          });
      });
    }

    if (chartEleitoralRef.current) {
      // Destroy existing chart if it exists
      const existingChart = Chart.getChart(chartEleitoralRef.current);
      if (existingChart) existingChart.destroy();

      new Chart(chartEleitoralRef.current, {
        type: 'bar',
        data: {
          labels: ['Candidato A', 'Candidato B', 'Candidato C', 'Indecisos'],
          datasets: [{
            label: 'Intenção de voto (%)',
            data: [42, 31, 18, 9],
            backgroundColor: ['#faa749', '#58595b', '#55c5d0', '#cccccc'],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any) => ` ${ctx.raw}%`
              }
            }
          },
          scales: {
            x: {
              max: 100,
              grid: { color: '#f0f0f0' },
              ticks: {
                callback: (val: any) => val + '%',
                font: { family: "'Source Sans 3', sans-serif", size: 12 }
              }
            },
            y: {
              grid: { display: false },
              ticks: {
                font: { family: "'Source Sans 3', sans-serif", size: 13 }
              }
            }
          }
        }
      });
    }

    // --- BLOCO 2: EMPRESARIAL ---
    if (chartEmpresarialRef.current) {
      const existingChart = Chart.getChart(chartEmpresarialRef.current);
      if (existingChart) existingChart.destroy();

      new Chart(chartEmpresarialRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Mar', 'Mai', 'Jul', 'Set', 'Nov'],
          datasets: [
            {
              label: 'Com diagnóstico estratégico',
              data: [30, 42, 58, 70, 82, 91],
              borderColor: '#faa749',
              backgroundColor: 'rgba(250,167,73,0.15)',
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#faa749',
              pointRadius: 5
            },
            {
              label: 'Sem diagnóstico',
              data: [30, 32, 29, 34, 31, 33],
              borderColor: '#cccccc',
              backgroundColor: 'rgba(204,204,204,0.08)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#cccccc',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#ffffff',
                font: { family: "'Source Sans 3', sans-serif", size: 12 },
                usePointStyle: true,
                pointStyleWidth: 10
              }
            },
            title: {
              display: true,
              text: 'ÍNDICE DE PERFORMANCE — COM VS. SEM PESQUISA ESTRATÉGICA',
              color: '#ffffff',
              font: { family: "'Source Sans 3', sans-serif", size: 12, weight: '600' },
              padding: { bottom: 20 }
            },
            tooltip: {
              callbacks: {
                label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.raw} pts`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#ffffff', font: { family: "'Source Sans 3', sans-serif" } }
            },
            y: {
              min: 0,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#ffffff', font: { family: "'Source Sans 3', sans-serif" } }
            }
          }
        }
      });
    }

    // --- BLOCO 3: AMBIENTAL ---
    if (mapaAmbientalRef.current && !mapaAmbientalRef.current.hasChildNodes()) {
      const mapaAmbiental = L.map(mapaAmbientalRef.current, {
        center: [-14.2350, -51.9253],
        zoom: 4,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 6
      }).addTo(mapaAmbiental);

      const estadosAmbientais = [
        { nome: "Ceará", bioma: "Caatinga", lat: -5.4984, lng: -39.3206, cor: "#d4a017" },
        { nome: "Bahia", bioma: "Mata Atlântica / Caatinga", lat: -12.5797, lng: -41.7007, cor: "#52b788" },
        { nome: "Alagoas", bioma: "Mata Atlântica", lat: -9.5713, lng: -36.7819, cor: "#52b788" },
        { nome: "Sergipe", bioma: "Mata Atlântica", lat: -10.5741, lng: -37.3857, cor: "#52b788" },
        { nome: "Minas Gerais", bioma: "Cerrado / Mata Atlântica", lat: -18.5122, lng: -44.5550, cor: "#8fb339" },
        { nome: "Goiás", bioma: "Cerrado", lat: -15.8270, lng: -49.8362, cor: "#8fb339" },
        { nome: "Amapá", bioma: "Amazônia", lat: -1.4102, lng: -51.7700, cor: "#2d6a4f" },
        { nome: "Acre", bioma: "Amazônia", lat: -9.0238, lng: -70.8120, cor: "#2d6a4f" }
      ];

      estadosAmbientais.forEach((estado: any) => {
        L.circleMarker([estado.lat, estado.lng], {
          radius: 14,
          fillColor: estado.cor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(mapaAmbiental)
          .bindTooltip(`<strong>${estado.nome}</strong><br><small>${estado.bioma}</small>`, {
            permanent: false,
            direction: 'top',
            className: 'lupa-tooltip'
          });
      });
    }

    if (chartAmbientalRef.current) {
      const existingChart = Chart.getChart(chartAmbientalRef.current);
      if (existingChart) existingChart.destroy();

      new Chart(chartAmbientalRef.current, {
        type: 'bar',
        data: {
          labels: ['Diagnóstico\nTerritorial', 'Impacto\nSocioambiental', 'Licenciamento\nAmbiental', 'Monitoramento\nde Fauna'],
          datasets: [{
            label: 'Projetos realizados',
            data: [38, 29, 21, 14],
            backgroundColor: ['#2d6a4f', '#52b788', '#8fb339', '#d4a017'],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any) => ` ${ctx.raw} projetos`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { family: "'Source Sans 3', sans-serif", size: 11 },
                color: '#2c2c2c'
              }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.08)' },
              ticks: {
                font: { family: "'Source Sans 3', sans-serif", size: 12 },
                color: '#2c2c2c'
              }
            }
          }
        }
      });
    }

  }, []);

  return (
    <div className="w-full">
      {/* BLOCO 1 — HERO */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-lupa-graphite leading-[1.1] mb-6">
                Clareza estratégica começa com leitura de cenário.
              </h1>
              <p className="text-xl text-lupa-gray-dark mb-10 leading-relaxed">
                Pesquisas qualitativas, quantitativas e análise com geoprocessamento para decisões precisas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={scrollToForm}
                  className="bg-lupa-orange hover:bg-orange-500 text-white text-lg h-14 px-8 rounded-none border-0"
                  data-testid="button-hero-orcamento"
                >
                  Solicitar Orçamento
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-lupa-orange text-lupa-orange hover:bg-orange-50 text-lg h-14 px-8 rounded-none"
                  data-testid="button-hero-sobre"
                >
                  <Link href="/sobre">Conheça a Lupa</Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center mt-12 lg:mt-0"
            >
              {/* Ilustração Premium da Lupa */}
              <div className="w-full max-w-lg aspect-square relative flex items-center justify-center">
                {/* Background radial glow */}
                <div className="absolute inset-0 bg-radial-glow from-orange-100/40 to-transparent rounded-full blur-3xl scale-150 opacity-60 animate-glow-breathe"></div>
                
                <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 filter drop-shadow-2xl">
                  <defs>
                    <linearGradient id="lupaLensGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#faa749" />
                      <stop offset="100%" stopColor="#e08830" />
                    </linearGradient>
                    
                    <radialGradient id="illustrationBgGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#faa749" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#faa749" stopOpacity="0" />
                    </radialGradient>

                    <filter id="premiumShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="12" stdDeviation="15" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* Outer rotating circle */}
                  <circle cx="200" cy="200" r="185" stroke="#f0f0f0" strokeWidth="1" className="animate-rotate-slow" />
                  <circle cx="200" cy="200" r="180" stroke="#f5f5f5" strokeWidth="2" />
                  
                  {/* Pulsing radar circle */}
                  <circle cx="200" cy="200" r="120" stroke="#55c5d0" strokeWidth="1.5" strokeDasharray="6 6" className="animate-radar opacity-70" />
                  
                  {/* Breating glow circle */}
                  <circle cx="230" cy="170" r="100" fill="url(#illustrationBgGlow)" className="animate-glow-breathe" />
                  
                  {/* The Pointer Line */}
                  <path d="M150 250 L280 120" stroke="#2c2c2c" strokeWidth="1.5" className="animate-soft-fade opacity-40" />
                  
                  {/* Abstract curves */}
                  <path d="M100 200 Q 150 100 250 150 T 300 250" stroke="#55c5d0" strokeWidth="2" fill="none" className="opacity-30" />
                  
                  {/* Floating Magnifying Glass Group */}
                  <g className="animate-float" style={{ filter: 'url(#premiumShadow)' }}>
                    {/* Dots */}
                    <circle cx="280" cy="120" r="5" fill="#faa749" />
                    <circle cx="150" cy="250" r="5" fill="#2c2c2c" />
                    
                    {/* The Lupa Handle */}
                    <path d="M255 255 L320 320" stroke="#faa749" strokeWidth="6" strokeLinecap="round" />
                    <path d="M255 255 L320 320" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.3" transform="translate(-1, -1)" />
                    
                    {/* The Lupa Lens */}
                    <circle cx="210" cy="210" r="65" stroke="#faa749" strokeWidth="4" fill="url(#lupaLensGradient)" fillOpacity="0.95" />
                    <circle cx="210" cy="210" r="55" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.2" />
                  </g>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BLOCO 2 — NÚMEROS E CREDENCIAIS */}
      <section className="bg-white border-t border-lupa-orange py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TOP ROW: 2 blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {[
              { icon: Calendar, num: "+20 anos", desc: "de atuação em pesquisa" },
              { icon: Users, num: "+60", desc: "pesquisas eleitorais realizadas" },
            ].map((stat, i) => (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                key={i} 
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-orange-50 text-lupa-orange rounded-full mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-lupa-graphite mb-2">{stat.num}</h3>
                <p className="text-lupa-gray-dark">{stat.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* BOTTOM ROW: 3 blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Building2, num: "+60", desc: "pesquisas empresariais" },
              { icon: Leaf, num: "+40", desc: "projetos de análise e desenvolvimento socioambiental" },
              { icon: Users, num: "+8", desc: "Coordenação de pesquisa em campanhas eleitorais, estaduais e municipais." }
            ].map((stat, i) => (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: (i + 2) * 0.1 } }
                }}
                key={i} 
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-orange-50 text-lupa-orange rounded-full mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-lupa-graphite mb-2">{stat.num}</h3>
                <p className="text-lupa-gray-dark">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center text-sm font-semibold tracking-wide text-lupa-gray-dark border-t border-gray-100 pt-8 mb-6">
            CEARÁ · BAHIA · SERGIPE · MINAS GERAIS · GOIÁS · AMAPÁ · ACRE · ALAGOAS
          </div>
          <div className="text-center mt-4">
            <span className="text-lupa-orange text-xl md:text-2xl font-bold tracking-[0.25em] uppercase">
              Atuação em todo território nacional
            </span>
          </div>
        </div>
      </section>

      {/* BLOCO 3 — PESQUISA ELEITORAL */}
      <section id="eleitoral" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 max-w-3xl"
          >
            <span className="text-lupa-orange text-sm font-bold tracking-widest uppercase mb-4 block">Pesquisa Eleitoral</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-lupa-graphite">Decida sua estratégia com base em realidade, não em suposição.</h2>
            <p className="text-lg text-lupa-gray-dark">
              Candidatos e gestores públicos que usam somente a intuição e conselhos de terceiros tomam decisões estratégicas frágeis. A Lupa entrega diagnóstico do cenário eleitoral — o que pensam os eleitores e quais são os temais mais importantes, quantifica e qualifica o público através das pesquisas de opinião e mapeia o potencial eleitoral no território.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Pesquisa Qualitativa", desc: "Grupos focais e entrevistas em profundidade. Entendemos motivações, discursos e percepções reais do eleitorado.", icon: Users },
              { title: "Pesquisa Quantitativa", desc: "Questionários estruturados com amostras representativas. Tendências, intenção de voto e projeções estatísticas precisas.", icon: LineChart },
              { title: "Geoprocessamento Eleitoral", desc: "Mapeamento territorial do eleitorado. Identificamos padrões regionais e variações por zona para estratégia de campo.", icon: Map }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                className="bg-white border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <card.icon className="w-8 h-8 text-lupa-orange mb-6" />
                <h3 className="text-xl font-serif font-bold text-lupa-graphite mb-4">{card.title}</h3>
                <p className="text-lupa-gray-dark">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="border-l-4 border-lupa-orange pl-6 py-2 mb-10 bg-orange-50/50">
            <p className="italic text-lg text-lupa-graphite font-serif font-bold">
              "Nossa equipe inicia o trabalho muito antes da coleta de dados em campo. Chegamos com antecedência para entender como os extratos sociais se organizam localmente. Nossos recrutamentos para os grupos focais e a coleta de dados nas pesquisas quantitativas são minuciosos e enxergam cada campo como particular, não apenas como cotas padronizadas."
            </p>
          </div>

          {/* BLOCO: PESQUISA QUALITATIVA GOIÁS 2018 */}
          <div className="bg-white border border-gray-200 p-8 md:p-12 mb-12 rounded-xl shadow-sm overflow-hidden">
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-3xl font-serif font-bold text-lupa-graphite mb-2">Pesquisa Qualitativa — Intenção de Voto | Goiás 2018</h3>
              <p className="text-lg text-lupa-gray-dark">Diagnóstico baseado em entrevistas em profundidade e grupos focais codificados (Goiânia).</p>
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <img
                src={maxqdaImage}
                alt="Interface de pesquisa qualitativa MAXQDA"
                className="w-full max-w-4xl rounded-lg shadow-md border border-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/800x400?text=Interface+MAXQDA";
                }}
              />
              <img
                src={metodologiaGeoVoto}
                alt="Metodologia Geografia do Voto"
                className="w-full max-w-4xl rounded-lg shadow-md border border-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/800x400?text=Metodologia+Geografia+do+Voto";
                }}
              />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-sm text-lupa-gray-dark leading-relaxed italic text-center md:text-left">
                * Acima, registro da interface de codificação de áudios (MAXQDA) utilizada para análise de sentimento e extração de insights em grupos focais.
              </p>
            </div>
          </div>

          <Button 
            onClick={scrollToForm}
            className="bg-lupa-orange hover:bg-orange-500 text-white text-lg h-14 px-8 rounded-none border-0"
            data-testid="button-cta-eleitoral"
          >
            Quero minha pesquisa eleitoral
          </Button>
        </div>
      </section>

      {/* BLOCO 4 — PESQUISA EMPRESARIAL */}
      <section id="empresarial" className="py-24 bg-[#58595b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 max-w-3xl"
          >
            <span className="text-lupa-orange text-sm font-bold tracking-widest uppercase mb-4 block">Pesquisa Empresarial</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Seu mercado tem respostas. A Lupa ajuda você a encontrá-las.</h2>
            <p className="text-lg text-gray-300">
              Empresários que atuam sem dados do seu público tomam decisões baseadas em intuição. Pesquisas de satisfação, comportamento do consumidor e viabilidade de mercado transformam incerteza em direção estratégica.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Satisfação de Clientes", desc: "Entenda como seu público percebe sua marca, produto e atendimento. Dados que orientam melhorias e fidelização." },
              { title: "Comportamento do Consumidor", desc: "Mapeamos hábitos, preferências e decisões de compra do seu público para posicionamento assertivo." },
              { title: "Viabilidade de Mercado", desc: "Antes de investir, entenda o cenário. Pesquisas para validação de novos negócios, expansões e lançamentos." }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                className="bg-[#6d6e70] border border-gray-500/30 p-8 hover:bg-[#7a7b7d] transition-colors duration-300"
              >
                <h3 className="text-xl font-serif font-bold text-white mb-4">{card.title}</h3>
                <p className="text-gray-200">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-10 text-sm tracking-wide text-gray-300 font-medium">
            IMOBILIÁRIO · VAREJO · SERVIÇOS · GESTÃO PÚBLICA · SAÚDE
          </div>

          <Button 
            onClick={scrollToForm}
            className="bg-lupa-orange hover:bg-orange-500 text-white text-lg h-14 px-8 rounded-none border-0"
            data-testid="button-cta-empresarial"
          >
            Quero minha pesquisa empresarial
          </Button>
        </div>
      </section>

      {/* BLOCO 5 — PESQUISA E PROJETOS AMBIENTAIS */}
      <section id="ambiental" className="py-24 bg-[#55c5d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 max-w-3xl"
          >
            <span className="text-lupa-graphite text-sm font-bold tracking-widest uppercase mb-4 block">Pesquisa e Projetos Ambientais</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-lupa-graphite">Diagnóstico ambiental com método. Dados que sustentam decisões responsáveis.</h2>
            <p className="text-lg text-lupa-graphite/80 font-medium">
              Empreendimentos que precisam de licenciamento ambiental e urbanístico exigem diagnósticos técnicos criteriosos. A Lupa realiza estudos de viabilidade territorial, impacto ambiental e análise socioambiental com rigor metodológico e leitura territorial real.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Diagnóstico de Viabilidade", desc: "Estudos de viabilidade ambiental e urbanística para licenciamento de empreendimentos privados e públicos." },
              { title: "Impacto Socioambiental", desc: "Avaliação de impactos ambientais e sociais com imersão territorial e metodologia rigorosa." },
              { title: "Monitoramento e Projetos", desc: "Pesquisas de campo, coleta de dados ambientais e acompanhamento de projetos de conservação e preservação." }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                className="bg-white/90 backdrop-blur p-8 hover:bg-white transition-colors duration-300"
              >
                <h3 className="text-xl font-serif font-bold text-lupa-graphite mb-4">{card.title}</h3>
                <p className="text-lupa-gray-dark">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <Button 
            onClick={scrollToForm}
            className="bg-lupa-graphite hover:bg-gray-800 text-white text-lg h-14 px-8 rounded-none border-0"
            data-testid="button-cta-ambiental"
          >
            Quero meu projeto ambiental
          </Button>
        </div>
      </section>

      {/* BLOCO 6 — DIFERENCIAIS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-lupa-orange text-sm font-bold tracking-widest uppercase mb-4 block">Por que a Lupa</span>
            <h2 className="text-4xl md:text-5xl font-bold text-lupa-graphite">Não entregamos dados. Entregamos direção.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: Target, title: "Metodologia sob medida", desc: "Cada projeto nasce da escuta do cliente. Nenhum modelo replicado." },
              { icon: Brain, title: "Psicologia aplicada", desc: "Formação em psicologia amplia a leitura de comportamento coletivo e dinâmica de grupo." },
              { icon: MapPin, title: "Recrutamento territorial", desc: "A equipe vai ao campo antes de aplicar qualquer instrumento. Leitura real do território." },
              { icon: Map, title: "Geoprocessamento", desc: "Cruzamos dados qualitativos e quantitativos com mapeamento territorial para precisão máxima." },
              { icon: LineChart, title: "Interpretação estratégica", desc: "Não apenas o que os dados dizem. O que deve ser feito a partir deles." },
              { icon: ShieldCheck, title: "Independência técnica", desc: "Diagnóstico isento, sem conflito de interesses. A realidade, mesmo quando desconfortável." }
            ].map((diff, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.05 } }
                }}
                className="flex gap-4"
              >
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                    <diff.icon className="w-5 h-5 text-lupa-orange" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-lupa-graphite mb-2">{diff.title}</h3>
                  <p className="text-lupa-gray-dark">{diff.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCO 7 — FORMULÁRIO */}
      <section id="contato" className="py-24 bg-lupa-orange relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Fale com a Lupa.</h2>
            <p className="text-xl text-orange-50">Preencha o formulário e entraremos em contato para entender sua demanda.</p>
          </div>

          <div className="bg-white p-8 md:p-10 shadow-xl border-t-4 border-t-lupa-graphite">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lupa-graphite font-bold">Nome da empresa ou candidato</FormLabel>
                        <FormControl>
                          <Input placeholder="Sua empresa ou nome" className="rounded-none border-gray-300 focus-visible:ring-lupa-orange" {...field} data-testid="input-empresa" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="responsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lupa-graphite font-bold">Nome do responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" className="rounded-none border-gray-300 focus-visible:ring-lupa-orange" {...field} data-testid="input-responsavel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lupa-graphite font-bold">Telefone com WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" className="rounded-none border-gray-300 focus-visible:ring-lupa-orange" {...field} data-testid="input-telefone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lupa-graphite font-bold">E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" className="rounded-none border-gray-300 focus-visible:ring-lupa-orange" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lupa-graphite font-bold">Área de interesse</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none border-gray-300 focus:ring-lupa-orange" data-testid="select-area">
                            <SelectValue placeholder="Selecione uma área" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="eleitoral">Pesquisa Eleitoral</SelectItem>
                          <SelectItem value="empresarial">Pesquisa Empresarial</SelectItem>
                          <SelectItem value="ambiental">Pesquisa e Projetos Ambientais</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="demanda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lupa-graphite font-bold">Descreva brevemente sua demanda</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Conte um pouco sobre o que você precisa pesquisar..." 
                          className="min-h-[120px] rounded-none border-gray-300 focus-visible:ring-lupa-orange resize-none" 
                          {...field} 
                          data-testid="textarea-demanda"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-lupa-graphite hover:bg-gray-800 text-white text-lg h-14 rounded-none border-0" data-testid="button-submit">
                  Enviar solicitação
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}