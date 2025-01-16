import PageTemplate from "@/shared/original-ui/PageTemplate";
import FeedbackForm from "@/features/form/FeedbackForm";
import EditUserProfile from "@/features/setting/EditUserProfile";
import DeleteAccountDialog from "@/widgets/DeleteAccountDialog";
import PolicySection from "@/widgets/PolicySection";
import { SocialLoginConnectSection } from "@/widgets/SocialLoginConnectSection";

export default function Settings() {
  return (
    <PageTemplate>
      <div className="w-full md:max-w-xl mx-auto space-y-16">
        {/* 프로필 편집 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-3">
            프로필 편집
          </h2>
          <p className="text-sm text-muted-foreground">
            프로필 이미지, 닉네임을 편집할 수 있습니다.
          </p>
          <EditUserProfile />
        </div>

        {/* 소셜 로그인 연동 설정 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-3">
            소셜 로그인 연동 설정
          </h2>
          <p className="text-sm text-muted-foreground">
            소셜 로그인 연동 설정을 편집할 수 있습니다.
          </p>
          <p className="text-sm text-destructive">현재 준비 중인 기능입니다.</p>
          <SocialLoginConnectSection />
        </div>

        {/* 피드백 보내기 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-3">
            피드백
          </h2>
          <p className="text-sm text-muted-foreground">
            서비스 이용 중 발생한 버그, 또는 불편했던 점들을 작성해서
            보내주세요. 서비스 개선점에 대해서 자세하게 작성해주시면 더욱 좋은
            서비스를 제공하기 위해 노력하겠습니다.
          </p>
          <FeedbackForm />
        </div>

        {/* 약관 정책 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-3">
            약관 정책
          </h2>
          <p className="text-sm text-muted-foreground">
            약관 정책들을 확인할 수 있습니다.
          </p>
          <PolicySection />
        </div>

        {/* 회원 탈퇴 */}
        <div className="space-y-4">
          <h2 className="text-2xl text-destructive font-semibold border-b border-border pb-3">
            회원 탈퇴
          </h2>
          <p className="text-sm text-muted-foreground">
            서비스에서 탈퇴하고 계정을 삭제합니다.
          </p>
          <DeleteAccountDialog />
        </div>
      </div>
    </PageTemplate>
  );
}
