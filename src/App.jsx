import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Lock, Clock, AlertCircle, CheckCircle2, ArrowRight, BarChart3, Target, BookOpen, Layers } from 'lucide-react';

// --- UI Components ---

// ✅ 개선된 Tooltip 컴포넌트: 영문/한글 제목(title)과 상세 설명(children)을 분리하고 화면 최상단에 띄웁니다.
const Tooltip = ({ term, title, children }) => (
  <span className="group relative inline-block cursor-help border-b border-dashed border-blue-400/60 text-blue-300 hover:text-blue-400 transition-colors font-medium">
    {term}
    {/* 툴팁 말풍선 본체 */}
    <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-80 -translate-x-1/2 rounded-xl bg-gray-900 border border-gray-700 p-5 shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 z-[100] text-left">
      <strong className="block text-blue-400 font-bold mb-2 text-sm">{title || term}</strong>
      <span className="block text-gray-300 text-xs leading-relaxed font-normal whitespace-pre-wrap">{children}</span>

      {/* 툴팁 꼬리표 (아래쪽 화살표) */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-700"></span>
      <span className="absolute top-[calc(100%-1px)] left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-gray-900"></span>
    </span>
  </span>
);

const Badge = ({ type, text }) => {
  const styles = {
    paper: "bg-gray-800 text-gray-300 border border-gray-700",
    interpretation: "bg-blue-900/30 text-blue-400 border border-blue-800/50",
    appendix: "bg-yellow-900/30 text-yellow-500 border border-yellow-800/50"
  };
  const icons = { paper: "📄", interpretation: "💡", appendix: "📎" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${styles[type]}`}>
      <span>{icons[type]}</span> {text}
    </span>
  );
};

const Transition = ({ children }) => (
  <div className="min-h-[40vh] flex items-center justify-center px-6 py-20 bg-gradient-to-b from-black via-gray-900/20 to-black border-y border-gray-900/50">
    <p className="max-w-4xl text-center text-2xl md:text-4xl font-light leading-relaxed text-gray-400">
      {children}
    </p>
  </div>
);

// ✅ 이미지 팝업 모달 컴포넌트
const ImageModal = ({ src, title, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-400 hover:text-white text-3xl font-light leading-none transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>
        <img
          src={src}
          alt={title}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
        />
        {title && (
          <p className="mt-4 text-sm text-gray-400 text-center">{title}</p>
        )}
      </div>
    </div>
  );
};

// ✅ 이미지 경로(src)를 받아 화면에 보여주는 컴포넌트
const ImagePlaceholder = ({ title, desc, src, onClick }) => (
  <div
    className={`w-full aspect-[4/3] bg-gray-900/40 border border-gray-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden text-center hover:bg-gray-800 transition-colors group relative ${src && onClick ? 'cursor-zoom-in hover:border-blue-500/50' : ''}`}
    onClick={src && onClick ? onClick : undefined}
  >
    {src ? (
      <>
        <img src={src} alt={title} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
        {onClick && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-2xl">
            <span className="text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-full">🔍 클릭하여 크게 보기</span>
          </div>
        )}
      </>
    ) : (
      <div className="p-6 flex flex-col items-center">
        <BarChart3 className="w-12 h-12 text-gray-600 mb-4 group-hover:text-blue-500 transition-colors" />
        <h3 className="text-sm md:text-base font-medium text-gray-300 mb-2">{title}</h3>
        {desc && <p className="text-xs text-gray-500">{desc}</p>}
      </div>
    )}
  </div>
);

const Accordion = ({ title, children, badgeType, badgeText }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-2xl overflow-hidden bg-black">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-900/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
          {badgeType && <Badge type={badgeType} text={badgeText} />}
        </div>
        {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
      </button>
      {isOpen && <div className="p-6 border-t border-gray-800 bg-gray-900/20">{children}</div>}
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [sliderYear, setSliderYear] = useState(2010);
  const [modalImg, setModalImg] = useState(null);
  const openModal = useCallback((src, title) => setModalImg({ src, title }), []);
  const closeModal = useCallback(() => setModalImg(null), []);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">

      {/* Image Modal */}
      {modalImg && <ImageModal src={modalImg.src} title={modalImg.title} onClose={closeModal} />}

      {/* GNB */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-sm font-medium text-gray-400">
          <div className="text-white font-bold tracking-tight">CorpFin & Reality</div>
          <div className="hidden md:flex space-x-8">
            <a href="#intro" className="hover:text-white transition-colors">Intro</a>
            <a href="#ch3" className="hover:text-white transition-colors">Ch III. 계획</a>
            <a href="#ch5" className="hover:text-white transition-colors">Ch V. 환원</a>
            <a href="#ch6" className="hover:text-white transition-colors">Ch VI. 목표</a>
            <a href="#ch7" className="hover:text-white transition-colors">Ch VII. 결론</a>
          </div>
        </div>
      </nav>

      {/* Section 0. Hero */}
      <section id="intro" className="min-h-screen flex flex-col justify-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-60"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-blue-400 font-medium tracking-widest uppercase mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> John R. Graham (2022) 설문 연구 분석
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
            기업은 실제로 미래를 <br className="hidden md:block" />얼마나 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">정확히 예측</span>하는가?
          </h1>
          <div className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm max-w-3xl mt-12">
            <Badge type="interpretation" text="펀치라인" />
            <p className="mt-4 text-xl leading-relaxed text-gray-300 font-light">
              "이 논문은 현실의 기업재무가 완전한 '최적화'보다는 <strong className="text-white font-semibold">짧은 계획기간, 예측의 보정 실패, 보수적 정책, 경직적인 의사결정</strong>에 더 가깝다고 보여줍니다."
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Box */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 relative z-20 pb-20">
        <Accordion title="Methodology & Limitations (연구 방법론 및 한계)" badgeType="appendix" badgeText="Appendix Evidence">
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> <span><strong>Data:</strong> 주로 2019/2020 wave에 진행된 미국 중심의 CFO 설문(Survey) 기반.</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> <span><strong>Strength:</strong> 최종 재무 수치(Outcome) 이면의 실제 '의사결정 과정(Process)' 관찰 가능.</span></li>
            <li className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" /> <span><strong>Limitation:</strong> 자기보고형 자료(Self-reported data)로서 응답 편향, 대표성 한계, 사후 정당화(Ex-post justification) 가능성 존재.</span></li>
          </ul>
        </Accordion>
      </section>

      <Transition>
        <>투자, 자본구조, <Tooltip term="허들레이트" title="Hurdle Rate (허들레이트·최소 요구수익률)">최소 요구수익률. 이 프로젝트 수익률이 최소 이 정도는 넘어야 투자하겠다는 기준선입니다. 이를 넘지 못하면 투자를 포기합니다.</Tooltip>... 이 모든 결정을 떠받치는 밑바탕은 기업의 '계획과 예측'입니다.<br />실제 기업은 미래를 어떻게 계획할까요?</>
      </Transition>

      {/* Section 1. Chapter III */}
      <section id="ch3" className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ch III. 기업 계획과 내부 예측</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Sticky Text */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 space-y-10 z-20">
              <div className="space-y-3">
                <Badge type="paper" text="Paper Finding" />
                <h3 className="text-2xl font-bold text-white">1. 시나리오 플래닝</h3>
                <p className="text-gray-400 leading-relaxed">
                  기업은 단일 숫자가 아닌 보통 3개(기준/하방/상방)의 시나리오를 사용함. 기준 시나리오를 중심으로 운영하되, 상방보다 하방 시나리오에 더 실질적 관심을 둠.
                </p>
              </div>
              <div className="space-y-3">
                <Badge type="paper" text="Paper Finding" />
                <h3 className="text-2xl font-bold text-white">2. 짧은 계획 기간</h3>
                <p className="text-gray-400 leading-relaxed">
                  신뢰할 수 있는 구체적 미래 계획은 평균적으로 <span className="text-white font-medium">단 '2년'</span>에 불과함.
                </p>
              </div>
              <div className="space-y-3">
                <Badge type="paper" text="Paper Finding" />
                <h3 className="text-2xl font-bold text-white">3. 매출 예측의 아이러니</h3>
                <p className="text-gray-400 leading-relaxed">
                  기업 결과에 가장 큰 영향을 주는 1순위 변수지만, 부록(Table A.II)에 따르면 예측 정확도는 <span className="text-white font-medium">22.8%로 가장 빈번하게 실패</span>함.
                </p>
              </div>
              <div className="space-y-3">
                <Badge type="paper" text="Paper Finding" />
                <h3 className="text-2xl font-bold text-white">4. Miscalibration과 하방 대비</h3>
                <p className="text-gray-400 leading-relaxed">
                  <Tooltip term="Miscalibration" title="Miscalibration (보정 실패)">
                    예측 분포가 실제보다 너무 좁거나 넓어서, 실제 결과가 예측 범위를 자주 벗어나는 현상입니다. 기업이 스스로의 예측력을 과신하여 하방 위험 대비를 충분히 하지 못하는 원인이 됩니다.
                  </Tooltip>으로 인해 예측 범위를 자주 벗어남. 이 한계를 알기에 극도로 보수적인 생존 전략을 짬.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Scrolling Charts */}
          <div className="lg:col-span-7 space-y-12 z-10">
            <ImagePlaceholder
              title="[논문 Figure 7]"
              desc="2년 planning horizon(계획기간) 근거 차트"
              src="/images/Fig7.png"
              onClick={() => openModal('/images/Fig7.png', '[논문 Figure 7] 2년 planning horizon 근거 차트')}
            />

            <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
              <div className="flex gap-2 mb-4">
                <Badge type="paper" text="Figure 8" />
              </div>
              <h4 className="text-xl font-medium text-white mb-6">매출 중요도(1위) vs 예측 정확도(22.8%)의 아이러니</h4>
              <div className="flex justify-center">
                <div className="w-full max-w-xl">
                  <ImagePlaceholder
                    title="[논문 Figure 8]"
                    desc="예측 변수 중 1위가 매출임을 보여주는 차트"
                    src="/images/Fig8.png"
                    onClick={() => openModal('/images/Fig8.png', '[논문 Figure 8] 예측 변수 중 1위가 매출임을 보여주는 차트')}
                  />
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 relative z-10">
              <Badge type="paper" text="Figure 9" />
              <p className="mt-4 mb-6 text-gray-400 leading-relaxed">
                <strong className="text-white">💡 핵심 예시:</strong> Figure 9는 매출 예측 구간이 실제 결과를 충분히 포착하지 못한다는 점을 보여주는{' '}
                <Tooltip term="보정 실패" title="Miscalibration (보정 실패)">
                  예측 범위를 실제보다 너무 좁게 잡아 충격이 올 때 크게 빗나가는 현상.
                </Tooltip>의 대표적 증거입니다.
              </p>
              <ImagePlaceholder
                title="[논문 Figure 9]"
                desc="지역별 매출 예측 보정 정도(Revenue calibration by region)"
                src="/images/Fig9.png"
                onClick={() => openModal('/images/Fig9.png', '[논문 Figure 9] 지역별 매출 예측 보정 정도')}
              />
            </div>

            <ImagePlaceholder
              title="[논문 Figure 11]"
              desc="코로나 충격 이후 예측 폭이 확 넓어지는 차트"
              src="/images/Fig11.png"
              onClick={() => openModal('/images/Fig11.png', '[논문 Figure 11] 코로나 충격 이후 예측 폭 변화')}
            />

            <Accordion title="보조 근거 및 상세 액션 (클릭하여 펼치기)" badgeType="appendix" badgeText="Appendix Evidence">
              <div className="space-y-8">
                <ImagePlaceholder
                  title="[논문 Figure A.2]"
                  desc="하방 시나리오에 더 실질적 관심을 둠을 보여주는 차트"
                  src="/images/FigA.2.png"
                  onClick={() => openModal('/images/FigA.2.png', '[논문 Figure A.2] 하방 시나리오 관심도 차트')}
                />
                <div className="pt-6 border-t border-gray-800">
                  <Badge type="interpretation" text="Paper-based synthesis" />
                  <h4 className="mt-4 mb-6 text-lg font-medium">하방 충격 대응 4단계 (논문 부록 기반 재구성)</h4>
                  <div className="flex flex-col gap-3">
                    {['현금 인출 및 확보', '기존 신용한도 최대한 활용', '채용 동결 및 비용 삭감', '자산 매각'].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-black border border-gray-800 p-4 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                        <span className="text-gray-300 font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
        </div>
      </section>

      <Transition>
        "예측이 이처럼 불완전하고 하방 위험을 두려워한다면,<br />배당과 자사주매입은 어떻게 결정될까요?"
      </Transition>

      {/* Section 2. Chapter V */}
      <section id="ch5" className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">Ch V. 배당과 자사주매입 정책</h2>
        <p className="text-xl text-blue-400 font-medium text-center mb-16">"배당은 안정적인 약속으로 남고, 자사주매입은 유연한 타이밍 수단이 된다."</p>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl flex flex-col group hover:border-blue-500/50 transition-colors">
            <div className="mb-4"><Badge type="paper" text="Paper Finding" /></div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="w-6 h-6 text-gray-500" /> 환원과 투자의 긴장</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">주주 환원과 기업 투자는 서로 현금을 두고 다투는 긴장 상태에 있음.</p>
            <ImagePlaceholder
              title="[논문 Figure 21]"
              desc="기존 배당 유지가 투자만큼 중요하게 평가됨을 보여주는 차트"
              src="/images/Fig21.png"
              onClick={() => openModal('/images/Fig21.png', '[논문 Figure 21] 기존 배당 유지가 투자만큼 중요하게 평가됨')}
            />
          </div>

          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl flex flex-col group hover:border-blue-500/50 transition-colors">
            <div className="mb-4"><Badge type="paper" text="Paper Finding" /></div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock className="w-6 h-6 text-gray-500" /> 배당의 경직성</h3>
            <p className="text-gray-400 flex-grow leading-relaxed">
              한 번 정한 배당은 "매력적인 투자가 새로 생겨도 쉽게 줄이지 않는다"는 강한 관성(
              <Tooltip term="Sticky" title="Sticky Dividends (배당의 경직성)">
                투자 기회가 생기거나 환경이 변해도 기업이 기존 배당 수준을 끈적하게 유지하려는 관성을 의미합니다.
              </Tooltip>)을 지님.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl flex flex-col group hover:border-blue-500/50 transition-colors">
            <div className="mb-4"><Badge type="paper" text="Paper Finding" /></div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="w-6 h-6 text-gray-500" /> 자사주매입의 유연성</h3>
            <p className="text-gray-400 flex-grow leading-relaxed">
              경영진이 "우리 주식이 저평가되었다"고 판단할 때 실행되며(
              <Tooltip term="Market Timing" title="Market Timing (시장 타이밍)">
                가격이 유리할 때 발행·매입 시점을 조절하는 행동입니다. 경영진이 시장가격과 내재가치 차이를 적극적으로 이용합니다.
              </Tooltip>), 투자 기회가 오면 배당보다 훨씬 쉽게 축소함.
            </p>
          </div>
        </div>

        {/* Comparison Table & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-black border border-gray-800 rounded-3xl overflow-hidden flex flex-col justify-center">
            <div className="p-6 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">배당 vs 자사주매입 비대칭성 비교</h3>
              <Badge type="interpretation" text="Interpretation" />
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="text-gray-500 text-sm border-b border-gray-800">
                    <th className="pb-4 font-normal w-1/3">기준</th>
                    <th className="pb-4 font-medium text-blue-400 w-1/3">배당 (Dividends)</th>
                    <th className="pb-4 font-medium text-yellow-500 w-1/3">자사주 (Repurchases)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-800/50">
                    <td className="py-4 text-gray-400">Commitment<br /><span className="text-xs text-gray-600">(약속 수준)</span></td>
                    <td className="py-4 font-medium">매우 강함<br /><span className="text-xs text-gray-500 font-normal">시장과의 묵시적 약속</span></td>
                    <td className="py-4">약함<br /><span className="text-xs text-gray-500">필요시 중단 가능</span></td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-4 text-gray-400">Flexibility<br /><span className="text-xs text-gray-600">(조정 가능성)</span></td>
                    <td className="py-4">낮음<br /><span className="text-xs text-gray-500">Sticky, 하방경직성</span></td>
                    <td className="py-4 font-medium">높음<br /><span className="text-xs text-gray-500">시장 상황에 따라 탄력적</span></td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-4 text-gray-400">Market Timing</td>
                    <td className="py-4">둔감함</td>
                    <td className="py-4 font-medium text-yellow-500">매우 민감함<br /><span className="text-xs text-gray-500 font-normal">저평가 시 적극 매입</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 text-gray-400">Investment Compatibility</td>
                    <td className="py-4 text-blue-400 font-medium">투자와 긴장/구축<br /><span className="text-xs text-gray-500 font-normal">배당 유지가 최우선</span></td>
                    <td className="py-4">쉽게 자금 양보</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <ImagePlaceholder
              title="[논문 Figure 20]"
              desc="배당과 자사주매입의 결정 요인 비교 차트"
              src="/images/Fig20.png"
              onClick={() => openModal('/images/Fig20.png', '[논문 Figure 20] 배당과 자사주매입의 결정 요인 비교')}
            />
          </div>
        </div>
      </section>

      <Transition>
        "투자, 현금 유보, 그리고 환원. 기업의 이 모든 결정들은<br />궁극적으로 누구를 만족시키기 위한 것일까요?"
      </Transition>

      {/* Section 3. Chapter VI */}
      <section id="ch6" className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Ch VI. 기업의 목표</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-20">
            <div className="space-y-2">
              <Badge type="paper" text="Paper Finding" />
              <h3 className="text-xl font-bold">1. 기본 전제</h3>
              <p className="text-gray-400">기업의 1차 목표는 여전히 압도적으로 '주주가치'임.</p>
            </div>
            <div className="space-y-2">
              <Badge type="paper" text="Paper Finding" />
              <h3 className="text-xl font-bold">2. 최근의 변화</h3>
              <p className="text-gray-400 leading-relaxed">
                2010년 대비 2020년, 기업 목적 함수에서 {' '}
                <Tooltip term="이해관계자" title="Stakeholder (이해관계자)">
                  주주 외에 기업 활동의 영향을 받거나 긴밀한 이해관계를 가지는 직원, 고객, 지역사회, 환경 등을 모두 포함하는 집단입니다.
                </Tooltip> 고려 비중이 뚜렷하게 증가함.
              </p>
            </div>
            <div className="space-y-2">
              <Badge type="paper" text="Paper Finding" />
              <h3 className="text-xl font-bold">3. 실질적 의미 (우선순위)</h3>
              <p className="text-gray-400">모든 이해관계자가 동등한 것은 아니며, 직원(Employees)과 고객(Customers)이 압도적으로 중요하게 취급됨.</p>
            </div>

            <div className="mt-8 p-6 bg-blue-900/20 border border-blue-800/50 rounded-2xl">
              <div className="mb-3"><Badge type="interpretation" text="발표자 주의점" /></div>
              <p className="text-blue-300 leading-relaxed text-sm md:text-base">
                "주주가치의 시대가 끝났다는 것은 과장입니다. 중심은 주주에 있되, 그 운영의 폭이 직원과 고객 같은 핵심 이해관계자를 포함하는 쪽으로 넓어지고 있는 것입니다."
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 z-10">
            <div className="mb-12">
              <div className="flex justify-between text-sm font-bold text-gray-500 mb-4 px-2">
                <span className={sliderYear === 2010 ? "text-white" : ""}>2010년</span>
                <span className={sliderYear === 2020 ? "text-white" : ""}>2020년</span>
              </div>
              <input
                type="range" min="2010" max="2020" step="10"
                value={sliderYear}
                onChange={(e) => setSliderYear(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-800 rounded-lg appearance-none"
              />
            </div>

            {/* Visualizer */}
            <div className="h-64 relative flex items-center justify-center mb-8 border border-gray-800 rounded-2xl bg-black overflow-hidden">
              <div className="absolute text-center z-10">
                <div className="w-32 h-32 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center backdrop-blur-sm">
                  <span className="font-bold text-blue-400">Shareholders</span>
                </div>
              </div>
              <div className="absolute text-center transition-all duration-700 ease-out" style={{ transform: sliderYear === 2020 ? 'translate(-80px, 40px)' : 'translate(-50px, 20px)' }}>
                <div className={`rounded-full bg-green-600/20 border border-green-500/50 flex items-center justify-center backdrop-blur-sm transition-all duration-700 ${sliderYear === 2020 ? 'w-24 h-24' : 'w-16 h-16'}`}>
                  <span className={`font-bold text-green-400 ${sliderYear === 2020 ? 'text-sm' : 'text-xs'}`}>Employees</span>
                </div>
              </div>
              <div className="absolute text-center transition-all duration-700 ease-out" style={{ transform: sliderYear === 2020 ? 'translate(80px, -40px)' : 'translate(50px, -20px)' }}>
                <div className={`rounded-full bg-yellow-600/20 border border-yellow-500/50 flex items-center justify-center backdrop-blur-sm transition-all duration-700 ${sliderYear === 2020 ? 'w-20 h-20' : 'w-12 h-12'}`}>
                  <span className={`font-bold text-yellow-400 ${sliderYear === 2020 ? 'text-xs' : 'text-[10px]'}`}>Customers</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ImagePlaceholder
                title="[논문 Figure 22]"
                desc="2010년 대비 2020년 주주/이해관계자 비중 변화"
                src="/images/Fig22.png"
                onClick={() => openModal('/images/Fig22.png', '[논문 Figure 22] 2010년 대비 2020년 주주/이해관계자 비중 변화')}
              />
              <ImagePlaceholder
                title="[논문 Figure 23]"
                desc="이해관계자 중요도 순위"
                src="/images/Fig23.png"
                onClick={() => openModal('/images/Fig23.png', '[논문 Figure 23] 이해관계자 중요도 순위')}
              />
            </div>
          </div>
        </div>
      </section>

      <Transition>
        "그렇다면, 이 복잡한 현실을 설명하기 위해 기존의 기업재무 연구는<br />무엇을 놓치고, 무엇을 바꿔야 할까요?"
      </Transition>

      {/* Section 4. Chapter VII & VIII */}
      <section id="ch7" className="max-w-7xl mx-auto px-6 py-24 pb-32">
        <div className="border border-yellow-900/50 bg-yellow-900/10 p-6 rounded-2xl mb-16 text-center max-w-3xl mx-auto">
          <p className="text-yellow-500 font-medium leading-relaxed">
            ⚠️ 이 부분은 발표자의 단순한 결론 요약이 아닙니다. 앞선 III·V·VI장의 증거를 바탕으로 논문 저자가 직접 제안하는 기업재무 연구의 새로운 방향성입니다.
          </p>
        </div>

        <div className="space-y-16">
          <div className="text-center space-y-4 relative z-20">
            <Badge type="paper" text="Process over Outcome" />
            <h3 className="text-3xl font-bold">결과보다 과정</h3>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              기업이 1) 무엇을 진실로 믿는지, 2) 어떻게 시나리오를 계획하는지, 3) 어떤{' '}
              <Tooltip term="위험(Left Tail)" title="Left Tail / Downside Risk (하방위험/꼬리위험)">
                예상보다 훨씬 나쁜 결과가 나올 가능성이며, 분포의 왼쪽 꼬리 부분으로 드물지만 기업 생존을 위협하는 극단적 위험 영역입니다.
              </Tooltip>을 두려워하는지 그 '과정' 자체를 연구해야 함.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {[
              { k: "Short Horizon", v: "III장의 2년 planning horizon" },
              { k: "Miscalibration", v: "III장의 revenue 오류 및 예측 폭 한계" },
              { k: "Conservatism", v: "III장의 downside 대비 및 V장 환원 보수성" },
              { k: "Stickiness", v: "V장의 배당 관성" },
              { k: "Market Timing", v: "V장의 자사주 매입" },
              { k: "Simple Rules", v: "전체 논문을 관통하는 기업의 대응 축" }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl">
                <Badge type="interpretation" text={`Keyword ${i + 1}`} />
                <h4 className="text-xl font-bold text-white mt-4 mb-2">{item.k}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500" /> {item.v}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-12 rounded-3xl text-center space-y-6 relative z-20">
            <Badge type="paper" text="Paradigm Shift" />
            <h3 className="text-2xl font-medium text-gray-300 flex items-center justify-center flex-wrap gap-4">
              <span className="line-through decoration-gray-600">Optimization(최적화)</span>
              <ArrowRight className="text-blue-500" />
              <span className="text-blue-400 font-bold">
                <Tooltip term="Satisficing(충분주의)" title="Satisficing (충분주의)">
                  시간과 정보의 제약 속에서 불가능에 가까운 '완전한 최적해' 대신, 생존을 위한 '충분히 괜찮은 방어적 선택'을 하는 현실적인 의사결정 방식입니다.
                </Tooltip>
              </span>
            </h3>
            <p className="text-gray-400 leading-relaxed mt-4">
              완벽한 합리성에서 벗어나,{' '}
              <Tooltip term="제한된 합리성" title="Bounded Rationality (제한된 합리성)">
                정보, 시간, 인지능력이 제한된 상태에서 인간과 기업의 합리성이 제한된다는 경제학 개념입니다.
              </Tooltip> 속에서 생존을 도모하는 연구로의 전환
            </p>
          </div>
        </div>

        <div className="mt-32 text-center">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            현실의 기업재무는 교과서적 최적화의 산물이 아닙니다. <br className="hidden md:block" />
            불완전한 예측 속에서, 보수적이고 끈적한 규칙으로 견뎌내는 <br className="hidden md:block" />
            치열하고 역동적인 생존 전략입니다.
          </h2>
        </div>
      </section>

      {/* Footer / Glossary / Appendix */}
      <footer id="glossary" className="border-t border-gray-900 bg-black pt-16 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-500" /> Glossary (용어 사전)</h3>
            <div className="space-y-4 text-sm">
              {[
                { t: "Scenario Planning (시나리오 플래닝)", d: "단일 숫자가 아니라 기준·하방·상방 등 여러 가능한 미래를 나눠 준비하는 계획 방식이다." },
                { t: "Miscalibration (보정 실패)", d: "예측 분포가 실제보다 너무 좁거나 넓어서, 실제 결과가 예측 범위를 자주 벗어나는 현상." },
                { t: "Left Tail / Downside Risk (하방·꼬리위험)", d: "분포의 왼쪽 꼬리 부분으로, 예상보다 훨씬 나쁜 결과가 나올 가능성이며 드물지만 큰 충격을 주는 극단적 위험." },
                { t: "Sticky dividends (배당의 경직성)", d: "한 번 정하면 쉽게 바뀌지 않는 성질. 한 번 올리면 쉽게 줄이지 않는 배당 관성." },
                { t: "Market timing (시장 타이밍)", d: "가격이 유리할 때 발행·매입 시점을 조절하는 행동. 기업이 시장가격과 내재가치 차이를 적극적으로 이용함." },
                { t: "Satisficing (충분주의)", d: "완전한 최적해가 아니라, 시간 및 정보 제약 안에서 충분히 괜찮은 해답을 선택하는 방식." },
                { t: "Hurdle Rate (허들레이트·최소 요구수익률)", d: "이 프로젝트 수익률이 최소 이 정도는 넘어야 투자하겠다는 기준선. 이를 넘지 못하면 투자를 포기함." },
                { t: "Bounded rationality (제한된 합리성)", d: "정보, 시간, 인지능력이 제한된 상태에서 합리성이 제한된다는 개념." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col border-b border-gray-800 pb-3">
                  <span className="font-semibold text-gray-300">{item.t}</span>
                  <span className="text-gray-500 mt-1 leading-relaxed">{item.d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-yellow-500" /> Appendix (부록)</h3>
            <p className="text-sm text-gray-500 mb-6">발표 흐름 외 추가 캡처 도표. 논의가 필요할 때 참고하세요.</p>
            <div className="grid grid-cols-2 gap-4">
              <ImagePlaceholder
                title="[논문 Figure 2]"
                desc="자본예산 의사결정 규칙"
                src="/images/Fig2.png"
                onClick={() => openModal('/images/Fig2.png', '[논문 Figure 2] 자본예산 의사결정 규칙')}
              />
              <ImagePlaceholder
                title="[논문 Figure 3]"
                desc="허들레이트 시계열 변화"
                src="/images/Fig3.png"
                onClick={() => openModal('/images/Fig3.png', '[논문 Figure 3] 허들레이트 시계열 변화')}
              />
              <ImagePlaceholder
                title="[논문 Figure 13]"
                desc="기업 부채 측정 지표"
                src="/images/Fig13.png"
                onClick={() => openModal('/images/Fig13.png', '[논문 Figure 13] 기업 부채 측정 지표')}
              />
              <ImagePlaceholder
                title="[논문 Figure 16]"
                desc="자본구조 결정 요인"
                src="/images/Fig16.png"
                onClick={() => openModal('/images/Fig16.png', '[논문 Figure 16] 자본구조 결정 요인')}
              />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}