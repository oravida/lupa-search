import presentationPage8 from "@assets/Apresentação_LUPA-1-12-8_page-0001_1772589644352.jpg";
import presentationPage9 from "@assets/Apresentação_LUPA-1-12-9_page-0001_1772589698087.jpg";
import maxqdaImage from "@assets/targeted_element_1772589701320.png";
import legendImage from "@assets/targeted_element_1772589995688.png";
import metodologiaGeoVoto from "@assets/Apresentação_LUPA-1-12-8_page-0001_1772590317827.jpg";
import metodologiaTseFontes from "@assets/Apresentação_LUPA-1-12-9_page-0001_1772591214559.jpg";
import geoVotoUpdated from "@assets/targeted_element_1772591333463.png";
import { motion, Variants } from "framer-motion";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Users, Building2, Leaf, Target, Brain, MapPin, Map, LineChart, ShieldCheck, ThumbsUp, ShoppingCart, TrendingUp, ClipboardList, TreePine, Activity } from "lucide-react";
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
      if (!response.ok) throw new Error("Falha ao enviar");
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const scrollToForm = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  const mapaEleitoralRef = useRef<HTMLDivElement>(null);
  const mapaAmbientalRef = useRef<HTMLDivElement>(null);
  const chartEleitoralRef = useRef<HTMLCanvasElement>(null);
  const chartEmpresarialRef = useRef<HTMLCanvasElement>(null);
  const chartAmbientalRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).L || !(window as any).Chart) return;
    const L = (window as any).L;
    const Chart = (window as any).Chart;

    if (mapaEleitoralRef.current && !mapaEleitoralRef.current.hasChildNodes()) {
      const mapaEleitoral = L.map(mapaEleitoralRef.current, {
        center: [-14.235, -51.9253],
        zoom: 4,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        attributionControl: false,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 6 }).addTo(mapaEleitoral);
      const estadosAtuacao = [
        { nome: "Ceará", lat: -5.4984, lng: -39.3206 },
        { nome: "Bahia", lat: -12.5797, lng: -41.7007 },
        { nome: "Sergipe", lat: -10.5741, lng: -37.3857 },
        { nome: "Minas Gerais", lat: -18.5122, lng: -44.555 },
        { nome: "Goiás", lat: -15.827, lng: -49.8362 },
        { nome: "Amapá", lat: -1.4102, lng: -51.77 },
        { nome: "Acre", lat: -9.0238, lng: -70.812 },
        { nome: "Alagoas", lat: -9.5713, lng: -36.7819 },
      ];
      estadosAtuacao.forEach((estado: any) => {
        L.circleMarker([estado.lat, estado.lng], { radius: 14, fillColor: "#faa749", color: "#e08830", weight: 2, opacity: 1, fillOpacity: 0.85 })
          .addTo(mapaEleitoral)
          .bindTooltip(`<strong>${estado.nome}</strong>`, { permanent: false, direction: "top", className: "lupa-tooltip" });
      });
    }

    if (chartEleitoralRef.current) {
      const existingChart = Chart.getChart(chartEleitoralRef.current);
      if (existingChart) existingChart.destroy();
      new Chart(chartEleitoralRef.current, {
        type: "bar",
        data: {
          labels: ["Candidato A", "Candidato B", "Candidato C", "Indecisos"],
          datasets: [{ label: "Intenção de voto (%)", data: [42, 31, 18, 9], backgroundColor: ["#faa749", "#58595b", "#55c5d0", "#cccccc"], borderRadius: 6, borderSkipped: false }],
        },
        options: {
          indexAxis: "y", responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.raw}%` } } },
          scales: {
            x: { max: 100, grid: { color: "#f0f0f0" }, ticks: { callback: (val: any) => val + "%", font: { family: "'Source Sans 3', sans-serif", size: 12 } } },
            y: { grid: { display: false }, ticks: { font: { family: "'Source Sans 3', sans-serif", size: 13 } } },
          },
        },
      });
    }

    if (chartEmpresarialRef.current) {
      const existingChart = Chart.getChart(chartEmpresarialRef.current);
      if (existingChart) existingChart.destroy();
      new Chart(chartEmpresarialRef.current, {
        type: "line",
        data: {
          labels: ["Jan", "Mar", "Mai", "Jul", "Set", "Nov"],
          datasets: [
            { label: "Com diagnóstico estratégico", data: [30, 42, 58, 70, 82, 91], borderColor: "#faa749", backgroundColor: "rgba(250,167,73,0.15)", borderWidth: 3, tension: 0.4, fill: true, pointBackgroundColor: "#faa749", pointRadius: 5 },
            { label: "Sem diagnóstico", data: [30, 32, 29, 34, 31, 33], borderColor: "#cccccc", backgroundColor: "rgba(204,204,204,0.08)", borderWidth: 2, tension: 0.4, fill: true, pointBackgroundColor: "#cccccc", pointRadius: 4 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { color: "#ffffff", font: { family: "'Source Sans 3', sans-serif", size: 12 }, usePointStyle: true, pointStyleWidth: 10 } },
            title: { display: true, text: "ÍNDICE DE PERFORMANCE — COM VS. SEM PESQUISA ESTRATÉGICA", color: "#ffffff", font: { family: "'Source Sans 3', sans-serif", size: 12, weight: "600" }, padding: { bottom: 20 } },
            tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.raw} pts` } },
          },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#ffffff", font: { family: "'Source Sans 3', sans-serif" } } },
            y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#ffffff", font: { family: "'Source Sans 3', sans-serif" } } },
          },
        },
      });
    }

    if (mapaAmbientalRef.current && !mapaAmbientalRef.current.hasChildNodes()) {
      const mapaAmbiental = L.map(mapaAmbientalRef.current, { center: [-14.235, -51.9253], zoom: 4, zoomControl: false, scrollWheelZoom: false, dragging: false, attributionControl: false });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 6 }).addTo(mapaAmbiental);
      const estadosAmbientais = [
        { nome: "Ceará", bioma: "Caatinga", lat: -5.4984, lng: -39.3206, cor: "#d4a017" },
        { nome: "Bahia", bioma: "Mata Atlântica / Caatinga", lat: -12.5797, lng: -41.7007, cor: "#52b788" },
        { nome: "Alagoas", bioma: "Mata Atlântica", lat: -9.5713, lng: -36.7819, cor: "#52b788" },
        { nome: "Sergipe", bioma: "Mata Atlântica", lat: -10.5741, lng: -37.3857, cor: "#52b788" },
        { nome: "Minas Gerais", bioma: "Cerrado / Mata Atlântica", lat: -18.5122, lng: -44.555, cor: "#8fb339" },
        { nome: "Goiás", bioma: "Cerrado", lat: -15.827, lng: -49.8362, cor: "#8fb339" },
        { nome: "Amapá", bioma: "Amazônia", lat: -1.4102, lng: -51.77, cor: "#2d6a4f" },
        { nome: "Acre", bioma: "Amazônia", lat: -9.0238, lng: -70.812, cor: "#2d6a4f" },
      ];
      estadosAmbientais.forEach((estado: any) => {
        L.circleMarker([estado.lat, estado.lng], { radius: 14, fillColor: estado.cor, color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 0.9 })
          .addTo(mapaAmbiental)
          .bindTooltip(`<strong>${estado.nome}</strong><br><small>${estado.bioma}</small>`, { permanent: false, direction: "top", className: "lupa-tooltip" });
      });
    }

    if (chartAmbientalRef.current) {
      const existingChart = Chart.getChart(chartAmbientalRef.current);
      if (existingChart) existingChart.destroy();
      new Chart(chartAmbientalRef.current, {
        type: "bar",
        data: {
          labels: ["Diagnóstico\nTerritorial", "Impacto\nSocioambiental", "Licenciamento\nAmbiental", "Monitoramento\nde Fauna"],
          datasets: [{ label: "Projetos realizados", data: [38, 29, 21, 14], backgroundColor: ["#2d6a4f", "#52b788", "#8fb339", "#d4a017"], borderRadius: 6, borderSkipped: false }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.raw} projetos` } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: "'Source Sans 3', sans-serif", size: 11 }, color: "#2c2c2c" } },
            y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.08)" }, ticks: { font: { family: "'Source Sans 3', sans-serif", size: 12 }, color: "#2c2c2c" } },
          },
        },
      });
    }
  }, []);

  return (
    <div className="w-full">
      {/* BLOCO 1 — HERO */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-lupa-graphite leading-[1.1] mb-6">
                Clareza estratégica começa com leitura de cenário.
              </h1>
              <p className="text-xl text-lupa-gray-dark mb-10 leading-relaxed">
                Pesquisas qualitativas, quantitativas e análise com geoprocessamento para decisões precisas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={scrollToForm} className="bg-lupa-orange hover:bg-orange-500 text-white text-lg h-14 px-8 rounded-none border-0" data-testid="button-hero-orcamento">
                  Solicitar Orçamento
                </Button>
                <Button asChild variant="outline" className="border-lupa-orange text-lupa-orange hover:bg-orange-50 text-lg h-14 px-8 rounded-none" data-testid="button-hero-sobre">
                  <Link href="/sobre">Conheça a Lupa</Link>
                </Button>
              </div>
            </motion.div>

            {/* ─────────────────────────────────────────────────────────────
                ILUSTRAÇÃO DA LUPA — VERSÃO REFINADA
                Centro completamente transparente com efeito de vidro real,
                reflexo especular, borda laranja premium e cabo sólido.
            ───────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center mt-12 lg:mt-0"
            >
              <div className="w-full max-w-lg aspect-square relative flex items-center justify-center select-none">

                {/* Glow de fundo pulsante */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(250,167,73,0.18) 0%, transparent 70%)" }}
                />

                <svg
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full relative z-10"
                  style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.13))" }}
                >
                  <defs>
                    {/* ── Gradientes da moldura laranja ── */}
                    <linearGradient id="molduraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFB85C" />
                      <stop offset="50%" stopColor="#faa749" />
                      <stop offset="100%" stopColor="#d4791a" />
                    </linearGradient>

                    {/* ── Gradiente do cabo ── */}
                    <linearGradient id="caboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFB85C" />
                      <stop offset="100%" stopColor="#c06010" />
                    </linearGradient>

                    {/* ── Sombra suave do cabo ── */}
                    <linearGradient id="caboSombra" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
                    </linearGradient>

                    {/* ── Vidro: transparência azulada muito sutil ── */}
                    <radialGradient id="vidroGrad" cx="38%" cy="32%" r="60%">
                      <stop offset="0%"   stopColor="#EFF6FF" stopOpacity="0.10" />
                      <stop offset="40%"  stopColor="#DBEAFE" stopOpacity="0.07" />
                      <stop offset="80%"  stopColor="#93C5FD" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.04" />
                    </radialGradient>

                    {/* ── Reflexo especular principal (brilho branco no topo-esquerdo) ── */}
                    <radialGradient id="reflexoPrincipal" cx="28%" cy="25%" r="38%">
                      <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.55" />
                      <stop offset="45%"  stopColor="#FFFFFF" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </radialGradient>

                    {/* ── Sombra interna da borda (profundidade) ── */}
                    <radialGradient id="sombraInterna" cx="50%" cy="50%" r="50%">
                      <stop offset="70%"  stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
                    </radialGradient>

                    {/* ── Clip da lente ── */}
                    <clipPath id="lensClip">
                      <circle cx="200" cy="195" r="88" />
                    </clipPath>

                    {/* ── Grade de pontos do fundo (visível através da lente) ── */}
                    <pattern id="gridDots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                      <circle cx="7" cy="7" r="1.3" fill="#CBD5E1" opacity="0.6" />
                    </pattern>

                    {/* ── Linhas de dados abstratas ── */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* ── Círculos orbitais de fundo ── */}
                  <circle cx="200" cy="200" r="182" stroke="#F1F5F9" strokeWidth="1.5" />
                  <circle cx="200" cy="200" r="160" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 8" />

                  {/* ── Radar pulsante ── */}
                  <motion.circle
                    cx="200" cy="200" r="125"
                    stroke="#55c5d0" strokeWidth="1.5" strokeDasharray="5 7"
                    fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "200px 200px" }}
                  />

                  {/* ── Linhas de dados no fundo ── */}
                  <motion.path
                    d="M60 230 Q 130 160 200 195 T 340 170"
                    stroke="#55c5d0" strokeWidth="1.8" fill="none" opacity="0.35"
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                  <motion.path
                    d="M80 270 Q 160 200 230 215 T 350 200"
                    stroke="#faa749" strokeWidth="1.2" fill="none" opacity="0.2"
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  />

                  {/* ── Pontos flutuantes ── */}
                  {[
                    { cx: 95,  cy: 130, r: 4, color: "#faa749", delay: 0 },
                    { cx: 310, cy: 155, r: 3, color: "#55c5d0", delay: 0.8 },
                    { cx: 340, cy: 280, r: 5, color: "#faa749", delay: 1.6 },
                    { cx: 70,  cy: 290, r: 3.5, color: "#55c5d0", delay: 2.4 },
                  ].map((dot, i) => (
                    <motion.circle
                      key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.color}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
                      style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
                    />
                  ))}

                  {/* ════════════════════════════════════
                      GRUPO DA LUPA — animação float
                  ════════════════════════════════════ */}
                  <motion.g
                    animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "200px 220px" }}
                  >
                    {/* ── CABO — sólido, elegante ── */}
                    {/* Sombra do cabo */}
                    <line
                      x1="274" y1="272" x2="338" y2="336"
                      stroke="#00000022" strokeWidth="12" strokeLinecap="round"
                    />
                    {/* Corpo do cabo */}
                    <line
                      x1="272" y1="270" x2="336" y2="334"
                      stroke="url(#caboGrad)" strokeWidth="10" strokeLinecap="round"
                    />
                    {/* Brilho do cabo */}
                    <line
                      x1="270" y1="270" x2="334" y2="334"
                      stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.3"
                      transform="translate(-2,-2)"
                    />
                    {/* Junção cabo+moldura */}
                    <circle cx="271" cy="271" r="8" fill="url(#molduraGrad)" />

                    {/* ── MOLDURA LARANJA ── */}
                    {/* Sombra da moldura */}
                    <circle cx="202" cy="197" r="94" fill="none" stroke="#00000018" strokeWidth="10" />
                    {/* Anel externo highlight */}
                    <circle cx="200" cy="195" r="93" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.25" />
                    {/* Moldura principal */}
                    <circle cx="200" cy="195" r="91" fill="none" stroke="url(#molduraGrad)" strokeWidth="9" />
                    {/* Anel interno sutil */}
                    <circle cx="200" cy="195" r="87" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.15" />

                    {/* ── INTERIOR DA LENTE (transparente) ── */}
                    {/* Fundo com grade de pontos visível */}
                    <circle cx="200" cy="195" r="88" fill="url(#gridDots)" />

                    {/* Tint de vidro azulado suavíssimo */}
                    <circle cx="200" cy="195" r="88" fill="url(#vidroGrad)" />

                    {/* Sombra interna de borda */}
                    <circle cx="200" cy="195" r="88" fill="url(#sombraInterna)" />

                    {/* ── REFLEXOS DE VIDRO ── */}
                    {/* Reflexo principal — elipse grande no canto superior esquerdo */}
                    <ellipse
                      cx="172" cy="160" rx="34" ry="22"
                      fill="url(#reflexoPrincipal)"
                      transform="rotate(-30 172 160)"
                    />
                    {/* Ponto de brilho intenso */}
                    <ellipse
                      cx="166" cy="154" rx="11" ry="7"
                      fill="#FFFFFF" opacity="0.55"
                      transform="rotate(-30 166 154)"
                    />
                    {/* Reflexo secundário menor — canto direito inferior */}
                    <ellipse
                      cx="232" cy="230" rx="10" ry="5"
                      fill="#FFFFFF" opacity="0.12"
                      transform="rotate(-30 232 230)"
                    />

                    {/* ── MINI GRÁFICO DE BARRAS dentro da lente (decorativo) ── */}
                    <g clipPath="url(#lensClip)" opacity="0.25">
                      {[
                        { x: 148, h: 40, color: "#faa749" },
                        { x: 168, h: 62, color: "#faa749" },
                        { x: 188, h: 30, color: "#55c5d0" },
                        { x: 208, h: 55, color: "#faa749" },
                        { x: 228, h: 45, color: "#55c5d0" },
                        { x: 248, h: 68, color: "#faa749" },
                      ].map((bar, i) => (
                        <rect
                          key={i}
                          x={bar.x} y={230 - bar.h}
                          width="14" height={bar.h}
                          fill={bar.color}
                          rx="2"
                        />
                      ))}
                      <line x1="140" y1="230" x2="270" y2="230" stroke="#94A3B8" strokeWidth="1" />
                    </g>

                    {/* Linha de mira — cruz central */}
                    <line x1="200" y1="168" x2="200" y2="180" stroke="#faa749" strokeWidth="1.5" opacity="0.4" />
                    <line x1="200" y1="210" x2="200" y2="222" stroke="#faa749" strokeWidth="1.5" opacity="0.4" />
                    <line x1="173" y1="195" x2="185" y2="195" stroke="#faa749" strokeWidth="1.5" opacity="0.4" />
                    <line x1="215" y1="195" x2="227" y2="195" stroke="#faa749" strokeWidth="1.5" opacity="0.4" />

                  </motion.g>

                  {/* ── Ponto de destaque / alvo externo ── */}
                  <motion.circle
                    cx="112" cy="115" r="5" fill="#faa749"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "112px 115px" }}
                  />
                  <motion.circle
                    cx="112" cy="115" r="12"
                    stroke="#faa749" strokeWidth="1.5" fill="none"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "112px 115px" }}
                  />
                </svg>
              </div>
            </motion.div>
            {/* ─── FIM DA ILUSTRAÇÃO ─── */}

          </div>
        </div>
      </section>

      {/* BLOCO 2 — NÚMEROS E CREDENCIAIS */}
      <section className="bg-white border-t border-lupa-orange py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {[
              { icon: Calendar, num: "+20 anos", desc: "de atuação em pesquisa" },
              { icon: Users,    num: "+60",      desc: "pesquisas eleitorais realizadas" },
            ].map((stat, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Building2, num: "+60", desc: "pesquisas empresariais" },
              { icon: Leaf,      num: "+40", desc: "projetos de análise e desenvolvimento socioambiental" },
              { icon: Users,     num: "+8",  desc: "Coordenação de pesquisa em campanhas eleitorais, estaduais e municipais." },
            ].map((stat, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: (i + 2) * 0.1 } } }}
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

          <div className="text-center border-t border-gray-100 pt-8 mt-4">
            <span className="text-lupa-orange text-3xl md:text-4xl font-bold tracking-[0.25em] uppercase">
              Atuação em todo território nacional
            </span>
          </div>
        </div>
      </section>

      {/* BLOCO 3 — PESQUISA ELEITORAL */}
      <section id="eleitoral" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 max-w-3xl">
            <span className="text-lupa-orange text-sm font-bold tracking-widest uppercase mb-4 block">Pesquisa Eleitoral</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-lupa-graphite">Decida sua estratégia com base em realidade, não em suposição.</h2>
            <p className="text-lg text-lupa-gray-dark">
              Candidatos e gestores públicos que usam somente a intuição e conselhos de terceiros tomam decisões estratégicas frágeis. A Lupa entrega diagnóstico do cenário eleitoral — o que pensam os eleitores e quais são os temais mais importantes, quantifica e qualifica o público através das pesquisas de opinião e mapeia o potencial eleitoral no território.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Pesquisa Qualitativa",      desc: "Grupos focais e entrevistas em profundidade. Entendemos motivações, discursos e percepções reais do eleitorado.", icon: Users },
              { title: "Pesquisa Quantitativa",     desc: "Questionários estruturados com amostras representativas. Tendências, intenção de voto e projeções estatísticas precisas.", icon: LineChart },
              { title: "Geoprocessamento Eleitoral", desc: "Mapeamento territorial do eleitorado. Identificamos padrões regionais e variações por zona para estratégia de campo.", icon: Map },
            ].map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                className="bg-white border-2 border-gray-200 p-8 hover:border-lupa-orange hover:shadow-lg transition-all duration-300"
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

          <div className="mb-6">
            <h3 className="text-3xl font-serif font-bold text-lupa-graphite mb-2">Pesquisa Qualitativa — Análise de Conjuntura Política</h3>
            <p className="text-lg text-lupa-gray-dark">Análise qualitativa com codificação de entrevistas em profundidade e grupos focais.</p>
          </div>
          <div className="bg-white border border-gray-200 p-8 md:p-12 mb-12 rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col items-center gap-8">
              <img
                src="/attached_assets/WhatsApp_Image_2026-03-03_at_08.42.24_1772562819034.jpeg"
                alt="Pesquisa Qualitativa — Análise de Conjuntura Política"
                className="w-full max-w-4xl rounded-lg shadow-md border border-gray-100"
                onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = "https://placehold.co/800x400?text=Pesquisa+Qualitativa"; }}
              />
              <img
                src="/attached_assets/Imagem para substituir geografia do voto_page-0002.jpg"
                alt="Metodologia Geografia do Voto"
                className="w-full max-w-4xl rounded-lg shadow-md border border-gray-100"
                onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = "https://placehold.co/800x400?text=Geografia+do+Voto"; }}
              />
            </div>
          </div>

          <div className="flex justify-center w-full">
          <Button onClick={scrollToForm} className="bg-lupa-orange hover:bg-orange-500 text-white text-lg h-14 px-8 rounded-none border-0" data-testid="button-cta-eleitoral">
            Quero minha pesquisa eleitoral
          </Button>
          </div>
        </div>
      </section>

      {/* BLOCO 4 — PESQUISA EMPRESARIAL */}
      <section id="empresarial" className="py-24 bg-[#58595b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 max-w-3xl">
            <span className="text-lupa-orange text-sm font-bold tracking-widest uppercase mb-4 block">Pesquisa Empresarial</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Seu mercado tem respostas. A Lupa ajuda você a encontrá-las.</h2>
            <p className="text-lg text-gray-300">
              Empresários que atuam sem dados do seu público tomam decisões baseadas em intuição. Pesquisas de satisfação, comportamento do consumidor e viabilidade de mercado transformam incerteza em direção estratégica.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Satisfação de Clientes",      desc: "Entenda como seu público percebe sua marca, produto e atendimento. Dados que orientam melhorias e fidelização.", icon: ThumbsUp },
              { title: "Comportamento do Consumidor", desc: "Mapeamos hábitos, preferências e decisões de compra do seu público para posicionamento assertivo.", icon: ShoppingCart },
              { title: "Viabilidade de Mercado",      desc: "Antes de investir, entenda o cenário. Pesquisas para validação de novos negócios, expansões e lançamentos.", icon: TrendingUp },
            ].map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                className="bg-[#6d6e70] border border-gray-500/30 p-8 hover:bg-[#7a7b7d] transition-colors duration-300"
              >
                <card.icon className="w-8 h-8 text-lupa-orange mb-6" />
                <h3 className="text-xl font-serif font-bold text-white mb-4">{card.title}</h3>
                <p className="text-gray-200">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-10 text-sm tracking-wide text-gray-300 font-medium">
            IMOBILIÁRIO · VAREJO · SERVIÇOS · GESTÃO PÚBLICA · SAÚDE
          </div>
          <div className="flex justify-center w-full">
          <Button onClick={scrollToForm} className="bg-lupa-orange hover:bg-orange-500 text-white text-lg h-14 px-8 rounded-none border-0" data-testid="button-cta-empresarial">
            Quero minha pesquisa empresarial
          </Button>
          </div>
        </div>
      </section>

      {/* BLOCO 5 — PESQUISA E PROJETOS AMBIENTAIS */}
      <section id="ambiental" className="py-24 bg-[#55c5d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 max-w-3xl">
            <span className="text-lupa-graphite text-sm font-bold tracking-widest uppercase mb-4 block">Pesquisa e Projetos Ambientais</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-lupa-graphite">Diagnóstico ambiental com método. Dados que sustentam decisões responsáveis.</h2>
            <p className="text-lg text-lupa-graphite/80 font-medium">
              Empreendimentos que precisam de licenciamento ambiental e urbanístico exigem diagnósticos técnicos criteriosos. A Lupa realiza estudos de viabilidade territorial, impacto ambiental e análise socioambiental com rigor metodológico e leitura territorial real.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Diagnóstico de Viabilidade", desc: "Estudos de viabilidade ambiental e urbanística para licenciamento de empreendimentos privados e públicos.", icon: ClipboardList },
              { title: "Impacto Socioambiental",     desc: "Avaliação de impactos ambientais e sociais com imersão territorial e metodologia rigorosa.", icon: TreePine },
              { title: "Monitoramento e Projetos",   desc: "Pesquisas de campo, coleta de dados ambientais e acompanhamento de projetos de conservação e preservação.", icon: Activity },
            ].map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }}
                className="bg-white/90 backdrop-blur p-8 hover:bg-white transition-colors duration-300"
              >
                <card.icon className="w-8 h-8 text-lupa-graphite mb-6" />
                <h3 className="text-xl font-serif font-bold text-lupa-graphite mb-4">{card.title}</h3>
                <p className="text-lupa-gray-dark">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center w-full">
          <Button onClick={scrollToForm} className="bg-lupa-graphite hover:bg-gray-800 text-white text-lg h-14 px-8 rounded-none border-0" data-testid="button-cta-ambiental">
            Quero minha pesquisa ambiental
          </Button>
          </div>
        </div>
      </section>

      {/* BLOCO 6 — DIFERENCIAIS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-lupa-orange text-sm font-bold tracking-widest uppercase mb-4 block">Por que a Lupa</span>
            <h2 className="text-4xl md:text-5xl font-bold text-lupa-graphite">Não entregamos dados<br />Entregamos direção</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: Target,     title: "Metodologia sob medida",   desc: "Cada projeto nasce da escuta do cliente. Nenhum modelo replicado." },
              { icon: Brain,      title: "Psicologia aplicada",      desc: "Formação em psicologia amplia a leitura de comportamento coletivo e dinâmica de grupo." },
              { icon: MapPin,     title: "Recrutamento territorial",  desc: "A equipe vai ao campo antes de aplicar qualquer instrumento. Leitura real do território." },
              { icon: Map,        title: "Geoprocessamento",         desc: "Cruzamos dados qualitativos e quantitativos com mapeamento territorial para precisão máxima." },
              { icon: LineChart,  title: "Interpretação estratégica", desc: "Não apenas o que os dados dizem. O que deve ser feito a partir deles." },
              { icon: ShieldCheck,title: "Independência técnica",    desc: "Diagnóstico isento, sem conflito de interesses. A realidade, mesmo quando desconfortável." },
            ].map((diff, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.05 } } }}
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
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Fale com a Lupa.</h2>
            <p className="text-xl text-orange-50">Preencha o formulário e entraremos em contato para entender sua demanda.</p>
          </div>
          <div className="bg-white p-8 md:p-10 shadow-xl border-t-4 border-t-lupa-graphite">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lupa-graphite font-bold">Nome da empresa ou candidato</FormLabel>
                        <FormControl><Input placeholder="Sua empresa ou nome" className="rounded-none border-gray-300 focus-visible:ring-lupa-orange" {...field} data-testid="input-empresa" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="responsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lupa-graphite font-bold">Nome do responsável</FormLabel>
                        <FormControl><Input placeholder="Seu nome completo" className="rounded-none border-gray-300 focus-visible:ring-lupa-orange" {...field} data-testid="input-responsavel" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lupa-graphite font-bold">Telefone com WhatsApp</FormLabel>
                        <FormControl><Input placeholder="(00) 00000-0000" className="rounded-none border-gray-300 focus-visible:ring-lupa-orange" {...field} data-testid="input-telefone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lupa-graphite font-bold">E-mail</FormLabel>
                        <FormControl><Input type="email" placeholder="seu@email.com" className="rounded-none border-gray-300 focus-visible:ring-lupa-orange" {...field} data-testid="input-email" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField control={form.control} name="area"
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
                <FormField control={form.control} name="demanda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lupa-graphite font-bold">Descreva brevemente sua demanda</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Conte um pouco sobre o que você precisa pesquisar..." className="min-h-[120px] rounded-none border-gray-300 focus-visible:ring-lupa-orange resize-none" {...field} data-testid="textarea-demanda" />
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
