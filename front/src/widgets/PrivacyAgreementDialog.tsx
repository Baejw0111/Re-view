import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/shared/shadcn-ui/dialog";
import { Button } from "@/shared/shadcn-ui/button";

export default function PrivacyAgreementDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="h-auto p-0 text-sm ml-1 text-blue-500"
        >
          개인정보 수집 및 이용 동의서
        </Button>
      </DialogTrigger>
      <DialogContent className="block md:max-w-[760px] lg:max-w-[860px] h-[90vh] p-20 overflow-y-auto scrollbar-hide focus-visible:outline-none">
        <DialogTitle className="text-4xl">
          개인정보 수집 및 이용 동의서
        </DialogTitle>
        <DialogDescription hidden />
        <p className="my-4">
          <strong>Re|view</strong> (이하 "서비스")는 서비스 제공을 위해 아래와
          같이 이용자의 개인정보를 수집 및 이용하고자 합니다. 본 동의서는 관련
          법령에 따라 개인정보의 수집 및 이용 목적, 항목, 보유 및 이용 기간을
          명확히 안내하며, 이에 대한 동의를 요청드립니다.
        </p>

        <section className="my-4">
          <h2 className="text-2xl font-semibold my-4">
            1. 개인정보 수집 및 이용 항목
          </h2>
          <table className="table-auto w-full my-4">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">이용 항목</th>
                <th className="px-4 py-2 border border-gray-300">
                  개인정보 항목
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  소셜 로그인
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  소셜 로그인 제공자로부터 제공받은 client ID
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  서비스 이용 관련 정보
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  Google Analytics를 통해 수집된 서비스 내 사용 데이터, 브라우저
                  및 기기 정보
                </td>
              </tr>
            </tbody>
          </table>
          <ul className="list-disc pl-6 my-4">
            <li>
              이용자는 언제든지 개인정보의 열람, 수정, 삭제를 요청할 수 있으며,
              동의를 철회할 권리가 있습니다.
            </li>
            <li>
              개인정보 수집 및 이용에 동의하지 않을 권리가 있으며, 이 경우
              서비스 이용이 제한될 수 있습니다.
            </li>
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  );
}
