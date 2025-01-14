export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold my-10 text-center">개인정보처리방침</h1>
      <p>
        <strong>Re|view</strong> 서비스(“서비스”라 함)는 사용자의 개인정보를
        중요하게 생각하며, 정보통신망 이용촉진 및 정보보호 등에 관한
        법률(“정보통신망법”) 및 기타 개인정보보호 관련 법령을 준수하고 있습니다.
        본 개인정보처리방침은 Re|view가 제공하는 서비스에서의 개인정보 수집,
        이용, 보유 및 파기 절차 등을 설명하며, 사용자의 개인정보 보호를 위한
        방침을 안내합니다.
      </p>
      <br />
      <p>
        본 방침은 <strong>2025년 1월 15일</strong>부터 시행됩니다.
      </p>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">
          제 1장. 개인정보 수집 및 이용목적
        </h2>
        <p>
          Re|view는 소셜 로그인 및 서비스 제공을 위해 최소한의 개인정보를
          수집합니다. 개인정보는 아래와 같은 목적을 위해 사용됩니다.
        </p>
        <h3 className="font-semibold my-4">[수집하는 개인정보 항목 및 방법]</h3>
        <table className="table-auto border-collapse w-full my-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">구분</th>
              <th className="px-4 py-2 border border-gray-300">
                개인정보 항목
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 border-gray-300">소셜 로그인</td>
              <td className="border px-4 py-2 border-gray-300">
                소셜 로그인 제공자로부터 제공받은 client ID
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 border-gray-300">
                서비스 이용 관련 정보
              </td>
              <td className="border px-4 py-2 border-gray-300">
                Google Analytics를 통해 수집된 서비스 내 사용 데이터, 브라우저
                및 기기 정보
              </td>
            </tr>
          </tbody>
        </table>
        <h3 className="font-semibold my-4">[수집 목적]</h3>
        <ol className="list-decimal pl-6 my-4">
          <li>회원관리 및 본인확인: 소셜 로그인 인증 및 회원 식별</li>
          <li>
            서비스 제공: 리뷰 작성, 콘텐츠 저장 및 사용자 맞춤형 기능 제공
          </li>
          <li>서비스 개선 및 개발: 사용 통계 분석을 통한 서비스 품질 향상</li>
          <li>법적 의무 준수: 관련 법령에 따른 의무 이행</li>
        </ol>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">
          제 2장. 개인정보의 보유 및 이용기간
        </h2>
        <p>
          Re|view는 사용자의 개인정보를 서비스 제공 목적 달성 시까지 보유하며,
          목적 달성 후에는 해당 정보를 즉시 파기합니다. 단, 법령에 따른 의무
          준수를 위해 필요한 경우 또는 사용자가 1년 이상 서비스를 이용하지 않은
          경우, 해당 정보를 별도 분리 보관합니다.
        </p>
        <h3 className="font-semibold my-4">[법령에 따른 보존 항목 및 기간]</h3>
        <ul className="list-disc pl-6 my-4">
          <li>
            서비스 이용 기록: Google Analytics 설정에 따라 최대 14개월 보관
          </li>
          <li>소셜 로그인 정보(client ID): 회원 탈퇴 즉시 삭제</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">
          제 3장. 개인정보의 파기절차 및 방법
        </h2>
        <p>
          Re|view는 개인정보 보유기간이 경과하거나 처리 목적이 달성된 경우, 해당
          정보를 지체 없이 파기합니다.
        </p>
        <ol className="list-decimal pl-6 my-4">
          <li>
            파기절차: 개인정보는 목적 달성 후 시스템 내에서 즉시 파기됩니다.
          </li>
          <li>
            파기방법: 전자적 파일 형태의 정보는 복구 및 재생할 수 없도록 영구
            삭제합니다. 종이에 출력된 정보는 분쇄기로 분쇄하거나 소각합니다.
          </li>
        </ol>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">
          제 4장. 개인정보의 제3자 제공 및 위탁
        </h2>
        <p>
          Re|view는 원칙적으로 사용자의 개인정보를 제3자에게 제공하지 않습니다.
        </p>
        <p>
          Re|view는 1인 운영 서비스로, 사용자의 데이터를 보호하기 위해 외부
          수탁업체와 최소한으로 협력하고 있습니다. 아래는 서비스 제공을 위해
          필요한 위탁 업무의 목록입니다:
        </p>
        <table className="table-auto border-collapse w-full my-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">수탁 업체</th>
              <th className="px-4 py-2 border border-gray-300">위탁 업무</th>
              <th className="px-4 py-2 border border-gray-300">위탁 내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                AWS (Amazon Web Services)
              </td>
              <td className="px-4 py-2 border border-gray-300">
                데이터 저장 및 관리
              </td>
              <td className="px-4 py-2 border border-gray-300">
                서비스 내 모든 이미지 저장
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                MongoDB Atlas
              </td>
              <td className="px-4 py-2 border border-gray-300">
                데이터베이스 관리
              </td>
              <td className="px-4 py-2 border border-gray-300">
                서비스 생성 데이터 저장 및 관리
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                Google Analytics
              </td>
              <td className="px-4 py-2 border border-gray-300">
                사용자 활동 데이터 수집 및 분석
              </td>
              <td className="px-4 py-2 border border-gray-300">
                서비스 사용 통계 및 분석 데이터 처리
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          위탁 사항이 변경되는 경우, 본 개인정보처리방침을 통해 사전
          고지하겠습니다.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">
          제 5장. 이용자의 권리와 행사방법
        </h2>
        <ol className="list-decimal pl-6">
          <li>
            이용자는 Re|view에서 본인의 개인정보를 언제든지 조회하거나 수정할 수
            있으며, 개인정보 수집 및 이용 동의를 철회할 수 있습니다.
          </li>
          <li>
            회원탈퇴를 요청하는 경우, 즉시 계정을 삭제하고 관련 개인정보를
            파기합니다.
          </li>
          <li>
            개인정보 조회, 수정 및 철회 요청은 Re|view 내 설정 메뉴 또는
            고객센터를 통해 가능합니다.
          </li>
        </ol>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">
          제 6장. 개인정보 자동수집 장치의 설치, 운영 및 거부
        </h2>
        <p>
          Re|view는 사용자 경험 향상과 맞춤형 서비스를 제공하기 위해 쿠키를
          사용합니다.
        </p>
        <h3 className="font-semibold my-4">[쿠키의 사용 목적]</h3>
        <ul className="list-disc pl-6">
          <li>접속 상태 유지 및 사용자 설정 저장</li>
          <li>서비스 사용 통계 분석 및 품질 개선</li>
        </ul>
        <h3 className="font-semibold my-4">[쿠키 설정 거부 방법]</h3>
        <p>
          사용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
          있습니다. 단, 쿠키 저장을 거부할 경우 서비스 이용에 일부 제한이 있을
          수 있습니다.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">
          제 7장. 개인정보보호를 위한 기술적, 관리적 대책
        </h2>
        <ol className="list-decimal pl-6">
          <li>
            데이터 암호화: 모든 개인정보는 암호화된 통신 구간을 통해 전송 및
            저장됩니다.
          </li>
          <li>접근 제한: 개인정보 접근 권한을 최소화합니다.</li>
          <li>
            시스템 보호: 해킹 및 데이터 유출 방지를 위해 최신 보안 솔루션을
            적용합니다.
          </li>
        </ol>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">
          제 8장. 개인정보보호 책임자 및 연락처
        </h2>
        <p>
          Re|view는 1인 운영 서비스로, 개인정보와 관련된 모든 업무를 서비스
          운영자인 본인이 직접 처리합니다. 개인정보 관련 문의는 아래로 연락해
          주시기 바랍니다:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>운영자 이름: 배정원</li>
          <li>
            이메일: <a href="mailto:bjw0111@naver.com">bjw0111@naver.com</a>
          </li>
        </ul>
        <p>
          개인정보와 관련한 문의, 불만 사항은 위 이메일로 연락 주시면 신속히
          답변드리겠습니다.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold my-4">부칙</h2>
        <ul className="list-disc pl-6 my-4">
          <li>공고일자: 2025년 1월 15일</li>
          <li>시행일자: 2025년 1월 15일</li>
        </ul>
      </section>
    </div>
  );
}
