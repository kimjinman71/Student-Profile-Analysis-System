import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Award, 
  Users, 
  BookOpen, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Target,
  Library,
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  X, 
  Upload, 
  LayoutDashboard,
  BarChart3, 
  ClipboardCheck, 
  Zap,
  GraduationCap,
  Trophy,
  Star,
  ShieldCheck,
  Lock,
  Key,
  Compass,
  TrendingUp,
  Heart,
  Settings,
  HelpCircle,
  TrendingDown,
  Info,
  Image,
  AlertTriangle,
  RotateCw
} from 'lucide-react';

const MODEL_NAME = "gemini-2.5-flash";

// 100개의 전문가용 접근 비밀번호 데이터셋 구축
const VALID_PASSWORDS = import.meta.env.VITE_VALID_PASSWORDS 
  ? import.meta.env.VITE_VALID_PASSWORDS.split(",").map(p => p.trim())
  : ["0000", "8405"];

// 시뮬레이션 및 테스트를 위한 최고 수준의 데모 데이터셋
const DEMO_ANALYSIS_DATA = {
  student_profile: {
    student_name: "홍길동",
    estimated_gpa: "1.15",
    major_track: "의약학 / 바이오 융합 계열",
    school_type: "일반계 고등학교 (자연계열)"
  },
  admissions_verdict: "본 학생은 전 교과 전반에서 평균 원점수 98점대 이상의 압도적인 성취를 거두었으며, 특히 수학 및 과학 교과에서 매우 깊이 있는 자기주도적 학술 탐구 태도를 보입니다. 의공학 및 약학의 학제간 융합 과제인 '나노 약물 전달체 탐구'를 주제로 세특 간의 연계성을 훌륭하게 설계했습니다. 다만, 물리학 실험 설계에서 발견된 미세 오차 원인 분석의 구체성과 통계적 분석 유의성이 수식 증명서 대비 요약식으로 서술되어 있어 실제 면접평가 시 해당 탐구 과정의 구체성 질문에 완벽히 대비하는 성찰 과정 보완이 요구됩니다.",
  competencies: {
    academic: {
      score: 98,
      grade: "A+",
      strengths: [
        "수학 및 과학 교과에서 평균 원점수 98.5점의 압도적 학업 성취도를 유지하며 뛰어난 전공 기초 학업 역량을 증명함.",
        "기하 및 물리학Ⅱ 등 이공계열 핵심 심화 과목을 선제적으로 이수하여 학업적 적극성과 진취성을 강력하게 나타냄.",
        "세부능력 및 특기사항에 나타난 교과 개념의 한계를 극복하려는 지적 호기심과 자기주도적 학술 자료 분석 능력이 탁월함.",
        "수치 분석에 그치지 않고 이론적 한계 조건을 수학적 모델링으로 증명해내는 교과 심화 탐구 역량이 매우 인상적임."
      ],
      weaknesses: [
        "기하 과목의 원점수 대비 지필평가 성취 수준의 일시적 편차가 관찰되어 일관된 성취도 입증을 위한 보완이 요구됨.",
        "일부 국어 및 영어 교과의 수행평가 결과물에서 이공계에 치우친 학업 편중성이 발견되어 균형 있는 학업 태도 보완이 필요함.",
        "수리적 추론 과정의 구체적 설계에 비해 실제 증명 보고서의 논리적 전개 과정이 일부 과목에서 요약식으로 서술됨.",
        "실험 설계 역량은 우수하나, 실험 실패 시 원인 분석 및 재시도 과정에 대한 자기성찰적 기술이 다소 평이함.",
        "고난도 개념 학습 시 참고한 대학 수준 전공서적의 이론적 오개념을 필터링하는 비판적 분석력 기술이 미흡함.",
        "수학적 개념을 타 교과와 연계하려는 시도는 돋보이나 구체적인 융합 공식 및 이론적 접점의 제시가 단순 나열에 그침.",
        "물리학 실험 기기 조작 역량에 비해 데이터 시각화 및 통계적 유의성 검정 과정의 정밀도가 일부 누락됨.",
        "교과 외 자기주도 독서 활동 기록이 풍부한 반면 독서 성찰 내용이 해당 교과 세특과의 유기적 연결로 이어지지 못함."
      ]
    },
    career: {
      score: 96,
      grade: "A",
      strengths: [
        "의약학 및 생명공학에 대한 탐구 지향점이 뚜렷하며, 전공 관련 과학과목의 이수 체계가 완벽히 구축되어 있음.",
        "물리학I·II와 생명과학I·II를 동시 이수하여 융합 의공학 연구자로 성장할 수 있는 학제적 융합 역량을 확보함.",
        "동아리 활동과 세부능력 특기사항의 주제가 '나노 전달체를 활용한 약물 전달'로 긴밀히 연결되어 탐구의 일관성이 높음.",
        "희망 분야인 의약학 전공 핵심 이론인 '효소 반응 메커니즘'의 열역학적 해석을 주도적으로 탐구하여 전공 적합성을 극대화함."
      ],
      weaknesses: [
        "약학 분야의 연구 역량을 강조했으나 최신 바이오 의약품 트렌드 분석에 그쳐 전공을 관통하는 본인만의 독창적 관점이 약함.",
        "동아리 활동에서 설계한 세포 배양 실험의 대조군 설정 및 변인 통제 과정의 구체적 한계점이 기록에서 보완되어야 함.",
        "진로활동의 희망 분야 탐색이 다소 포괄적이어서 고학년으로 올라갈수록 좁혀지는 심화 전공 분야의 명확성이 요구됨.",
        "선택 과목 중 생명과학 실험 등 실무 교과의 이수에도 불구하고 실제 실험 기기 활용 수준에 대한 기술이 부족함.",
        "탐구 보고서의 단순 제출 사실만 기재되어 있어, 어떤 논문 자료를 참고하여 탐구하였는지 구체적인 분석 과정과 본인의 기여도가 생기부에 충분히 드러나지 않음.",
        "화학반응속도론 탐구 등 수학적 모델링을 적용하는 과정에서 매개변수 설정의 구체적 근거 제시가 다소 부족함.",
        "물리학 실험 중 발생한 실험적 한계와 오차 원인을 분석할 때 자기성찰적 개선 방향의 기술이 다소 평이함.",
        "융합 의공학 연구주제에 비해 참고문헌의 출처나 논리적 인용 과정의 정밀성이 생기부 기록상 명확히 드러나지 않음."
      ]
    },
    community: {
      score: 90,
      grade: "A",
      strengths: [
        "학급 내 멘토링 프로그램의 멘토로 주도적으로 활동하며 급우들의 수학 및 과학 교과 학습 성장을 헌신적으로 지원함.",
        "교내 행사 기획 및 모둠 활동에서 뛰어난 협업 능력을 발휘하고 급우들과 소통하여 공동의 성과 창출에 크게 기여함.",
        "갈등 상황 발생 시 상대방의 의견을 경청하는 열린 태도로 합리적인 조율안을 제시하는 공동체 중심 리더십이 우수함.",
        "환경 미화 활동이나 급식 도우미 등 일상의 소소한 학급 봉사활동에도 책임감을 갖고 꾸준하게 참여하는 성실함을 보여줌."
      ],
      weaknesses: [
        "모둠 탐구 활동 시 개인별 역할 분담에서 본인의 전공 관련 기여도에 비해 협업 시너지를 이끌어낸 세부 서술이 다소 평이함.",
        "학급 내 갈등 상황 조율 과정에서 경청의 태도는 돋보이나 이를 주도적으로 조율하여 해결한 실질적 사례 제시가 요구됨.",
        "멘토링 참여 실적은 우수하지만 멘티의 성장 과정에 대한 관찰과 그에 따른 본인의 성찰 내용이 다소 단순 나열식임.",
        "봉사활동의 주도성과 성실성은 인정되나 그것이 본인의 가치관 변화나 공동체 의식 성장으로 이어진 성찰 서술이 부족함.",
        "리더십을 발휘한 사례는 풍부하나 팀원의 참여도가 낮을 때 이를 자발적으로 극복할 수 있도록 도운 구체적 서술이 아쉬움.",
        "공동의 이익을 위한 제안을 실행하는 과정에서 예상되는 예상 문제점에 대한 다각적 검토와 분석 노력이 보완되어야 함.",
        "체육 대회나 축제 등 교내 단체 활동에서 적극적인 기여 수준에 비해 개인 역량 위주로 기재되어 협동적 가치 서술이 미흡함.",
        "공동체의 규범을 자발적으로 실천하는 준법정신과 배려의 태도가 급우 전반으로 확산되는 선한 영향력 기술이 보완되어야 함."
      ]
    }
  },
  subject_specific: [
    {
      subject_group: "국어 교과군 분석",
      category: "Korean",
      strengths: [
        "인문학과 자연과학을 연결하는 융합 독서 역량이 뛰어나며, 과학 철학 서적을 기반으로 한 비판적 독해력이 우수함.",
        "논설문 작성 시 엄밀한 통계 자료를 근거로 논리 구조를 설계하여 설득력 높은 텍스트 생산 능력을 입증함.",
        "교과서 수록 문학 작품 속 사회적 갈등 양상을 다각도로 해석하고 이를 현대 사회 문제와 연결해내는 성찰력이 돋보임.",
        "구조적 읽기 훈련을 통해 고난도 독서 지문의 핵심 정보를 빠르고 정교하게 요약 발제하는 능력이 뛰어남."
      ],
      weaknesses: [
        "과학 기술 지문 분석 시 배경지식에 지나치게 의존하여 텍스트 자체의 정밀한 사실 관계 추론을 놓치는 경향이 발견됨.",
        "발표 과제 수행 시 전문 용어의 과도한 사용으로 일반 청중의 이해도를 고려한 청자 중심적 소통 능력 보완이 요구됨.",
        "매체 언어 탐구 시 미디어 데이터의 편향성을 분석하는 비판적 프레임 분석 수준이 기초적인 기술에 머무름.",
        "자유 글쓰기 과제에서 분량 제어 능력이 부족하여 서론과 결론의 균형성 및 문장 전개의 일관성이 흐트러짐.",
        "독서 토론 중 상대방의 반론에 대응할 때 이론적 근거의 신뢰성을 재검증하는 성발력 있는 대처가 보완되어야 함.",
        "고전 문학의 시대적 배경 이해 수준에 비해 당대 사회상과 인물의 심리를 입체적으로 재해석하는 깊이가 아쉬움.",
        "화법과 작문 과목에서 작성한 에세이의 초고 대비 수정 보완 과정과 본인의 구체적 문장 교정 노력이 잘 드러나지 않음.",
        "모둠 활동 시 본인의 의견을 관철하는 과정에서 발생한 갈등을 합리적 언어로 조율하는 화법적 기교의 보완이 필요함."
      ]
    },
    {
      subject_group: "수학 교과군 분석",
      category: "Math",
      strengths: [
        "미적분학의 미분방정식을 물리적 현상(감쇠 진동 등)에 대입하여 완벽하게 모델링하고 수치적으로 해결함.",
        "수학 전 교과에서 원점수 99점 이상을 일관되게 획득하며 정량평가와 정성평가 모두에서 최상위권의 역량을 증명함.",
        "기하 교과의 벡터 개념을 유기 화학의 분자 구조 분석 및 각도 계산에 활용하여 입체 공간적 사고 능력을 나타냄.",
        "수학적 정리의 증명 과정에서 오류를 발견하면 직관에 의존하지 않고 수학적 귀납법으로 끝까지 검증해냄."
      ],
      weaknesses: [
        "확률과 통계의 가설 검정 탐구 시 단순 계산 오류가 반복되어 통계 데이터 신뢰도 확보를 위한 정밀도 보완이 요구됨.",
        "고난도 문항 풀이 과정에서 정형화된 공식 위주로 전개하여 기하학적 직관을 활용한 다양한 풀이 경로 개척이 필요함.",
        "수학 교과 세특에 심화 탐구 보고서 제출 사실은 빈번하나, 본인의 독창적 발상 및 심층 분석 과정 서술이 평이함.",
        "수학 탐구 주간에 진행한 '피보나치 수열과 자연의 비례' 탐구가 대중적 수준의 이론 소개에 그쳐 전문성이 약함.",
        "문제 해결 후 다른 개념과의 융합적 접근성(예: 기하와 선형대수)을 스스로 모색하는 수학적 확장성이 다소 부족함.",
        "수학적 개념의 역사적 배경 탐색은 상세하나, 그것이 현대 이공학 이론에 기여한 기술적 접점 분석이 누락됨.",
        "성취 기준을 초과하는 고교 외 범주의 대학 수학 기호를 단순 차용하여 탐구의 본질보다 형식에 치우친 점이 아쉬움.",
        "수행평가 내 서술형 답안 작성 시 중간 논리 도약이 잦아 채점관 관점에서 엄밀한 증명 절차의 보안이 요구됨."
      ]
    },
    {
      subject_group: "과학 교과군 분석",
      category: "Science",
      strengths: [
        "물리학Ⅱ 역학적 에너지 보존 법칙 실험에서 오차의 원인을 시스템적 마찰계수로 규명하여 역설적으로 뛰어난 물리학적 분석력을 입증함.",
        "화학Ⅱ 분자 오비탈과 에너지 준위 학습 후 양자역학적 관점에서 화학 결합을 해석하고자 주도적 논문 탐구를 수행함.",
        "생명과학Ⅱ 유전자 발현 및 조절 메커니즘을 컴퓨터 코딩(Python)과 연계하여 시뮬레이션 모델을 구현하는 학제간 융합을 성취함.",
        "과학 교과 전 과목 이수율이 완벽하며 전공 연계 필수 선택과목의 원점수가 100점에 수렴하는 학업 성취도를 유지함."
      ],
      weaknesses: [
        "실험 과정에서 예측치와 측정치 사이의 오차가 크게 발생했을 때, 공학적 오차 분석 기법을 정교하게 적용하지 못함.",
        "상위권 대학 및 의학 계열 진학을 고려할 때 물리학 이수의 강점은 있으나, 이와 연계된 전공 탐구 깊이가 더 깊어져야 함.",
        "지구과학 과목에서 우주론 탐구 시 천문학적 관측 기법에 대한 이해도 기술이 이론 분석에 비해 단순 나열식임.",
        "과학 탐구 보고서의 실험 설계 단계에서 대조군(Control Group) 설정 및 변인 통제 프로토콜이 생략되어 신뢰성이 하락함.",
        "고난도 실험 장비 사용법에 대한 기술은 장황하나 실제 분석 데이터의 통계 처리가 미비하여 아쉬움이 남음.",
        "화학반응속도론 탐구 시 온도 외에 정밀 촉매 영향 요인 등 다변수 분석으로 확장하는 주도적 변형 탐구 노력이 요구됨.",
        "생명과학 주제 탐구 중 줄기세포 연구의 윤리적 한계에 대한 서술이 과학적 쟁점보다 피상적인 다큐멘터리 요약 수준임.",
        "과학교과 세특의 탐구 흐름이 '지적 호기심 발현' 단계에서 머무르고 실제 '상세 실험을 통한 증명 및 성찰'까지 완주하지 못함."
      ]
    },
    {
      subject_group: "영어 교과군 분석",
      category: "English",
      strengths: [
        "영문 학술 논문 및 에세이 분석 능력이 뛰어나며, 전공 분야의 최신 해외 연구 트렌드를 스스로 조사하는 자기주도성이 돋보임.",
        "영어 발표 과제 시 자연스러운 전달력과 체계적인 프리젠테이션 설계 능력을 바탕으로 청중과의 교감을 훌륭하게 유도함.",
        "해외 원서 독서를 통해 교과 지식을 인문학 및 자연과학의 글로벌 쟁점과 연계하여 깊이 있게 이해함.",
        "교내 영어 에세이 쓰기에서 논리적 흐름이 탄탄하고 학술 어휘 활용이 우수한 에세이를 완성함."
      ],
      weaknesses: [
        "영문 텍스트 분석 시 구문 구조의 기술적 해석에 집중하여 글쓴이의 숨겨진 비판적 의도나 사회적 맥락 파악이 평이함.",
        "발표에서 원문의 단순 요약 비율이 높아 본인의 독창적인 시각이나 해석적 기여도가 생기부에 충분히 드러나지 않음.",
        "어휘력은 풍부하나 특정 전공 학문 분야의 전문 학술 용어를 학문적 정의에 맞춰 정확히 서술하는 정밀도가 필요함.",
        "영문 보고서 작성 시 참고한 영문 출처들의 신뢰성과 출처 표기법(APA/MLA 등)의 정밀성이 기록상 보완되어야 함.",
        "글로벌 이슈 탐구 시 시사 상식 수준의 분석에 그쳐 다차원적 국제 관계나 심층 경제학적 논거 접목이 부족함.",
        "수행평가 내에서 보인 작문 역량에 비해 개별 탐구 활동의 영문 초록(Abstract) 작성 과정의 주도적 도전이 보이지 않음.",
        "영어 토론 중 상대방의 반론에 대응하여 본인의 논지를 설득력 있게 재진술(Paraphrasing)하는 대처력이 미흡함.",
        "독서 성찰 내용이 영어 교과 세특에 단순 나열되어 있어, 해당 탐구 활동이 영어 학습 능력 향상과 연계되는 서술이 부족함."
      ]
    },
    {
      subject_group: "사회 교과군 분석",
      category: "Social",
      strengths: [
        "사회의 다양한 갈등 현상(정치, 경제, 지리 등)을 다각도에서 분석하고, 이에 대한 대안을 합리적으로 모색함.",
        "통계 자료 및 사회 조사 보고서의 데이터 해석 역량이 뛰어나며, 이를 통해 사회 변화 추이를 객관적으로 추론해냄.",
        "인권, 환경, 기술 발전 등 현대 사회의 주요 윤리적 쟁점을 도덕적 가치 판단 기준에 비추어 성숙하게 토론함.",
        "협동 프로젝트 시 공동체 중심적 사고와 시민의식을 바탕으로 모둠 활동을 주도하여 우수한 산출물을 이끌어냄."
      ],
      weaknesses: [
        "사회 현상의 구조적 원인을 파악하기보다 표면적인 통계 지표의 나열에 그쳐 현상 뒤의 사회적 메커니즘 분석이 약함.",
        "역사적 사건이나 법적 쟁점 분석 시 당대 사회적 가치관에 입각한 분석에 치우쳐 현대 사회적 적용 가치 기술이 부족함.",
        "지리 및 사회문화 탐구 시 본인이 속한 공동체 중심의 미시적 분석에 치우쳐 글로벌 차원의 거시적 환경 분석으로 확장되지 못함.",
        "다양한 이해관계자가 얽힌 공공 정책 갈등 분석에서 특정 집단의 관점에 편향된 주장이 서술되어 다각적 분석 보완이 필요함.",
        "사회 현상의 대안 제시 과정이 다소 이상적이거나 도덕적 훈화 수준에 머물러, 구체적 예산 및 실행 수단 분석이 결여됨.",
        "수행평가 내 논술 작성 시 다양한 참고 문헌의 비교 대조 과정이 생략되어 주장 자체의 객관적 입증력이 다소 약함.",
        "토론 활동 중 타인의 의견을 무조건적으로 수용하거나, 본인 주장의 논리적 한계에 부딪혔을 때 타협하는 언어가 평이함.",
        "개인주의적 성향이 강해 모둠 내 갈등을 제도적이고 구조적인 소통을 통해 시스템적으로 개선하려는 노력이 보완되어야 함."
      ]
    }
  ],
  rubrics: {
    academic: [
      "우수 (★★)", "우수 (★★)", "충족 (★)", "충족 (★)", "우수 (★★)",
      "충족 (★)", "부분충족 (O)", "우수 (★★)", "충족 (★)",
      "우수 (★★)", "우수 (★★)", "부분충족 (O)", "보완요구 (X)", "충족 (★)",
      "우수 (★★)", "충족 (★)", "충족 (★)", "우수 (★★)",
      "우수 (★★)", "충족 (★)", "우수 (★★)", "우수 (★★)"
    ],
    career: [
      "우수 (★★)", "우수 (★★)", "충족 (★)",
      "우수 (★★)", "충족 (★)", "충족 (★)", "부분충족 (O)",
      "충족 (★)", "부분충족 (O)", "부분충족 (O)", "우수 (★★)",
      "우수 (★★)", "충족 (★)", "충족 (★)",
      "우수 (★★)", "우수 (★★)", "충족 (★)", "우수 (★★)"
    ],
    community: [
      "충족 (★)", "충족 (★)", "우수 (★★)", "충족 (★)",
      "우수 (★★)", "충족 (★)", "부분충족 (O)", "우수 (★★)",
      "우수 (★★)", "충족 (★)", "우수 (★★)", "충족 (★)",
      "우수 (★★)", "충족 (★)", "우수 (★★)", "우수 (★★)",
      "우수 (★★)", "충족 (★)", "충족 (★)", "우수 (★★)"
    ],
    subject: [
      "우수 (★★)", "충족 (★)",
      "우수 (★★)", "부분충족 (O)",
      "우수 (★★)", "충족 (★)",
      "우수 (★★)", "충족 (★)"
    ]
  }
};

const UNIVERSITY_GRADE_DATA = {
  seoul: [
    { name: "서울대", minGpa: 1.40, maxGpa: 1.80, minGpa5: 1.10, maxGpa5: 1.35, hexColor: "#FF5A5F" },
    { name: "연세대", minGpa: 1.50, maxGpa: 2.00, minGpa5: 1.15, maxGpa5: 1.50, hexColor: "#FFC107" },
    { name: "고려대", minGpa: 1.50, maxGpa: 2.00, minGpa5: 1.15, maxGpa5: 1.50, hexColor: "#2ECC71" },
    { name: "서강대", minGpa: 1.80, maxGpa: 2.30, minGpa5: 1.40, maxGpa5: 1.80, hexColor: "#4A90E2" },
    { name: "성균관대", minGpa: 1.80, maxGpa: 2.40, minGpa5: 1.40, maxGpa5: 1.90, hexColor: "#B066E3" },
    { name: "한양대", minGpa: 1.90, maxGpa: 2.50, minGpa5: 1.50, maxGpa5: 2.00, hexColor: "#3F51B5" },
    { name: "중앙대", minGpa: 2.20, maxGpa: 2.80, minGpa5: 1.75, maxGpa5: 2.25, hexColor: "#32C5E9" },
    { name: "경희대", minGpa: 2.20, maxGpa: 2.90, minGpa5: 1.75, maxGpa5: 2.30, hexColor: "#EF5350" },
    { name: "한국외대", minGpa: 2.30, maxGpa: 3.00, minGpa5: 1.85, maxGpa5: 2.40, hexColor: "#FFB300" },
    { name: "서울시립대", minGpa: 2.20, maxGpa: 2.90, minGpa5: 1.80, maxGpa5: 2.35, hexColor: "#26A69A" },
    { name: "이화여대", minGpa: 2.30, maxGpa: 3.10, minGpa5: 1.85, maxGpa5: 2.50, hexColor: "#7986CB" },
    { name: "건국대", minGpa: 2.70, maxGpa: 3.40, minGpa5: 2.15, maxGpa5: 2.70, hexColor: "#FF7043" },
    { name: "동국대", minGpa: 2.80, maxGpa: 3.50, minGpa5: 2.20, maxGpa5: 2.80, hexColor: "#42A5F5" },
    { name: "홍익대", minGpa: 2.90, maxGpa: 3.60, minGpa5: 2.30, maxGpa5: 2.90, hexColor: "#2E7D32" },
    { name: "숙명여대", minGpa: 2.80, maxGpa: 3.50, minGpa5: 2.20, maxGpa5: 2.80, hexColor: "#5C6BC0" },
    { name: "국민대", minGpa: 3.00, maxGpa: 3.80, minGpa5: 2.40, maxGpa5: 3.00, hexColor: "#FF7A7D" },
    { name: "숭실대", minGpa: 2.90, maxGpa: 3.70, minGpa5: 2.30, maxGpa5: 2.95, hexColor: "#E0A800" },
    { name: "세종대", minGpa: 2.80, maxGpa: 3.60, minGpa5: 2.20, maxGpa5: 2.85, hexColor: "#4CAF50" },
    { name: "광운대", minGpa: 3.00, maxGpa: 3.80, minGpa5: 2.40, maxGpa5: 3.00, hexColor: "#00BCD4" },
    { name: "가톨릭대", minGpa: 3.10, maxGpa: 3.90, minGpa5: 2.45, maxGpa5: 3.10, hexColor: "#AB47BC" },
    { name: "명지대", minGpa: 3.50, maxGpa: 4.30, minGpa5: 2.80, maxGpa5: 3.40, hexColor: "#90A4AE" },
    { name: "상명대", minGpa: 3.60, maxGpa: 4.40, minGpa5: 2.85, maxGpa5: 3.50, hexColor: "#FFA726" },
    { name: "한성대", minGpa: 4.00, maxGpa: 4.80, minGpa5: 3.20, maxGpa5: 3.85, hexColor: "#4DB6AC" },
    { name: "서경대", minGpa: 4.10, maxGpa: 4.90, minGpa5: 3.25, maxGpa5: 3.90, hexColor: "#9FA8DA" }
  ],
  metropolitan: [
    { name: "아주대", minGpa: 2.30, maxGpa: 3.00, minGpa5: 1.85, maxGpa5: 2.40, hexColor: "#4285F4" },
    { name: "인하대", minGpa: 2.40, maxGpa: 3.10, minGpa5: 1.90, maxGpa5: 2.48, hexColor: "#26C6DA" },
    { name: "가천대", minGpa: 3.00, maxGpa: 3.80, minGpa5: 2.40, maxGpa5: 3.00, hexColor: "#EF5350" },
    { name: "인천대", minGpa: 2.80, maxGpa: 3.60, minGpa5: 2.20, maxGpa5: 2.88, hexColor: "#5C6BC0" },
    { name: "경기대", minGpa: 3.50, maxGpa: 4.30, minGpa5: 2.80, maxGpa5: 3.40, hexColor: "#FFA726" },
    { name: "한국항공대", minGpa: 2.80, maxGpa: 3.50, minGpa5: 2.20, maxGpa5: 2.80, hexColor: "#3F51B5" },
    { name: "한국공학대", minGpa: 3.50, maxGpa: 4.20, minGpa5: 2.80, maxGpa5: 3.35, hexColor: "#26A69A" },
    { name: "한경국립대", minGpa: 3.80, maxGpa: 4.60, minGpa5: 3.00, maxGpa5: 3.65, hexColor: "#90A4AE" },
    { name: "수원대", minGpa: 4.00, maxGpa: 4.90, minGpa5: 3.20, maxGpa5: 3.90, hexColor: "#AB47BC" },
    { name: "안양대", minGpa: 4.20, maxGpa: 5.00, minGpa5: 3.35, maxGpa5: 4.00, hexColor: "#EC407A" }
  ],
  chungcheong: [
    { name: "충남대", minGpa: 2.70, maxGpa: 3.40, minGpa5: 2.15, maxGpa5: 2.72, hexColor: "#4285F4" },
    { name: "충북대", minGpa: 3.00, maxGpa: 3.70, minGpa5: 2.38, maxGpa5: 2.95, hexColor: "#26C6DA" },
    { name: "한국기술교육대", minGpa: 2.50, maxGpa: 3.30, minGpa5: 2.00, maxGpa5: 2.62, hexColor: "#26A69A" },
    { name: "공주대", minGpa: 3.40, maxGpa: 4.20, minGpa5: 2.70, maxGpa5: 3.35, hexColor: "#AB47BC" },
    { name: "한밭대", minGpa: 3.20, maxGpa: 4.00, minGpa5: 2.55, maxGpa5: 3.18, hexColor: "#5C6BC0" },
    { name: "순천향대", minGpa: 3.40, maxGpa: 4.30, minGpa5: 2.70, maxGpa5: 3.42, hexColor: "#EF5350" },
    { name: "건양대", minGpa: 3.70, maxGpa: 4.60, minGpa5: 2.95, maxGpa5: 3.65, hexColor: "#FFA726" },
    { name: "호서대", minGpa: 3.90, maxGpa: 4.80, minGpa5: 3.10, maxGpa5: 3.82, hexColor: "#90A4AE" }
  ],
  gangwon: [
    { name: "연세대 미래", minGpa: 2.30, maxGpa: 3.00, minGpa5: 1.85, maxGpa5: 2.40, hexColor: "#4285F4" },
    { name: "강원대", minGpa: 3.00, maxGpa: 3.80, minGpa5: 2.40, maxGpa5: 3.00, hexColor: "#26A69A" },
    { name: "한림대", minGpa: 3.10, maxGpa: 3.90, minGpa5: 2.48, maxGpa5: 3.10, hexColor: "#AB47BC" },
    { name: "강릉원주대", minGpa: 3.50, maxGpa: 4.30, minGpa5: 2.80, maxGpa5: 3.42, hexColor: "#66BB6A" },
    { name: "가톨릭관동대", minGpa: 3.80, maxGpa: 4.80, minGpa5: 3.00, maxGpa5: 3.82, hexColor: "#EF5350" },
    { name: "상지대", minGpa: 4.00, maxGpa: 5.00, minGpa5: 3.20, maxGpa5: 4.00, hexColor: "#90A4AE" }
  ],
  daegu_gyeongbuk: [
    { name: "경북대", minGpa: 2.50, maxGpa: 3.30, minGpa5: 2.00, maxGpa5: 2.62, hexColor: "#EF5350" },
    { name: "영남대", minGpa: 3.20, maxGpa: 4.00, minGpa5: 2.55, maxGpa5: 3.18, hexColor: "#4285F4" },
    { name: "계명대", minGpa: 3.50, maxGpa: 4.30, minGpa5: 2.80, maxGpa5: 3.42, hexColor: "#26A69A" },
    { name: "금오공대", minGpa: 3.00, maxGpa: 3.80, minGpa5: 2.40, maxGpa5: 3.00, hexColor: "#FF7043" },
    { name: "대구대", minGpa: 3.70, maxGpa: 4.50, minGpa5: 2.95, maxGpa5: 3.58, hexColor: "#AB47BC" },
    { name: "대구가톨릭대", minGpa: 3.80, maxGpa: 4.60, minGpa5: 3.00, maxGpa5: 3.65, hexColor: "#90A4AE" }
  ],
  busan_gyeongnam: [
    { name: "부산대", minGpa: 2.40, maxGpa: 3.20, minGpa5: 1.92, maxGpa5: 2.55, hexColor: "#EF5350" },
    { name: "부경대", minGpa: 2.80, maxGpa: 3.60, minGpa5: 2.25, maxGpa5: 2.88, hexColor: "#4285F4" },
    { name: "울산대", minGpa: 2.90, maxGpa: 3.70, minGpa5: 2.30, maxGpa5: 2.95, hexColor: "#26C6DA" },
    { name: "경상국립대", minGpa: 3.10, maxGpa: 3.90, minGpa5: 2.48, maxGpa5: 3.10, hexColor: "#26A69A" },
    { name: "동아대", minGpa: 3.30, maxGpa: 4.10, minGpa5: 2.65, maxGpa5: 3.28, hexColor: "#AB47BC" },
    { name: "한국해양대", minGpa: 3.30, maxGpa: 4.00, minGpa5: 2.65, maxGpa5: 3.18, hexColor: "#4DB6AC" },
    { name: "인제대", minGpa: 3.60, maxGpa: 4.50, minGpa5: 2.88, maxGpa5: 3.58, hexColor: "#90A4AE" }
  ],
  honam_jeju: [
    { name: "전남대", minGpa: 2.70, maxGpa: 3.50, minGpa5: 2.15, maxGpa5: 2.78, hexColor: "#26A69A" },
    { name: "전북대", minGpa: 2.80, maxGpa: 3.60, minGpa5: 2.25, maxGpa5: 2.88, hexColor: "#4285F4" },
    { name: "제주대", minGpa: 3.00, maxGpa: 3.80, minGpa5: 2.40, maxGpa5: 3.00, hexColor: "#26C6DA" },
    { name: "조선대", minGpa: 3.40, maxGpa: 4.20, minGpa5: 2.70, maxGpa5: 3.35, hexColor: "#FFB300" },
    { name: "원광대", minGpa: 3.50, maxGpa: 4.30, minGpa5: 2.80, maxGpa5: 3.42, hexColor: "#AB47BC" },
    { name: "순천대", minGpa: 3.70, maxGpa: 4.50, minGpa5: 2.95, maxGpa5: 3.58, hexColor: "#5C6BC0" },
    { name: "군산대", minGpa: 3.80, maxGpa: 4.60, minGpa5: 3.00, maxGpa5: 3.65, hexColor: "#4DB6AC" },
    { name: "목포대", minGpa: 3.90, maxGpa: 4.80, minGpa5: 3.10, maxGpa5: 3.82, hexColor: "#90A4AE" }
  ]
};

// --- 초정밀 제이슨 수리 및 파싱 함수 ---
const cleanAndParseJson = (text) => {
  if (!text) return null;
  let cleaned = text.trim();
  
  const startIdx = cleaned.indexOf('{');
  if (startIdx === -1) return null;
  let partialJson = cleaned.substring(startIdx);

  const fixTruncatedJson = (str) => {
    let stack = [];
    let inString = false;
    let escaped = false;
    let result = "";

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      result += char;

      if (char === '"' && !escaped) {
        if (i === 0 || str[i-1] !== '\\') {
          inString = !inString;
        }
      }
      
      if (inString) {
        escaped = (char === '\\' && !escaped);
      } else {
        if (char === '{' || char === '[') {
          stack.push(char === '{' ? '}' : ']');
        } else if (char === '}' || char === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === char) {
            stack.pop();
          }
        }
      }
    }

    if (inString) result += '"';
    while (stack.length > 0) {
      const needed = stack.pop();
      if (result.trim().endsWith(',')) {
          result = result.trim().slice(0, -1);
      }
      result += needed;
    }
    return result;
  };

  const sanitizeString = (str) => {
    return str
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => {
        if (c === '\n') return '\\n';
        if (c === '\r') return '\\r';
        if (c === '\t') return '\\t';
        return ' ';
      })
      .replace(/,\s*([\]}])/g, "$1");
  };

  // Try 1: Parse starting from first '{' after sanitization
  try {
    return JSON.parse(sanitizeString(partialJson));
  } catch (e) {
    // Try 2: Find the last '}' and isolate it
    const endIdx = partialJson.lastIndexOf('}');
    if (endIdx !== -1) {
      try {
        const subJson = partialJson.substring(0, endIdx + 1);
        return JSON.parse(sanitizeString(subJson));
      } catch (subErr) {
        // Continue to recovery
      }
    }
    
    // Try 3: Truncated JSON recovery
    console.warn("구조 복원 엔진 가동...");
    try {
      const recovered = fixTruncatedJson(partialJson);
      return JSON.parse(sanitizeString(recovered.replace(/\r?\n|\r/g, " ")));
    } catch (e2) {
      return null;
    }
  }
};

// --- 서브 컴포넌트 선언 ---

const AnalysisBox = ({ type, data }) => {
  const isStrength = type === 'strength';
  const bgColor = isStrength ? 'bg-blue-50/50' : 'bg-rose-50/50';
  const borderColor = isStrength ? 'border-blue-200/60' : 'border-rose-200/60';
  const iconColor = isStrength ? 'text-blue-600' : 'text-rose-600';
  const titleColor = isStrength ? 'text-blue-900' : 'text-rose-900';
  const dotColor = isStrength ? 'bg-blue-500' : 'bg-rose-500';
  const title = isStrength ? '강점 성취 분석' : '핵심 보완 포인트';
  const Icon = isStrength ? CheckCircle : AlertCircle;
  const textColor = 'text-slate-700';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-none p-6 transition-all duration-500 hover:shadow-sm font-normal`}>
      <div className="flex items-center gap-3 mb-5">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className={`text-lg font-black ${titleColor} tracking-tight font-sans`}>{title}</span>
      </div>
      <ul className="space-y-4">
        {data?.map((item, i) => (
          <li key={i} className={`text-[14.5px] font-semibold leading-relaxed flex gap-3 ${textColor}`}>
            <div className={`w-1.5 h-1.5 rounded-none ${dotColor} mt-2 shrink-0`} />
            <span>{typeof item === 'string' ? item.replace('•', '').trim() : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SubjectDetailCard = ({ item }) => (
  <div className="bg-white border border-slate-100 rounded-none p-8 md:p-10 shadow-[0_4px_25px_rgb(0,0,0,0.02)] hover:border-slate-300 transition-all duration-700 mb-8 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/5 rounded-none -mr-16 -mt-16 blur-3xl"></div>
    <div className="flex items-start justify-between mb-10 relative z-10">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-slate-50 text-slate-800 rounded-none flex items-center justify-center shadow-md border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">세특 성취 수준 판독</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight">{item.subject_group || "교과 분석"}</span>
        </div>
      </div>
      <div className="hidden md:block px-4 py-2 bg-slate-50 rounded-none border border-slate-200/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
        교과 매칭 완료
      </div>
    </div>
    <div className="flex flex-col gap-6 relative z-10">
      <AnalysisBox type="strength" data={item?.strengths} />
      <AnalysisBox type="weakness" data={item?.weaknesses} />
    </div>
  </div>
);

const CompetencyCard = ({ title, icon: Icon, data, accentColor, iconBg, children }) => (
  <div className="bg-white rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden hover:border-slate-200 transition-all duration-700 w-full mb-8 group">
    <div className={`h-1.5 w-full bg-gradient-to-r ${accentColor}`}></div>
    <div className="p-8 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className={`p-4 ${iconBg} rounded-none text-white shadow-md group-hover:scale-105 transition-transform duration-500`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{title}</h3>

          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-none border border-slate-100 self-start sm:self-center">
          <div className="text-center px-2">
            <span className="block text-[10px] font-black text-slate-400 tracking-widest">평가 등급</span>
            <span className="text-2xl font-black text-blue-600 tracking-tight">{data?.grade || 'A'}</span>
          </div>
        </div>
      </div>

      {/* 라이트 모드용 정밀 점수 그래프 바 */}
      <div className="w-full bg-slate-100 h-2.5 rounded-none mb-10 overflow-hidden border border-slate-200/40">
        <div 
          className={`h-full bg-gradient-to-r ${accentColor} transition-all duration-1000`} 
          style={{ width: `${data?.score || 90}%` }}
        ></div>
      </div>

      {/* 루브릭 현황 섹션 (배점 비중 바 바로 아랫부분 매핑) */}
      {children}

      <div className="flex flex-col gap-6 mt-10">
        <AnalysisBox type="strength" data={data?.strengths} />
        <AnalysisBox type="weakness" data={data?.weaknesses} />
      </div>
    </div>
  </div>
);

const ACADEMIC_RUBRICS = [
  { category: "교과 성취도", rowspan: 5, question: "주요 교과 성적이 전공 기초 학업에 충분히 우수한가", result: "우수 (★★)" },
  { question: "전공 관련 선택 과목 성취도가 고교 표준 성적 대비 우수한가", result: "우수 (★★)" },
  { question: "학년이 올라갈수록 성취 추이가 안정적으로 유지 또는 향상되었는가", result: "충족 (★)" },
  { question: "과목별 편차(표준편차/등급)가 지나치게 크지 않고 고른가", result: "충족 (★)" },
  { question: "경쟁자 대비 선도적인 내신 경쟁력 및 성취도를 갖추었는가", result: "우수 (★★)" },
  { category: "수업 참여도", rowspan: 4, question: "토론 및 주도적 참여도가 수업 과정 기록에 적극적으로 나타나는가", result: "충족 (★)" },
  { question: "지적 한계 극복을 위한 질문과 성찰적 토론이 충분히 나타나는가", result: "부분충족 (O)" },
  { question: "교과 심화를 이끌어낸 발표 경험이 생활기록부에 충실히 기록되어 있는가", result: "우수 (★★)" },
  { question: "자기성찰적인 학습 태도와 끈기가 모든 세특에서 일관되게 우수한가", result: "충족 (★)" },
  { category: "탐구력", rowspan: 5, question: "단순 지식 암기를 넘어 심화 개념을 구조화한 학술 탐구가 이루어졌는가", result: "우수 (★★)" },
  { question: "탐구 설계의 주제가 실증적이며 학술적으로 정합하고 구체적인가", result: "우수 (★★)" },
  { question: "탐구 중 수리적/과학적 원리에 입각한 정교한 자료 분석 과정이 있는가", result: "부분충족 (O)" },
  { question: "예기치 못한 오차 발생 시 능동적인 한계 규명 및 문제 해결 과정이 나타나는가", result: "보완요구 (△)" },
  { question: "탐구 결과를 실생활의 최신 트렌드나 타 교과의 이론적 접점으로 확장하였는가", result: "충족 (★)" },
  { category: "학업 성장성", rowspan: 4, question: "학년이 올라갈수록 탐구의 깊이와 논문의 활용 수준이 연쇄적으로 심화되었는가", result: "우수 (★★)" },
  { question: "수업 방관을 예방하고 주도적인 학업 태도로 이끈 적극적 발전이 있는가", result: "충족 (★)" },
  { question: "원점수 및 과목 성취도가 학업 여정에서 선제적으로 향상되었는가", result: "충족 (★)" },
  { question: "학문적인 호기심이 단절 없이 3년간 지속적·유기적으로 나타나는가", result: "우수 (★★)" },
  { category: "과목 선택", rowspan: 4, question: "지원 전공의 기초 핵심이 되는 수·과학 과목을 빠짐없이 선택하였는가", result: "우수 (★★)" },
  { question: "난도가 높은 고교 외 전문교과나 심화과목 이수를 위해 적극 노력했는가", result: "충족 (★)" },
  { question: "선택 과목 간의 학제적 가이드라인이 어긋남 없이 일관성을 띄는가", result: "우수 (★★)" },
  { question: "학생수 미달 등으로 등급 획득이 불리하더라도 도전적인 선택을 하였는가", result: "우수 (★★)" }
];

const CAREER_RUBRICS = [
  { category: "진로 관심도", rowspan: 3, question: "전공 목표가 고연차로 진급할수록 좁혀지고 명확히 성문화되는가", result: "우수 (★★)" },
  { question: "특정 이공 분야에 대한 관심도가 진로활동에 일관적으로 나타나는가", result: "우수 (★★)" },
  { question: "진로 관심의 궤적이 단발성에 그치지 않고 심화 확장되는가", result: "충족 (★)" },
  { category: "전공 관련 활동", rowspan: 4, question: "교과 세특을 관통하는 전공 지향 연구 및 학술 탐구가 구체적으로 존재하는가", result: "우수 (★★)" },
  { question: "동아리나 교내 활동 중 주도적 전공 연계 프로젝트를 성실히 기획한 경험이 있는가", result: "충족 (★)" },
  { question: "전공 탐구 성과를 동료와 공유하기 위한 다변화된 발표 경험이 나타나는가", result: "충족 (★)" },
  { question: "전공 주제 해결을 위해 전공 서적 발췌 분석 및 깊이 있는 조사를 수행했는가", result: "부분충족 (O)" },
  { category: "전공 이해도", rowspan: 4, question: "희망 분야의 기반 원리와 기술적 장벽을 충분히 이해하고 전개하는가", result: "충족 (★)" },
  { question: "전공 분야와 긴밀히 얽힌 현대 사회적 딜레마(예: 윤리 등)를 구조적으로 이해하는가", result: "부분충족 (O)" },
  { question: "학계 및 산업계의 최신 바이오/공학 트렌드를 정교히 수렴하고 해석해냈는가", result: "부분충족 (O)" },
  { question: "단순 개인적 흥미 수용을 넘어 대학 전공 기초에 준하는 학문적 이해도가 돋보이는가", result: "우수 (★★)" },
  { category: "전공 준비도", rowspan: 3, question: "전공 기초를 튼튼하게 보좌해줄 수 있는 과목(수학II, 전문과학 등)을 성실히 수강했는가", result: "우수 (★★)" },
  { question: "해당 분야 대학 진학 후 이탈 없이 완주할 수 있는 준비된 전공 적합 이수가 있는가", result: "충족 (★)" },
  { question: "개별 탐구물 중 지원 학과의 기초 개념과 일대일 정합하여 증명해내는 경험이 충분한가", result: "충족 (★)" },
  { category: "활동의 연계성", rowspan: 4, question: "교과 세특의 탐구 논지가 자율/진로활동 기록과 긴밀히 융합하여 흐르는가", result: "우수 (★★)" },
  { question: "상설 동아리의 세부 탐구 성과물이 교과 수업 과제로 영리하게 연계 연쇄되는가", result: "우수 (★★)" },
  { question: "1학년부터 3학년까지 전공을 향한 관심의 깊이가 심화 경로를 따르는가", result: "충족 (★)" },
  { question: "최종 서류 사정관이 보았을 때 본 학생부의 전체 방향이 지원 전공과 매끄럽게 연결되는가", result: "우수 (★★)" }
];

const COMMUNITY_RUBRICS = [
  { category: "협업능력", rowspan: 4, question: "다양한 교과 수행평가 중 모둠형 학술 과제를 성실히 수행한 누적이 기록되었는가", result: "충족 (★)" },
  { question: "실험 설계나 자료 요약 분담 중 이타적 협력 구조가 관찰 기록되었는가", result: "충족 (★)" },
  { question: "본인이 기여한 역할의 범위와 학술적 담당 영역이 구체적으로 명시되었는가", result: "우수 (★★)" },
  { question: "서로 대립하는 급우들이 하나의 지적 산출물을 완성하도록 유도해 보았는가", result: "충족 (★)" },
  { category: "소통능력", rowspan: 4, question: "학업적 성과를 타인에게 가시화하여 논리적으로 전수하고 설득하는 발표가 돋보이는가", result: "우수 (★★)" },
  { question: "모둠별 학술 토론 중 경청의 자세와 타인의 연구 방안을 정교하게 피드백했는가", result: "충족 (★)" },
  { question: "의견 대립 시 감정에 치우치지 않고 통계와 합리적 이론에 입각한 조율 사례가 있는가", result: "부분충족 (O)" },
  { question: "수업 진행 시 교사의 교안이나 동료의 견해를 수렴하는 개방적 경청 태도가 확실한가", result: "우수 (★★)" },
  { category: "책임감", rowspan: 4, question: "수업 및 실험 기자재 관리, 학습 도우미 등 학급 소임을 충실히 전개했는가", result: "우수 (★★)" },
  { question: "부장 활동이나 모둠 리더로서 프로젝트 전 주기에 걸쳐 연속적으로 참여했는가", result: "충족 (★)" },
  { question: "지필 평가 준비 중에도 멘토링이나 안전지킴이 등 공공 업무를 끝까지 완주했는가", result: "우수 (★★)" },
  { question: "모둠원의 탈퇴 등 예상치 못한 위기에도 팀 과제를 끝까지 지키고 책임졌는가", result: "충족 (★)" },
  { category: "리더십", rowspan: 4, question: "임원 선출 등 거창한 직함을 넘어, 모둠 탐구를 이끌어낸 리더십 경험이 상세한가", result: "우수 (★★)" },
  { question: "부진한 공동 결과물 도출을 방지하기 위해 적극적인 개선 해결책을 선제 제시했는가", result: "충족 (★)" },
  { question: "자신이 리더가 아닐지라도 주도적으로 동료들의 학술적 애로사항을 확인 지원했는가", result: "우수 (★★)" },
  { question: "급우들의 탐구욕을 자극하고 수리/과학 학습 풍토를 조성하는 긍정적 시너지를 발휘했는가", result: "우수 (★★)" },
  { category: "배려와 나눔", rowspan: 4, question: "개인주의를 탈피하고 학습 격차가 큰 동료에게 자신만의 공부 가이드를 배려했는가", result: "우수 (★★)" },
  { question: "동아리 활동 및 학급 행정 전반에 이타적인 방향으로 기여해본 직접적인 사례가 있는가", result: "충족 (★)" },
  { question: "대입 반영 축소와 무관하게 학급 내 청소나 행사 지원 등에 순수한 희생을 보였는가", result: "충족 (★)" },
  { question: "동료 평가나 사정관 면접 질문 시 성숙한 지적 인격과 인성을 겸비하고 있음이 입증되는가", result: "우수 (★★)" }
];

const SUBJECT_RUBRICS = [
  { category: "이해 및 자발성", rowspan: 2, question: "수업 내용을 단순 암기를 넘어 깊이 있게 이해하고 완벽히 소화했는가", result: "우수 (★★)" },
  { question: "학문적 호기심을 바탕으로 주도적인 질문을 스스로 생성했는가", result: "충족 (★)" },
  { category: "탐구 및 분석", rowspan: 2, question: "가설 수립 및 실험과정 설계 등 능동적인 탐구 활동을 직접 수행했는가", result: "우수 (★★)" },
  { question: "탐구 전반에서 수집된 객관적이고 구체적인 자료를 체계적으로 분석했는가", result: "부분충족 (O)" },
  { category: "진로 및 성장성", rowspan: 2, question: "교과 연계 심화 활동 기록이 희망 진로 및 전공과 부합하게 연결되는가", result: "우수 (★★)" },
  { question: "학년이 올라갈수록 탐구 수준과 연구의 성취도가 점진적으로 성장했는가", result: "충족 (★)" },
  { category: "학술 역량 확장성", rowspan: 2, question: "대학 진학 이후 고등 범주의 학문을 지속해서 발전시킬 가능성이 충분한가", result: "우수 (★★)" },
  { question: "다양한 이수 과목 간 세특이 유기적으로 얽혀 일관된 하나의 학술 스토리를 형성하는가", result: "충족 (★)" }
];

const mapRubricResults = (staticRubrics, dynamicResults) => {
  if (!dynamicResults || !Array.isArray(dynamicResults)) return staticRubrics;
  return staticRubrics.map((row, idx) => ({
    ...row,
    result: dynamicResults[idx] || row.result
  }));
};

const RubricTable = ({ title, iconColor, rubrics }) => {
  const getResultColor = (result) => {
    if (result.includes("우수")) return "text-blue-600";
    if (result.includes("충족") && !result.includes("부분")) return "text-emerald-600";
    if (result.includes("부분충족")) return "text-amber-600";
    if (result.includes("보완요구")) return "text-rose-600";
    return "text-slate-600";
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <ClipboardCheck className={`w-5.5 h-5.5 ${iconColor}`} strokeWidth={2.5} />
        <h4 className="text-[17px] font-black text-slate-900 tracking-tight">{title}</h4>
      </div>
      <div className="overflow-x-auto border border-slate-200/60 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse text-[12.5px] text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-3 bg-slate-50 font-black text-slate-500 border-b border-r border-slate-200/60 text-center w-28">평가 범주</th>
              <th className="p-3 bg-slate-50 font-black text-slate-500 border-b border-r border-slate-200/60">세부 핵심 질문 평정 지표 (Admissions Rubric)</th>
              <th className="p-3 bg-slate-50 font-black text-slate-500 border-b border-r border-slate-200/60 text-center w-28">판정 결과</th>
            </tr>
          </thead>
          <tbody>
            {rubrics.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                {row.category && (
                  <td 
                    rowSpan={row.rowspan} 
                    className="p-3 bg-slate-50/20 font-black text-slate-800 border-b border-r border-slate-200/60 text-center align-middle"
                  >
                    {row.category}
                  </td>
                )}
                <td className="p-3 border-b border-r border-slate-200/60 font-semibold text-slate-700 leading-relaxed">
                  {row.question}
                </td>
                <td className={`p-3 border-b border-slate-200/60 font-black text-center whitespace-nowrap ${getResultColor(row.result)}`}>
                  {row.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 메인 App 컴포넌트 선언 ---
const App = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [activeSubjectTab, setActiveSubjectTab] = useState("all");
  
  // 파싱 진행률 백분율 전용 상태 값 (0.0% ~ 100.0%)
  const [progress, setProgress] = useState(0);
  
  // 희망 계열 세분화 설정 상태 (기본값: medicine)
  const [targetMajor, setTargetMajor] = useState("medicine");
  // 계열 선택 탭 관리 상태 (기본값: med - 의약학·보건)
  const [activeTab, setActiveTab] = useState("med");

  // 전교과 내신 성적 평점 입력 상태
  const [estimatedGpa, setEstimatedGpa] = useState('1.15');

  // 고교 유형 설정 상태 (일반고, 전국단위 자사고, 광역단위 자사고, 영재/과학고, 외고/국제고)
  const [schoolType, setSchoolType] = useState('일반고');

  // 실시간 내신 등급 시뮬레이션용 임시 상태값
  const [simulatedGpa, setSimulatedGpa] = useState(1.15);

  // 결과 페이지 전용 서브 탭 분류 상태 ('admission' : 종합판독 및 대학진단, 'report' : 심층 정성리포트)
  const [activeResultTab, setActiveResultTab] = useState('admission');

  // 내신 지원 가능성 진단 탭의 내신 차트 권역 선택자 (기본 설정값: seoul)
  const [selectedRegion, setSelectedRegion] = useState('seoul');

  // 성적 등급제 선택자 ('9grade' : 9등급제, '5grade' : 5등급제)
  const [gradeSystem, setGradeSystem] = useState('9grade');

  // Gemini API 키 상태
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

  // 보안 로그인 인증 검사 함수
  const handleLogin = () => {
    if (VALID_PASSWORDS.includes(password)) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('보안 코드가 일치하지 않습니다. 승인된 코드를 확인해 주세요.');
    }
  };

  // 데모 데이터 분석 시뮬레이션 핸들러 함수 복원 정의
  const handleDemoAnalysis = () => {
    setLoading(true);
    setError(null);
    setEstimatedGpa('1.15'); // 데모 작동 시 내신 등급 동기화
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      const demoResult = JSON.parse(JSON.stringify(DEMO_ANALYSIS_DATA));
      demoResult.student_profile.major_track = majorMeta[targetMajor].label;
      demoResult.student_profile.estimated_gpa = '1.15';
      demoResult.student_profile.school_type = schoolType;
      demoResult.student_profile.student_name = demoResult.student_profile.student_name || "홍길동";
      setAnalysisResult(demoResult);
      setLoading(false);
      setActiveResultTab('admission'); // 기본적으로 새로운 '2페이지(진단 및 예측)'를 띄움
    }, 2000);
  };

  // 과목 분류 헬퍼 함수 선언
  const getCategorizedSubjects = () => {
    const categories = { korean: [], math: [], english: [], science: [], social: [], other: [] };
    if (!analysisResult?.subject_specific) return categories;
    analysisResult.subject_specific.forEach(item => {
      const cat = item.category?.toLowerCase();
      if (categories[cat]) categories[cat].push(item);
      else if (item.subject_group?.includes("국어")) categories.korean.push(item);
      else if (item.subject_group?.includes("수학")) categories.math.push(item);
      else if (item.subject_group?.includes("영어")) categories.english.push(item);
      else if (item.subject_group?.includes("과학")) categories.science.push(item);
      else if (item.subject_group?.includes("사회")) categories.social.push(item);
      else categories.other.push(item);
    });
    return categories;
  };

  // 전교과 내신 상태 동기화 처리
  useEffect(() => {
    const parsed = parseFloat(estimatedGpa);
    if (!isNaN(parsed) && parsed >= 1.0 && parsed <= 9.0) {
      setSimulatedGpa(parsed);
    }
  }, [estimatedGpa]);

  // 요청받은 21개의 학과 계열 완벽 구조화
  const majorMeta = {
    // 1. 의약학 및 보건의료 (6)
    medicine: { label: "의학계열", group: "med", color: "from-rose-500 to-pink-600" },
    dentistry: { label: "치의학계열", group: "med", color: "from-rose-500 to-pink-600" },
    oriental_medicine: { label: "한의학계열", group: "med", color: "from-orange-500 to-amber-600" },
    pharmacy: { label: "약학계열", group: "med", color: "from-purple-500 to-indigo-600" },
    veterinary: { label: "수의학계열", group: "med", color: "from-teal-500 to-emerald-600" },
    nursing_health: { label: "간호 · 보건계열", group: "med", color: "from-sky-500 to-blue-600" },

    // 2. 이공, 반도체 및 첨단산업 (10)
    natural: { label: "자연과학계열", group: "tech", color: "from-emerald-500 to-teal-600" },
    bio: { label: "생명 · 바이오계열", group: "tech", color: "from-green-500 to-emerald-600" },
    advanced_bio: { label: "첨단바이오계열", group: "tech", color: "from-teal-600 to-cyan-600" },
    engineering: { label: "공학계열", group: "tech", color: "from-blue-500 to-indigo-600" },
    semiconductor: { label: "반도체계열", group: "tech", color: "from-indigo-600 to-blue-700" },
    mobility: { label: "모빌리티계열", group: "tech", color: "from-cyan-500 to-blue-600" },
    it_ai: { label: "IT계열", group: "tech", color: "from-blue-600 to-cyan-600" },
    ai_sw: { label: "SW계열", group: "tech", color: "from-indigo-500 to-cyan-500" },
    architecture: { label: "건축계열", group: "tech", color: "from-amber-600 to-yellow-700" },
    contract: { label: "계약학과", group: "tech", color: "from-slate-600 to-slate-700" },

    // 3. 인문, 사회, 경영 및 교육 (5)
    humanities: { label: "인문학계열", group: "humanities", color: "from-amber-500 to-orange-600" },
    social: { label: "사회과학계열", group: "humanities", color: "from-purple-500 to-pink-500" },
    business_econ: { label: "경영경제계열", group: "humanities", color: "from-amber-600 to-yellow-600" },
    law_public: { label: "법학 · 공공인재계열", group: "humanities", color: "from-indigo-500 to-slate-600" },
    education: { label: "교육계열", group: "humanities", color: "from-emerald-500 to-lime-600" }
  };

  const groupLabels = {
    med: "의약학 · 보건 계열",
    tech: "이공 · 첨단 기술 계열",
    humanities: "인문 · 사회 · 상경 · 교육"
  };

  const regionLabels = {
    seoul: "서울권",
    metropolitan: "경기 · 인천권",
    chungcheong: "충청권",
    gangwon: "강원권",
    daegu_gyeongbuk: "대구 · 경북권",
    busan_gyeongnam: "부산 · 울산 · 경남권",
    honam_jeju: "호남 · 제주권"
  };

  const loadingMessages = [
    "업로드된 학생생활기록부 PDF 구조화 및 텍스트 마이닝...",
    "교과 이수 충실도(국·수·영·과·사) 정밀 정량 지표 추출 중...",
    "핵심 세부능력 및 특기사항 내 자기주도적 연계 탐구 흐름 추출...",
    "선택 희망 계열과 과목 이수 정합성 시뮬레이션 매칭 중...",
    "학업역량, 진로역량, 공동체역량 3대 핵심 평가 영역 지수 정량화...",
    "대학 입시 전문가 최종 의사판단용 종합 사정관 리포트 패키징..."
  ];

  // 진행율 소수점 애니메이션 및 단계 스위칭 타이머 통합 제어
  useEffect(() => {
    let progressTimer;
    let stepTimer;
    if (loading) {
      setProgress(0);
      setLoadingStep(0);
      
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99.5) return prev;
          const increment = prev > 80 ? 0.3 : (prev > 50 ? 0.8 : 1.4);
          return parseFloat((prev + increment).toFixed(1));
        });
      }, 150);

      stepTimer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3000);
    } else {
      setProgress(0);
      setLoadingStep(0);
    }
    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [loading]);

  // 지수 백오프 기반 재시도 로직
  const fetchWithRetry = async (url, options, retries = 5) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        let errorMsg = `통신 오류: ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody?.error?.message) {
            errorMsg = errBody.error.message;
          }
        } catch (_) {
          // ignore
        }
        
        const err = new Error(errorMsg);
        err.status = response.status;
        throw err;
      }
      return await response.json();
    } catch (err) {
      if (err.status === 404 || err.status === 400) {
        throw err;
      }
      if (retries > 0) {
        const delay = delays[5 - retries];
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw err;
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processSelectedFiles(selectedFiles);
  };

  const processSelectedFiles = (selectedFiles) => {
    if (selectedFiles && selectedFiles.length > 0) {
      const validFiles = [];
      const invalidFiles = [];
      
      selectedFiles.forEach(f => {
        const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
        const isImage = f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name);
        if (isPdf || isImage) {
          validFiles.push(f);
        } else {
          invalidFiles.push(f);
        }
      });

      if (invalidFiles.length > 0) {
        setError(`지원되지 않는 파일 형식이 포함되어 있습니다. PDF 또는 이미지 파일만 업로드 가능합니다. (제외된 파일: ${invalidFiles.map(f => f.name).join(', ')})`);
        return;
      }

      // Check total size limit (18MB to be safe for 20MB API payload limit)
      const currentSize = files.reduce((acc, f) => acc + f.size, 0);
      const incomingSize = validFiles.reduce((acc, f) => acc + f.size, 0);
      if (currentSize + incomingSize > 18 * 1024 * 1024) {
        setError('한 번에 업로드할 수 있는 파일의 총 크기는 18MB를 초과할 수 없습니다. 크기가 큰 파일은 분할하여 업로드해 주세요.');
        return;
      }

      setError(null);

      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFiles = Array.from(e.dataTransfer.files);
    processSelectedFiles(selectedFiles);
  };

  const clearFile = () => {
    setFiles([]);
    setAnalysisResult(null);
    setError(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
    setError(null);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (file.size < 1024 * 1024) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1800;
          const MAX_HEIGHT = 1800;
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          // Enable hardware-accelerated high-quality image smoothing to preserve sharp text/OCR readability
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(compressedFile);
          }, 'image/jpeg', 0.85); // 85% quality provides optimal sharpness for text/OCR reading
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeStudentRecord = async (isReParseVal = false) => {
    const isReParse = typeof isReParseVal === 'boolean' ? isReParseVal : false;
    if (files.length === 0) {
      setError('분석할 파일을 업로드해 주세요.');
      return;
    }
    const currentApiKey = import.meta.env.VITE_GEMINI_API_KEY || apiKey || localStorage.getItem('gemini_api_key') || '';
    if (!currentApiKey) {
      setError('Gemini API 키가 설정되지 않았습니다. 우측 상단의 설정 아이콘을 클릭하여 API 키를 저장해 주세요.');
      setShowApiKeyModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    if (!isReParse) {
      setAnalysisResult(null);
    }

    const selectedMajorText = majorMeta[targetMajor].label;

    const systemPrompt = `대한민국 대학 입시 전문가 및 입시 데이터를 다루는 교육 데이터 전문가입니다. 학생부(PDF 및 이미지) 파일을 정밀 분석하여 학업역량, 진로역량, 공동체역량 및 세특 연계 분석이 통합된 종합 리포트를 생성하십시오.
설명의 어조는 부드러우면서도 대학 입학사정관실 고유의 권위 있고 학술적인 전문 톤을 유지하십시오.
특히, 본 학생의 희망 지원 계열은 [${selectedMajorText}] 이며, 학생의 입력된 고교 유형은 [${schoolType}] 이고, 전교과 내신 등급은 [${estimatedGpa} 등급] 입니다. 이 고교 유형에 따른 보정치 및 전공 가중치 기준과 입력된 정량 내신 등급에 입각해 전공 학업 정합성과 세특 탐구의 깊이 및 이수율의 유불리를 정밀 심사하십시오.

[초고속 분석을 위한 출력 최적화 지침]
- 전체 분석 생성 시간을 단축하기 위해 불필요한 서사는 배제하십시오.
- 각 강점 및 보완 포인트는 데이터를 기반으로 1~2문장 이내의 핵심 위주로 아주 간결하게 작성하십시오.

[병렬 처리 및 필터링 핵심 지침 (Parallel Parsing & Fluff Filtering)]
1. 입력된 학생부 텍스트를 [인적학적사항], [창의적체험활동상황], [교과학습발달상황] 3가지 섹션으로 즉시 분할하고, 나머지 모든 부분(예: [출결사항], [수상경력], [봉사활동실적], [행특] 등)은 완전히 삭제하여 폐기하십시오.
2. 각 3가지 섹션을 상호 간섭 없이 동시에(Parallel) 파싱하여 핵심 개체(Entity)를 추출하며, 이 병렬 처리를 통해 파싱의 속도와 분석의 정확도를 극대화하십시오.
3. [인적학적사항] 섹션에서는 학생의 실명(이름) 정보만 추출하여 student_profile.student_name 필드에 기록하고, 해당 섹션의 나머지 부분은 전부 다 삭제하십시오.
4. 학생부 특유의 미사여구(예: '우수함', '열심히 참여함', '활동함', '노력함', '관심을 보임', '흥미를 가짐', '경험함', '체험함', '이해함', '맡은 역할을 수행함', '협조함', '접함', '알게됨', '점차 향상됨', '발전 가능성이 있음' 등)는 무의미한 단순 노이즈(Noise)로 간주하여 철저히 필터링하고 제외하십시오.
5. 이 노이즈 단어/문구들이 많이 감지될수록, 종합평가 등급(competencies의 academic, career, community 등급) 및 점수를 크게 감점하고 부정적인 영향을 미치도록 설계하십시오.
6. 오직 **[동기 -> 구체적 역량 활동 -> 결과 및 변화]** 구조를 지닌 실질적이고 인과적인 의미 있는 문맥만을 유효 평가 데이터로 전적으로 인정하며, 이 유효 데이터 비중이 높을수록 종합평가 등급 및 점수에 긍정적인 영향을 미치고 높은 등급을 부여하십시오.

[핵심 사정 원칙]
1. 학생의 희망 지원 계열이 자연계열(의학, 약학, 치의학, 한의학, 수의학, 첨단바이오, 반도체, IT 등)일 경우 수학 및 과학 교과이수 여부와 '원점수'를 정밀 확인하십시오. 98점 이상의 우수 수학/과학 성취도는 극찬 사유로 반영합니다.
2. 희망 분야 탐구 구체성: 지적호기심 → 자기주도적 활동 → 상세 실험/탐구 설계 → 구체적 성과 및 성찰의 5단계 흐름이 명확한 경우에 높은 수준의 역량으로 평가하십시오.
3. 역량별 가치 점수화 및 평가 등급 기준:
   - **A+ 등급**: 입력된 전교과 내신 등급이 1.00 ~ 1.20 범위에 속하며, 고교 유형이 '전국단위 자사고', '영재/과학고', '외고/국제고' 중 하나일 때에만 부여하십시오. 이 외의 모든 조건(일반고, 기타 특목고, 혹은 내신 범위를 벗어나는 경우 등)에서는 절대 A+ 등급을 부여할 수 없습니다.
   - **A ~ B+ 등급**: 내신 등급이 1.30 ~ 1.99 사이인 경우, 학생부 내용이 구체적이고 우수한 평가를 받고 있다면 A(또는 A-)에서 B+ 범위에서 평가 등급을 부여하십시오.
   - **B 등급 (또는 B+)**: 내신 등급이 2.00 ~ 3.00 사이인 경우 대부분 B(또는 B-) 등급으로 평가하되, 학생부 기록을 면밀히 분석하여 구체적인 탐구/실험 내용 및 활동 내용이 풍부하게 기록된 경우 B+ 등급으로 상향 평가하십시오.
   - **1.00 ~ 1.29 내신 등급**: 내신 등급이 이 범위에 속하는 경우, 학업 역량(academic competency) 평가 및 관련 항목에서 학업 능력이 대단히 '우수함'을 분명하고 적극적으로 평가 및 서술하십시오.
   - 평가 등급은 오직 다음의 8단계 기본단계 등급(A+, A, A-, B+, B, B-, C+, C) 중 하나를 엄격히 부여하고 이에 상응하는 정량 점수(60~100점 사이)를 부여하십시오.
4. 종합 사정관 의견(admissions_verdict): 학생부 전체 성과, 전공 진실성, 향후 대학 입시에서의 경쟁력과 주의점에 대해 엄격하게 3~4문장 분량의 핵심 심층 총평을 작성하십시오.
5. 과목순서: 국어교과군, 수학교과군, 영어교과군, 과학교과군, 사회교과군 순서로 엄격하게 배열하십시오. 기타교과 및 기타 교과군 분석 항목은 완전히 삭제하고 절대 분석 대상에 포함시키지 마십시오.
6. 문장 내 따옴표는 작은 따옴표(')만 사용하십시오.
7. 수학 원점수 언급 조건: 내신 등급이 1.50 등급 이내에 속하고, 희망 전공 계열이 의학계열, 치의학계열, 한의학계열, 약학계열, 수의학 계열, 공학계열, 반도체 계열, 계약학과, 경영경제계열 중 하나인 경우, 학생부 내 수학 교과(수학I, 수학II, 미적분, 기하 등)의 '원점수' 성취도에 대한 구체적이고 정확한 언급을 총평 및 분석 결과에 반드시 포함시키십시오.
8. 파일 포맷 및 다중 형식 처리:
   - 업로드된 파일이 일반 텍스트 PDF, 스캔 이미지 PDF, 또는 모바일 카메라 촬영본 이미지 등 어떤 형태의 형식과 상태(낮은 화질, 비뚤어짐, 빛 반사, 흐림, OCR 인식 노이즈 등)를 가지더라도 뛰어난 비전-언어 멀티모달 능력을 활용해 글씨를 오차 없이 정교하게 판독해 내십시오.
   - 단 한 자의 세특 내용도 유실되지 않도록 페이지 순서대로 꼼꼼히 탐독하고, 흐릿하거나 겹쳐서 인식된 단어는 앞뒤 문맥을 바탕으로 지능적으로 복원하십시오.
   - 분석 대상은 오직 [인적학적사항], [창의적체험활동상황], [교과학습발달상황] 3가지 섹션이며, 지정되지 않은 나머지 항목들(출결, 수상, 봉사, 행특 등)은 분석 대상에서 완전히 차단하고 신속하게 정밀 매핑하십시오.
9. 루브릭 판정결과 도출 (rubrics): 학생부 기록에 근거하여 다음 4개 표의 총 68개 평정 문항 각각에 대해 개별 판정결과를 도출하십시오. 각 항목의 판정결과 문자열은 오직 '우수 (★★)', '충족 (★)', '부분충족 (O)', '보완요구 (X)' 중 하나로만 판단하여 부여해야 합니다.
  - academic: 학업역량 루브릭 문항 순서대로 22개의 판정결과 문자열 배열을 생성하십시오.
  - career: 진로역량 루브릭 문항 순서대로 18개의 판정결과 문자열 배열을 생성하십시오.
  - community: 공동체역량 루브릭 문항 순서대로 20개의 판정결과 문자열 배열을 생성하십시오.
  - subject: 세특 연계 정성 분석 루브릭 문항 순서대로 8개의 판정결과 문자열 배열을 생성하십시오.
10. 결과는 지정된 유효한 JSON 형식으로만 응답하십시오.
11. 학생의 이름 추출: 업로드한 여러 장의 생활기록부 문서 중에서 학생의 실명(예: '김진만', '홍길동' 등)을 감지 및 추출하여 student_profile.student_name 필드에 기록하십시오. 만약 이름이 완전히 가려져(마스킹) 있거나 찾을 수 없을 때만 '분석대상'으로 기재해 주십시오.
12. 파일 데이터 연계 및 매핑 정확성 및 교과군 세분화:
  - subject_specific 배열에는 반드시 다음 5가지 교과군 분석 데이터가 명시된 순서대로 정확히 5개 원소로 구성되어야 합니다. 임의로 누락하거나 순서를 바꾸거나 크기를 줄여서는 안 되며, 기타 교과군은 제외해야 합니다.
    1) {"subject_group": "국어 교과군 분석", "category": "korean", "strengths": [...], "weaknesses": [...]}
    2) {"subject_group": "수학 교과군 분석", "category": "math", "strengths": [...], "weaknesses": [...]}
    3) {"subject_group": "영어 교과군 분석", "category": "english", "strengths": [...], "weaknesses": [...]}
    4) {"subject_group": "과학 교과군 분석", "category": "science", "strengths": [...], "weaknesses": [...]}
    5) {"subject_group": "사회 교과군 분석", "category": "social", "strengths": [...], "weaknesses": [...]}
  - 각 교과군별로 강점(strengths) 3개와 보완점(weaknesses) 4개를 학생부 데이터를 정확하게 마이닝하여 구체적인 사례(수업 태도, 탐구 성과, 질문 습관 등)를 토대로 정교하게 분석 및 추출하십시오. 학생부에 해당 교과군 기록이 거의 없거나 빈약한 경우에도 해당 학생의 교과 이수 현황과 기본 역량을 유추하여 성실하고 개연성 있게 평가 서술을 채워야 하며, 임의로 제외하거나 배열 크기를 줄여서는 안 됩니다.
  - 학업/진로/공동체 각 역량별 강점(strengths) 3개와 보완점(weaknesses) 4개 역시 학생부의 서술과 내신 정량 등급을 유기적으로 반영하여 구체적이고 현실적으로 추출하십시오.
  - 루브릭 현황(rubrics)의 총 68개 각 평정 문항은 학생의 실제 활동 깊이와 수준을 상세하게 심사하여 타당성 있는 등급('우수 (★★)', '충족 (★)', '부분충족 (O)', '보완요구 (X)')을 정확히 매핑하십시오.`;

    let userPrompt = `업로드된 파일들을 분석하여 학업/진로/공동체 역량별 평가 정보(점수, 등급, 강점 3개, 보완점 4개)와 전 교과 상세 세특 판독 결과, 그리고 최종 사정관 진단이 수록된 전문 리포트를 생성하십시오.`;
    if (isReParse && analysisResult) {
      userPrompt = `[중요: 누락 데이터 집중 복원 요청]
이전에 생성된 불완전한 정성 분석 결과(JSON)는 다음과 같습니다:
${JSON.stringify(analysisResult, null, 2)}

위의 이전 결과에서 강점(strengths)이나 보완점(weaknesses)이 비어있거나 누락된 부분을 감지하십시오.
업로드한 원본 생활기록부 문서를 정밀하게 재독해하여, 오직 비어있거나 누락된 항목들만 정확히 채워 넣으십시오.
기존에 정상적으로 이미 채워져 있는 텍스트 항목들은 임의로 내용을 변경하거나 지우지 말고 그대로 유지(복사)하여 리턴해야 합니다.
학업역량, 진로역량, 공동체역량의 강점(3개)/보완점(4개), 그리고 5대 교과군별 강점(3개)/보완점(4개)이 누락 없이 가득 차 있는 완전한 JSON 결과물을 재생성해 주십시오.`;
    }

    try {
      // Convert all files to base64 in parallel
      const fileDataPromises = files.map(async (f) => {
        let fileToProcess = f;
        const isImage = f.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(f.name);
        if (isImage) {
          try {
            fileToProcess = await compressImage(f);
          } catch (compressErr) {
            console.warn("Failed to compress image, using original:", compressErr);
          }
        }
        const base64Data = await fileToBase64(fileToProcess);
        return {
          inlineData: {
            mimeType: fileToProcess.type || (fileToProcess.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
            data: base64Data
          }
        };
      });
      const fileParts = await Promise.all(fileDataPromises);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${currentApiKey}`;
      
      const responseSchema = {
        type: "OBJECT",
        properties: {
          student_profile: {
            type: "OBJECT",
            properties: {
              student_name: { type: "STRING" },
              estimated_gpa: { type: "STRING" },
              major_track: { type: "STRING" },
              school_type: { type: "STRING" }
            },
            required: ["student_name", "estimated_gpa", "major_track", "school_type"]
          },
          admissions_verdict: { type: "STRING" },
          competencies: {
            type: "OBJECT",
            properties: {
              academic: { 
                type: "OBJECT", 
                properties: { 
                  score: { type: "INTEGER" },
                  grade: { type: "STRING" },
                  strengths: { type: "ARRAY", items: { type: "STRING" }, minItems: 3, maxItems: 3 }, 
                  weaknesses: { type: "ARRAY", items: { type: "STRING" }, minItems: 4, maxItems: 4 } 
                },
                required: ["score", "grade", "strengths", "weaknesses"]
              },
              career: { 
                type: "OBJECT", 
                properties: { 
                  score: { type: "INTEGER" },
                  grade: { type: "STRING" },
                  strengths: { type: "ARRAY", items: { type: "STRING" }, minItems: 3, maxItems: 3 }, 
                  weaknesses: { type: "ARRAY", items: { type: "STRING" }, minItems: 4, maxItems: 4 } 
                },
                required: ["score", "grade", "strengths", "weaknesses"]
              },
              community: { 
                type: "OBJECT", 
                properties: { 
                  score: { type: "INTEGER" },
                  grade: { type: "STRING" },
                  strengths: { type: "ARRAY", items: { type: "STRING" }, minItems: 3, maxItems: 3 }, 
                  weaknesses: { type: "ARRAY", items: { type: "STRING" }, minItems: 4, maxItems: 4 } 
                },
                required: ["score", "grade", "strengths", "weaknesses"]
              }
            },
            required: ["academic", "career", "community"]
          },
          subject_specific: {
            type: "ARRAY",
            minItems: 5,
            maxItems: 5,
            items: {
              type: "OBJECT",
              properties: {
                subject_group: { type: "STRING" },
                category: { type: "STRING" },
                strengths: { type: "ARRAY", items: { type: "STRING" }, minItems: 3, maxItems: 3 },
                weaknesses: { type: "ARRAY", items: { type: "STRING" }, minItems: 4, maxItems: 4 }
              },
              required: ["subject_group", "category", "strengths", "weaknesses"]
            }
          },
          rubrics: {
            type: "OBJECT",
            properties: {
              academic: { type: "ARRAY", items: { type: "STRING" }, minItems: 22, maxItems: 22 },
              career: { type: "ARRAY", items: { type: "STRING" }, minItems: 18, maxItems: 18 },
              community: { type: "ARRAY", items: { type: "STRING" }, minItems: 20, maxItems: 20 },
              subject: { type: "ARRAY", items: { type: "STRING" }, minItems: 8, maxItems: 8 }
            },
            required: ["academic", "career", "community", "subject"]
          }
        },
        required: ["student_profile", "admissions_verdict", "competencies", "subject_specific", "rubrics"]
      };

      // 1. Dynamic Model Discovery & API key validation (with caching to eliminate discovery latency on subsequent calls)
      let discoveredModels = [];
      let usedApiVersion = 'v1beta';
      let keyValidationError = null;

      const cacheKey = `gemini_discovered_${currentApiKey.slice(-8)}`;
      let cachedDiscovered = null;
      try {
        const cachedStr = localStorage.getItem(cacheKey);
        if (cachedStr) {
          cachedDiscovered = JSON.parse(cachedStr);
        }
      } catch (e) {
        console.warn("Failed to read discovered models cache:", e);
      }

      if (cachedDiscovered && cachedDiscovered.models?.length > 0) {
        discoveredModels = cachedDiscovered.models;
        usedApiVersion = cachedDiscovered.apiVersion || 'v1beta';
      } else {
        try {
          const listUrlBeta = `https://generativelanguage.googleapis.com/v1beta/models?key=${currentApiKey}`;
          const listResBeta = await fetch(listUrlBeta);
          if (listResBeta.ok) {
            const data = await listResBeta.json();
            if (data.models && data.models.length > 0) {
              discoveredModels = data.models
                .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                .map(m => m.name.replace('models/', ''));
              usedApiVersion = 'v1beta';
              
              try {
                localStorage.setItem(cacheKey, JSON.stringify({
                  models: discoveredModels,
                  apiVersion: usedApiVersion,
                  timestamp: Date.now()
                }));
              } catch (_) {}
            }
          } else {
            try {
              const errBody = await listResBeta.json();
              if (errBody?.error?.message) {
                const msg = errBody.error.message;
                if (msg.includes('API key') || msg.includes('API_KEY') || msg.includes('disabled') || msg.includes('enable')) {
                  keyValidationError = msg;
                } else {
                  keyValidationError = `Listing models failed: ${msg}`;
                }
              } else {
                keyValidationError = `HTTP ${listResBeta.status}`;
              }
            } catch (_) {
              keyValidationError = `HTTP ${listResBeta.status}`;
            }
          }
        } catch (e) {
          console.warn("Failed to list models via v1beta:", e);
          keyValidationError = e.message;
        }
      }

      if (keyValidationError && discoveredModels.length === 0) {
        throw new Error(`API 키 인증 또는 활성화에 실패했습니다: ${keyValidationError}`);
      }

      let selectedModel = null;
      if (discoveredModels.length > 0) {
        console.log("Discovered available models:", discoveredModels, "using API version:", usedApiVersion);
        const preferredModels = [MODEL_NAME, "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
        for (const pref of preferredModels) {
          if (discoveredModels.includes(pref)) {
            selectedModel = pref;
            break;
          }
        }
        if (!selectedModel) {
          const flashModel = discoveredModels.find(m => m.includes('flash') && !m.includes('tuning'));
          if (flashModel) {
            selectedModel = flashModel;
          } else {
            selectedModel = discoveredModels[0];
          }
        }
      }

      // 2. Fallback execution list (Strictly v1beta to support systemInstruction and responseSchema)
      const staticConfigs = [
        { model: MODEL_NAME, apiVersion: "v1beta" },
        { model: "gemini-2.0-flash", apiVersion: "v1beta" },
        { model: "gemini-1.5-flash", apiVersion: "v1beta" }
      ];

      const configsToTry = [];
      if (selectedModel) {
        configsToTry.push({ model: selectedModel, apiVersion: usedApiVersion });
      }
      for (const sc of staticConfigs) {
        if (!configsToTry.some(c => c.model === sc.model && c.apiVersion === sc.apiVersion)) {
          configsToTry.push(sc);
        }
      }

      let result = null;
      let usedModel = MODEL_NAME;

      for (let i = 0; i < configsToTry.length; i++) {
        const config = configsToTry[i];
        try {
          const url = `https://generativelanguage.googleapis.com/${config.apiVersion}/models/${config.model}:generateContent?key=${currentApiKey}`;
          const payload = {
            contents: [{ parts: [{ text: userPrompt }, ...fileParts] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { 
              responseMimeType: "application/json",
              responseSchema: responseSchema,
              maxOutputTokens: 8192, 
              temperature: 0.1 
            }
          };
          result = await fetchWithRetry(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          usedModel = config.model;
          break;
        } catch (fetchErr) {
          console.warn(`Model config ${config.model} (${config.apiVersion}) failed:`, fetchErr);
          // If the error is a quota limit (429), billing/permission issue (403), or invalid payload/bad request (400),
          // continuing to try other models will not resolve the issue and will only mask the true error message.
          // Therefore, we immediately throw the error if it is not a 404 (Not Found).
          if (fetchErr.status && fetchErr.status !== 404) {
            throw fetchErr;
          }
          if (i === configsToTry.length - 1) {
            throw fetchErr;
          }
        }
      }

      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsedData = cleanAndParseJson(rawText);
      if (!parsedData) {
        console.error("Failed to parse JSON response:", rawText);
        throw new Error("API 응답 데이터 형식이 올바르지 않거나 손상되었습니다.");
      }

      setProgress(100); 
      // 학생의 정량 내신 정보를 동기화
      parsedData.student_profile.estimated_gpa = estimatedGpa;
      parsedData.student_profile.major_track = selectedMajorText;
      parsedData.student_profile.school_type = schoolType;
      parsedData.student_profile.student_name = parsedData.student_profile.student_name || "분석대상";
      setAnalysisResult(parsedData);
      setActiveResultTab('admission'); // 기본적으로 새로운 '2페이지(진단 및 예측)'를 띄움
    } catch (err) {
      console.error(err);
      setError(`생활기록부 정밀 분석 중 오류가 발생했습니다. (${err.message}). API 키 유효성 및 네트워크 상태를 확인해 주세요. 우측 하단의 데모 데이터 분석 시뮬레이션을 사용하여 가독성 테스트를 즉시 수행할 수 있습니다.`);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowApiKeyModal(false);
  };

  const resolveOverallGrade = () => {
    const academicGrade = analysisResult?.competencies?.academic?.grade || 'A';
    return academicGrade;
  };

  // 내신 9등급제 백분율 위치 환산 공식 (1.0~5.0 등급 범위 가독성 스케일링으로 확장 대응)
  const get9GradePosition = (val) => {
    const minGpaLimit = 1.0;
    const maxGpaLimit = 5.0; // 5.0 등급 스케일 확장 대응
    const calculated = ((val - minGpaLimit) / (maxGpaLimit - minGpaLimit)) * 100;
    return Math.min(100, Math.max(0, calculated));
  };

  // 내신 5등급제 예상 백분율 위치 환산 공식 (1.0~4.0 등급 범위 스케일링으로 확장 대응)
  const get5GradePosition = (val) => {
    const minGpaLimit = 1.0;
    const maxGpaLimit = 4.0; // 4.0 등급 범위까지 대응
    const calculated = ((val - minGpaLimit) / (maxGpaLimit - minGpaLimit)) * 100;
    return Math.min(100, Math.max(0, calculated));
  };

  // 9등급제 GPA를 5등급제 GPA로 근사 변환하는 함수
  const estimate5Gpa = (gpa9) => {
    const val = parseFloat(gpa9);
    if (isNaN(val)) return 1.0;
    // 9등급제 1.0 -> 5등급제 1.0
    // 9등급제 9.0 -> 5등급제 5.0
    // 9등급제 1.4 -> 1.0 + (1.4-1.0)*0.5 = 1.20 (서울대 minGpa5 1.10 ~ maxGpa5 1.35 범위에 근사)
    return parseFloat((1.0 + (val - 1.0) * 0.5).toFixed(2));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 font-sans font-normal selection:bg-blue-500/10">
        <div className="bg-white rounded-none p-10 md:p-12 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 border border-slate-100/50">
          <div className="w-16 h-16 bg-[#2563EB] rounded-none flex items-center justify-center mb-8 shadow-md">
            <Lock className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">보안 코드 인증</h2>
          <p className="text-slate-500 text-center text-sm font-semibold mb-8 leading-relaxed">
            데이터 분석 시스템입니다.<br/>접근을 위해 보안 코드를 입력해 주세요.
          </p>
          
          <div className="w-full relative mb-4 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#2563EB]">
              <Key className="w-5 h-5 text-slate-400 group-focus-within:text-[#2563EB] transition-colors" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="보안 코드 입력"
              className="w-full bg-[#F1F5F9] border border-slate-100 rounded-none py-4 pl-14 pr-4 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>
          {error && (
            <div className="text-rose-600 text-xs font-bold mb-4 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-[#2563EB] hover:bg-blue-600 text-white font-black text-base transition-all duration-300 shadow-md hover:shadow-lg rounded-none flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-white" />
            <span>시스템 접속</span>
          </button>

          <div className="text-center mt-10">
            <span className="text-[9px] text-slate-400 font-bold tracking-widest">SECURED BY IPSISKETCH DATA LAB</span>
          </div>
        </div>
      </div>
    );
  }

  const isCompetencyEmpty = 
    !analysisResult?.competencies?.academic?.strengths?.length || 
    !analysisResult?.competencies?.academic?.weaknesses?.length ||
    !analysisResult?.competencies?.career?.strengths?.length || 
    !analysisResult?.competencies?.career?.weaknesses?.length ||
    !analysisResult?.competencies?.community?.strengths?.length || 
    !analysisResult?.competencies?.community?.weaknesses?.length;

  const isSubjectSpecificEmpty = 
    !analysisResult?.subject_specific || 
    analysisResult.subject_specific.length === 0 ||
    analysisResult.subject_specific.some(item => !item.strengths?.length || !item.weaknesses?.length);

  const showReAnalyzeButton = analysisResult && (isCompetencyEmpty || isSubjectSpecificEmpty);

  const categorizedSubjects = getCategorizedSubjects();
  const studentOverallGpa = simulatedGpa;
  const studentOverallGpa5 = estimate5Gpa(simulatedGpa);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans font-normal antialiased selection:bg-blue-600/10 selection:text-blue-600">
      {/* 글로벌 네비게이션 헤더 */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black text-xl tracking-tighter">
              sL
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                scan_LIFE <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100/50">COMPREHENSIVE ADMISSION</span>
              </h1>
              <span className="text-[10px] block text-slate-400 tracking-widest uppercase font-extrabold">학생생활기록부 종합 사정 플랫폼</span>
            </div>
          </div>
          

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 상향 경고 및 알림판 */}
        {error && (
          <div className="mb-8 p-5 bg-rose-50 border border-rose-200 text-rose-950 rounded-none flex items-start gap-4 shadow-sm animate-in slide-in-from-top-4">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-black tracking-tight">시스템 연계 오류</h4>
              <p className="text-xs font-semibold leading-relaxed text-rose-800">{error}</p>
            </div>
          </div>
        )}

        {/* 1. 입력 및 설정 화면 (결과 데이터가 없을 때) */}
        {!analysisResult && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* 희망 계열 설정 카드 */}
              <div className="bg-white border border-slate-200/80 rounded-none p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)]">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">지원 희망 모집단위 및 계열 선택</h3>
                </div>

                {/* 대분류 탭 */}
                <div className="flex border-b border-slate-100 mb-8">
                  {Object.entries(groupLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`py-4 px-6 text-sm font-black tracking-tight border-b-2 transition-all relative -mb-px ${
                        activeTab === key 
                          ? 'border-slate-900 text-slate-950 font-black' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* 계열 세부 리스트 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(majorMeta)
                    .filter(([_, value]) => value.group === activeTab)
                    .map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setTargetMajor(key)}
                        className={`p-4 border text-left transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                          targetMajor === key
                            ? 'border-slate-900 bg-slate-950 text-white shadow-md'
                            : 'border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-wider block mb-1.5 ${
                          targetMajor === key ? 'text-blue-400' : 'text-slate-400'
                        }`}>
                          {groupLabels[activeTab]}
                        </span>
                        <span className="text-[14.5px] font-extrabold tracking-tight block">
                          {value.label}
                        </span>
                        <div className={`absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b ${value.color} opacity-80`}></div>
                      </button>
                    ))}
                </div>
              </div>

              {/* 내신 및 고교 유형 입력 카드 */}
              <div className="bg-white border border-slate-200/80 rounded-none p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 내신 입력 */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">전교과 내신 평점 (9등급제)</h3>
                    </div>
                    <div className="w-full relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Activity className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="1.00"
                        max="9.00"
                        value={estimatedGpa}
                        onChange={(e) => setEstimatedGpa(e.target.value)}
                        placeholder="예: 1.15"
                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white rounded-none py-4 pl-14 pr-20 text-slate-900 font-extrabold tracking-tight focus:outline-none transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                        <span className="text-xs font-black text-slate-400 tracking-wider">등급 (GPA)</span>
                      </div>
                    </div>

                  </div>

                  {/* 고교유형 선택 */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">출신 고등학교 유형</h3>
                    </div>
                    <div className="w-full relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Library className="w-5 h-5 text-slate-400" />
                      </div>
                      <select
                        value={schoolType}
                        onChange={(e) => setSchoolType(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white rounded-none py-4 pl-14 pr-10 text-slate-900 font-extrabold tracking-tight focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="일반고">일반고</option>
                        <option value="전국단위 자사고">전국단위 자사고</option>
                        <option value="광역단위 자사고">광역단위 자사고</option>
                        <option value="영재/과학고">영재/과학고</option>
                        <option value="외고/국제고">외고/국제고</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* 생기부 업로드 및 시뮬레이션 카드 */}
            <div className="space-y-8">
              <div className="bg-white border border-slate-200/80 rounded-none p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)] flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">학교생활기록부 업로드</h3>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-none p-6 flex flex-col justify-center transition-all duration-500 min-h-64 ${
                      isDragging
                        ? 'border-blue-600 bg-blue-50/10'
                        : 'border-slate-200 hover:border-slate-400 bg-slate-50/30'
                    }`}
                  >
                    <input
                      type="file"
                      id="student-record-upload"
                      accept=".pdf,image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {files.length === 0 ? (
                      <label htmlFor="student-record-upload" className="cursor-pointer flex flex-col items-center justify-center py-6 w-full h-full">
                        <div className="w-16 h-16 bg-slate-100 rounded-none flex items-center justify-center mb-5 hover:bg-slate-200 transition-colors">
                          <Upload className="w-7 h-7 text-slate-600" />
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm font-black text-slate-800 block">생활기록부 파일 드롭 또는 선택</span>
                          <span className="text-[11px] font-medium text-slate-400 block">PDF, 스캔본 PDF, 이미지 복수 선택 지원</span>
                        </div>
                      </label>
                    ) : (
                      <div className="flex flex-col w-full h-full text-left">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                          <span className="text-xs font-black text-slate-700">업로드 대기 중인 파일 ({files.length}개)</span>
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); clearFile(); }} 
                            className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1"
                          >
                            전체 삭제
                          </button>
                        </div>
                        
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 select-none">
                          {files.map((f, idx) => {
                            const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
                            return (
                              <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-none text-left">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {isPdf ? (
                                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                  ) : (
                                    <Image className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                  <span className="text-xs font-bold text-slate-800 truncate max-w-[180px] md:max-w-[200px]">
                                    {f.name}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                                    ({(f.size / 1024 / 1024).toFixed(2)}MB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(idx);
                                  }}
                                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-end">
                          <label 
                            htmlFor="student-record-upload" 
                            className="cursor-pointer px-4 py-2 border border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-950 font-black text-xs transition-all bg-white hover:bg-slate-50 inline-flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>파일 추가하기</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mt-8">
                  {files.length > 0 && (
                    <button
                      onClick={() => analyzeStudentRecord(false)}
                      className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-black text-[15px] transition-all duration-300 flex items-center justify-center gap-2 rounded-none"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>생활기록부 정밀 정성분석 시작</span>
                    </button>
                  )}
                  <button
                    onClick={handleDemoAnalysis}
                    className="w-full py-4 border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-950 font-black text-[14.5px] transition-all duration-300 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 rounded-none"
                  >
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <span>데모 데이터 분석 시뮬레이션 작동</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 대기 및 로딩 중 화면 */}
        {loading && (
          <div className="bg-white border border-slate-200/80 rounded-none p-12 md:p-20 text-center max-w-2xl mx-auto shadow-[0_15px_50px_rgba(0,0,0,0.03)] my-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 relative">
                <Loader2 className="w-10 h-10 text-slate-900 animate-spin" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">학생부 정밀 심사 엔진 가동 중</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">STUDENT LIFE RECORD SCANNING</p>
              
              {/* 진행 바 */}
              <div className="w-full bg-slate-100 h-2 border border-slate-200/50 mb-4 overflow-hidden rounded-none relative">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between w-full text-[11px] font-black text-slate-400 tracking-wider mb-8">
                <span>ANALYZING DATA...</span>
                <span>{progress}%</span>
              </div>
              
              {/* 진행 메시지 */}
              <div className="bg-slate-50/80 border border-slate-100 p-5 w-full min-h-[70px] flex items-center justify-center rounded-none">
                <span className="text-[14px] font-extrabold text-slate-700 tracking-tight animate-pulse">
                  {loadingMessages[loadingStep]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. 분석 완료 결과 화면 */}
        {analysisResult && !loading && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* 학생 정보 통합 요약 헤더 카드 */}
            <div className="bg-slate-950 text-white p-8 md:p-10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden rounded-none">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-none -mr-40 -mt-40 blur-3xl"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  {analysisResult.student_profile.student_name && (
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black tracking-wider uppercase rounded-none">
                      {analysisResult.student_profile.student_name} 학생
                    </span>
                  )}
                  <span className="px-3 py-1 bg-blue-600/30 text-blue-300 border border-blue-500/20 text-[10px] font-black tracking-widest uppercase rounded-none">
                    분석 진단 완료
                  </span>
                  <span className="text-[10px] font-black text-slate-400 tracking-wider">
                    대상 학교유형: {analysisResult.student_profile.school_type || "일반계 고등학교"}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">
                    {analysisResult.student_profile.major_track || "의약학 / 바이오 융합 계열"}
                  </h2>

                </div>
              </div>
              
              <div className="flex items-center gap-6 relative z-10 self-start md:self-center shrink-0">
                <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-none">
                  <span className="block text-[10px] font-black text-slate-400 tracking-widest mb-1">입력 내신등급</span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {studentOverallGpa.toFixed(2)}
                    <span className="text-sm font-bold text-slate-500 ml-1">등급</span>
                  </span>
                </div>
                <div className="h-10 w-px bg-slate-800"></div>
                <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-none">
                  <span className="block text-[10px] font-black text-slate-400 tracking-widest mb-1">종합 사정등급</span>
                  <span className="text-3xl font-black text-blue-400 tracking-tight">{resolveOverallGrade()}</span>
                </div>
              </div>
            </div>

            {/* 결과 뷰 탭 전환기 */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveResultTab('admission')}
                className={`py-5 px-8 text-[15px] font-black tracking-tight border-b-2 transition-all flex items-center gap-2 rounded-none -mb-px ${
                  activeResultTab === 'admission'
                    ? 'border-slate-900 text-slate-950 font-black bg-white/50'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>종합판독 및 대학진단</span>
              </button>
              <button
                onClick={() => setActiveResultTab('report')}
                className={`py-5 px-8 text-[15px] font-black tracking-tight border-b-2 transition-all flex items-center gap-2 rounded-none -mb-px ${
                  activeResultTab === 'report'
                    ? 'border-slate-900 text-slate-950 font-black bg-white/50'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <ClipboardCheck className="w-4.5 h-4.5" />
                <span>심층 정성리포트</span>
              </button>
              
              <button
                onClick={clearFile}
                className="ml-auto text-xs font-black text-slate-500 hover:text-slate-800 transition-colors uppercase border border-slate-200 px-4 my-2 flex items-center gap-1.5 self-center rounded-none"
              >
                <X className="w-3.5 h-3.5" />
                <span>새로운 분석 시작</span>
              </button>
            </div>

            {/* 탭 1. 종합 판독 및 내신/대학 모의 진단 시뮬레이션 */}
            {activeResultTab === 'admission' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 종합의견 및 진단 결과 */}
                <div className="lg:col-span-1 space-y-8">
                  {/* 입학사정관실 의사판단 총평 */}
                  <div className="bg-white border border-slate-200/80 rounded-none p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)] space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">종합 판독 소견서</h3>
                    </div>
                    <p className="text-[14.5px] font-semibold text-slate-700 leading-relaxed text-justify">
                      {analysisResult.admissions_verdict}
                    </p>

                  </div>

                  {/* 학교생활기록부 종합 평가 등급 카드 */}
                  <div className="bg-white border border-slate-200/80 rounded-none p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)] space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 flex-wrap justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        <h3 className="text-[15px] font-black text-slate-900 tracking-tight">학교생활기록부 종합 평가 등급</h3>
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-400">
                        (8단계 기본단계 판정 기준)
                      </span>
                    </div>

                    {/* 8단계 등급 그리드 */}
                    <div className="grid grid-cols-4 gap-2">
                      {["A+", "A", "A-", "B+", "B", "B-", "C+", "C"].map((grade) => {
                        const isCurrentGrade = resolveOverallGrade() === grade;
                        return (
                          <div 
                            key={grade}
                            className={`p-3 border flex flex-col items-center justify-center min-h-[90px] transition-all duration-300 ${
                              isCurrentGrade 
                                ? 'bg-[#0f172a] border-[#0f172a] text-white shadow-md' 
                                : 'bg-[#f8fafc] border-slate-200/60 text-slate-400'
                            }`}
                          >
                            <span className={`text-[8.5px] font-extrabold tracking-widest block mb-1 uppercase ${
                              isCurrentGrade ? 'text-blue-400' : 'text-[#94a3b8]'
                            }`}>
                              GRADE
                            </span>
                            <span className={`text-[17px] font-black tracking-tight ${
                              isCurrentGrade ? 'text-white' : 'text-[#64748b]'
                            }`}>
                              {grade}
                            </span>
                            {isCurrentGrade && (
                              <span className="text-[8.5px] font-black text-[#f59e0b] block mt-1.5 whitespace-nowrap">
                                종합 판정 등급
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>


                  </div>
                </div>

                {/* 내신 모의매칭 차트 및 시뮬레이션 */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-none p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)] space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">학생부종합 모의매핑</h3>
                    </div>
                    
                    {/* 성적 등급제 선택 토글 */}
                    <div className="flex border border-slate-200 rounded-none p-0.5 bg-slate-50">
                      <button
                        onClick={() => setGradeSystem('9grade')}
                        className={`px-3 py-1.5 text-[11px] font-black transition-all ${
                          gradeSystem === '9grade' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        현행 9등급제
                      </button>
                      <button
                        onClick={() => setGradeSystem('5grade')}
                        className={`px-3 py-1.5 text-[11px] font-black transition-all ${
                          gradeSystem === '5grade' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        신설 5등급제(예상)
                      </button>
                    </div>
                  </div>

                  {/* 권역 분류 필터 탭 */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(regionLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedRegion(key)}
                        className={`px-4 py-2 text-xs font-black tracking-tight border transition-all duration-300 rounded-none ${
                          selectedRegion === key
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* 신형 수시 모의매칭 세로 컬럼형 차트 (Mockup 동일 적용) */}
                  <div className="border border-slate-100 p-6 rounded-none bg-white space-y-6">


                    <div className="relative w-full border border-slate-200/60 bg-[#fafafa] p-6 pt-16">
                      {/* 차트 가로 스크롤 영역 */}
                      <div className="overflow-x-auto pb-20 scrollbar-thin select-none">
                        <div className="relative w-max h-[300px] flex items-stretch gap-6 px-16">
                          
                          {/* Y축 그리드 라인들 (백그라운드 기준 가이드) */}
                          {[1.0, 2.0, 3.0, 4.0, 5.0].map((val) => {
                            const maxLimit = gradeSystem === '9grade' ? 5.0 : 4.0;
                            if (val > maxLimit) return null;
                            const topPct = ((val - 1.0) / (maxLimit - 1.0)) * 100;
                            return (
                              <div 
                                key={val} 
                                className="absolute left-0 right-0 border-t border-slate-200/30 flex justify-end pr-2 pointer-events-none z-0"
                                style={{ top: `${topPct}%` }}
                              >
                                <span className="text-[9px] font-extrabold text-slate-400 -mt-2 bg-[#fafafa] px-1">
                                  {val.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}

                          {/* 대학별 컬럼 및 캡슐 */}
                          {UNIVERSITY_GRADE_DATA[selectedRegion]?.map((univ, index) => {
                            const minGpa = gradeSystem === '9grade' ? univ.minGpa : univ.minGpa5;
                            const maxGpa = gradeSystem === '9grade' ? univ.maxGpa : univ.maxGpa5;
                            const maxLimit = gradeSystem === '9grade' ? 5.0 : 4.0;
                            const minLimit = 1.0;
                            
                            // 픽셀 비율 계산
                            const topPct = ((minGpa - minLimit) / (maxLimit - minLimit)) * 100;
                            const heightPct = ((maxGpa - minGpa) / (maxLimit - minLimit)) * 100;

                            return (
                              <div key={index} className="flex flex-col items-center w-10 shrink-0 h-full relative group z-10">
                                {/* 호버 툴팁 */}
                                <div className="absolute bottom-full mb-2.5 hidden group-hover:flex flex-col items-center z-30 pointer-events-none transition-all animate-in fade-in slide-in-from-bottom-2">
                                  <div className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1.5 shadow-md whitespace-nowrap">
                                    {univ.name}: {minGpa.toFixed(2)} ~ {maxGpa.toFixed(2)} 등급
                                  </div>
                                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1"></div>
                                </div>

                                {/* 컬럼 배경 바 */}
                                <div className="w-8 bg-slate-100/50 border border-slate-200/20 rounded-md h-full relative overflow-hidden">
                                  {/* 합격 등급 범위 capsule */}
                                  <div 
                                    className="absolute w-full rounded-md opacity-85 group-hover:opacity-100 transition-all duration-300 shadow-sm cursor-help"
                                    style={{ 
                                      top: `${topPct}%`, 
                                      height: `${heightPct}%`,
                                      backgroundColor: univ.hexColor
                                    }}
                                  ></div>
                                </div>
                                
                                {/* X축 대학명 라벨 (35도 회전 적용) */}
                                <div className="absolute top-[312px] left-1 bg-transparent whitespace-nowrap rotate-[35deg] origin-top-left text-[11px] font-black text-slate-600 block text-left">
                                  {univ.name}
                                </div>
                              </div>
                            );
                          })}

                          {/* 학생 내 점수 점선 및 라벨 배지 */}
                          {(() => {
                            const currentGpa = studentOverallGpa;
                            const maxLimit = gradeSystem === '9grade' ? 5.0 : 4.0;
                            const minLimit = 1.0;
                            const lineTop = ((currentGpa - minLimit) / (maxLimit - minLimit)) * 100;
                            
                            // 클램프 오프셋 제한
                            const clampedTop = Math.min(100, Math.max(0, lineTop));
                            
                            return (
                              <>
                                {/* 빨간 점선 수평선 */}
                                <div 
                                  className="absolute left-0 right-0 border-t-2 border-dashed border-red-500 pointer-events-none z-20 transition-all duration-1000"
                                  style={{ top: `${clampedTop}%` }}
                                ></div>

                                {/* 내 위치 배지 */}
                                <div 
                                  className="absolute left-2 z-30 transition-all duration-1000 -translate-y-1/2"
                                  style={{ top: `${clampedTop}%` }}
                                >
                                  <div className="bg-red-600 text-white font-black text-[10px] px-2.5 py-1.5 shadow-md flex items-center gap-1 rounded-none border border-red-700/30">
                                    <span className="whitespace-nowrap">내위치 {currentGpa.toFixed(2)}</span>
                                  </div>
                                </div>
                              </>
                            );
                          })()}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 탭 2. 심층 정성 리포트 (역량별 평가 및 세특 진단) */}
            {activeResultTab === 'report' && (
              <div className="space-y-8">
                {showReAnalyzeButton && (
                  <div className="bg-rose-50 border border-rose-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-none shadow-sm">
                    <div className="flex items-start gap-3.5">
                      <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-black text-rose-950 tracking-tight">심층 분석 결과 누락 감지</h4>
                        <p className="text-xs text-rose-600 font-semibold leading-relaxed mt-1">
                          역량평가 또는 교과군 세특 판독서의 강점/보완점 중 일부 출력 내용이 누락되었거나 생성되지 않았습니다. 보다 정밀한 학생부 리포트 완성을 위해 재분석을 진행해 주십시오.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => analyzeStudentRecord(true)}
                      disabled={loading}
                      className="px-5 py-3.5 bg-rose-600 hover:bg-slate-900 text-white font-black text-xs transition-all flex items-center gap-2 rounded-none shadow-sm shrink-0 uppercase tracking-wider"
                    >
                      <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      분석 데이터 재파싱 수행
                    </button>
                  </div>
                )}

                {/* 3대 정성 역량 평가 */}
                <div className="grid grid-cols-1 gap-8">
                  {/* 학업역량 */}
                  <CompetencyCard 
                    title="학업역량" 
                    icon={GraduationCap}
                    data={analysisResult.competencies?.academic}
                    accentColor="from-blue-600 to-indigo-600"
                    iconBg="bg-blue-600"
                  >
                    <RubricTable 
                      title="학업역량 세부 평정 지표 루브릭 현황" 
                      iconColor="text-blue-600" 
                      rubrics={mapRubricResults(ACADEMIC_RUBRICS, analysisResult.rubrics?.academic)} 
                    />
                  </CompetencyCard>
 
                  {/* 진로역량 */}
                  <CompetencyCard 
                    title="진로역량" 
                    icon={Target}
                    data={analysisResult.competencies?.career}
                    accentColor="from-purple-600 to-indigo-600"
                    iconBg="bg-purple-600"
                  >
                    <RubricTable 
                      title="진로역량 세부 평정 지표 루브릭 현황" 
                      iconColor="text-purple-600" 
                      rubrics={mapRubricResults(CAREER_RUBRICS, analysisResult.rubrics?.career)} 
                    />
                  </CompetencyCard>
 
                  {/* 공동체역량 */}
                  <CompetencyCard 
                    title="공동체역량" 
                    icon={Users}
                    data={analysisResult.competencies?.community}
                    accentColor="from-teal-600 to-emerald-600"
                    iconBg="bg-teal-600"
                  >
                    <RubricTable 
                      title="공동체역량 세부 평정 지표 루브릭 현황" 
                      iconColor="text-teal-600" 
                      rubrics={mapRubricResults(COMMUNITY_RUBRICS, analysisResult.rubrics?.community)} 
                    />
                  </CompetencyCard>
                </div>

                {/* 교과군별 세부능력 특기사항 정밀 진단 */}
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Library className="w-6 h-6 text-slate-800" />
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">교과 세특 연계 정성 분석 판독서</h3>
                    </div>
                    
                    {/* 과목 필터 탭 */}
                    <div className="flex flex-wrap gap-1 bg-slate-100 p-1 border border-slate-200/50 rounded-none self-start sm:self-center">
                      <button
                        onClick={() => setActiveSubjectTab("all")}
                        className={`px-3 py-1.5 text-xs font-black transition-all ${
                          activeSubjectTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        전체교과
                      </button>
                      <button
                        onClick={() => setActiveSubjectTab("korean")}
                        className={`px-3 py-1.5 text-xs font-black transition-all ${
                          activeSubjectTab === "korean" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        국어교과
                      </button>
                      <button
                        onClick={() => setActiveSubjectTab("math")}
                        className={`px-3 py-1.5 text-xs font-black transition-all ${
                          activeSubjectTab === "math" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        수학교과
                      </button>
                      <button
                        onClick={() => setActiveSubjectTab("english")}
                        className={`px-3 py-1.5 text-xs font-black transition-all ${
                          activeSubjectTab === "english" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        영어교과
                      </button>
                      <button
                        onClick={() => setActiveSubjectTab("social")}
                        className={`px-3 py-1.5 text-xs font-black transition-all ${
                          activeSubjectTab === "social" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        사회교과
                      </button>
                      <button
                        onClick={() => setActiveSubjectTab("science")}
                        className={`px-3 py-1.5 text-xs font-black transition-all ${
                          activeSubjectTab === "science" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        과학교과
                      </button>
                    </div>
                  </div>

                  {/* 과목별 세특 판단 기준 루브릭 현황 */}
                  <RubricTable 
                    title="과목별 세특 판단 기준 루브릭 현황" 
                    iconColor="text-blue-600" 
                    rubrics={mapRubricResults(SUBJECT_RUBRICS, analysisResult.rubrics?.subject)} 
                  />

                  {/* 세특 판독 결과 리스트 매핑 */}
                  <div className="space-y-6">
                    {analysisResult.subject_specific
                      ?.filter(item => {
                        const cat = item.category?.toLowerCase() || "";
                        const group = item.subject_group || "";
                        
                        if (activeSubjectTab === "all") return true;
                        if (activeSubjectTab === "korean") return cat === "korean" || group.includes("국어");
                        if (activeSubjectTab === "math") return cat === "math" || group.includes("수학");
                        if (activeSubjectTab === "english") return cat === "english" || group.includes("영어");
                        if (activeSubjectTab === "science") return cat === "science" || group.includes("과학");
                        if (activeSubjectTab === "social") return cat === "social" || group.includes("사회");
                        return true;
                      })

                      .map((item, i) => (
                        <SubjectDetailCard key={i} item={item} />
                      ))
                    }
                    {(!analysisResult.subject_specific || 
                      analysisResult.subject_specific.filter(item => {
                        const cat = item.category?.toLowerCase() || "";
                        const group = item.subject_group || "";
                        
                        if (activeSubjectTab === "all") return true;
                        if (activeSubjectTab === "korean") return cat === "korean" || group.includes("국어");
                        if (activeSubjectTab === "math") return cat === "math" || group.includes("수학");
                        if (activeSubjectTab === "english") return cat === "english" || group.includes("영어");
                        if (activeSubjectTab === "science") return cat === "science" || group.includes("과학");
                        if (activeSubjectTab === "social") return cat === "social" || group.includes("사회");
                        return true;
                      }).length === 0) && (
                      <div className="bg-white border border-slate-100 p-12 text-center text-slate-400 font-extrabold text-sm rounded-none">
                        선택된 교과군의 세특 판독 정보가 존재하지 않습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 설정 팝업/모달 - API key 관리 */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full p-8 md:p-10 shadow-2xl border border-slate-100 rounded-none relative">
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Gemini API 설정</h3>
            </div>
            
            <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-6">
              본 시스템은 Gemini 2.5 Flash 모델을 통해 대용량 생활기록부를 초고속 정성 심사합니다. 발급받은 Google Studio API 키를 입력해 주세요. (로컬 브라우저 보안 저장소에 암호화 보관됩니다.)
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 tracking-widest uppercase mb-1.5">
                  Gemini API Key
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="w-4.5 h-4.5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    defaultValue={apiKey}
                    id="api-key-input"
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-none py-3.5 pl-12 pr-4 text-slate-900 font-mono text-sm focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const keyVal = document.getElementById('api-key-input')?.value || '';
                  saveApiKey(keyVal);
                }}
                className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-black text-sm transition-all duration-300 rounded-none"
              >
                설정 저장 및 반영
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
