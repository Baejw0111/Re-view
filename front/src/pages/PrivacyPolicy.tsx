export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">개인정보 처리방침</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">제 1조 (목적)</h2>
        <p>
          Re|view (이하 "서비스")는 이용자의 개인정보를 중요시하며, 『정보통신망
          이용촉진 및 정보보호 등에 관한 법률』, 『개인정보보호법』,
          『통신비밀보호법』, 『전기통신사업법』 등 정보통신서비스제공자가
          준수하여야 할 관련 법령 상의 개인정보보호 규정을 준수하며 최소한의
          정보만을 필요한 시점에 수집하고, 수집하는 정보는 고지한 범위 내에서만
          사용하며, 사전 동의 없이 그 범위를 초과하여 이용하거나 외부에 공개하지
          않는 등 "회원"의 권익 보호에 최선을 다하고 있습니다. 본 방침은
          운영자가 제공하는 서비스와 관련하여 이용자의 개인정보 보호를 위해
          취하는 조치 및 처리 방침을 설명합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 2조 (수집하는 개인정보 항목)
        </h2>
        <ol className="list-decimal pl-6">
          <li>
            회원가입 시: 소셜 로그인 제공자로부터 제공받는 사용자 일련 번호
          </li>
          <li>
            서비스 이용 시: 로그 데이터 (접속 일시, 사용 기기 정보, 브라우저
            유형)
          </li>
          <li>기타: 피드백 기능을 통해 접수된 내용</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 3조 (개인정보의 수집 방법)
        </h2>
        <ol className="list-decimal pl-6">
          <li>소셜 로그인 제공자로부터 자동 수집</li>
          <li>피드백 기능을 통한 이용자의 입력</li>
          <li>쿠키 및 로그 분석을 통한 자동 수집</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 4조 (개인정보의 이용 목적)
        </h2>
        <ol className="list-decimal pl-6">
          <li>서비스 제공 및 이용 관리</li>
          <li>회원 식별 및 인증</li>
          <li>서비스 개선 및 맞춤형 광고 제공</li>
          <li>피드백 접수 및 처리</li>
          <li>법적 의무 이행 및 분쟁 해결</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 5조 (개인정보의 보관 및 파기)
        </h2>
        <ol className="list-decimal pl-6">
          <li>
            운영자는 개인정보 보관 기간 동안만 해당 정보를 보유하며, 보유 기간은
            다음과 같습니다:
            <ul className="list-disc pl-6">
              <li>회원정보: 회원 탈퇴 시 즉시 삭제</li>
              <li>로그 데이터: 수집 후 1년간 보관</li>
              <li>
                법적 보관 의무가 있는 경우: 관련 법령에 따른 기간 동안 보관
              </li>
            </ul>
          </li>
          <li>
            개인정보 파기 절차:
            <ul className="list-disc pl-6">
              <li>개인정보는 보관 기간 경과 후 즉시 파기합니다.</li>
              <li>전자적 파일 형태: 복구 불가능한 방법으로 삭제</li>
              <li>문서 형태: 분쇄 또는 소각</li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 6조 (개인정보의 제3자 제공)
        </h2>
        <p>
          운영자는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
          다만, 다음의 경우 예외로 합니다:
        </p>
        <ol className="list-decimal pl-6">
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령에 따라 요구되는 경우</li>
          <li>
            서비스 제공을 위해 필요한 범위 내에서 외부 업체와의 계약이 이루어진
            경우 (예: 데이터 분석, 광고 제공)
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 7조 (개인정보의 처리 위탁)
        </h2>
        <p>
          운영자는 서비스 제공을 위해 다음 업무를 외부에 위탁할 수 있으며,
          위탁받은 업체가 개인정보를 안전하게 처리하도록 필요한 조치를 취합니다.
        </p>
        <ol className="list-decimal pl-6">
          <li>
            위탁 내용:
            <ul className="list-disc pl-6">
              <li>데이터 분석 (Google Analytics)</li>
              <li>서버 운영 (AWS Lambda, Vercel)</li>
              <li>이미지 저장 및 관리 (AWS S3)</li>
              <li>광고 제공 (Google Adsense, 향후 적용 예정)</li>
              <li>서비스 운영 및 관리 (Discord, MongoDB)</li>
            </ul>
          </li>
          <li>위탁 업체: 각 서비스 제공 업체</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 8조 (이용자의 권리 및 행사 방법)
        </h2>
        <ol className="list-decimal pl-6">
          <li>
            이용자는 언제든지 자신의 개인정보를 열람, 수정, 삭제, 처리 정지를
            요청할 수 있습니다.
          </li>
          <li>
            개인정보 관련 요청은 피드백 기능을 통해 접수 가능하며, 운영자는
            법령에서 정한 기간 내에 처리합니다.
          </li>
          <li>
            이용자는 개인정보 제공 동의를 철회할 수 있으며, 철회 시 일부 서비스
            이용이 제한될 수 있습니다.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 9조 (개인정보 보호를 위한 현실적 안전 조치)
        </h2>
        <ol className="list-decimal pl-6">
          <li>
            관리적 조치: 운영자가 직접 데이터 접근 권한을 관리하며, 외부 위탁된
            서비스의 보안 정책을 신뢰하고 따릅니다.
          </li>
          <li>
            기술적 조치: AWS, Vercel, S3와 같은 신뢰할 수 있는 플랫폼에서
            제공하는 보안 기능을 활용합니다.
          </li>
          <li>
            물리적 조치: 별도의 로컬 데이터 저장소를 두지 않고, 모든 데이터는
            클라우드 상에서 관리됩니다.
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">제 10조 (쿠키의 사용)</h2>
        <ol className="list-decimal pl-6">
          <li>
            운영자는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용할 수
            있습니다.
          </li>
          <li>
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
            있습니다. 단, 쿠키를 비활성화할 경우 서비스 이용에 제한이 있을 수
            있습니다.
          </li>
          <li>쿠키 수집 항목: 방문 기록, 이용 패턴, 관심 상품 정보</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          제 11조 (개인정보 보호책임자)
        </h2>
        <p>
          운영자는 단독으로 운영되는 서비스로, 운영자 본인이 개인정보 보호에
          대한 책임을 담당합니다.
        </p>
        <ul className="list-disc pl-6">
          <li>이름: 배정원</li>
          <li>
            연락처: <a href="mailto:bjw0111@naver.com">bjw0111@naver.com</a>
          </li>
          <li>업무: 개인정보 처리 관련 민원 처리 및 고충 해결</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">제 12조 (변경 및 고지)</h2>
        <ol className="list-decimal pl-6">
          <li>본 방침은 2025년 1월 11일부터 시행됩니다.</li>
          <li>
            운영자는 개인정보 처리방침의 변경 사항 발생 시 서비스 초기 화면에
            고지하며, 변경 내용은 시행 7일 전부터 공지합니다.
          </li>
        </ol>
      </section>
    </div>
  );
}
